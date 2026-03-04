import { NextRequest, NextResponse } from "next/server";
import { withAuth, AuthenticatedHandler } from "@/lib/middleware/withAuth";
import { createServiceClient } from "@/lib/supabase/server";

const handler: AuthenticatedHandler = async (request, user, profile) => {
  try {
    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get("year");
    const church_id = searchParams.get("church_id");
    const status = searchParams.get("status");

    // Default to current year if not provided
    const year = yearParam ? parseInt(yearParam) : new Date().getFullYear();

    const supabaseService = await createServiceClient();

    // Build the query with joins
    let query = supabaseService
      .from("gbir")
      .select(
        `
        *,
        users!inner(
          id,
          full_name
        ),
        church:churches!church_id(
          id,
          name
        )
      `,
      )
      .eq("year", year)
      .order("created_at", { ascending: false });

    // Apply church filter
    if (church_id) {
      query = query.eq("church_id", church_id);
    }

    // Apply status filter
    if (status && ["paid", "pending", "missed"].includes(status)) {
      query = query.eq("status", status);
    }

    const { data: records, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Calculate summary statistics
    const total_expected = records.reduce(
      (sum: number, record: any) => sum + record.amount,
      0,
    );
    const total_collected = records
      .filter((record: any) => record.status === "paid")
      .reduce(
        (sum: number, record: any) =>
          sum + (record.amount_paid || record.amount),
        0,
      );

    const total_count = records.length;
    const paid_count = records.filter(
      (record: any) => record.status === "paid",
    ).length;
    const compliance_rate =
      total_count > 0
        ? Math.round((paid_count / total_count) * 100 * 100) / 100
        : 0;

    // Count records by status
    const counts = {
      paid: records.filter((r: any) => r.status === "paid").length,
      pending: records.filter((r: any) => r.status === "pending").length,
      missed: records.filter((r: any) => r.status === "missed").length,
    };

    const summary = {
      year,
      total_expected,
      total_collected,
      compliance_rate,
      counts,
    };

    return NextResponse.json({
      data: {
        summary,
        records,
      },
    });
  } catch (error) {
    console.error("Gbir report error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
};

export const GET = withAuth(handler, ["admin", "treasurer"]);
