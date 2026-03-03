import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { withAuth, AuthenticatedHandler } from "@/lib/middleware/withAuth";
import { ApiError, ApiSuccess, Gbir } from "@/lib/supabase/types";

interface GbirWithChurch extends Gbir {
  church: {
    name: string;
  };
}

// GET handler - list current user's Gbir records
const getHandler: AuthenticatedHandler = async (_req, user) => {
  try {
    const supabase = await createClient();

    const { data: gbirRecords, error } = await supabase
      .from("gbir")
      .select(
        `
        *,
        church:churches!church_id (
          name
        )
      `,
      )
      .eq("user_id", user.id)
      .order("year", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message } satisfies ApiError, {
        status: 500,
      });
    }

    return NextResponse.json({
      data: gbirRecords as GbirWithChurch[],
    } satisfies ApiSuccess<GbirWithChurch[]>);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" } satisfies ApiError,
      { status: 500 },
    );
  }
};

// POST handler - create Gbir entry for a year
const createGbirSchema = z.object({
  year: z.number().int().min(2020),
  amount: z.number().positive("Amount must be greater than 0"),
  due_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
});

const postHandler: AuthenticatedHandler = async (req, user) => {
  try {
    const body = await req.json();

    const validationResult = createGbirSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.flatten() } as unknown as ApiError,
        { status: 400 },
      );
    }

    const { year, amount, due_date } = validationResult.data;

    const supabase = await createClient();

    // Get user's church_id from users table
    const { data: userProfile, error: userError } = await supabase
      .from("users")
      .select("church_id")
      .eq("id", user.id)
      .single();

    if (userError) {
      return NextResponse.json(
        { error: userError.message } satisfies ApiError,
        { status: 500 },
      );
    }

    if (!userProfile.church_id) {
      return NextResponse.json(
        {
          error:
            "You must be registered to a home church to pay Gbir. Please update your profile with your home church.",
        } satisfies ApiError,
        { status: 400 },
      );
    }

    // Upsert gbir record
    const { data: gbirRecord, error } = await supabase
      .from("gbir")
      .upsert(
        {
          user_id: user.id,
          church_id: userProfile.church_id,
          year,
          amount,
          due_date,
          amount_paid: 0,
        },
        {
          onConflict: "user_id,church_id,year",
        },
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message } satisfies ApiError, {
        status: 500,
      });
    }

    return NextResponse.json({ data: gbirRecord } satisfies ApiSuccess<Gbir>, {
      status: 201,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" } satisfies ApiError,
      { status: 500 },
    );
  }
};

export const GET = withAuth(getHandler);
export const POST = withAuth(postHandler);
