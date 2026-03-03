import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { withAuth, AuthenticatedHandler } from "@/lib/middleware/withAuth";
import { ApiError, ApiSuccess } from "@/lib/supabase/types";

// ─────────────────────────────────────────
// Local types
// ─────────────────────────────────────────

interface ChurchSnippet {
  id: string;
  name: string;
  location: string | null;
}

interface Member {
  id: string;
  full_name: string;
  phone: string | null;
  role: "admin" | "treasurer" | "member" | "guest";
  preferred_language: string;
  voice_enabled: boolean;
  church_id: string | null;
  created_at: string;
  church: ChurchSnippet | null;
}

// ─────────────────────────────────────────
// Zod schemas
// ─────────────────────────────────────────

const patchSchema = z.object({
  user_id: z.string().uuid(),
  role: z.enum(["admin", "treasurer", "member", "guest"]),
});

// ─────────────────────────────────────────
// GET — list all members
// ─────────────────────────────────────────

const getHandler: AuthenticatedHandler = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") ?? undefined;
    const church_id = searchParams.get("church_id") ?? undefined;
    const search = searchParams.get("search") ?? undefined;

    const supabase = await createServiceClient();

    let query = supabase
      .from("users")
      .select(
        `
        id,
        full_name,
        phone,
        role,
        preferred_language,
        voice_enabled,
        church_id,
        created_at,
        church:churches!church_id ( id, name, location )
        `,
      )
      .order("created_at", { ascending: false });

    if (role) {
      query = query.eq("role", role);
    }

    if (church_id) {
      query = query.eq("church_id", church_id);
    }

    if (search) {
      query = query.ilike("full_name", `%${search}%`);
    }

    const { data: members, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message } satisfies ApiError, {
        status: 500,
      });
    }

    return NextResponse.json({
      data: members as unknown as Member[],
    } satisfies ApiSuccess<Member[]>);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message } satisfies ApiError, {
      status: 500,
    });
  }
};

// ─────────────────────────────────────────
// PATCH — update a member's role
// ─────────────────────────────────────────

const patchHandler: AuthenticatedHandler = async (req: NextRequest, user) => {
  try {
    const body: unknown = await req.json();
    const parsed = patchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.issues[0]?.message ?? "Invalid request body",
        } satisfies ApiError,
        { status: 400 },
      );
    }

    const { user_id, role } = parsed.data;

    if (user_id === user.id) {
      return NextResponse.json(
        { error: "Cannot change your own role" } satisfies ApiError,
        { status: 400 },
      );
    }

    const supabase = await createServiceClient();

    const { data: updatedUser, error } = await supabase
      .from("users")
      .update({ role })
      .eq("id", user_id)
      .select(
        `
        id,
        full_name,
        phone,
        role,
        preferred_language,
        voice_enabled,
        church_id,
        created_at,
        church:churches!church_id ( id, name, location )
        `,
      )
      .single();

    if (error) {
      return NextResponse.json({ error: error.message } satisfies ApiError, {
        status: 500,
      });
    }

    return NextResponse.json({
      data: updatedUser as unknown as Member,
    } satisfies ApiSuccess<Member>);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message } satisfies ApiError, {
      status: 500,
    });
  }
};

// ─────────────────────────────────────────
// Route exports
// ─────────────────────────────────────────

export const GET = withAuth(getHandler, ["admin", "treasurer"]);
export const PATCH = withAuth(patchHandler, ["admin"]);
