import { NextRequest, NextResponse } from "next/server";
import { withAuth, AuthenticatedHandler } from "@/lib/middleware/withAuth";
import { createServiceClient } from "@/lib/supabase/server";

const handler: AuthenticatedHandler = async (request, user, profile) => {
  try {
    const { searchParams } = new URL(request.url);
    const start_date = searchParams.get("start_date");
    const end_date = searchParams.get("end_date");
    const campaign_id = searchParams.get("campaign_id");
    const church_id = searchParams.get("church_id");

    const supabaseService = await createServiceClient();

    // Build the query with joins
    let query = supabaseService
      .from("donations")
      .select(
        `
        *,
        users!inner(
          id,
          full_name
        ),
        campaigns!inner(
          id,
          title,
          church_id,
          churches!inner(
            id,
            name
          )
        )
      `,
      )
      .eq("status", "confirmed")
      .order("created_at", { ascending: false });

    // Apply date filters
    if (start_date) {
      query = query.gte("created_at", start_date);
    }
    if (end_date) {
      query = query.lte("created_at", end_date);
    }

    // Apply campaign filter
    if (campaign_id) {
      query = query.eq("campaign_id", campaign_id);
    }

    // Apply church filter
    if (church_id) {
      query = query.eq("campaigns.church_id", church_id);
    }

    const { data: donations, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform data to mask anonymous donors
    const transformedDonations = donations.map((donation: any) => ({
      ...donation,
      users: {
        ...donation.users,
        full_name: donation.is_anonymous
          ? "Anonymous Donor"
          : donation.users.full_name,
      },
    }));

    // Calculate summary statistics
    const total_amount = donations.reduce(
      (sum: number, donation: any) => sum + donation.amount,
      0,
    );
    const total_count = donations.length;
    const average_amount =
      total_count > 0
        ? Math.round((total_amount / total_count) * 100) / 100
        : 0;

    const summary = {
      total_amount,
      total_count,
      average_amount,
      date_range: {
        start_date: start_date || null,
        end_date: end_date || null,
      },
    };

    return NextResponse.json({
      data: {
        summary,
        donations: transformedDonations,
      },
    });
  } catch (error) {
    console.error("Donations report error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
};

export const GET = withAuth(handler, ["admin", "treasurer"]);
