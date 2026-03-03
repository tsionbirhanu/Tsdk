import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { withAuth, AuthenticatedHandler } from "@/lib/middleware/withAuth";
import { ApiError, ApiSuccess } from "@/lib/supabase/types";

interface CampaignSummary {
  id: string;
  title: string;
  goal_amount: number;
  current_amount: number;
  status: string;
  percentage_reached: number;
}

interface RecentDonation {
  id: string;
  amount: number;
  payment_method: string;
  created_at: string;
  full_name: string;
  campaign_title: string;
}

interface AseratBreakdown {
  paid: number;
  partial: number;
  pending: number;
  missed: number;
}

interface SeletBreakdown {
  active: number;
  partial: number;
  fulfilled: number;
  overdue: number;
}

interface GbirBreakdown {
  paid: number;
  pending: number;
  missed: number;
}

interface FinancialSummary {
  total_donations: number;
  total_aserat_collected: number;
  total_selet_fulfilled: number;
  total_gbir_collected: number;
  grand_total: number;
  total_donors: number;
  total_campaigns: number;
}

interface DashboardData {
  summary: FinancialSummary;
  campaigns: CampaignSummary[];
  aserat_breakdown: AseratBreakdown;
  selet_breakdown: SeletBreakdown;
  gbir_breakdown: GbirBreakdown;
  recent_donations: RecentDonation[];
}

const getHandler: AuthenticatedHandler = async () => {
  try {
    const supabase = createServiceClient();

    const [
      donationsResult,
      aseratResult,
      seletResult,
      gbirResult,
      campaignsResult,
      recentDonationsResult,
    ] = await Promise.all([
      // Total confirmed donations + distinct donor count + total campaigns
      supabase
        .from("donations")
        .select("amount, user_id, status")
        .eq("status", "confirmed"),

      // All aserat_bekurat for collected + breakdown
      supabase.from("aserat_bekurat").select("amount_paid, status"),

      // All selet for fulfilled + breakdown
      supabase.from("selet").select("amount, status"),

      // All gbir for paid + breakdown
      supabase.from("gbir").select("amount_paid, status"),

      // Campaigns
      supabase
        .from("campaigns")
        .select("id, title, goal_amount, current_amount, status"),

      // Recent 10 donations with user and campaign joins
      supabase
        .from("donations")
        .select(
          `
          id,
          amount,
          payment_method,
          created_at,
          is_anonymous,
          user:users!user_id (
            full_name
          ),
          campaign:campaigns!campaign_id (
            title
          )
        `,
        )
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    // Handle errors
    if (donationsResult.error) {
      return NextResponse.json(
        { error: donationsResult.error.message } satisfies ApiError,
        { status: 500 },
      );
    }
    if (aseratResult.error) {
      return NextResponse.json(
        { error: aseratResult.error.message } satisfies ApiError,
        { status: 500 },
      );
    }
    if (seletResult.error) {
      return NextResponse.json(
        { error: seletResult.error.message } satisfies ApiError,
        { status: 500 },
      );
    }
    if (gbirResult.error) {
      return NextResponse.json(
        { error: gbirResult.error.message } satisfies ApiError,
        { status: 500 },
      );
    }
    if (campaignsResult.error) {
      return NextResponse.json(
        { error: campaignsResult.error.message } satisfies ApiError,
        { status: 500 },
      );
    }
    if (recentDonationsResult.error) {
      return NextResponse.json(
        { error: recentDonationsResult.error.message } satisfies ApiError,
        { status: 500 },
      );
    }

    // ── Financial Summary ──
    const confirmedDonations = donationsResult.data ?? [];
    const total_donations = confirmedDonations.reduce(
      (sum, d) => sum + (d.amount as number),
      0,
    );
    const total_donors = new Set(
      confirmedDonations.map((d) => d.user_id as string),
    ).size;
    const total_campaigns = (campaignsResult.data ?? []).length;

    const aseratRows = aseratResult.data ?? [];
    const total_aserat_collected = aseratRows.reduce(
      (sum, r) => sum + (r.amount_paid as number),
      0,
    );

    const seletRows = seletResult.data ?? [];
    const total_selet_fulfilled = seletRows
      .filter((r) => r.status === "fulfilled")
      .reduce((sum, r) => sum + (r.amount as number), 0);

    const gbirRows = gbirResult.data ?? [];
    const total_gbir_collected = gbirRows
      .filter((r) => r.status === "paid")
      .reduce((sum, r) => sum + (r.amount_paid as number), 0);

    const grand_total =
      total_donations +
      total_aserat_collected +
      total_selet_fulfilled +
      total_gbir_collected;

    const summary: FinancialSummary = {
      total_donations,
      total_aserat_collected,
      total_selet_fulfilled,
      total_gbir_collected,
      grand_total,
      total_donors,
      total_campaigns,
    };

    // ── Campaigns ──
    const campaigns: CampaignSummary[] = (campaignsResult.data ?? []).map(
      (c) => ({
        id: c.id as string,
        title: c.title as string,
        goal_amount: c.goal_amount as number,
        current_amount: c.current_amount as number,
        status: c.status as string,
        percentage_reached:
          (c.goal_amount as number) > 0
            ? parseFloat(
                (
                  ((c.current_amount as number) / (c.goal_amount as number)) *
                  100
                ).toFixed(2),
              )
            : 0,
      }),
    );

    // ── Aserat Breakdown ──
    const aserat_breakdown: AseratBreakdown = {
      paid: aseratRows.filter((r) => r.status === "paid").length,
      partial: aseratRows.filter((r) => r.status === "partial").length,
      pending: aseratRows.filter((r) => r.status === "pending").length,
      missed: aseratRows.filter((r) => r.status === "missed").length,
    };

    // ── Selet Breakdown ──
    const selet_breakdown: SeletBreakdown = {
      active: seletRows.filter((r) => r.status === "active").length,
      partial: seletRows.filter((r) => r.status === "partial").length,
      fulfilled: seletRows.filter((r) => r.status === "fulfilled").length,
      overdue: seletRows.filter((r) => r.status === "overdue").length,
    };

    // ── Gbir Breakdown ──
    const gbir_breakdown: GbirBreakdown = {
      paid: gbirRows.filter((r) => r.status === "paid").length,
      pending: gbirRows.filter((r) => r.status === "pending").length,
      missed: gbirRows.filter((r) => r.status === "missed").length,
    };

    // ── Recent Donations ──
    type RawDonation = {
      id: string;
      amount: number;
      payment_method: string;
      created_at: string;
      is_anonymous: boolean;
      user: { full_name: string } | null;
      campaign: { title: string } | null;
    };

    const recent_donations: RecentDonation[] = (
      (recentDonationsResult.data ?? []) as unknown as RawDonation[]
    ).map((d) => ({
      id: d.id,
      amount: d.amount,
      payment_method: d.payment_method,
      created_at: d.created_at,
      full_name: d.is_anonymous
        ? "Anonymous"
        : (d.user?.full_name ?? "Unknown"),
      campaign_title: d.campaign?.title ?? "Unknown",
    }));

    const dashboardData: DashboardData = {
      summary,
      campaigns,
      aserat_breakdown,
      selet_breakdown,
      gbir_breakdown,
      recent_donations,
    };

    return NextResponse.json({
      data: dashboardData,
    } satisfies ApiSuccess<DashboardData>);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" } satisfies ApiError,
      { status: 500 },
    );
  }
};

export const GET = withAuth(getHandler, ["admin", "treasurer"]);
