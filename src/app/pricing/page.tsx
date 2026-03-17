"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import AppShell from "@/components/AppShell";

type BillingCycle = "monthly" | "yearly";

const PLANS = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    period: "",
    description: "Try Tonvo with basic features",
    features: [
      "3 sessions per month",
      "Real-time tone analysis",
      "Basic suggestions",
      "Session history (7 days)",
    ],
    cta: "Current Plan",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 19,
    yearlyPrice: 182,
    period: "/month",
    description: "For professionals who want an edge",
    features: [
      "Unlimited sessions",
      "Advanced conversation intelligence",
      "AI coaching tips & live insights",
      "Full session history",
      "Screen analysis",
      "Conversation signals detection",
      "Quality & engagement scoring",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    id: "team",
    name: "Team",
    monthlyPrice: 49,
    yearlyPrice: 470,
    period: "/user/month",
    description: "For teams that close deals together",
    features: [
      "Everything in Pro",
      "Team dashboard (coming soon)",
      "Manager insights (coming soon)",
      "Priority onboarding",
      "Dedicated support",
    ],
    cta: "Upgrade to Team",
    popular: false,
  },
];

export default function PricingPage() {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState("free");
  const [loading, setLoading] = useState<string | null>(null);
  const [billing, setBilling] = useState<BillingCycle>("monthly");

  useEffect(() => {
    if (!user) return;
    fetch("/api/subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.uid }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.plan) setCurrentPlan(data.plan);
      })
      .catch(() => {});
  }, [user]);

  async function handleUpgrade(planId: string) {
    if (!user || planId === "free") return;

    setLoading(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          userId: user.uid,
          userEmail: user.email,
          billing,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Upgrade error:", err);
    } finally {
      setLoading(null);
    }
  }

  async function handleManage() {
    if (!user) return;
    setLoading("manage");
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Portal error:", err);
    } finally {
      setLoading(null);
    }
  }

  function getDisplayPrice(plan: typeof PLANS[number]) {
    if (plan.monthlyPrice === 0) return "Free";
    if (billing === "yearly") {
      return `$${Math.round(plan.yearlyPrice / 12)}`;
    }
    return `$${plan.monthlyPrice}`;
  }

  function getPeriodLabel(plan: typeof PLANS[number]) {
    if (plan.monthlyPrice === 0) return "";
    if (plan.id === "team") return billing === "yearly" ? "/user/month" : "/user/month";
    return "/month";
  }

  function getSavingsLabel(plan: typeof PLANS[number]) {
    if (plan.monthlyPrice === 0 || billing !== "yearly") return null;
    const monthlyCost = plan.monthlyPrice * 12;
    const saved = monthlyCost - plan.yearlyPrice;
    return `Save $${saved}/year`;
  }

  return (
    <AppShell>
      <div style={{ maxWidth: 1000 }}>
        <div className="text-center mb-12">
          <h1 className="section-heading text-glow mb-3">Choose your plan</h1>
          <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
            Upgrade to unlock unlimited sessions and advanced AI coaching.
          </p>

          {/* Billing Toggle */}
          <div
            className="inline-flex items-center rounded-xl p-1 mb-2"
            style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
          >
            <button
              onClick={() => setBilling("monthly")}
              className="px-5 py-2 rounded-lg text-sm font-medium border-none cursor-pointer transition-all"
              style={{
                background: billing === "monthly"
                  ? "linear-gradient(135deg, #5c5c6e, #6e6e82)"
                  : "transparent",
                color: billing === "monthly" ? "white" : "var(--color-text-muted)",
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className="px-5 py-2 rounded-lg text-sm font-medium border-none cursor-pointer transition-all flex items-center gap-2"
              style={{
                background: billing === "yearly"
                  ? "linear-gradient(135deg, #5c5c6e, #6e6e82)"
                  : "transparent",
                color: billing === "yearly" ? "white" : "var(--color-text-muted)",
              }}
            >
              Yearly
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{
                  background: billing === "yearly" ? "rgba(52, 211, 153, 0.2)" : "rgba(52, 211, 153, 0.1)",
                  color: "var(--color-positive)",
                }}
              >
                -20%
              </span>
            </button>
          </div>

          {currentPlan !== "free" && (
            <div className="mt-4">
              <button
                onClick={handleManage}
                disabled={loading === "manage"}
                className="text-xs px-4 py-2 rounded-lg border cursor-pointer transition-all hover:opacity-80"
                style={{
                  background: "transparent",
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-muted)",
                }}>
                {loading === "manage" ? "Loading..." : "Manage Subscription"}
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLANS.map((plan) => {
            const isCurrent = currentPlan === plan.id;
            const isUpgrade = !isCurrent && plan.id !== "free";
            const savings = getSavingsLabel(plan);

            return (
              <div
                key={plan.id}
                className="rounded-xl border p-4 sm:p-6 flex flex-col relative"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: plan.popular ? "rgba(200, 200, 216, 0.25)" : "var(--color-border)",
                  boxShadow: plan.popular
                    ? "0 0 40px rgba(200, 200, 216, 0.06), 0 8px 32px rgba(0, 0, 0, 0.3)"
                    : undefined,
                }}>
                {plan.popular && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-1 rounded-full"
                    style={{
                      background: "linear-gradient(135deg, #5c5c6e, #6e6e82)",
                      color: "white",
                    }}>
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-1" style={{ color: "var(--color-text)" }}>
                    {plan.name}
                  </h3>
                  <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                    {plan.description}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold" style={{ color: "var(--color-text)" }}>
                      {getDisplayPrice(plan)}
                    </span>
                    {getPeriodLabel(plan) && (
                      <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                        {getPeriodLabel(plan)}
                      </span>
                    )}
                  </div>
                  {savings && (
                    <span
                      className="inline-block mt-2 text-xs font-semibold px-2 py-1 rounded-md"
                      style={{ backgroundColor: "rgba(52, 211, 153, 0.1)", color: "var(--color-positive)" }}
                    >
                      {savings}
                    </span>
                  )}
                  {billing === "yearly" && plan.yearlyPrice > 0 && (
                    <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                      Billed ${plan.yearlyPrice}/year
                    </p>
                  )}
                </div>

                <ul className="flex-1 mb-6 space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--color-text-silver)" }}>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mt-0.5 shrink-0"
                        style={{ color: plan.popular ? "var(--color-positive)" : "var(--color-accent-light)" }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => isUpgrade ? handleUpgrade(plan.id) : undefined}
                  disabled={isCurrent || loading === plan.id}
                  className="w-full py-3 rounded-xl font-semibold text-sm cursor-pointer border-none transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: plan.popular
                      ? "linear-gradient(135deg, #5c5c6e, #6e6e82)"
                      : isCurrent
                        ? "rgba(52, 211, 153, 0.1)"
                        : "var(--color-surface-2)",
                    color: isCurrent ? "var(--color-positive)" : "white",
                    border: isCurrent ? "1px solid rgba(52, 211, 153, 0.3)" : "none",
                  }}>
                  {loading === plan.id
                    ? "Redirecting..."
                    : isCurrent
                      ? "Current Plan"
                      : plan.cta}
                </button>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs mt-8" style={{ color: "var(--color-text-muted)" }}>
          All plans include a 7-day money-back guarantee. Cancel anytime.
        </p>
      </div>
    </AppShell>
  );
}
