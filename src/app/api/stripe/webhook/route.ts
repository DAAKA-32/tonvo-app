import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type Stripe from "stripe";

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
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
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
        }
        break;
      }

      case "customer.subscription.updated": {
        const subObj = event.data.object as unknown as { customer: string; status: string; current_period_end: number };
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
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
