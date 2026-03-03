import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { withAuth, AuthenticatedHandler } from "@/lib/middleware/withAuth";
import { ApiError, ApiSuccess, Church } from "@/lib/supabase/types";

// GET handler - list all churches (public endpoint)
export async function GET() {
  try {
    const supabase = await createClient();

    const { data: churches, error } = await supabase
      .from("churches")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message } satisfies ApiError, {
        status: 500,
      });
    }

    return NextResponse.json({
      data: churches,
    } satisfies ApiSuccess<Church[]>);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" } satisfies ApiError,
      { status: 500 },
    );
  }
}

// POST handler - create a new church (admin only)
const createChurchSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  location: z.string().optional(),
  contact_info: z.record(z.string(), z.unknown()).optional(),
});

const postHandler: AuthenticatedHandler = async (req) => {
  try {
    const body = await req.json();

    const validationResult = createChurchSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.flatten() } as unknown as ApiError,
        { status: 400 },
      );
    }

    const { name, location, contact_info } = validationResult.data;

    const supabase = await createClient();

    const { data: church, error } = await supabase
      .from("churches")
      .insert({
        name,
        location: location ?? null,
        contact_info: contact_info ?? null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message } satisfies ApiError, {
        status: 500,
      });
    }

    return NextResponse.json({ data: church } satisfies ApiSuccess<Church>, {
      status: 201,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" } satisfies ApiError,
      { status: 500 },
    );
  }
};

export const POST = withAuth(postHandler, ["admin"]);
