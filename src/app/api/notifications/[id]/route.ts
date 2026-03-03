import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { withAuth, AuthenticatedHandler } from "@/lib/middleware/withAuth";
import { ApiError, ApiSuccess } from "@/lib/supabase/types";

// PATCH — mark a notification as read
const patchHandler: AuthenticatedHandler = async (_req, user, _profile, params) => {
  try {
    const supabase = createClient();
    const id = params?.id;

    if (!id) {
      return NextResponse.json(
        { error: "Notification ID is required" } satisfies ApiError,
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Notification not found" } satisfies ApiError,
        { status: 404 }
      );
    }

    return NextResponse.json({
      data,
    } satisfies ApiSuccess<typeof data>);

  } catch {
    return NextResponse.json(
      { error: "Internal server error" } satisfies ApiError,
      { status: 500 }
    );
  }
};

export const PATCH = withAuth(patchHandler);