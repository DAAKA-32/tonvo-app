"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth-context";
import { authFetch } from "@/lib/api-client";
import AnimatedTitle from "@/components/AnimatedTitle";
import { PRICING_PLANS, ANNUAL_DISCOUNT_PERCENT } from "@/lib/pricing-config";
import { formatPrice, getCurrencyForLanguage } from "@/lib/currency";

export default function PricingSection() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const showBilledInUsd = getCurrencyForLanguage(lang) !== "USD";
  const [annual, setAnnual] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  async function handlePaidPlanClick(planId: string) {
    if (!user) return;
    setLoadingPlan(planId);
    try {
      const res = await authFetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          userId: user.uid,
          userEmail: user.email,
          billing: annual ? "yearly" : "monthly",
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // Fallback to pricing page on error
      window.location.href = "/pricing";
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <section id="pricing" className="px-4 sm:px-6 py-16 sm:py-24 md:py-32" style={{ backgroundColor: "var(--color-surface)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="section-label">{t("landing.nav.pricing")}</span>
          <AnimatedTitle variant="left" className="section-heading text-glow mb-4">
            {t("pricing.title")}
          </AnimatedTitle>
          <p className="body-muted max-w-lg mx-auto mb-8">
            {t("pricing.subtitle")}
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 px-1.5 py-1.5 rounded-full" style={{ background: "rgba(255, 255, 255, 0.04)", border: "1px solid var(--color-border)" }}>
            <button
              onClick={() => setAnnual(false)}
              className="px-5 py-2 rounded-full text-sm font-medium border-none cursor-pointer transition-all"
              style={{
                background: !annual ? "rgba(200, 200, 216, 0.12)" : "transparent",
                color: !annual ? "var(--color-text)" : "var(--color-text-muted)",
              }}
            >
              {t("pricing.monthly")}
            </button>
            <button
              onClick={() => setAnnual(true)}
              className="px-5 py-2 rounded-full text-sm font-medium border-none cursor-pointer transition-all flex items-center gap-2"
              style={{
                background: annual ? "rgba(200, 200, 216, 0.12)" : "transparent",
                color: annual ? "var(--color-text)" : "var(--color-text-muted)",
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {PRICING_PLANS.map((plan) => {
            const isFree = plan.monthlyPrice === 0;
            const displayPrice = isFree
              ? formatPrice(0, lang)
              : annual
                ? formatPrice(plan.monthlyEquivalent, lang)
                : formatPrice(plan.monthlyPrice, lang);
            const oldPrice = formatPrice(plan.monthlyPrice, lang);

            return (
              <div
                key={plan.id}
                className={`pricing-card rounded-xl border p-7 flex flex-col relative ${plan.popular ? "pricing-card--popular" : ""}`}
                style={{
                  background: "rgba(17, 17, 20, 0.6)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  borderColor: plan.popular
                    ? "rgba(200, 200, 216, 0.25)"
                    : "rgba(255, 255, 255, 0.06)",
                  boxShadow: plan.popular
                    ? "0 0 60px rgba(200, 200, 216, 0.05), 0 8px 32px rgba(0, 0, 0, 0.3)"
                    : undefined,
                  ...(plan.popular ? { padding: "2rem 1.75rem 1.75rem" } : {}),
                }}
              >
                {plan.popular && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold px-3.5 py-1 rounded-full"
                    style={{ background: "linear-gradient(135deg, #5c5c6e, #6e6e82)", color: "white" }}
                  >
                    {t("pricing.mostPopular")}
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-1" style={{ color: "var(--color-text)" }}>{plan.name}</h3>
                  <p className="text-xs mb-5" style={{ color: "var(--color-text-muted)" }}>{plan.description}</p>
                  <div className="flex items-baseline gap-1" style={{ minHeight: 48 }}>
                    {annual && !isFree && (
                      <span
                        className="text-lg line-through mr-1 transition-opacity duration-200"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {oldPrice}
                      </span>
                    )}
                    <span className="text-4xl font-bold" style={{ color: "var(--color-text)", minWidth: 56, display: "inline-block" }}>
                      {displayPrice}
                    </span>
                    {plan.period && (
                      <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>{plan.period}</span>
                    )}
                  </div>
                </div>
                <ul className="flex-1 space-y-3 mb-8" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--color-text-silver)" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={plan.popular ? "var(--color-positive)" : "var(--color-accent-light)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                {isFree ? (
                  user ? (
                    <div
                      className="w-full py-3 rounded-xl font-semibold text-sm text-center"
                      style={{ background: "rgba(52, 211, 153, 0.08)", color: "var(--color-positive)", border: "1px solid rgba(52, 211, 153, 0.2)" }}
                    >
                      {t("pricing.currentPlan")}
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      className="pricing-btn pricing-btn--secondary w-full py-3 rounded-xl font-semibold text-sm text-center no-underline block"
                      style={{
                        background: "transparent",
                        color: "var(--color-text-silver)",
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      {plan.cta}
                    </Link>
                  )
                ) : user ? (
                  <button
                    onClick={() => handlePaidPlanClick(plan.id)}
                    disabled={loadingPlan === plan.id}
                    className={`pricing-btn ${plan.popular ? "pricing-btn--primary" : "pricing-btn--secondary"} w-full py-3 rounded-xl font-semibold text-sm text-center cursor-pointer border-none disabled:opacity-60 disabled:cursor-wait`}
                    style={plan.popular
                      ? { background: "linear-gradient(135deg, #5c5c6e, #6e6e82)", color: "#fff" }
                      : { background: "transparent", color: "var(--color-text-silver)", border: "1px solid var(--color-border)" }
                    }
                  >
                    {loadingPlan === plan.id ? t("pricing.redirecting") : plan.cta}
                  </button>
                ) : (
                  <Link
                    href={`/login?plan=${plan.id}&billing=${annual ? "yearly" : "monthly"}`}
                    className={`pricing-btn ${plan.popular ? "pricing-btn--primary" : "pricing-btn--secondary"} w-full py-3 rounded-xl font-semibold text-sm text-center no-underline block`}
                    style={plan.popular
                      ? { background: "linear-gradient(135deg, #5c5c6e, #6e6e82)", color: "#fff", border: "none" }
                      : { background: "transparent", color: "var(--color-text-silver)", border: "1px solid var(--color-border)" }
                    }
                  >
                    {t("landing.hero.cta")}
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs mt-8" style={{ color: "var(--color-text-muted)" }}>
          {t("pricing.guarantee")}
          {showBilledInUsd && (
            <>
              {" · "}
              {t("pricing.billedInUsd")}
            </>
          )}
        </p>
      </div>
    </section>
  );
}
