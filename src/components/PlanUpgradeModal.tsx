"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth-context";
import { authFetch } from "@/lib/api-client";
import { usePlan } from "@/hooks/usePlan";
import {
  PRICING_PLANS,
  ANNUAL_DISCOUNT_PERCENT,
  type BillingCycle,
} from "@/lib/pricing-config";
import { formatPrice } from "@/lib/currency";

/* ------------------------------------------------------------------ */
/*  Trigger logic                                                      */
/* ------------------------------------------------------------------ */
type ModalTrigger =
  | "stripe-success"    // ?session_id=...&plan=pro → upgrade confirmed
  | "stripe-cancel"     // ?canceled=1 → user cancelled checkout
  | "free-nudge"        // free user, periodic nudge
  | null;

function detectTrigger(
  searchParams: ReturnType<typeof useSearchParams>,
  plan: string,
  loading: boolean,
): ModalTrigger {
  if (loading) return null;

  // Stripe success: redirected back with session_id
  const sessionId = searchParams.get("session_id");
  const planParam = searchParams.get("plan");
  if (sessionId && planParam) return "stripe-success";

  // Stripe cancel: redirected back with canceled flag
  if (searchParams.get("canceled") === "1") return "stripe-cancel";

  // Free plan nudge: show once per session
  if (plan === "free") {
    if (typeof window !== "undefined") {
      const key = "tonvo-upgrade-nudge-shown";
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, "1");
        return "free-nudge";
      }
    }
  }

  return null;
}

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-positive)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-px">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
    </svg>
  );
}

function CrownIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4l3 12h14l3-12-6 7-4-9-4 9-6-7z" />
      <path d="M3 20h18" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function PlanUpgradeModal() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const { plan: currentPlan, loading: planLoading, refresh } = usePlan();

  const [open, setOpen] = useState(false);
  const [trigger, setTrigger] = useState<ModalTrigger>(null);
  const [billing, setBilling] = useState<BillingCycle>("monthly");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [visible, setVisible] = useState(false); // for animation

  // Detect trigger
  useEffect(() => {
    const t = detectTrigger(searchParams, currentPlan, planLoading);
    if (t) {
      // For stripe-success, refresh plan data first
      if (t === "stripe-success") refresh();
      setTrigger(t);
      setOpen(true);
      // Delay for entrance animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    }
  }, [searchParams, currentPlan, planLoading, refresh]);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      setOpen(false);
      setTrigger(null);
      // Clean URL params without reload
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.delete("session_id");
        url.searchParams.delete("plan");
        url.searchParams.delete("canceled");
        window.history.replaceState({}, "", url.pathname);
      }
    }, 250);
  }, []);

  async function handleUpgrade(planId: string) {
    if (!user || planId === "free") {
      handleClose();
      return;
    }
    setLoadingPlan(planId);
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
      if (data.url) {
        window.location.href = data.url;
        return;
      }
    } catch {
      // ignore
    }
    setLoadingPlan(null);
  }

  if (!open) return null;

  // Determine content based on trigger
  const isSuccess = trigger === "stripe-success";
  const isCancel = trigger === "stripe-cancel";
  const activatedPlan = searchParams.get("plan");

  const heading = isSuccess
    ? t("upgrade.successTitle")
    : isCancel
      ? t("upgrade.cancelTitle")
      : t("upgrade.nudgeTitle");

  const subtitle = isSuccess
    ? t("upgrade.successSubtitle", { plan: PRICING_PLANS.find((p) => p.id === activatedPlan)?.name ?? "Plus" })
    : isCancel
      ? t("upgrade.cancelSubtitle")
      : t("upgrade.nudgeSubtitle");

  // For success, show confirmation only (no plan cards)
  if (isSuccess) {
    return (
      <div
        className="upgrade-overlay"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={handleClose}
      >
        <div
          className="upgrade-modal upgrade-modal--compact"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "scale(1) translateY(0)" : "scale(0.96) translateY(12px)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="upgrade-success-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-positive)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2 className="upgrade-heading">{heading}</h2>
          <p className="upgrade-subtitle">{subtitle}</p>
          <button onClick={handleClose} className="upgrade-btn-primary upgrade-btn-full">
            {t("upgrade.goToDashboard")}
          </button>
        </div>
      </div>
    );
  }

  // Plan selection view (cancel or free-nudge)
  const plansToShow = PRICING_PLANS.filter((p) => p.id !== "free");

  return (
    <div
      className="upgrade-overlay"
      style={{ opacity: visible ? 1 : 0 }}
      onClick={handleClose}
    >
      <div
        className="upgrade-modal"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1) translateY(0)" : "scale(0.96) translateY(12px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button onClick={handleClose} className="upgrade-close" aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Header */}
        <div className="upgrade-header">
          <h2 className="upgrade-heading">{heading}</h2>
          <p className="upgrade-subtitle">{subtitle}</p>
        </div>

        {/* Billing toggle */}
        <div className="upgrade-toggle-row">
          <div className="upgrade-toggle">
            <button
              onClick={() => setBilling("monthly")}
              className={`upgrade-toggle-btn ${billing === "monthly" ? "upgrade-toggle-btn--active" : ""}`}
            >
              {t("pricing.monthly")}
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`upgrade-toggle-btn ${billing === "yearly" ? "upgrade-toggle-btn--active" : ""}`}
            >
              {t("pricing.annual")}
              <span className="upgrade-discount-badge">-{ANNUAL_DISCOUNT_PERCENT}%</span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="upgrade-plans">
          {plansToShow.map((plan) => {
            const isPopular = plan.popular;
            const priceAmount = billing === "yearly" ? plan.monthlyEquivalent : plan.monthlyPrice;
            const price = formatPrice(priceAmount, lang);
            const oldPrice = formatPrice(plan.monthlyPrice, lang);
            const isCurrent = currentPlan === plan.id;

            return (
              <div
                key={plan.id}
                className={`upgrade-plan-card ${isPopular ? "upgrade-plan-card--popular" : ""}`}
              >
                {isPopular && (
                  <div className="upgrade-popular-badge">
                    <SparkleIcon />
                    {t("pricing.mostPopular")}
                  </div>
                )}

                <div className="upgrade-plan-header">
                  <div className="upgrade-plan-icon">
                    {isPopular ? <SparkleIcon /> : <CrownIcon />}
                  </div>
                  <h3 className="upgrade-plan-name">{plan.name}</h3>
                  <p className="upgrade-plan-desc">{plan.description}</p>
                </div>

                <div className="upgrade-plan-price">
                  {billing === "yearly" && (
                    <span className="upgrade-plan-price-old">{oldPrice}</span>
                  )}
                  <span className="upgrade-plan-price-current">{price}</span>
                  <span className="upgrade-plan-price-period">{plan.period}</span>
                </div>

                <ul className="upgrade-plan-features">
                  {plan.features.slice(0, 4).map((f) => (
                    <li key={f}>
                      <CheckIcon />
                      <span>{f}</span>
                    </li>
                  ))}
                  {plan.features.length > 4 && (
                    <li className="upgrade-plan-more">
                      +{plan.features.length - 4} more
                    </li>
                  )}
                </ul>

                <button
                  onClick={() => isCurrent ? handleClose() : handleUpgrade(plan.id)}
                  disabled={loadingPlan === plan.id}
                  className={`upgrade-plan-cta ${isPopular ? "upgrade-btn-primary" : "upgrade-btn-secondary"} ${isCurrent ? "upgrade-btn-current" : ""}`}
                >
                  {loadingPlan === plan.id
                    ? t("pricing.redirecting")
                    : isCurrent
                      ? t("pricing.currentPlan")
                      : plan.cta}
                </button>
              </div>
            );
          })}
        </div>

        {/* Stay free */}
        {currentPlan === "free" && (
          <button onClick={handleClose} className="upgrade-stay-free">
            {t("upgrade.stayFree")}
          </button>
        )}
      </div>
    </div>
  );
}
