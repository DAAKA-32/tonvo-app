import { NextRequest, NextResponse } from "next/server";
import { getStripe, PLANS, type PlanId } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifyAuth } from "@/lib/auth-server";
import { afterResponse, recordServerEvent } from "@/lib/analytics/server";
import { getAppUrl } from "@/lib/url";
import { assertJsonSize, JSON_BODY_LIMIT } from "@/lib/security";
import Stripe from "stripe";

const VALID_PLAN_IDS = new Set(["pro", "team"]);
const VALID_BILLING = new Set(["monthly", "yearly"]);

/** Return a JSON error with only a code — the frontend maps codes to i18n messages */
function errorResponse(code: string, status: number) {
  return NextResponse.json({ code }, { status });
}

export async function POST(req: NextRequest) {
  const sizeErr = assertJsonSize(req, JSON_BODY_LIMIT);
  if (sizeErr) return sizeErr;

  const authUser = await verifyAuth(req);
  if (!authUser) {
    return errorResponse("UNAUTHORIZED", 401);
  }

  try {
    let body: Record<string, unknown>;
    try {
      body = (await req.json()) as Record<string, unknown>;
    } catch {
      return errorResponse("INVALID_JSON", 400);
    }
    const { planId, billing: billingRaw } = body as {
      planId?: unknown;
      billing?: unknown;
    };

    // Trust the verified Firebase token, never the request body, for identity.
    const userId = authUser.uid;
    const userEmail = authUser.email;

    if (!userEmail) {
      // Token is valid but no email claim — refuse rather than create an
      // anonymous Stripe customer that can't be matched on payment failure.
      return errorResponse("MISSING_EMAIL", 400);
    }

    if (typeof planId !== "string" || !VALID_PLAN_IDS.has(planId)) {
      return errorResponse("INVALID_PLAN", 400);
    }
    const billing = typeof billingRaw === "string" && VALID_BILLING.has(billingRaw)
      ? billingRaw
      : "monthly";

    const plan = PLANS[planId as PlanId];
    if (!plan || !("priceId" in plan) || !plan.priceId) {
      console.error("Invalid plan or missing priceId:", {
        planId,
        hasPlan: !!plan,
        priceId: plan && "priceId" in plan ? plan.priceId : "N/A",
        envPro: !!process.env.STRIPE_PRO_PRICE_ID,
        envTeam: !!process.env.STRIPE_TEAM_PRICE_ID,
      });
      return errorResponse("INVALID_PLAN", 400);
    }

    const priceId = billing === "yearly" && "yearlyPriceId" in plan && plan.yearlyPriceId
      ? plan.yearlyPriceId
      : plan.priceId;

    if (!priceId) {
      console.error("Price ID resolved to empty:", { planId, billing });
      return errorResponse("MISSING_PRICE", 400);
    }

    const { data: existingSub, error: subError } = await supabaseAdmin
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (subError) {
      console.error("Supabase lookup error:", subError);
    }

    let customerId = existingSub?.stripe_customer_id;

    let stripe: Stripe;
    try {
      stripe = getStripe();
    } catch (initErr) {
      console.error("Stripe initialization failed:", initErr);
      return errorResponse("STRIPE_INIT", 503);
    }

    if (!customerId) {
      try {
        const customer = await stripe.customers.create({
          email: userEmail,
          metadata: { firebaseUid: userId },
        });
        customerId = customer.id;

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
        }
      } catch (custErr) {
        console.error("Stripe customer creation failed:", custErr);
        return errorResponse("CUSTOMER_CREATE", 502);
      }
    }

    const appUrl = getAppUrl();

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}&plan=${planId}`,
      cancel_url: `${appUrl}/pricing`,
      metadata: {
        userId,
        planId,
      },
    });

    afterResponse(() => recordServerEvent("checkout_started", userId, { plan: planId, billing: String(billing) }));
    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    if (error instanceof Stripe.errors.StripeConnectionError) {
      console.error("Stripe connection error:", error.message);
      return errorResponse("STRIPE_CONNECTION", 502);
    }
    if (error instanceof Stripe.errors.StripeAuthenticationError) {
      console.error("Stripe auth error — check STRIPE_SECRET_KEY:", error.message);
      return errorResponse("STRIPE_AUTH", 500);
    }
    if (error instanceof Stripe.errors.StripeInvalidRequestError) {
      console.error("Stripe invalid request:", error.message, error.param);
      return errorResponse("STRIPE_INVALID", 400);
    }
    if (error instanceof Stripe.errors.StripeRateLimitError) {
      console.error("Stripe rate limit hit");
      return errorResponse("STRIPE_RATE_LIMIT", 429);
    }

    const message = error instanceof Error ? error.message : String(error);
    console.error("Checkout error (unhandled):", message, error);
    return errorResponse("UNKNOWN", 500);
  }
}
