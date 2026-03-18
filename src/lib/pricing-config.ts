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

export function getDisplayPrice(plan: PricingPlan, billing: BillingCycle): string {
  if (plan.monthlyPrice === 0) return "Free";
  if (billing === "yearly") return `$${plan.monthlyEquivalent}`;
  return `$${plan.monthlyPrice}`;
}

export function getSavingsLabel(plan: PricingPlan, billing: BillingCycle): string | null {
  if (plan.monthlyPrice === 0 || billing !== "yearly") return null;
  const saved = plan.monthlyPrice * 12 - plan.yearlyPrice;
  return `Save $${saved}/year`;
}

export function getPeriodLabel(plan: PricingPlan): string {
  return plan.period;
}
