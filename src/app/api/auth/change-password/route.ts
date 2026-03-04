import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withAuth } from "@/lib/middleware/withAuth";
import { createClient } from "@/lib/supabase/server";

const changePasswordSchema = z.object({
  current_password: z.string().min(1, "Current password is required"),
  new_password: z.string().min(8, "New password must be at least 8 characters"),
  confirm_password: z
    .string()
    .min(8, "Confirm password must be at least 8 characters"),
});

async function handler(request: NextRequest, { user }: { user: any }) {
  try {
    const body = await request.json();

    const validatedData = changePasswordSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { current_password, new_password, confirm_password } =
      validatedData.data;

    // Check if new password and confirm password match
    if (new_password !== confirm_password) {
      return NextResponse.json(
        { error: "New password and confirm password do not match" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Verify current password by re-authenticating the user
    // ✅ First fetch the full user from Supabase Auth to get email
    const {
      data: { user: authUser },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !authUser?.email) {
      return NextResponse.json(
        { error: "Could not verify user identity" },
        { status: 401 },
      );
    }

    // Now verify current password using the fetched email
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: authUser.email,
      password: current_password,
    });

    if (authError) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 },
      );
    }

    // Update to new password
    const { error: updateError } = await supabase.auth.updateUser({
      password: new_password,
    });

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update password" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      data: { message: "Password changed successfully" },
    });
  } catch (error) {
    console.log("CHANGE PASSWORD ERROR:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}

export const POST = withAuth(handler);
