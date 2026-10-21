"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth-context";
import { authFetch } from "@/lib/api-client";
import AnimatedTitle from "@/components/AnimatedTitle";
import { PRICING_PLANS, ANNUAL_DISCOUNT_PERCENT } from "@/lib/pricing-config";
import { formatPrice, getCurrencyForLanguage } from "@/lib/currency";
import {
  easeOutExpo,
  easeOutSoft,
  VIEWPORT,
} from "@/components/motion/transitions";

const SPRING_TAP = { type: "spring" as const, stiffness: 480, damping: 28 };
const SPRING_HOVER = { type: "spring" as const, stiffness: 320, damping: 28 };

const MotionLink = motion.create(Link);

// Same i18n namespaces as /pricing, so both pages always say the same thing.
const PLAN_I18N_KEY = {
  free: "pricing.planFree",
  pro: "pricing.planPro",
  team: "pricing.planTeam",
} as const;

export default function PricingSection({ headingAs = "h2" }: { headingAs?: "h1" | "h2" } = {}) {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const reduce = useReducedMotion();
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
      window.location.href = "/pricing";
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <section
      data-cta-section="pricing"
      id="pricing"
      className="relative px-4 sm:px-6 py-16 sm:py-24 md:py-32 overflow-hidden"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <motion.span
            className="section-label inline-block"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
            whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.55, ease: easeOutExpo }}
          >
            {t("landing.nav.pricing")}
          </motion.span>

          <AnimatedTitle as={headingAs} variant="left" className="section-heading text-glow mb-4">
            {t("pricing.title")}
          </AnimatedTitle>

          <motion.p
            className="body-muted max-w-lg mx-auto mb-8"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
            whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, delay: 0.1, ease: easeOutExpo }}
          >
            {t("pricing.subtitle")}
          </motion.p>

          {/* Billing toggle — magnetic pill via shared layoutId */}
          <BillingToggle annual={annual} onChange={setAnnual} reduce={!!reduce} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {PRICING_PLANS.map((plan, i) => {
            const isFree = plan.monthlyPrice === 0;
            const displayPrice = isFree
              ? formatPrice(0, lang)
              : annual
                ? formatPrice(plan.monthlyEquivalent, lang)
                : formatPrice(plan.monthlyPrice, lang);
            const oldPrice = formatPrice(plan.monthlyPrice, lang);
            const copyKey = PLAN_I18N_KEY[plan.id];
            const translatedFeatures = t(`${copyKey}.features`, { returnObjects: true });
            const localizedPlan = {
              ...plan,
              name: t(`${copyKey}.name`),
              description: t(`${copyKey}.description`),
              cta: t(`${copyKey}.cta`),
              features: Array.isArray(translatedFeatures)
                ? (translatedFeatures as string[])
                : plan.features,
            };

            return (
              <PricingCard
                key={plan.id}
                index={i}
                plan={localizedPlan}
                annual={annual}
                isFree={isFree}
                displayPrice={displayPrice}
                oldPrice={oldPrice}
                user={user}
                loadingPlan={loadingPlan}
                onPaidPlanClick={handlePaidPlanClick}
                t={t}
                reduce={!!reduce}
              />
            );
          })}
        </div>

        <EnterprisePanel t={t} reduce={!!reduce} />

        <motion.p
          className="text-center text-xs mt-8"
          style={{ color: "var(--color-text-muted)" }}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, delay: 0.5, ease: easeOutSoft }}
        >
          {t("pricing.guarantee")}
          {showBilledInUsd && (
            <>
              {" · "}
              {t("pricing.billedInUsd")}
            </>
          )}
        </motion.p>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- */
/*  EnterprisePanel — sales-led tier, anchors the ladder upward      */
/*  Horizontal wide card sitting below the 3-tier grid. No price     */
/*  shown — buyers in this segment expect a sales conversation.      */
/* ----------------------------------------------------------------- */
interface EnterprisePanelProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
  reduce: boolean;
}

