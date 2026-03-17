import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const { userId, action } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const { data: sub } = await supabaseAdmin
      .from("subscriptions")
      .select("stripe_subscription_id, stripe_customer_id")
      .eq("user_id", userId)
      .single();

    if (!sub?.stripe_subscription_id) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 404 });
    }

    if (action === "cancel") {
      // Cancel at end of period (don't cancel immediately -- user keeps access until period ends)
      await getStripe().subscriptions.update(sub.stripe_subscription_id, {
        cancel_at_period_end: true,
      });

      await supabaseAdmin
        .from("subscriptions")
        .update({ cancel_at_period_end: true })
        .eq("user_id", userId);

      return NextResponse.json({ canceled: true });
    }

    if (action === "reactivate") {
      // Undo cancellation -- resume auto-renewal
      await getStripe().subscriptions.update(sub.stripe_subscription_id, {
        cancel_at_period_end: false,
      });

      await supabaseAdmin
        .from("subscriptions")
        .update({ cancel_at_period_end: false })
        .eq("user_id", userId);

      return NextResponse.json({ reactivated: true });
    }

    return NextResponse.json({ error: "Invalid action. Use 'cancel' or 'reactivate'." }, { status: 400 });
  } catch (error) {
    console.error("Cancel/reactivate error:", error);
    return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 });
  }
}
