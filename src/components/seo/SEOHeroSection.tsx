import Link from "next/link";
import type { StatItem } from "@/data/seo/types";

interface SEOHeroSectionProps {
  label?: string;
  h1: string;
  subtitle: string;
  stats?: StatItem[];
  ctaText?: string;
  ctaHref?: string;
}

export default function SEOHeroSection({
  label,
  h1,
  subtitle,
  stats,
  ctaText = "Try Tonvo Free",
  ctaHref = "/login",
}: SEOHeroSectionProps) {
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

      {stats && stats.length > 0 && (
        <div className="flex flex-wrap justify-center gap-8 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p
                className="text-2xl sm:text-3xl font-extrabold m-0"
                style={{
                  background: "linear-gradient(135deg, #ffffff 0%, #d4d4e0 40%, #a0a0b8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {stat.value}
              </p>
              <p className="text-xs m-0 mt-1" style={{ color: "var(--color-text-muted)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      )}

      <Link
        href={ctaHref}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold no-underline transition-all hover:opacity-90"
        style={{
          background: "linear-gradient(135deg, #5c5c6e, #6e6e82)",
          color: "white",
          boxShadow: "0 4px 14px rgba(92,92,110,0.35)",
        }}
      >
        {ctaText}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
      </Link>
    </div>
  );
}
