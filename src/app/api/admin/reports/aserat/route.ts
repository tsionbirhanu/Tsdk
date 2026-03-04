import { NextRequest, NextResponse } from "next/server";
import { withAuth, AuthenticatedHandler } from "@/lib/middleware/withAuth";
import { createServiceClient } from "@/lib/supabase/server";

const handler: AuthenticatedHandler = async (request, user, profile) => {
  try {
    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get("year");
    const status = searchParams.get("status");
    const church_id = searchParams.get("church_id");

    // Default to current year if not provided
    const year = yearParam ? parseInt(yearParam) : new Date().getFullYear();

    const supabaseService = await createServiceClient();

    // Build the query with joins
    let query = supabaseService
      .from("aserat_bekurat")
      .select(
        `
        *,
        users!inner(
          id,
          full_name,
          church_id,
          church:churches!church_id(
            id,
            name
          )
        )
      `,
      )
      .eq("year", year)
      .order("year", { ascending: false })
      .order("month", { ascending: false });

    // Apply status filter
    if (status && ["paid", "partial", "pending", "missed"].includes(status)) {
      query = query.eq("status", status);
    }

    // Apply church filter
    if (church_id) {
      query = query.eq("users.church_id", church_id);
    }

    const { data: records, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Calculate summary statistics
    const total_due = records.reduce(
      (sum: number, record: any) => sum + record.amount_due,
      0,
    );
    const total_collected = records.reduce(
      (sum: number, record: any) => sum + (record.amount_paid || 0),
      0,
    );
    const collection_rate =
      total_due > 0
        ? Math.round((total_collected / total_due) * 100 * 100) / 100
        : 0;

    // Count records by status
    const status_counts = {
      paid: records.filter((r: any) => r.status === "paid").length,
      partial: records.filter((r: any) => r.status === "partial").length,
      pending: records.filter((r: any) => r.status === "pending").length,
      missed: records.filter((r: any) => r.status === "missed").length,
    };

    const summary = {
      year,
      total_due,
      total_collected,
      collection_rate,
      status_counts,
    };

    return NextResponse.json({
      data: {
        summary,
        records,
      },
    });
  } catch (error) {
    console.error("Aserat report error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
};

export const GET = withAuth(handler, ["admin", "treasurer"]);
