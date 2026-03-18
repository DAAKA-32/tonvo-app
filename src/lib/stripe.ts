import Stripe from "stripe";

// Lazy init: don't crash at build time if key is missing (dev mode)
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover",
      typescript: true,
    });
  }
  return _stripe;
}

/** @deprecated Use getStripe() instead -- kept for backward compat */
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-02-25.clover", typescript: true })
  : (null as unknown as Stripe);

// ===== Pricing tiers (synced with pricing-config.ts) =====
import { PRICING_PLANS, type PlanId as ConfigPlanId } from "./pricing-config";

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
    priceId: process.env.STRIPE_PRO_PRICE_ID || "",
    yearlyPriceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID || "",
    sessionsPerMonth: -1,
    features: PRICING_PLANS[1].features,
  },
  team: {
    name: "Team",
    price: PRICING_PLANS[2].monthlyPrice,
    yearlyPrice: PRICING_PLANS[2].yearlyPrice,
    priceId: process.env.STRIPE_TEAM_PRICE_ID || "",
    yearlyPriceId: process.env.STRIPE_TEAM_YEARLY_PRICE_ID || "",
    sessionsPerMonth: -1,
    features: PRICING_PLANS[2].features,
  },
} as const;

export type PlanId = ConfigPlanId;
