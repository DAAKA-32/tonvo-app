/**
 * ========================================================
 * SINGLE SOURCE OF TRUTH — Pricing Configuration
 * ========================================================
 * ALL pricing display (landing, /pricing, emails, etc.)
 * and Stripe integration MUST reference this file.
 *
 * To change a price: update it HERE, then update the
 * corresponding Stripe Price object via dashboard or CLI.
 * ========================================================
 */

import { formatPrice, formatSavings } from "@/lib/currency";

export type PlanId = "free" | "pro" | "team";
export type BillingCycle = "monthly" | "yearly";

export interface PricingPlan {
  id: PlanId;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;          // total billed per year
  monthlyEquivalent: number;    // yearlyPrice / 12, rounded
  discountPercent: number;       // e.g. 30
  features: string[];
  cta: string;
  popular: boolean;
  period: string;               // "/month", "/user/month", ""
}

// ── Discount ──
export const ANNUAL_DISCOUNT_PERCENT = 30;

// ── Plans ──
export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "Try Tonvo with basic features",
    monthlyPrice: 0,
    yearlyPrice: 0,
    monthlyEquivalent: 0,
    discountPercent: 0,
    features: [
      "3 sessions per month",
      "Real-time tone analysis",
      "Basic suggestions",
      "Session history (7 days)",
    ],
    cta: "Get Started Free",
    popular: false,
    period: "",
  },
  {
    id: "pro",
    name: "Pro",
    description: "For professionals who want an edge",
    monthlyPrice: 19,
    yearlyPrice: 156,             // 19 × 12 × 0.70 = 159.6 → 156 (=$13/mo × 12)
    monthlyEquivalent: 13,        // 156 / 12
    discountPercent: ANNUAL_DISCOUNT_PERCENT,
    features: [
      "Unlimited sessions",
      "Advanced conversation intelligence",
      "AI coaching tips & live insights",
      "Full session history",
      "Screen analysis",
      "Export PDF/CSV",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    popular: true,
    period: "/month",
  },
  {
    id: "team",
    name: "Team",
    description: "For teams that close deals together",
    monthlyPrice: 49,
    yearlyPrice: 408,             // 49 × 12 × 0.70 = 411.6 → 408 (=$34/mo × 12)
    monthlyEquivalent: 34,        // 408 / 12
    discountPercent: ANNUAL_DISCOUNT_PERCENT,
    features: [
      "Everything in Pro",
      "Team dashboard & analytics",
      "Manager insights & reports",
      "Custom coaching profiles",
      "API access",
      "SSO integration",
      "Dedicated support",
    ],
    cta: "Upgrade to Team",
    popular: false,
    period: "/user/month",
  },
];

// ── Helpers ──

export function getPlan(id: PlanId): PricingPlan {
  return PRICING_PLANS.find((p) => p.id === id) ?? PRICING_PLANS[0];
}

/**
 * Get the headline price string for a plan, formatted in the user's
 * display currency (USD/EUR per locale). Pass `lang` from
 * useTranslation().i18n.language so the right currency is picked.
 */
export function getDisplayPrice(
  plan: PricingPlan,
  billing: BillingCycle,
  lang: string | undefined,
): string {
  if (plan.monthlyPrice === 0) return formatPrice(0, lang);
  const amount = billing === "yearly" ? plan.monthlyEquivalent : plan.monthlyPrice;
  return formatPrice(amount, lang);
}

/**
 * Yearly savings label, formatted in the user's display currency.
 * Returns null when the plan is free or the user is on monthly billing.
 */
export function getSavingsLabel(
  plan: PricingPlan,
  billing: BillingCycle,
  lang: string | undefined,
): string | null {
  if (plan.monthlyPrice === 0 || billing !== "yearly") return null;
  const saved = plan.monthlyPrice * 12 - plan.yearlyPrice;
  return formatSavings(saved, lang);
}

export function getPeriodLabel(plan: PricingPlan): string {
  return plan.period;
}
