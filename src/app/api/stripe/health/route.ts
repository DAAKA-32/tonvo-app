import { NextRequest, NextResponse } from "next/server";
import { getStripe, PLANS } from "@/lib/stripe";
import { verifyAuth } from "@/lib/auth-server";

/**
 * GET /api/stripe/health
 * Diagnostic endpoint to verify Stripe configuration.
 * Does NOT expose secrets — only reports presence/format.
 */
export async function GET(req: NextRequest) {
  const authUser = await verifyAuth(req);
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Auth check: require ?secret= matching STRIPE_WEBHOOK_SECRET
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");
  const expected = process.env.STRIPE_WEBHOOK_SECRET;

  if (!expected || secret !== expected) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const checks: Record<string, unknown> = {};

  // 1. Check env vars exist (never expose values)
  const keyRaw = process.env.STRIPE_SECRET_KEY;
  checks.secretKeySet = !!keyRaw;
  checks.secretKeyPrefix = keyRaw ? keyRaw.trim().slice(0, 8) + "..." : null;
  checks.secretKeyLength = keyRaw?.trim().length ?? 0;
  checks.secretKeyHasWhitespace = keyRaw !== keyRaw?.trim();

  checks.webhookSecretSet = !!process.env.STRIPE_WEBHOOK_SECRET;
  checks.publishableKeySet = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  // 2. Check price IDs
  checks.priceIds = {
    proMonthly: PLANS.pro.priceId ? PLANS.pro.priceId.slice(0, 12) + "..." : "MISSING",
    proYearly: PLANS.pro.yearlyPriceId ? PLANS.pro.yearlyPriceId.slice(0, 12) + "..." : "MISSING",
    teamMonthly: PLANS.team.priceId ? PLANS.team.priceId.slice(0, 12) + "..." : "MISSING",
    teamYearly: PLANS.team.yearlyPriceId ? PLANS.team.yearlyPriceId.slice(0, 12) + "..." : "MISSING",
  };

  // 3. Test Stripe connection
  try {
    const stripe = getStripe();
    const balance = await stripe.balance.retrieve();
    checks.stripeConnection = "OK";
    checks.stripeLivemode = balance.livemode;
  } catch (err) {
    checks.stripeConnection = "FAILED";
    checks.stripeError = err instanceof Error ? err.message : String(err);
  }

  // 4. Verify price IDs exist on Stripe
  for (const [label, priceId] of [
    ["proMonthly", PLANS.pro.priceId],
    ["proYearly", PLANS.pro.yearlyPriceId],
    ["teamMonthly", PLANS.team.priceId],
    ["teamYearly", PLANS.team.yearlyPriceId],
  ] as const) {
    if (!priceId) {
      checks[`price_${label}`] = "MISSING_ENV";
      continue;
    }
    try {
      const price = await getStripe().prices.retrieve(priceId);
      checks[`price_${label}`] = { active: price.active, currency: price.currency, type: price.type };
    } catch (err) {
      checks[`price_${label}`] = { error: err instanceof Error ? err.message : String(err) };
    }
  }

  const allOk = checks.stripeConnection === "OK"
    && checks.secretKeySet
    && !checks.secretKeyHasWhitespace
    && PLANS.pro.priceId
    && PLANS.pro.yearlyPriceId
    && PLANS.team.priceId
    && PLANS.team.yearlyPriceId;

  return NextResponse.json(
    { status: allOk ? "healthy" : "unhealthy", checks },
    { status: allOk ? 200 : 503 },
  );
}
