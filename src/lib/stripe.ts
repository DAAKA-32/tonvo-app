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

// ===== Pricing tiers =====
export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    sessionsPerMonth: 3,
    features: [
      "3 sessions per month",
      "Real-time tone analysis",
      "Basic suggestions",
      "Session history (7 days)",
    ],
  },
  pro: {
    name: "Pro",
    price: 19,
    priceId: process.env.STRIPE_PRO_PRICE_ID || "",
    sessionsPerMonth: -1, // unlimited
    features: [
      "Unlimited sessions",
      "Advanced conversation intelligence",
      "AI coaching tips",
      "Full session history",
      "Screen analysis",
      "Export PDF/CSV",
      "Priority support",
    ],
  },
  team: {
    name: "Team",
    price: 49,
    priceId: process.env.STRIPE_TEAM_PRICE_ID || "",
    sessionsPerMonth: -1, // unlimited
    features: [
      "Everything in Pro",
      "Team dashboard (coming soon)",
      "Manager insights (coming soon)",
      "Priority onboarding",
      "Dedicated support",
    ],
  },
} as const;

export type PlanId = keyof typeof PLANS;
