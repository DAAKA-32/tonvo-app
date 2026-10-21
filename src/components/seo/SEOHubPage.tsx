import Link from "next/link";
import { notFound } from "next/navigation";
import SEOPageShell from "@/components/seo/SEOPageShell";
import { getSEOPagesByType, seoHubLocales } from "@/data/seo/registry";
import type { SEOPageEntry, SEOPageType } from "@/data/seo/types";
import { getServerT } from "@/i18n/messages";
import { isLocale, localePath } from "@/i18n/locales-config";

const HUB_KEYS: Record<SEOPageType, string> = {
  "use-cases": "useCases",
  features: "features",
  industries: "industries",
  compare: "compare",
  guides: "guides",
};

/** First `max` characters, cut at a word boundary. */
function excerpt(text: string, max = 140): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, Math.max(cut.lastIndexOf(" "), 40)).replace(/[,;:.\s]+$/, "") + "…";
}

/** A hub lists the pages of one type that exist in the page language. */
export default async function SEOHubPage({ type, locale }: { type: SEOPageType; locale: string }) {
  if (!isLocale(locale) || !seoHubLocales(type).includes(locale)) notFound();
  const t = await getServerT(locale);
  const key = HUB_KEYS[type];
  const pages = getSEOPagesByType(type, locale);

  const cardTitle = (p: SEOPageEntry): string => {
    switch (p.type) {
      case "features":
        return p.featureName;
      case "industries":
        return p.industryName;
      case "compare":
        return t("seoUi.tonvoVs", { name: p.competitorName });
      default:
        return p.h1;
    }
  };

  return (
    <SEOPageShell locale={locale} breadcrumbs={[{ label: t(`seoHub.${key}.label`) }]}>
      <div className="text-center mb-16">
        <p className="section-label mb-4" style={{ color: "var(--color-accent-light)" }}>
          {t(`seoHub.${key}.label`)}
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-5" style={{ color: "var(--color-text)", letterSpacing: "-0.02em" }}>
          {t(`seoHub.${key}.h1`)}
        </h1>
        <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: "var(--color-text-muted)" }}>
          {t(`seoHub.${key}.lede`)}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
        {pages.map((p) => (
          <Link
            key={p.slug}
            href={localePath(`/${type}/${p.slug}`, locale)}
            className="rounded-xl border p-6 no-underline transition-all hover:border-opacity-60 group"
            style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", display: "block" }}
          >
            {p.type === "guides" && (
              <span className="text-[10px] font-semibold uppercase tracking-wider block mb-2" style={{ color: p.tagColor }}>
                {p.tag} · {p.readingTime}
              </span>
            )}
            <h2 className="text-sm font-bold mb-2 group-hover:text-(--color-text-silver) transition-colors" style={{ color: "var(--color-text)" }}>
              {cardTitle(p)}
            </h2>
            <p className="text-xs leading-relaxed m-0" style={{ color: "var(--color-text-muted)" }}>
              {excerpt(p.subtitle)}
            </p>
          </Link>
        ))}
      </div>
    </SEOPageShell>
  );
}