function EnterprisePanel({ t, reduce }: EnterprisePanelProps) {
  const features = t("pricing.planEnterprise.features", { returnObjects: true }) as string[];
  const subject = encodeURIComponent("Tonvo Enterprise inquiry");
  const mailto = `mailto:outreach@tonvo.co?subject=${subject}`;

  return (
    <motion.div
      className="mt-8 rounded-2xl border p-7 sm:p-9 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(17, 17, 20, 0.85) 0%, rgba(24, 24, 28, 0.65) 100%)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderColor: "rgba(200, 200, 216, 0.12)",
        boxShadow: "0 12px 40px rgba(0, 0, 0, 0.25)",
      }}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, filter: "blur(8px)" }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={VIEWPORT}
      transition={{ duration: 0.7, delay: 0.5, ease: easeOutExpo }}
    >
      {/* Subtle directional sheen — bottom-right glow */}
      {!reduce && (
        <motion.div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            inset: "auto -20% -50% auto",
            width: "60%",
            height: "120%",
            background:
              "radial-gradient(ellipse at center, rgba(200, 200, 216, 0.10), transparent 70%)",
            filter: "blur(40px)",
          }}
          animate={{ opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 items-start">
        {/* Left column: label, name, description, features */}
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span
              className="text-xs font-semibold uppercase tracking-[0.14em] px-3 py-1 rounded-full"
              style={{
                color: "var(--color-accent-light)",
                background: "rgba(200, 200, 216, 0.08)",
                border: "1px solid rgba(200, 200, 216, 0.18)",
              }}
            >
              {t("pricing.planEnterprise.label")}
            </span>
            <span
              className="text-xs font-medium tabular-nums"
              style={{ color: "var(--color-text-muted)" }}
            >
              {t("pricing.planEnterprise.priceLabel")}
              {" · "}
              {t("pricing.planEnterprise.priceSubLabel")}
            </span>
          </div>

          <h3
            className="text-2xl sm:text-3xl font-bold mb-3 leading-tight"
            style={{ color: "var(--color-text)" }}
          >
            {t("pricing.planEnterprise.name")}
          </h3>
          <p
            className="text-sm sm:text-base mb-6 max-w-2xl"
            style={{ color: "var(--color-text-silver)" }}
          >
            {t("pricing.planEnterprise.description")}
          </p>

          <ul
            className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5"
            style={{ listStyle: "none", padding: 0, margin: 0 }}
          >
            {features.map((f, fi) => (
              <motion.li
                key={f}
                className="flex items-start gap-2.5 text-sm"
                style={{ color: "var(--color-text-silver)" }}
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: -8 }}
                whileInView={reduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
                viewport={VIEWPORT}
                transition={{
                  duration: 0.4,
                  delay: 0.55 + fi * 0.04,
                  ease: easeOutSoft,
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-accent-light)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-0.5 shrink-0"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{f}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Right column: CTA */}
        <div className="lg:self-center flex-shrink-0 w-full lg:w-auto">
          <MotionLink
            href={mailto}
            className="block px-7 py-3.5 rounded-full font-semibold text-sm text-center no-underline whitespace-nowrap"
            style={{
              background:
                "linear-gradient(135deg, rgba(200, 200, 216, 0.18) 0%, rgba(200, 200, 216, 0.06) 100%)",
              color: "var(--color-text)",
              border: "1px solid rgba(200, 200, 216, 0.32)",
              boxShadow:
                "0 18px 48px -22px rgba(200, 200, 216, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
            }}
            whileHover={reduce ? undefined : { scale: 1.03, y: -1 }}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            transition={SPRING_HOVER}
          >
            {t("pricing.planEnterprise.cta")}
            <span className="ml-2" aria-hidden>→</span>
          </MotionLink>
        </div>
      </div>
    </motion.div>
  );
}

/* ----------------------------------------------------------------- */
/*  BillingToggle — magnetic pill, layoutId-driven                   */
/* ----------------------------------------------------------------- */
interface BillingToggleProps {
  annual: boolean;
  onChange: (v: boolean) => void;
  reduce: boolean;
}

function BillingToggle({ annual, onChange, reduce }: BillingToggleProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      className="inline-flex items-center gap-1 px-1.5 py-1.5 rounded-full relative"
      style={{
        background: "rgba(255, 255, 255, 0.04)",
        border: "1px solid var(--color-border)",
      }}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.55, delay: 0.2, ease: easeOutExpo }}
    >
      <ToggleOption active={!annual} onClick={() => onChange(false)} reduce={reduce}>
        {t("pricing.monthly")}
      </ToggleOption>
      <ToggleOption
        active={annual}
        onClick={() => onChange(true)}
        reduce={reduce}
        suffix={
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
        }
      >
        {t("pricing.annual")}
      </ToggleOption>
    </motion.div>
  );
}

