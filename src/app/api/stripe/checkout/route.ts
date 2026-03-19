import { NextRequest, NextResponse } from "next/server";
import { getStripe, PLANS, type PlanId } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const { planId, userId, userEmail, billing = "monthly" } = await req.json();

    if (!planId || !userId || !userEmail) {
      return NextResponse.json(
        { error: "Missing required fields.", code: "MISSING_FIELDS" },
        { status: 400 },
      );
    }

    const plan = PLANS[planId as PlanId];
    if (!plan || !("priceId" in plan) || !plan.priceId) {
      console.error("Invalid plan or missing priceId:", {
        planId,
        hasPlan: !!plan,
        priceId: plan && "priceId" in plan ? plan.priceId : "N/A",
        envPro: !!process.env.STRIPE_PRO_PRICE_ID,
        envTeam: !!process.env.STRIPE_TEAM_PRICE_ID,
      });
      return NextResponse.json(
        { error: "This plan is not available. Please contact support.", code: "INVALID_PLAN" },
        { status: 400 },
      );
    }

    // Select monthly or yearly price
    const priceId = billing === "yearly" && "yearlyPriceId" in plan && plan.yearlyPriceId
      ? plan.yearlyPriceId
      : plan.priceId;

    if (!priceId) {
      console.error("Price ID resolved to empty:", { planId, billing });
      return NextResponse.json(
        { error: "Billing configuration error. Please try a different billing cycle.", code: "MISSING_PRICE" },
        { status: 400 },
      );
    }

    // Retrieve existing Stripe customer (maybeSingle avoids throwing on 0 rows)
    const { data: existingSub, error: subError } = await supabaseAdmin
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (subError) {
      console.error("Supabase lookup error:", subError);
      // Non-blocking: proceed as if no customer exists
    }

    let customerId = existingSub?.stripe_customer_id;

    // Initialize Stripe (validates key on first call)
    let stripe: Stripe;
    try {
      stripe = getStripe();
    } catch (initErr) {
      console.error("Stripe initialization failed:", initErr);
      return NextResponse.json(
        { error: "Payment service is temporarily unavailable. Please try again later.", code: "STRIPE_INIT" },
        { status: 503 },
      );
    }

    if (!customerId) {
      try {
        const customer = await stripe.customers.create({
          email: userEmail,
          metadata: { firebaseUid: userId },
        });
        customerId = customer.id;

        // Save customer ID
        const { error: upsertError } = await supabaseAdmin
          .from("subscriptions")
          .upsert({
            user_id: userId,
            stripe_customer_id: customerId,
            plan: "free",
            status: "none",
            sessions_used: 0,
            sessions_reset: new Date().toISOString(),
          }, { onConflict: "user_id" });

        if (upsertError) {
          console.error("Failed to save Stripe customer:", upsertError);
          // Non-blocking: customer was created on Stripe, continue to checkout
        }
      } catch (custErr) {
        console.error("Stripe customer creation failed:", custErr);
        return NextResponse.json(
          { error: "Unable to set up your account for payment. Please try again.", code: "CUSTOMER_CREATE" },
          { status: 502 },
        );
      }
    }

    // Create checkout session
    const origin = req.headers.get("origin") || req.headers.get("referer")?.replace(/\/[^/]*$/, "") || "https://tonvo.co";

    const session = await stripe.checkout.sessions.create({
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
    // Categorize and log errors
    if (error instanceof Stripe.errors.StripeConnectionError) {
      console.error("Stripe connection error:", error.message);
      return NextResponse.json(
        { error: "Unable to reach our payment provider. Please try again in a moment.", code: "STRIPE_CONNECTION" },
        { status: 502 },
      );
    }
    if (error instanceof Stripe.errors.StripeAuthenticationError) {
      console.error("Stripe auth error — check STRIPE_SECRET_KEY:", error.message);
      return NextResponse.json(
        { error: "Payment service configuration error. Our team has been notified.", code: "STRIPE_AUTH" },
        { status: 500 },
      );
    }
    if (error instanceof Stripe.errors.StripeInvalidRequestError) {
      console.error("Stripe invalid request:", error.message, error.param);
      return NextResponse.json(
        { error: "Unable to create checkout session. Please contact support if the issue persists.", code: "STRIPE_INVALID" },
        { status: 400 },
      );
    }
    if (error instanceof Stripe.errors.StripeRateLimitError) {
      console.error("Stripe rate limit hit");
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment and try again.", code: "STRIPE_RATE_LIMIT" },
        { status: 429 },
      );
    }

    const message = error instanceof Error ? error.message : String(error);
    console.error("Checkout error (unhandled):", message, error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again.", code: "UNKNOWN" },
      { status: 500 },
    );
  }
}
