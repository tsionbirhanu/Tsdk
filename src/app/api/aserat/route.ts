import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { withAuth, AuthenticatedHandler } from "@/lib/middleware/withAuth";
import { ApiError, ApiSuccess, AseratBekurat } from "@/lib/supabase/types";

// GET handler - list current user's Aserat records
const getHandler: AuthenticatedHandler = async (_req, user) => {
  try {
    const supabase = await createClient();

    const { data: aseratRecords, error } = await supabase
      .from("aserat_bekurat")
      .select("*")
      .eq("user_id", user.id)
      .order("year", { ascending: false })
      .order("month", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message } satisfies ApiError, {
        status: 500,
      });
    }

    return NextResponse.json({
      data: aseratRecords,
    } satisfies ApiSuccess<AseratBekurat[]>);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" } satisfies ApiError,
      { status: 500 },
    );
  }
};

// POST handler - create or update Aserat entry for a month
const createAseratSchema = z.object({
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2020),
  income_amount: z.number().positive("Income amount must be greater than 0"),
});

const postHandler: AuthenticatedHandler = async (req, user) => {
  try {
    const body = await req.json();

    const validationResult = createAseratSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.flatten() } as unknown as ApiError,
        { status: 400 },
      );
    }

    const { month, year, income_amount } = validationResult.data;

    // Calculate amount_due as 10% of income
    const amount_due = income_amount * 0.1;

    // Calculate due_date as the 25th of the given month and year
    const due_date = new Date(year, month - 1, 25).toISOString().split("T")[0];

    const supabase = await createClient();

    // Upsert to handle both create and update
    const { data: aseratRecord, error } = await supabase
      .from("aserat_bekurat")
      .upsert(
        {
          user_id: user.id,
          month,
          year,
          amount_due,
          due_date,
        },
        {
          onConflict: "user_id,month,year",
        },
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message } satisfies ApiError, {
        status: 500,
      });
    }

    return NextResponse.json(
      { data: aseratRecord } satisfies ApiSuccess<AseratBekurat>,
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
