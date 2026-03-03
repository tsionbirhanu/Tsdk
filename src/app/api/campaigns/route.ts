import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { withAuth, AuthenticatedHandler } from "@/lib/middleware/withAuth";
import { ApiError, ApiSuccess, Campaign } from "@/lib/supabase/types";

interface CampaignWithDetails extends Campaign {
  church: {
    name: string;
  };
  donation_count: number;
}

// GET handler - list campaigns (any authenticated user)
const getHandler: AuthenticatedHandler = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const churchId = searchParams.get("church_id");
    const status = searchParams.get("status");

    const supabase = await createClient();

    let query = supabase
      .from("campaigns")
      .select(
        `
        *,
        church:churches!church_id (
          name
        )
      `,
      )
      .order("created_at", { ascending: false });

    if (churchId) {
      query = query.eq("church_id", churchId);
    }

    if (status && ["active", "closed", "paused"].includes(status)) {
      query = query.eq("status", status);
    }

    const { data: campaigns, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message } satisfies ApiError, {
        status: 500,
      });
    }

    // Get donation counts for each campaign
    const campaignIds = campaigns.map((c) => c.id);

    const { data: donationCounts, error: countError } = await supabase
      .from("donations")
      .select("campaign_id")
      .in("campaign_id", campaignIds);

    if (countError) {
      return NextResponse.json(
        { error: countError.message } satisfies ApiError,
        { status: 500 },
      );
    }

    // Count donations per campaign
    const countMap = new Map<string, number>();
    donationCounts.forEach((d) => {
      countMap.set(d.campaign_id, (countMap.get(d.campaign_id) ?? 0) + 1);
    });

    const campaignsWithCounts: CampaignWithDetails[] = campaigns.map(
      (campaign) => ({
        ...campaign,
        church: campaign.church as { name: string },
        donation_count: countMap.get(campaign.id) ?? 0,
      }),
    );

    return NextResponse.json({
      data: campaignsWithCounts,
    } satisfies ApiSuccess<CampaignWithDetails[]>);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" } satisfies ApiError,
      { status: 500 },
    );
  }
};

// POST handler - create a campaign (admin and treasurer only)
const createCampaignSchema = z
  .object({
    church_id: z.string().uuid("Invalid church ID format"),
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    goal_amount: z.number().positive("Goal amount must be greater than 0"),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
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

const postHandler: AuthenticatedHandler = async (req, user) => {
  try {
    const body = await req.json();

    const validationResult = createCampaignSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.flatten() } as unknown as ApiError,
        { status: 400 },
      );
    }

    const { church_id, title, description, goal_amount, start_date, end_date } =
      validationResult.data;

    const supabase = await createClient();

    const { data: campaign, error } = await supabase
      .from("campaigns")
      .insert({
        church_id,
        title,
        description: description ?? null,
        goal_amount,
        start_date: start_date ?? new Date().toISOString().split("T")[0],
        end_date: end_date ?? null,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message } satisfies ApiError, {
        status: 500,
      });
    }

    return NextResponse.json(
      { data: campaign } satisfies ApiSuccess<Campaign>,
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" } satisfies ApiError,
      { status: 500 },
    );
  }
};

export const GET = withAuth(getHandler);
export const POST = withAuth(postHandler, ["admin", "treasurer"]);