interface ToggleOptionProps {
  active: boolean;
  onClick: () => void;
  reduce: boolean;
  children: React.ReactNode;
  suffix?: React.ReactNode;
}

function ToggleOption({ active, onClick, reduce, children, suffix }: ToggleOptionProps) {
  return (
    <button
      onClick={onClick}
      className="relative px-5 py-2 rounded-full text-sm font-medium border-none cursor-pointer flex items-center gap-2"
      style={{
        background: "transparent",
        color: active ? "var(--color-text)" : "var(--color-text-muted)",
        transition: "color 0.25s ease",
      }}
    >
      {active && (
        <motion.span
          aria-hidden
          layoutId="pricing-toggle-pill"
          className="absolute inset-0 rounded-full"
          style={{
            background: "rgba(200, 200, 216, 0.12)",
            border: "1px solid rgba(255, 255, 255, 0.04)",
            zIndex: 0,
          }}
          transition={
            reduce
              ? { duration: 0 }
              : { type: "spring", stiffness: 380, damping: 32 }
          }
        />
      )}
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {suffix}
      </span>
    </button>
  );
}

/* ----------------------------------------------------------------- */
/*  PricingCard — entrance reveal + hover lift + popular glow ring   */
/* ----------------------------------------------------------------- */
interface PricingCardProps {
  index: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plan: any;
  annual: boolean;
  isFree: boolean;
  displayPrice: string;
  oldPrice: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  loadingPlan: string | null;
  onPaidPlanClick: (planId: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
  reduce: boolean;
}

function PricingCard({
  index,
  plan,
  annual,
  isFree,
  displayPrice,
  oldPrice,
  user,
  loadingPlan,
  onPaidPlanClick,
  t,
  reduce,
}: PricingCardProps) {
  return (
    <motion.div
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
      initial={
        reduce
          ? { opacity: 0 }
          : { opacity: 0, y: 32, filter: "blur(8px)" }
      }
      whileInView={
        reduce
          ? { opacity: 1 }
          : { opacity: 1, y: 0, filter: "blur(0px)" }
      }
      viewport={VIEWPORT}
      transition={{
        duration: 0.7,
        delay: 0.18 + index * 0.1,
        ease: easeOutExpo,
      }}
      whileHover={
        reduce
          ? undefined
          : plan.popular
            ? { y: -6, scale: 1.01 }
            : { y: -4 }
      }
    >
      {/* Animated border glow halo — popular only, extends past the card edges */}
      {plan.popular && !reduce && (
        <motion.div
          aria-hidden
          className="absolute rounded-2xl pointer-events-none"
          style={{
            inset: -14,
            background:
              "linear-gradient(135deg, rgba(200, 200, 216, 0.18), rgba(129, 140, 248, 0.12), rgba(52, 211, 153, 0.14))",
            zIndex: -1,
            filter: "blur(22px)",
          }}
          animate={{ opacity: [0.35, 0.7, 0.35] }}
          transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Most popular badge */}
      {plan.popular && (
        <motion.div
          className="absolute -top-3 left-1/2 text-xs font-semibold px-3.5 py-1 rounded-full whitespace-nowrap"
          style={{
            background: "linear-gradient(135deg, #5c5c6e, #6e6e82)",
            color: "white",
            x: "-50%",
          }}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.85 }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          viewport={VIEWPORT}
          transition={{
            duration: 0.6,
            delay: 0.18 + index * 0.1 + 0.3,
            ease: easeOutExpo,
          }}
        >
          {t("pricing.mostPopular")}
        </motion.div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-bold mb-1" style={{ color: "var(--color-text)" }}>
          {plan.name}
        </h3>
        <p className="text-xs mb-5" style={{ color: "var(--color-text-muted)" }}>
          {plan.description}
        </p>
        <div className="flex items-baseline gap-1" style={{ minHeight: 48 }}>
          {annual && !isFree && (
            <span
              className="text-lg line-through mr-1 transition-opacity duration-200"
              style={{ color: "var(--color-text-muted)" }}
            >
              {oldPrice}
            </span>
          )}
          <span
            className="text-4xl font-bold tabular-nums"
            style={{ color: "var(--color-text)", minWidth: 56, display: "inline-block" }}
          >
            {displayPrice}
          </span>
          {plan.period && (
            <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              {t(plan.period === "/user/month" ? "pricing.periodUserMonth" : "pricing.periodMonth")}
            </span>
          )}
        </div>
      </div>

      <ul
        className="flex-1 space-y-3 mb-8"
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        {plan.features.map((f: string, fi: number) => (
          <motion.li
            key={f}
            className="flex items-start gap-2.5 text-sm"
            style={{ color: "var(--color-text-silver)" }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: -8 }}
            whileInView={reduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
            viewport={VIEWPORT}
            transition={{
              duration: 0.4,
              delay: 0.18 + index * 0.1 + 0.35 + fi * 0.04,
              ease: easeOutSoft,
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke={plan.popular ? "var(--color-positive)" : "var(--color-accent-light)"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-0.5 shrink-0"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {f}
          </motion.li>
        ))}
      </ul>

      <CTASlot
        plan={plan}
        isFree={isFree}
        annual={annual}
        user={user}
        loadingPlan={loadingPlan}
        onPaidPlanClick={onPaidPlanClick}
        t={t}
        reduce={reduce}
      />
    </motion.div>
  );
}

/* ----------------------------------------------------------------- */
/*  CTASlot — renders the right CTA flavor (free/paid, logged/not)   */
/* ----------------------------------------------------------------- */
interface CTASlotProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plan: any;
  isFree: boolean;
  annual: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  loadingPlan: string | null;
  onPaidPlanClick: (planId: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
  reduce: boolean;
}

function CTASlot({
  plan,
  isFree,
  annual,
  user,
  loadingPlan,
  onPaidPlanClick,
  t,
  reduce,
}: CTASlotProps) {
  const primaryStyle = {
    background:
      "linear-gradient(135deg, rgba(52, 211, 153, 0.22) 0%, rgba(52, 211, 153, 0.06) 100%)",
    color: "var(--color-text)",
    border: "1px solid rgba(52, 211, 153, 0.4)",
    boxShadow:
      "0 24px 60px -22px rgba(52, 211, 153, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
  };
  const secondaryStyle = {
    background: "rgba(255, 255, 255, 0.025)",
    color: "var(--color-text-silver)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
  };
  const btnClass = `pricing-btn ${plan.popular ? "pricing-btn--primary" : "pricing-btn--secondary"} w-full py-3.5 rounded-full font-semibold text-sm text-center relative overflow-hidden`;

  const tap = reduce ? undefined : { scale: 0.97 };
  const hover = reduce ? undefined : { scale: 1.02 };

  if (isFree) {
    if (user) {
      return (
        <div
          className="w-full py-3 rounded-xl font-semibold text-sm text-center"
          style={{
            background: "rgba(52, 211, 153, 0.08)",
            color: "var(--color-positive)",
            border: "1px solid rgba(52, 211, 153, 0.2)",
          }}
        >
          {t("pricing.currentPlan")}
        </div>
      );
    }
    return (
      <MotionLink
        href="/login"
        className={`${btnClass} no-underline block`}
        style={secondaryStyle}
        whileHover={hover}
        whileTap={tap}
        transition={SPRING_TAP}
      >
        {plan.cta}
      </MotionLink>
    );
  }

  if (user) {
    return (
      <motion.button
        onClick={() => onPaidPlanClick(plan.id)}
        disabled={loadingPlan === plan.id}
        className={`${btnClass} cursor-pointer disabled:opacity-60 disabled:cursor-wait`}
        style={plan.popular ? primaryStyle : secondaryStyle}
        whileHover={loadingPlan === plan.id ? undefined : hover}
        whileTap={loadingPlan === plan.id ? undefined : tap}
        transition={SPRING_TAP}
      >
        {loadingPlan === plan.id ? t("pricing.redirecting") : plan.cta}
      </motion.button>
    );
  }

  return (
    <MotionLink
      href={`/login?plan=${plan.id}&billing=${annual ? "yearly" : "monthly"}`}
      className={`${btnClass} no-underline block`}
      style={plan.popular ? primaryStyle : secondaryStyle}
      whileHover={hover}
      whileTap={tap}
      transition={SPRING_TAP}
    >
      {plan.cta}
    </MotionLink>
  );
}
