import Link from "next/link";
import { getServerT } from "@/i18n/messages";
import type { Locale } from "@/i18n/locales-config";

interface SEOHeroSectionProps {
  locale: Locale;
  label?: string;
  h1: string;
  subtitle: string;
  ctaText?: string;
  ctaHref?: string;
}

export default async function SEOHeroSection({
  locale,
  label,
  h1,
  subtitle,
  ctaText,
  ctaHref = "/login",
}: SEOHeroSectionProps) {
  const t = await getServerT(locale);
  return (
    <div className="text-center mb-16">
      {label && (
        <p className="section-label mb-4" style={{ color: "var(--color-accent-light)" }}>
          {label}
        </p>
      )}
      <h1
        className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-5 leading-tight"
        style={{ color: "var(--color-text)", letterSpacing: "-0.02em" }}
      >
        {h1}
      </h1>
      <p
        className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8"
        style={{ color: "var(--color-text-muted)" }}
      >
        {subtitle}
      </p>

      <Link
        href={ctaHref}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold no-underline transition-all hover:opacity-90"
        style={{
          background: "linear-gradient(135deg, #5c5c6e, #6e6e82)",
          color: "white",
          boxShadow: "0 4px 14px rgba(92,92,110,0.35)",
        }}
      >
        {ctaText ?? t("seoUi.heroCta")}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}
