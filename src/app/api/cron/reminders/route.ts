import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { ApiError, ApiSuccess } from "@/lib/supabase/types";

interface CronResult {
  processed: {
    aserat_reminders: number;
    selet_reminders: number;
    gbir_reminders: number;
    overdue_selet: number;
    missed_aserat: number;
  };
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Verify cron secret
    const authHeader = req.headers.get("Authorization");
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" } satisfies ApiError, {
        status: 401,
      });
    }

    const supabase = createServiceClient();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split("T")[0]; // YYYY-MM-DD

    const sevenDaysLater = new Date(today);
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
    const sevenDaysStr = sevenDaysLater.toISOString().split("T")[0]; // YYYY-MM-DD

    // Run all lookups in parallel
    const [aseratDueResult, seletDueResult, gbirDueResult] = await Promise.all([
      // Check 1: Aserat due in 7 days
      supabase
        .from("aserat_bekurat")
        .select("id, user_id, month, year, amount_due")
        .eq("due_date", sevenDaysStr)
        .in("status", ["pending", "partial"]),

      // Check 2: Selet due in 7 days
      supabase
        .from("selet")
        .select("id, user_id, amount, amount_paid")
        .eq("due_date", sevenDaysStr)
        .in("status", ["active", "partial"]),

      // Check 3: Gbir due in 7 days
      supabase
        .from("gbir")
        .select("id, user_id, amount")
        .eq("due_date", sevenDaysStr)
        .eq("status", "pending"),
    ]);

    if (aseratDueResult.error) {
      return NextResponse.json(
        { error: aseratDueResult.error.message } satisfies ApiError,
        { status: 500 },
      );
    }
    if (seletDueResult.error) {
      return NextResponse.json(
        { error: seletDueResult.error.message } satisfies ApiError,
        { status: 500 },
      );
    }
    if (gbirDueResult.error) {
      return NextResponse.json(
        { error: gbirDueResult.error.message } satisfies ApiError,
        { status: 500 },
      );
    }

    const aseratDue = aseratDueResult.data ?? [];
    const seletDue = seletDueResult.data ?? [];
    const gbirDue = gbirDueResult.data ?? [];

    type AseratRow = {
      id: string;
      user_id: string;
      month: number;
      year: number;
      amount_due: number;
    };
    type SeletRow = {
      id: string;
      user_id: string;
      amount: number;
      amount_paid: number;
    };
    type GbirRow = { id: string; user_id: string; amount: number };

    // Build notification inserts
    const aseratNotifications = (aseratDue as unknown as AseratRow[]).map(
      (a) => ({
        user_id: a.user_id,
        type: "aserat_reminder" as const,
        title: "Aserat Bekurat Due in 7 Days",
        message: `Your Aserat for ${a.month}/${a.year} of ${a.amount_due} ETB is due in 7 days. Please pay on time.`,
        channel: "in_app" as const,
        scheduled_at: new Date().toISOString(),
      }),
    );

    const seletNotifications = (seletDue as unknown as SeletRow[]).map((s) => ({
      user_id: s.user_id,
      type: "selet_reminder" as const,
      title: "Selet Due in 7 Days",
      message: `Your Selet vow of ${s.amount} ETB is due in 7 days. Remaining: ${s.amount - s.amount_paid} ETB.`,
      channel: "in_app" as const,
      scheduled_at: new Date().toISOString(),
    }));

    const gbirNotifications = (gbirDue as unknown as GbirRow[]).map((g) => ({
      user_id: g.user_id,
      type: "gbir_reminder" as const,
      title: "Gbir Due in 7 Days",
      message: `Your annual Gbir of ${g.amount} ETB is due in 7 days. Please make your payment.`,
      channel: "in_app" as const,
      scheduled_at: new Date().toISOString(),
    }));

    // Insert notifications + update overdue/missed statuses in parallel
    const allNotifications = [
      ...aseratNotifications,
      ...seletNotifications,
      ...gbirNotifications,
    ];

    const [notifResult, overdueSeletResult, missedAseratResult] =
      await Promise.all([
        // Insert all notifications (skip if empty)
        allNotifications.length > 0
          ? supabase.from("notifications").insert(allNotifications)
          : Promise.resolve({ error: null }),

        // Check 4: Mark overdue Selet (due_date < today AND status in active/partial)
        supabase
          .from("selet")
          .update({ status: "overdue" })
          .lt("due_date", todayStr)
          .in("status", ["active", "partial"])
          .select("id"),

        // Check 5: Mark missed Aserat (due_date < today AND status = pending)
        supabase
          .from("aserat_bekurat")
          .update({ status: "missed" })
          .lt("due_date", todayStr)
          .eq("status", "pending")
          .select("id"),
      ]);

    if (notifResult.error) {
      return NextResponse.json(
        { error: notifResult.error.message } satisfies ApiError,
        { status: 500 },
      );
    }
    if (overdueSeletResult.error) {
      return NextResponse.json(
        { error: overdueSeletResult.error.message } satisfies ApiError,
        { status: 500 },
      );
    }
    if (missedAseratResult.error) {
      return NextResponse.json(
        { error: missedAseratResult.error.message } satisfies ApiError,
        { status: 500 },
      );
    }

    const result: CronResult = {
      processed: {
        aserat_reminders: aseratNotifications.length,
        selet_reminders: seletNotifications.length,
        gbir_reminders: gbirNotifications.length,
        overdue_selet: (overdueSeletResult.data ?? []).length,
        missed_aserat: (missedAseratResult.data ?? []).length,
      },
    };

    return NextResponse.json({ data: result } satisfies ApiSuccess<CronResult>);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" } satisfies ApiError,
      { status: 500 },
    );
  }
}
