"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth-context";
import { authFetch } from "@/lib/api-client";
import AppShell from "@/components/AppShell";
import {
  PRICING_PLANS,
  ANNUAL_DISCOUNT_PERCENT,
  getDisplayPrice,
  getPeriodLabel,
  type BillingCycle,
} from "@/lib/pricing-config";
import { formatPrice, getCurrencyForLanguage } from "@/lib/currency";

const PLAN_I18N_KEY: Record<string, string> = {
  free: "pricing.planFree",
  pro: "pricing.planPro",
  team: "pricing.planTeam",
};

export default function PricingPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const showBilledInUsd = getCurrencyForLanguage(lang) !== "USD";
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState("free");
  const [loading, setLoading] = useState<string | null>(null);
  const [billing, setBilling] = useState<BillingCycle>("monthly");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    authFetch("/api/subscription", {
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
    setError(null);
    try {
      const res = await authFetch("/api/stripe/checkout", {
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
        const errorKey = data.code ? `pricing.error.${data.code}` : "";
        const translated = errorKey ? t(errorKey, { defaultValue: "" }) : "";
        setError(translated || t("pricing.checkoutError"));
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Upgrade error:", err);
      setError(t("pricing.networkError"));
    } finally {
      setLoading(null);
    }
  }

  async function handleManage() {
    if (!user) return;
    setLoading("manage");
    try {
      const res = await authFetch("/api/stripe/portal", {
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
            {t("pricing.title")}
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--color-text-muted)" }}>
            {t("pricing.subtitle")}
          </p>

          {/* Billing Toggle */}
          <div
            className="inline-flex items-center gap-3 px-1.5 py-1.5 rounded-full"
            style={{
              background: "var(--color-surface)",
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
              {t("pricing.monthly")}
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
              {t("pricing.annual")}
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
                {loading === "manage" ? t("pricing.managingSubscription") : t("pricing.manageSubscription")}
              </button>
            </div>
          )}
        </div>

        {error && (
          <div
            className="mb-6 px-4 py-3 rounded-lg text-sm flex items-center gap-3"
            style={{
              background: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              color: "#f87171",
            }}
          >
            <span style={{ flex: 1 }}>{error}</span>
            <button
              onClick={() => setError(null)}
              className="border-none bg-transparent cursor-pointer p-1"
              style={{ color: "#f87171" }}
              aria-label="Dismiss"
            >
              &times;
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {PRICING_PLANS.map((plan) => {
            const isCurrent = currentPlan === plan.id;
            const isUpgrade = !isCurrent && plan.id !== "free";
            const isAnnual = billing === "yearly";
            const price = getDisplayPrice(plan, billing, lang);
            const oldPrice = formatPrice(plan.monthlyPrice, lang);
            const period = getPeriodLabel(plan);
            const i18nKey = PLAN_I18N_KEY[plan.id];
            const translatedFeatures = t(`${i18nKey}.features`, { returnObjects: true }) as string[];

            return (
              <div
                key={plan.id}
                className={`pricing-card rounded-xl border p-7 flex flex-col relative ${plan.popular ? "pricing-card--popular" : ""}`}
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: plan.popular
                    ? "rgba(200, 200, 216, 0.25)"
                    : "var(--color-border)",
                  boxShadow: plan.popular
                    ? "0 0 60px rgba(200, 200, 216, 0.05), 0 8px 32px rgba(0, 0, 0, 0.3)"
                    : undefined,
                  ...(plan.popular ? { padding: "2rem 1.75rem 1.75rem" } : {}),
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
                    {t("pricing.mostPopular")}
                  </div>
                )}

                <div className="mb-6">
                  <h3
                    className="text-lg font-bold mb-1"
                    style={{ color: "var(--color-text)" }}
                  >
                    {t(`${i18nKey}.name`)}
                  </h3>
                  <p
                    className="text-xs mb-5"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {t(`${i18nKey}.description`)}
                  </p>
                  <div
                    className="flex items-baseline gap-1"
                    style={{ minHeight: 48 }}
                  >
                    {isAnnual && plan.monthlyPrice > 0 && (
                      <span
                        className="text-lg line-through mr-1 transition-opacity duration-200"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {oldPrice}
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
                  {(Array.isArray(translatedFeatures) ? translatedFeatures : plan.features).map((feature, i) => (
                    <li
                      key={i}
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
                  className={`pricing-btn ${plan.popular ? "pricing-btn--primary" : isCurrent ? "" : "pricing-btn--secondary"} w-full py-3 rounded-xl font-semibold text-sm cursor-pointer border-none disabled:opacity-40 disabled:cursor-not-allowed`}
                  style={{
                    background: plan.popular
                      ? "linear-gradient(135deg, #5c5c6e, #6e6e82)"
                      : isCurrent
                        ? "rgba(52, 211, 153, 0.08)"
                        : "var(--color-surface-2)",
                    color: plan.popular
                      ? "white"
                      : isCurrent
                        ? "var(--color-positive)"
                        : "var(--color-text)",
                    border: isCurrent
                      ? "1px solid rgba(52, 211, 153, 0.2)"
                      : "none",
                  }}
                >
                  {loading === plan.id
                    ? t("pricing.redirecting")
                    : isCurrent
                      ? t("pricing.currentPlan")
                      : t(`${i18nKey}.cta`)}
                </button>
              </div>
            );
          })}
        </div>

        <p
          className="text-center text-xs mt-8"
          style={{ color: "var(--color-text-muted)" }}
        >
          {t("pricing.guarantee")}
          {showBilledInUsd && (
            <>
              {" · "}
              {t("pricing.billedInUsd")}
            </>
          )}
        </p>
      </div>
    </AppShell>
  );
}
