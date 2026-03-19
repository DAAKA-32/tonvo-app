import Stripe from "stripe";

/** Strip whitespace AND literal \n that Vercel CLI can inject */
function cleanEnv(val: string | undefined): string {
  return (val ?? "").trim().replace(/\\n$/g, "");
}

// Lazy init: don't crash at build time if key is missing (dev mode)
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = cleanEnv(process.env.STRIPE_SECRET_KEY);
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    if (!key.startsWith("sk_live_") && !key.startsWith("sk_test_")) {
      throw new Error("STRIPE_SECRET_KEY has an invalid format — check Vercel env vars for trailing characters");
    }
    _stripe = new Stripe(key, {
      apiVersion: "2026-02-25.clover",
      maxNetworkRetries: 3,
      timeout: 15_000,
    });
  }
  return _stripe;
}

/** @deprecated Use getStripe() instead -- kept for backward compat */
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(cleanEnv(process.env.STRIPE_SECRET_KEY), { apiVersion: "2026-02-25.clover" })
  : (null as unknown as Stripe);

// ===== Pricing tiers (synced with pricing-config.ts) =====
import { PRICING_PLANS, type PlanId as ConfigPlanId } from "./pricing-config";

// Use getters so price IDs are resolved at runtime, not build time
export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    sessionsPerMonth: 3,
    features: PRICING_PLANS[0].features,
  },
  pro: {
    name: "Pro",
    price: PRICING_PLANS[1].monthlyPrice,
    yearlyPrice: PRICING_PLANS[1].yearlyPrice,
    get priceId() { return cleanEnv(process.env.STRIPE_PRO_PRICE_ID); },
    get yearlyPriceId() { return cleanEnv(process.env.STRIPE_PRO_YEARLY_PRICE_ID); },
    sessionsPerMonth: -1,
    features: PRICING_PLANS[1].features,
  },
  team: {
    name: "Team",
    price: PRICING_PLANS[2].monthlyPrice,
    yearlyPrice: PRICING_PLANS[2].yearlyPrice,
    get priceId() { return cleanEnv(process.env.STRIPE_TEAM_PRICE_ID); },
    get yearlyPriceId() { return cleanEnv(process.env.STRIPE_TEAM_YEARLY_PRICE_ID); },
    sessionsPerMonth: -1,
    features: PRICING_PLANS[2].features,
  },
};

export type PlanId = ConfigPlanId;
