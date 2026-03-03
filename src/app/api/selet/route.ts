import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { withAuth, AuthenticatedHandler } from "@/lib/middleware/withAuth";
import { ApiError, ApiSuccess, Selet } from "@/lib/supabase/types";

interface SeletWithChurch extends Selet {
  church: {
    name: string;
  };
}

// GET handler - list current user's Selet vows
const getHandler: AuthenticatedHandler = async (_req, user) => {
  try {
    const supabase = await createClient();

    const { data: seletVows, error } = await supabase
      .from("selet")
      .select(
        `
        *,
        church:churches!church_id (
          name
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
      data: seletVows as SeletWithChurch[],
    } satisfies ApiSuccess<SeletWithChurch[]>);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" } satisfies ApiError,
      { status: 500 },
    );
  }
};

// POST handler - create a new Selet vow
const createSeletSchema = z.object({
  church_id: z.string().uuid("Invalid church ID format"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  amount: z.number().positive("Amount must be greater than 0"),
  due_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  is_public: z.boolean().optional().default(false),
});

const postHandler: AuthenticatedHandler = async (req, user) => {
  try {
    const body = await req.json();

    const validationResult = createSeletSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.flatten() } as unknown as ApiError,
        { status: 400 },
      );
    }

    const { church_id, description, amount, due_date, is_public } =
      validationResult.data;

    const supabase = await createClient();

    // Verify church exists
    const { data: church, error: churchError } = await supabase
      .from("churches")
      .select("id")
      .eq("id", church_id)
      .single();

    if (churchError || !church) {
      return NextResponse.json(
        { error: "Church not found" } satisfies ApiError,
        { status: 404 },
      );
    }

    // Insert selet vow
    const { data: seletVow, error } = await supabase
      .from("selet")
      .insert({
        user_id: user.id,
        church_id,
        description,
        amount,
        due_date,
        is_public,
        amount_paid: 0,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message } satisfies ApiError, {
        status: 500,
      });
    }

    return NextResponse.json({ data: seletVow } satisfies ApiSuccess<Selet>, {
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
