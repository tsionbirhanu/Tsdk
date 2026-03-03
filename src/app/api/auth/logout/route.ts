import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ApiError, ApiSuccess } from "@/lib/supabase/types";

export async function POST() {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json({ error: error.message } satisfies ApiError, {
        status: 500,
      });
    }

    return NextResponse.json({
      data: { message: "Logged out successfully" },
    } satisfies ApiSuccess<{ message: string }>);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" } satisfies ApiError,
      { status: 500 },
    );
  }
}
