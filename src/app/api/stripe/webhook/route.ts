import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { recordServerEvent } from "@/lib/analytics/server";
import type Stripe from "stripe";

// Reject events whose Stripe timestamp is older than this. Stripe retries
// failed webhooks for ~3 days, so anything older is either a replay attempt
// or a configuration mistake that we don't want to process.
const MAX_EVENT_AGE_SECONDS = 4 * 24 * 60 * 60;

// In-memory dedup cache. Per-instance only — a determined attacker who
// triggered a serverless cold start could replay across instances, but
// Stripe's own signature timestamp + the MAX_EVENT_AGE_SECONDS window
// plus per-row updates being idempotent (upserts keyed on user_id /
// stripe_customer_id) make replay impact minimal.
//
// For stronger guarantees, persist processed event ids in a Supabase table
// or Redis with a TTL of MAX_EVENT_AGE_SECONDS.
const SEEN_EVENT_IDS = new Map<string, number>();
const SEEN_CAP = 5_000;

function rememberEvent(id: string): boolean {
  if (SEEN_EVENT_IDS.has(id)) return false;
  if (SEEN_EVENT_IDS.size >= SEEN_CAP) {
    // Drop the oldest 10% so the cache doesn't grow unbounded
    const drop = Math.floor(SEEN_CAP / 10);
    let i = 0;
    for (const k of SEEN_EVENT_IDS.keys()) {
      SEEN_EVENT_IDS.delete(k);
      if (++i >= drop) break;
    }
  }
  SEEN_EVENT_IDS.set(id, Date.now());
  return true;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err instanceof Error ? err.message : "unknown");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Staleness check — reject ancient events even if signature is valid
  const nowSec = Math.floor(Date.now() / 1000);
  if (event.created && nowSec - event.created > MAX_EVENT_AGE_SECONDS) {
    console.warn(`[stripe-webhook] rejecting stale event ${event.id} age=${nowSec - event.created}s`);
    // Return 200 so Stripe stops retrying; we deliberately ignore.
    return NextResponse.json({ received: true, ignored: "stale" });
  }

  // Idempotency — Stripe can deliver the same event multiple times.
  if (!rememberEvent(event.id)) {
    return NextResponse.json({ received: true, deduped: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId;

        if (userId && planId && session.subscription) {
          const subResponse = await getStripe().subscriptions.retrieve(session.subscription as string);
          const subscription = subResponse as unknown as { id: string; current_period_end: number };

          await supabaseAdmin
            .from("subscriptions")
            .upsert({
              user_id: userId,
              plan: planId,
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: subscription.id,
              status: "active",
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              sessions_used: 0,
              sessions_reset: new Date().toISOString(),
            }, { onConflict: "user_id" });
          await recordServerEvent("checkout_completed", userId, { plan: planId });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subObj = event.data.object as unknown as {
          customer: string;
          status: string;
          current_period_end: number;
          cancel_at_period_end: boolean;
        };
        const customerId = subObj.customer as string;

        const status = subObj.status === "active" ? "active"
          : subObj.status === "past_due" ? "past_due"
          : subObj.status === "trialing" ? "trialing"
          : "canceled";

        await supabaseAdmin
          .from("subscriptions")
          .update({
            status,
            current_period_end: new Date(subObj.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subObj.cancel_at_period_end ?? false,
          })
          .eq("stripe_customer_id", customerId);
        break;
      }

      case "customer.subscription.deleted": {
        const deletedSub = event.data.object as unknown as { customer: string };
        const customerId = deletedSub.customer as string;

        await supabaseAdmin
          .from("subscriptions")
          .update({
            plan: "free",
            status: "canceled",
            stripe_subscription_id: null,
            current_period_end: null,
          })
          .eq("stripe_customer_id", customerId);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        await supabaseAdmin
          .from("subscriptions")
          .update({ status: "past_due" })
          .eq("stripe_customer_id", customerId);
        break;
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err instanceof Error ? err.message : "unknown");
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
