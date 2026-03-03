import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { withAuth, AuthenticatedHandler } from "@/lib/middleware/withAuth";
import { ApiError, ApiSuccess, Donation } from "@/lib/supabase/types";

interface DonationWithDetails extends Donation {
  campaign: {
    title: string;
    church_id: string;
    church: {
      name: string;
    };
  };
}

// GET handler - list current user's donations
const getHandler: AuthenticatedHandler = async (_req, user) => {
  try {
    const supabase = await createClient();

    const { data: donations, error } = await supabase
      .from("donations")
      .select(
        `
        *,
        campaign:campaigns!campaign_id (
          title,
          church_id,
          church:churches!church_id (
            name
          )
        )
      `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message } satisfies ApiError, {
        status: 500,
      });
    }

    return NextResponse.json({
      data: donations as DonationWithDetails[],
    } satisfies ApiSuccess<DonationWithDetails[]>);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" } satisfies ApiError,
      { status: 500 },
    );
  }
};

// POST handler - make a donation
const createDonationSchema = z.object({
  campaign_id: z.string().uuid("Invalid campaign ID format"),
  amount: z.number().positive("Amount must be greater than 0"),
  payment_method: z.enum(["telebirr", "cbe_birr", "cash", "other"]),
  is_anonymous: z.boolean().optional().default(false),
  transaction_ref: z.string().optional(),
});

const postHandler: AuthenticatedHandler = async (req, user) => {
  try {
    const body = await req.json();

    const validationResult = createDonationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.flatten() } as unknown as ApiError,
        { status: 400 },
      );
    }

    const {
      campaign_id,
      amount,
      payment_method,
      is_anonymous,
      transaction_ref,
    } = validationResult.data;

    const supabase = await createClient();

    // Verify campaign exists and is active
    const { data: campaign, error: campaignError } = await supabase
      .from("campaigns")
      .select("id, title, status")
      .eq("id", campaign_id)
      .single();

    if (campaignError || !campaign) {
      return NextResponse.json(
        { error: "Campaign not found or not active" } satisfies ApiError,
        { status: 404 },
      );
    }

    if (campaign.status !== "active") {
      return NextResponse.json(
        { error: "Campaign not found or not active" } satisfies ApiError,
        { status: 404 },
      );
    }

    // Insert donation with status 'confirmed'
    const { data: donation, error: donationError } = await supabase
      .from("donations")
      .insert({
        user_id: user.id,
        campaign_id,
        amount,
        payment_method,
        status: "confirmed",
        is_anonymous,
        transaction_ref: transaction_ref ?? null,
      })
      .select()
      .single();

    if (donationError) {
      return NextResponse.json(
        { error: donationError.message } satisfies ApiError,
        { status: 500 },
      );
    }

    // Create notification using service client to bypass RLS
    const serviceClient = createServiceClient();
    await serviceClient.from("notifications").insert({
      user_id: user.id,
      type: "donation_confirmed",
      title: "Donation Confirmed",
      message: `Your donation of ${amount} ETB to ${campaign.title} has been received. Thank you!`,
      channel: "in_app",
      is_read: false,
      sent_at: new Date().toISOString(),
    });

    return NextResponse.json(
      { data: donation } satisfies ApiSuccess<Donation>,
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
export const POST = withAuth(postHandler);
