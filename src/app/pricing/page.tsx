"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import AppShell from "@/components/AppShell";
import {
  PRICING_PLANS,
  ANNUAL_DISCOUNT_PERCENT,
  getDisplayPrice,
  getSavingsLabel,
  getPeriodLabel,
  type BillingCycle,
} from "@/lib/pricing-config";

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
      if (!res.ok) {
        console.error("Checkout API error:", data);
        alert(data.error || "Something went wrong. Please try again.");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Upgrade error:", err);
      alert("Network error. Please check your connection and try again.");
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
        <div className="text-center mb-16">
          <h1 className="section-heading text-glow mb-4">
            Simple, transparent pricing.
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--color-text-muted)" }}>
            Start free. Upgrade when you need more power.
          </p>

          {/* Billing Toggle — matches landing page */}
          <div
            className="inline-flex items-center gap-3 px-1.5 py-1.5 rounded-full"
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid var(--color-border)",
            }}
          >
            <button
              onClick={() => setBilling("monthly")}
              className="px-5 py-2 rounded-full text-sm font-medium border-none cursor-pointer transition-all"
              style={{
                background: billing === "monthly"
                  ? "rgba(200, 200, 216, 0.12)"
                  : "transparent",
                color: billing === "monthly"
                  ? "var(--color-text)"
                  : "var(--color-text-muted)",
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className="px-5 py-2 rounded-full text-sm font-medium border-none cursor-pointer transition-all flex items-center gap-2"
              style={{
                background: billing === "yearly"
                  ? "rgba(200, 200, 216, 0.12)"
                  : "transparent",
                color: billing === "yearly"
                  ? "var(--color-text)"
                  : "var(--color-text-muted)",
              }}
            >
              Annual
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(52, 211, 153, 0.12)",
                  color: "var(--color-positive)",
                  border: "1px solid rgba(52, 211, 153, 0.2)",
                }}
              >
                -{ANNUAL_DISCOUNT_PERCENT}%
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
                }}
              >
                {loading === "manage" ? "Loading..." : "Manage Subscription"}
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {PRICING_PLANS.map((plan) => {
            const isCurrent = currentPlan === plan.id;
            const isUpgrade = !isCurrent && plan.id !== "free";
            const savings = getSavingsLabel(plan, billing);
            const isAnnual = billing === "yearly";
            const price = getDisplayPrice(plan, billing);
            const period = getPeriodLabel(plan);

            return (
              <div
                key={plan.id}
                className="rounded-xl border p-7 flex flex-col relative"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: plan.popular
                    ? "rgba(200, 200, 216, 0.25)"
                    : "var(--color-border)",
                  boxShadow: plan.popular
                    ? "0 0 60px rgba(200, 200, 216, 0.05), 0 8px 32px rgba(0, 0, 0, 0.3)"
                    : undefined,
                  minHeight: 420,
                }}
              >
                {plan.popular && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold px-3.5 py-1 rounded-full"
                    style={{
                      background: "linear-gradient(135deg, #5c5c6e, #6e6e82)",
                      color: "white",
                    }}
                  >
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3
                    className="text-lg font-bold mb-1"
                    style={{ color: "var(--color-text)" }}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className="text-xs mb-5"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {plan.description}
                  </p>
                  <div
                    className="flex items-baseline gap-1"
                    style={{ minHeight: 48 }}
                  >
                    {/* Strikethrough original price when annual */}
                    {isAnnual && plan.monthlyPrice > 0 && (
                      <span
                        className="text-lg line-through mr-1 transition-opacity duration-200"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        ${plan.monthlyPrice}
                      </span>
                    )}
                    <span
                      className="text-4xl font-bold"
                      style={{
                        color: "var(--color-text)",
                        minWidth: 56,
                        display: "inline-block",
                      }}
                    >
                      {price}
                    </span>
                    {period && (
                      <span
                        className="text-sm"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {period}
                      </span>
                    )}
                  </div>
                </div>

                <ul
                  className="flex-1 space-y-3 mb-8"
                  style={{ listStyle: "none", padding: 0, margin: 0 }}
                >
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm"
                      style={{ color: "var(--color-text-silver)" }}
                    >
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
                        style={{
                          color: plan.popular
                            ? "var(--color-positive)"
                            : "var(--color-accent-light)",
                        }}
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() =>
                    isUpgrade ? handleUpgrade(plan.id) : undefined
                  }
                  disabled={isCurrent || loading === plan.id}
                  className="w-full py-3 rounded-xl font-semibold text-sm cursor-pointer border-none transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: plan.popular
                      ? "linear-gradient(135deg, #5c5c6e, #6e6e82)"
                      : isCurrent
                        ? "rgba(52, 211, 153, 0.08)"
                        : "var(--color-surface-2)",
                    color: isCurrent ? "var(--color-positive)" : "white",
                    border: isCurrent
                      ? "1px solid rgba(52, 211, 153, 0.2)"
                      : "none",
                  }}
                >
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

        <p
          className="text-center text-xs mt-8"
          style={{ color: "var(--color-text-muted)" }}
        >
          All plans include a 7-day money-back guarantee. Cancel anytime.
        </p>
      </div>
    </AppShell>
  );
}
