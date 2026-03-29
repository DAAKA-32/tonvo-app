"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import AnimatedTitle from "@/components/AnimatedTitle";
import { PRICING_PLANS, ANNUAL_DISCOUNT_PERCENT } from "@/lib/pricing-config";

export default function PricingSection() {
  const { user } = useAuth();
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="px-4 sm:px-6 py-16 sm:py-24 md:py-32" style={{ backgroundColor: "var(--color-surface)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="section-label">Pricing</span>
          <AnimatedTitle variant="left" className="section-heading text-glow mb-4">
            Simple, transparent pricing.
          </AnimatedTitle>
          <p className="body-muted max-w-lg mx-auto mb-8">
            Start free. Upgrade when you need more power.
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
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className="px-5 py-2 rounded-full text-sm font-medium border-none cursor-pointer transition-all flex items-center gap-2"
              style={{
                background: annual ? "rgba(200, 200, 216, 0.12)" : "transparent",
                color: annual ? "var(--color-text)" : "var(--color-text-muted)",
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {PRICING_PLANS.map((plan) => {
            const isFree = plan.monthlyPrice === 0;
            const isTeam = plan.id === "team";
            const displayPrice = isFree
              ? "$0"
              : annual
                ? `$${plan.monthlyEquivalent}`
                : `$${plan.monthlyPrice}`;

            return (
              <div
                key={plan.id}
                className="glass-card p-7 flex flex-col relative"
                style={{
                  minHeight: 420,
                  ...(plan.popular
                    ? {
                        borderColor: "rgba(200, 200, 216, 0.25)",
                        boxShadow: "0 0 60px rgba(200, 200, 216, 0.05), 0 8px 32px rgba(0, 0, 0, 0.3)",
                      }
                    : {}),
                }}
              >
                {plan.popular && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold px-3.5 py-1 rounded-full"
                    style={{ background: "linear-gradient(135deg, #5c5c6e, #6e6e82)", color: "white" }}
                  >
                    Most Popular
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
                        ${plan.monthlyPrice}
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
                      Current Plan
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      className="btn-secondary w-full py-3 rounded-xl font-semibold text-sm text-center no-underline block"
                    >
                      {plan.cta}
                    </Link>
                  )
                ) : (
                  <Link
                    href={user ? "/pricing" : "/login"}
                    className={`${plan.popular ? "btn-primary" : "btn-secondary"} w-full py-3 rounded-xl font-semibold text-sm text-center no-underline block`}
                  >
                    {user ? plan.cta : "Get Started"}
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs mt-8" style={{ color: "var(--color-text-muted)" }}>
          All plans include a 7-day money-back guarantee. Cancel anytime.
        </p>
      </div>
    </section>
  );
}
