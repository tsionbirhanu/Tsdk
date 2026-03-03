import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { withAuth, AuthenticatedHandler } from "@/lib/middleware/withAuth";
import { ApiError, ApiSuccess, ChurchMember } from "@/lib/supabase/types";

interface MemberWithUser {
  user_id: string;
  church_id: string;
  joined_at: string;
  user: {
    full_name: string;
    role: string;
  };
}

interface MemberResponse {
  user_id: string;
  full_name: string;
  role: string;
  joined_at: string;
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET handler - list members of a church (any authenticated user)
const getHandler = (routeParams: RouteParams): AuthenticatedHandler => {
  return async () => {
    try {
      const { id } = await routeParams.params;
      const supabase = await createClient();

      const { data: members, error } = await supabase
        .from("church_members")
        .select(
          `
          user_id,
          church_id,
          joined_at,
          user:users!user_id (
            full_name,
            role
          )
        `,
        )
        .eq("church_id", id);

      if (error) {
        return NextResponse.json({ error: error.message } satisfies ApiError, {
          status: 500,
        });
      }

      // Transform the response to flatten user data
      const transformedMembers: MemberResponse[] = (
        members as unknown as MemberWithUser[]
      ).map((member) => ({
        user_id: member.user_id,
        full_name: member.user.full_name,
        role: member.user.role,
        joined_at: member.joined_at,
      }));

      return NextResponse.json({
        data: transformedMembers,
      } satisfies ApiSuccess<MemberResponse[]>);
    } catch {
      return NextResponse.json(
        { error: "Internal server error" } satisfies ApiError,
        { status: 500 },
      );
    }
  };
};

// POST handler - add a member to a church (admin only)
const addMemberSchema = z.object({
  user_id: z.string().uuid("Invalid user ID format"),
});

const postHandler = (routeParams: RouteParams): AuthenticatedHandler => {
  return async (req) => {
    try {
      const { id } = await routeParams.params;
      const body = await req.json();

      const validationResult = addMemberSchema.safeParse(body);
      if (!validationResult.success) {
        return NextResponse.json(
          { error: validationResult.error.flatten() } as unknown as ApiError,
          { status: 400 },
        );
      }

      const { user_id } = validationResult.data;
      const supabase = await createClient();

      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from("church_members")
        .select("user_id")
        .eq("church_id", id)
        .eq("user_id", user_id)
        .single();

      if (existingMember) {
        return NextResponse.json(
          {
            error: "User is already a member of this church",
          } satisfies ApiError,
          { status: 409 },
        );
      }

      const { data: membership, error } = await supabase
        .from("church_members")
        .insert({
          church_id: id,
          user_id,
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message } satisfies ApiError, {
          status: 500,
        });
      }

      return NextResponse.json(
        { data: membership } satisfies ApiSuccess<ChurchMember>,
        { status: 201 },
      );
    } catch {
      return NextResponse.json(
        { error: "Internal server error" } satisfies ApiError,
        { status: 500 },
      );
    }
  };
};

// DELETE handler - remove a member from a church (admin only)
const removeMemberSchema = z.object({
  user_id: z.string().uuid("Invalid user ID format"),
});

const deleteHandler = (routeParams: RouteParams): AuthenticatedHandler => {
  return async (req) => {
    try {
      const { id } = await routeParams.params;
      const body = await req.json();

      const validationResult = removeMemberSchema.safeParse(body);
      if (!validationResult.success) {
        return NextResponse.json(
          { error: validationResult.error.flatten() } as unknown as ApiError,
          { status: 400 },
        );
      }

      const { user_id } = validationResult.data;
      const supabase = await createClient();

      const { error } = await supabase
        .from("church_members")
        .delete()
        .eq("church_id", id)
        .eq("user_id", user_id);

      if (error) {
        return NextResponse.json({ error: error.message } satisfies ApiError, {
          status: 500,
        });
      }

      return NextResponse.json({
        data: { message: "Member removed successfully" },
      } satisfies ApiSuccess<{ message: string }>);
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

export const POST = (req: NextRequest, routeParams: RouteParams) =>
  withAuth(postHandler(routeParams), ["admin"])(req);

export const DELETE = (req: NextRequest, routeParams: RouteParams) =>
  withAuth(deleteHandler(routeParams), ["admin"])(req);
