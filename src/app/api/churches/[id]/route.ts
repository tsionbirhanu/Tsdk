import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { withAuth, AuthenticatedHandler } from "@/lib/middleware/withAuth";
import { ApiError, ApiSuccess, Church } from "@/lib/supabase/types";

interface ChurchWithMemberCount extends Church {
  member_count: number;
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET handler - get single church with member count (public endpoint)
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch church by id
    const { data: church, error: churchError } = await supabase
      .from("churches")
      .select("*")
      .eq("id", id)
      .single();

    if (churchError) {
      if (churchError.code === "PGRST116") {
        return NextResponse.json(
          { error: "Church not found" } satisfies ApiError,
          { status: 404 },
        );
      }
      return NextResponse.json(
        { error: churchError.message } satisfies ApiError,
        { status: 500 },
      );
    }

    // Get member count
    const { count, error: countError } = await supabase
      .from("church_members")
      .select("*", { count: "exact", head: true })
      .eq("church_id", id);

    if (countError) {
      return NextResponse.json(
        { error: countError.message } satisfies ApiError,
        { status: 500 },
      );
    }

    const churchWithCount: ChurchWithMemberCount = {
      ...church,
      member_count: count ?? 0,
    };

    return NextResponse.json({
      data: churchWithCount,
    } satisfies ApiSuccess<ChurchWithMemberCount>);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" } satisfies ApiError,
      { status: 500 },
    );
  }
}

// PATCH handler - update a church (admin only)
const updateChurchSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  location: z.string().optional(),
  contact_info: z.record(z.string(), z.unknown()).optional(),
});

const patchHandler = (routeParams: RouteParams): AuthenticatedHandler => {
  return async (req) => {
    try {
      const { id } = await routeParams.params;
      const body = await req.json();

      const validationResult = updateChurchSchema.safeParse(body);
      if (!validationResult.success) {
        return NextResponse.json(
          { error: validationResult.error.flatten() } as unknown as ApiError,
          { status: 400 },
        );
      }

      const updateData = validationResult.data;

      if (Object.keys(updateData).length === 0) {
        return NextResponse.json(
          { error: "No valid fields to update" } satisfies ApiError,
          { status: 400 },
        );
      }

      const supabase = await createClient();

      const { data: updatedChurch, error } = await supabase
        .from("churches")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return NextResponse.json(
            { error: "Church not found" } satisfies ApiError,
            { status: 404 },
          );
        }
        return NextResponse.json({ error: error.message } satisfies ApiError, {
          status: 500,
        });
      }

      return NextResponse.json({
        data: updatedChurch,
      } satisfies ApiSuccess<Church>);
    } catch {
      return NextResponse.json(
        { error: "Internal server error" } satisfies ApiError,
        { status: 500 },
      );
    }
  };
};

// DELETE handler - delete a church (admin only)
const deleteHandler = (routeParams: RouteParams): AuthenticatedHandler => {
  return async () => {
    try {
      const { id } = await routeParams.params;
      const supabase = await createClient();

      const { error } = await supabase.from("churches").delete().eq("id", id);

      if (error) {
        return NextResponse.json({ error: error.message } satisfies ApiError, {
          status: 500,
        });
      }

      return NextResponse.json({
        data: { message: "Church deleted successfully" },
      } satisfies ApiSuccess<{ message: string }>);
    } catch {
      return NextResponse.json(
        { error: "Internal server error" } satisfies ApiError,
        { status: 500 },
      );
    }
  };
};

export const PATCH = (req: NextRequest, routeParams: RouteParams) =>
  withAuth(patchHandler(routeParams), ["admin"])(req);

export const DELETE = (req: NextRequest, routeParams: RouteParams) =>
  withAuth(deleteHandler(routeParams), ["admin"])(req);
