import { NextRequest, NextResponse } from "next/server";
import { User as AuthUser } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { User, ApiError } from "@/lib/supabase/types";

export type AuthenticatedHandler = (
  req: NextRequest,
  user: AuthUser,
  userProfile: User,
  params?: Record<string, string>,
) => Promise<NextResponse>;

type UserRole = User["role"];

/**
 * Extracts Bearer token from Authorization header if present.
 * @param req - The incoming request
 * @returns The token string or null if not found
 */
function extractBearerToken(req: NextRequest): string | null {
  const authHeader = req.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7); // Remove "Bearer " prefix
  }
  return null;
}

/**
 * Higher-order function that wraps an API route handler with authentication.
 * Checks that the user is authenticated and optionally that their role is allowed.
 * Supports both Bearer token (for API clients like Postman) and cookie-based auth (for browser).
 *
 * @param handler - The route handler to wrap
 * @param allowedRoles - Optional array of roles that are allowed to access this route
 * @returns A wrapped handler that performs auth checks before calling the original handler
 */
export function withAuth(
  handler: AuthenticatedHandler,
  allowedRoles?: UserRole[],
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const supabase = await createClient();

      let user: AuthUser | null = null;

      // First, check for Bearer token in Authorization header
      const bearerToken = extractBearerToken(req);

      if (bearerToken) {
        // Validate JWT token directly by passing it to getUser
        const { data, error: tokenError } =
          await supabase.auth.getUser(bearerToken);

        if (!tokenError && data.user) {
          user = data.user;
        }
      }

      // Fall back to cookie-based session if no Bearer token or token validation failed
      if (!user) {
        const { data, error: authError } = await supabase.auth.getUser();

        if (!authError && data.user) {
          user = data.user;
        }
      }

      // If neither auth method worked, return unauthorized
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" } satisfies ApiError, {
          status: 401,
        });
      }

      // Fetch user profile with role from database
      const { data: userProfile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError || !userProfile) {
        return NextResponse.json({ error: "Unauthorized" } satisfies ApiError, {
          status: 401,
        });
      }

      console.log("ALLOWED ROLES:", allowedRoles);
      console.log("USER PROFILE ROLE:", userProfile?.role);
      console.log("USER PROFILE:", userProfile);

      // Check if user's role is allowed
      if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(userProfile.role as UserRole)) {
          return NextResponse.json({ error: "Forbidden" } satisfies ApiError, {
            status: 403,
          });
        }
      }

      // Call the handler with authenticated user data
      return handler(req, user, userProfile as User);
    } catch {
      return NextResponse.json(
        { error: "Internal server error" } satisfies ApiError,
        { status: 500 },
      );
    }
  };
}
