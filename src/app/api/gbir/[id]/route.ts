import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { withAuth, AuthenticatedHandler } from "@/lib/middleware/withAuth";
import { ApiError, ApiSuccess, Gbir } from "@/lib/supabase/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET handler - get single Gbir record
const getHandler = (routeParams: RouteParams): AuthenticatedHandler => {
  return async (_req, user) => {
    try {
      const { id } = await routeParams.params;
      const supabase = await createClient();

      const { data: gbirRecord, error } = await supabase
        .from("gbir")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return NextResponse.json(
            { error: "Gbir record not found" } satisfies ApiError,
            { status: 404 },
          );
        }
        return NextResponse.json({ error: error.message } satisfies ApiError, {
          status: 500,
        });
      }

      return NextResponse.json({
        data: gbirRecord,
      } satisfies ApiSuccess<Gbir>);
    } catch {
      return NextResponse.json(
        { error: "Internal server error" } satisfies ApiError,
        { status: 500 },
      );
    }
  };
};

// PATCH handler - record a payment toward Gbir
const paymentSchema = z.object({
  amount_paid: z.number().positive("Payment amount must be greater than 0"),
});

const patchHandler = (routeParams: RouteParams): AuthenticatedHandler => {
  return async (req, user) => {
    try {
      const { id } = await routeParams.params;
      const body = await req.json();

      const validationResult = paymentSchema.safeParse(body);
      if (!validationResult.success) {
        return NextResponse.json(
          { error: validationResult.error.flatten() } as unknown as ApiError,
          { status: 400 },
        );
      }

      const { amount_paid: paymentAmount } = validationResult.data;

      const supabase = await createClient();

      // Fetch current record
      const { data: currentRecord, error: fetchError } = await supabase
        .from("gbir")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (fetchError) {
        if (fetchError.code === "PGRST116") {
          return NextResponse.json(
            { error: "Gbir record not found" } satisfies ApiError,
            { status: 404 },
          );
        }
        return NextResponse.json(
          { error: fetchError.message } satisfies ApiError,
          { status: 500 },
        );
      }

      // Check if already paid
      if (currentRecord.status === "paid") {
        return NextResponse.json(
          { error: "Gbir is already paid for this year" } satisfies ApiError,
          { status: 400 },
        );
      }

      // Calculate new amount_paid (accumulate, capped at total amount)
      const newAmountPaid = Math.min(
        currentRecord.amount_paid + paymentAmount,
        currentRecord.amount,
      );

      const wasNotPaid = currentRecord.status !== "paid";

      // Update amount_paid in database
      const { data: updatedRecord, error: updateError } = await supabase
        .from("gbir")
        .update({ amount_paid: newAmountPaid })
        .eq("id", id)
        .select()
        .single();

      if (updateError) {
        return NextResponse.json(
          { error: updateError.message } satisfies ApiError,
          { status: 500 },
        );
      }

      // If newly paid, create notification
      if (wasNotPaid && updatedRecord.status === "paid") {
        const serviceClient = createServiceClient();
        await serviceClient.from("notifications").insert({
          user_id: user.id,
          type: "general",
          title: "Gbir Payment Complete",
          message: `Your Gbir for ${currentRecord.year} has been paid in full. Thank you for your contribution!`,
          channel: "in_app",
          is_read: false,
          sent_at: new Date().toISOString(),
        });
      }

      return NextResponse.json({
        data: updatedRecord,
      } satisfies ApiSuccess<Gbir>);
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

export const PATCH = (req: NextRequest, routeParams: RouteParams) =>
  withAuth(patchHandler(routeParams))(req);
