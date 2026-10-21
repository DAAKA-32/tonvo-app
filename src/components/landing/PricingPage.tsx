"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { TonvoLogoMark } from "@/components/Logo";
import LanguageSelector from "@/components/LanguageSelector";
import PricingSection from "@/components/landing/PricingSection";
import { useLocalePath } from "@/components/PublicProviders";

/** The public /pricing page: server-rendered plans, a short FAQ, and the same checkout as the home page. */
export default function PricingPage() {
  const { t } = useTranslation();
  const lp = useLocalePath();
  const faq = [1, 2, 3].map((n) => ({ q: t(`pricingPage.faq.q${n}`), a: t(`pricingPage.faq.a${n}`) }));

  return (
    <div style={{ backgroundColor: "var(--color-bg)", minHeight: "100vh", color: "var(--color-text-silver)" }}>
      <header className="border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Link href={lp("/")} className="flex items-center gap-2.5 no-underline">
            <TonvoLogoMark size="sm" />
            <span className="text-lg font-bold" style={{ color: "var(--color-text)" }}>Tonvo</span>
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <Link
              href="/login"
              className="text-sm font-semibold no-underline px-4 py-2 rounded-full whitespace-nowrap focus-visible:outline focus-visible:outline-2"
              style={{ color: "var(--color-text)", border: "1px solid rgba(52, 211, 153, 0.45)", background: "rgba(52, 211, 153, 0.12)" }}
            >
              {t("landing.nav.signIn")}
            </Link>
          </div>
        </div>
      </header>

      <main>
        <PricingSection headingAs="h1" />

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-20" aria-labelledby="pricing-faq-title">
          <h2 id="pricing-faq-title" className="text-2xl font-bold text-center mb-8" style={{ color: "var(--color-text)" }}>
            {t("pricingPage.faqTitle")}
          </h2>
          <div className="space-y-4">
            {faq.map((item) => (
              <details
                key={item.q}
                className="rounded-xl border group"
                style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
              >
                <summary
                  className="cursor-pointer px-6 py-4 text-sm font-semibold list-none focus-visible:outline-2"
                  style={{ color: "var(--color-text)" }}
                >
                  {item.q}
                </summary>
                <p className="px-6 pb-4 pt-0 m-0 text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t px-6 py-8" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}>
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs">
          <Link href={lp("/")} className="footer-link">{t("pricingPage.backHome")}</Link>
          <Link href={lp("/privacy")} className="footer-link">{t("footer.privacyPolicy")}</Link>
          <Link href={lp("/terms")} className="footer-link">{t("footer.termsOfService")}</Link>
        </div>
      </footer>
    </div>
  );
}
