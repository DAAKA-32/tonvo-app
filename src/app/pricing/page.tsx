"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import AppShell from "@/components/AppShell";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
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
    price: 19,
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
    price: 49,
    period: "/user/month",
    description: "For teams that close deals together",
    features: [
      "Everything in Pro",
      "Team dashboard (coming soon)",
      "Manager insights (coming soon)",
      "Priority onboarding",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function PricingPage() {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState("free");
  const [loading, setLoading] = useState<string | null>(null);

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

    if (planId === "team") {
      window.open("mailto:contact@tonvo.co?subject=Team Plan Inquiry", "_blank");
      return;
    }

    setLoading(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          userId: user.uid,
          userEmail: user.email,
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

  return (
    <AppShell>
      <div style={{ maxWidth: 1000 }}>
        <div className="text-center mb-12">
          <h1 className="section-heading text-glow mb-3">Choose your plan</h1>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Upgrade to unlock unlimited sessions and advanced AI coaching.
          </p>
          {currentPlan !== "free" && (
            <button
              onClick={handleManage}
              disabled={loading === "manage"}
              className="mt-4 text-xs px-4 py-2 rounded-lg border cursor-pointer transition-all hover:opacity-80"
              style={{
                background: "transparent",
                borderColor: "var(--color-border)",
                color: "var(--color-text-muted)",
              }}>
              {loading === "manage" ? "Loading..." : "Manage Subscription"}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLANS.map((plan) => {
            const isCurrent = currentPlan === plan.id;
            const isUpgrade = !isCurrent && plan.id !== "free";

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
                      {plan.price === 0 ? "Free" : `$${plan.price}`}
                    </span>
                    {plan.period && (
                      <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                        {plan.period}
                      </span>
                    )}
                  </div>
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
