import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { withAuth, AuthenticatedHandler } from "@/lib/middleware/withAuth";
import { ApiError, ApiSuccess, Donation } from "@/lib/supabase/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET handler - get single donation
const getHandler = (routeParams: RouteParams): AuthenticatedHandler => {
  return async (_req, user) => {
    try {
      const { id } = await routeParams.params;
      const supabase = await createClient();

      const { data: donation, error } = await supabase
        .from("donations")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return NextResponse.json(
            { error: "Donation not found" } satisfies ApiError,
            { status: 404 },
          );
        }
        return NextResponse.json({ error: error.message } satisfies ApiError, {
          status: 500,
        });
      }

      return NextResponse.json({
        data: donation,
      } satisfies ApiSuccess<Donation>);
    } catch {
      return NextResponse.json(
        { error: "Internal server error" } satisfies ApiError,
        { status: 500 },
      );
    }
  };
};

export const GET = (req: NextRequest, routeParams: RouteParams) =>
  withAuth(getHandler(routeParams))(req);
