import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { ApiError, ApiSuccess } from "@/lib/supabase/types";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().optional(),
  preferred_language: z.enum(["am", "or", "en"]).default("am"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('SUPABASE URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)

    // Validate request body
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.flatten() } as unknown as ApiError,
        { status: 400 },
      );
    }

    const { email, password, full_name, phone, preferred_language } =
      validationResult.data;

    const supabase = await createClient();

    // Sign up user with metadata
    // The database trigger will auto-create the users row
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          phone,
          preferred_language,
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message } satisfies ApiError, {
        status: 400,
      });
    }

    return NextResponse.json(
      { data: { user: data.user } } satisfies ApiSuccess<{
        user: typeof data.user;
      }>,
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" } satisfies ApiError,
      { status: 500 },
    );
  }
}
