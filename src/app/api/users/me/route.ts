import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { withAuth, AuthenticatedHandler } from "@/lib/middleware/withAuth";
import {
  ApiError,
  ApiSuccess,
  UserWithMedia,
  User,
} from "@/lib/supabase/types";

// GET handler - fetch current user's profile with media
const getHandler: AuthenticatedHandler = async (_req, user) => {
  try {
    const supabase = await createClient();

    // Fetch user profile with joined media
    const { data: userProfile, error } = await supabase
      .from("users")
      .select(
        `
        *,
        profile_media:media!profile_media_id (
          id,
          file_url,
          file_type,
          storage_path,
          mime_type,
          size_bytes,
          uploaded_by,
          created_at
        )
      `,
      )
      .eq("id", user.id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message } satisfies ApiError, {
        status: 500,
      });
    }

    return NextResponse.json({
      data: userProfile,
    } satisfies ApiSuccess<UserWithMedia>);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" } satisfies ApiError,
      { status: 500 },
    );
  }
};

// PATCH handler - update current user's profile
const updateSchema = z.object({
  full_name: z.string().min(2).optional(),
  phone: z.string().optional(),
  preferred_language: z.enum(["am", "or", "en"]).optional(),
  voice_enabled: z.boolean().optional(),
  church_id: z.string().uuid("Invalid church ID").optional(),
});

const patchHandler: AuthenticatedHandler = async (req, user) => {
  try {
    const body = await req.json();

    // Validate request body
    const validationResult = updateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.flatten() } as unknown as ApiError,
        { status: 400 },
      );
    }

    const updateData = validationResult.data;

    // Ensure no empty update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" } satisfies ApiError,
        { status: 400 },
      );
    }

    const supabase = await createClient();

    const { data: updatedUser, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message } satisfies ApiError, {
        status: 500,
      });
    }

    return NextResponse.json({
      data: updatedUser,
    } satisfies ApiSuccess<User>);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" } satisfies ApiError,
      { status: 500 },
    );
  }
};

// Export wrapped handlers
export const GET = withAuth(getHandler);
export const PATCH = withAuth(patchHandler);
