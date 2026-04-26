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
    name: "Starter",
    description: "Feel the close-rate lift on 3 calls a month",
    monthlyPrice: 0,
    yearlyPrice: 0,
    monthlyEquivalent: 0,
    discountPercent: 0,
    features: [
      "3 live closing sessions per month",
      "Buying-signal detection",
      "Core closing lines",
      "Deal review (7-day history)",
    ],
    cta: "Close my first deal",
    popular: false,
    period: "",
  },
  {
    id: "pro",
    name: "Closer",
    description: "For operators who close for a living",
    monthlyPrice: 19,
    yearlyPrice: 156,
    monthlyEquivalent: 13,
    discountPercent: ANNUAL_DISCOUNT_PERCENT,
    features: [
      "Unlimited closing sessions",
      "Full objection-handling library",
      "Live closing lines & price anchors",
      "Close-rate trend, all-time",
      "Post-call deal review (transcripts)",
      "Export deal reports (PDF/CSV)",
      "Priority support",
    ],
    cta: "Unlock my edge",
    popular: true,
    period: "/month",
  },
  {
    id: "team",
    name: "Sales Team",
    description: "Compound close rate across every rep",
    monthlyPrice: 49,
    yearlyPrice: 408,
    monthlyEquivalent: 34,
    discountPercent: ANNUAL_DISCOUNT_PERCENT,
    features: [
      "Everything in Closer",
      "Team close-rate dashboard",
      "Manager win/loss insights",
      "Custom playbook per rep",
      "API access",
      "SSO integration",
      "Dedicated revenue coach",
    ],
    cta: "Lift the whole team",
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
