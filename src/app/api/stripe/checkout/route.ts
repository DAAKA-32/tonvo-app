import { NextRequest, NextResponse } from "next/server";
import { getStripe, PLANS, type PlanId } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const { planId, userId, userEmail, billing = "monthly" } = await req.json();

    if (!planId || !userId || !userEmail) {
      return NextResponse.json({ error: "Missing planId, userId, or userEmail" }, { status: 400 });
    }

    const plan = PLANS[planId as PlanId];
    if (!plan || !("priceId" in plan) || !plan.priceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Select monthly or yearly price
    const priceId = billing === "yearly" && "yearlyPriceId" in plan && plan.yearlyPriceId
      ? plan.yearlyPriceId
      : plan.priceId;

    // Check if user already has a Stripe customer
    const { data: existingSub, error: subError } = await supabaseAdmin
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .single();

    let customerId = existingSub?.stripe_customer_id;

    if (!customerId) {
      // Create Stripe customer
      const customer = await getStripe().customers.create({
        email: userEmail,
        metadata: { firebaseUid: userId },
      });
      customerId = customer.id;

      // Save customer ID
      await supabaseAdmin
        .from("subscriptions")
        .upsert({
          user_id: userId,
          stripe_customer_id: customerId,
          plan: "free",
          status: "none",
          sessions_used: 0,
          sessions_reset: new Date().toISOString(),
        }, { onConflict: "user_id" });
    }

    // Create checkout session
    const origin = req.headers.get("origin") || "https://tonvo.co";

    const session = await getStripe().checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}&plan=${planId}`,
      cancel_url: `${origin}/pricing`,
      metadata: {
        userId,
        planId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Checkout error:", message, error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
