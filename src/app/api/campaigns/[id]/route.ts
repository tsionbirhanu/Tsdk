import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { withAuth, AuthenticatedHandler } from "@/lib/middleware/withAuth";
import { ApiError, ApiSuccess, Campaign } from "@/lib/supabase/types";

interface CampaignMedia {
  is_cover: boolean;
  media: {
    file_url: string;
  };
}

interface AICaption {
  language: string;
  platform: string;
  tone: string;
  generated_text: string;
}

interface CampaignWithFullDetails extends Campaign {
  church: {
    name: string;
  };
  campaign_media: CampaignMedia[];
  ai_captions: AICaption[];
  donation_count: number;
  donation_sum: number;
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET handler - get single campaign with full details (any authenticated user)
const getHandler = (routeParams: RouteParams): AuthenticatedHandler => {
  return async () => {
    try {
      const { id } = await routeParams.params;
      const supabase = await createClient();

      const { data: campaign, error: campaignError } = await supabase
        .from("campaigns")
        .select(
          `
          *,
          church:churches!church_id (
            name
          ),
          campaign_media (
            is_cover,
            media:media!media_id (
              file_url
            )
          ),
          ai_captions (
            language,
            platform,
            tone,
            generated_text
          )
        `,
        )
        .eq("id", id)
        .single();

      if (campaignError) {
        if (campaignError.code === "PGRST116") {
          return NextResponse.json(
            { error: "Campaign not found" } satisfies ApiError,
            { status: 404 },
          );
        }
        return NextResponse.json(
          { error: campaignError.message } satisfies ApiError,
          { status: 500 },
        );
      }

      // Get donation stats
      const { data: donationStats, error: statsError } = await supabase
        .from("donations")
        .select("amount")
        .eq("campaign_id", id)
        .eq("status", "confirmed");

      if (statsError) {
        return NextResponse.json(
          { error: statsError.message } satisfies ApiError,
          { status: 500 },
        );
      }

      const donationCount = donationStats.length;
      const donationSum = donationStats.reduce((sum, d) => sum + d.amount, 0);

      const campaignWithDetails: CampaignWithFullDetails = {
        ...campaign,
        church: campaign.church as { name: string },
        campaign_media: campaign.campaign_media as CampaignMedia[],
        ai_captions: campaign.ai_captions as AICaption[],
        donation_count: donationCount,
        donation_sum: donationSum,
      };

      return NextResponse.json({
        data: campaignWithDetails,
      } satisfies ApiSuccess<CampaignWithFullDetails>);
    } catch {
      return NextResponse.json(
        { error: "Internal server error" } satisfies ApiError,
        { status: 500 },
      );
    }
  };
};

// PATCH handler - update a campaign (admin and treasurer only)
const updateCampaignSchema = z
  .object({
    church_id: z.string().uuid("Invalid church ID format").optional(),
    title: z.string().min(3, "Title must be at least 3 characters").optional(),
    description: z.string().optional(),
    goal_amount: z
      .number()
      .positive("Goal amount must be greater than 0")
      .optional(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
    status: z.enum(["active", "closed", "paused"]).optional(),
  })
  .refine(
    (data) => {
      if (data.start_date && data.end_date) {
        return new Date(data.end_date) > new Date(data.start_date);
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["end_date"],
    },
  );

const patchHandler = (routeParams: RouteParams): AuthenticatedHandler => {
  return async (req) => {
    try {
      const { id } = await routeParams.params;
      const body = await req.json();

      // Remove disallowed fields
      delete body.current_amount;
      delete body.created_by;

      const validationResult = updateCampaignSchema.safeParse(body);
      if (!validationResult.success) {
        return NextResponse.json(
          { error: validationResult.error.flatten() } as unknown as ApiError,
          { status: 400 },
        );
      }

      const updateData = validationResult.data;

      if (Object.keys(updateData).length === 0) {
        return NextResponse.json(
          { error: "No valid fields to update" } satisfies ApiError,
          { status: 400 },
        );
      }

      const supabase = await createClient();

      const { data: updatedCampaign, error } = await supabase
        .from("campaigns")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return NextResponse.json(
            { error: "Campaign not found" } satisfies ApiError,
            { status: 404 },
          );
        }
        return NextResponse.json({ error: error.message } satisfies ApiError, {
          status: 500,
        });
      }

      return NextResponse.json({
        data: updatedCampaign,
      } satisfies ApiSuccess<Campaign>);
    } catch {
      return NextResponse.json(
        { error: "Internal server error" } satisfies ApiError,
        { status: 500 },
      );
    }
  };
};

// DELETE handler - delete a campaign (admin only)
const deleteHandler = (routeParams: RouteParams): AuthenticatedHandler => {
  return async () => {
    try {
      const { id } = await routeParams.params;
      const supabase = await createClient();

      // Check if campaign has any confirmed donations
      const { data: confirmedDonations, error: checkError } = await supabase
        .from("donations")
        .select("id")
        .eq("campaign_id", id)
        .eq("status", "confirmed")
        .limit(1);

      if (checkError) {
        return NextResponse.json(
          { error: checkError.message } satisfies ApiError,
          { status: 500 },
        );
      }

      if (confirmedDonations && confirmedDonations.length > 0) {
        return NextResponse.json(
          {
            error: "Cannot delete a campaign that has received donations",
          } satisfies ApiError,
          { status: 400 },
        );
      }

      const { error } = await supabase.from("campaigns").delete().eq("id", id);

      if (error) {
        return NextResponse.json({ error: error.message } satisfies ApiError, {
          status: 500,
        });
      }

      return NextResponse.json({
        data: { message: "Campaign deleted successfully" },
      } satisfies ApiSuccess<{ message: string }>);
    } catch {
      return NextResponse.json(
        { error: "Internal server error" } satisfies ApiError,
        { status: 500 },
      );
    }
  };
};

export const GET = (req: NextRequest, routeParams: RouteParams) =>
  withAuth(getHandler(routeParams))(req);

export const PATCH = (req: NextRequest, routeParams: RouteParams) =>
  withAuth(patchHandler(routeParams), ["admin", "treasurer"])(req);

export const DELETE = (req: NextRequest, routeParams: RouteParams) =>
  withAuth(deleteHandler(routeParams), ["admin"])(req);
