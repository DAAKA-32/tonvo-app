import Link from "next/link";
import { notFound } from "next/navigation";
import SEOPageShell from "@/components/seo/SEOPageShell";
import SEOHeroSection from "@/components/seo/SEOHeroSection";
import FeatureGrid from "@/components/seo/FeatureGrid";
import FAQAccordion from "@/components/seo/FAQAccordion";
import { getPageByTypeAndSlug } from "@/data/seo/registry";
import { buildWebPageJsonLd } from "@/data/seo/json-ld";
import { LOCALE_INFO, SITE_URL, isLocale, localePath } from "@/i18n/locales-config";
import { getServerT } from "@/i18n/messages";
import { makeSlugMetadata, slugStaticParams } from "@/lib/seo-server";

export const dynamicParams = false;
export const generateStaticParams = slugStaticParams("industries");
export const generateMetadata = makeSlugMetadata("industries");

export default async function IndustryPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const entry = getPageByTypeAndSlug("industries", slug, locale);
  if (!entry || entry.type !== "industries") notFound();
  const t = await getServerT(locale);

  const webPageJsonLd = buildWebPageJsonLd(entry, `${SITE_URL}${localePath(`/industries/${slug}`, locale)}`, LOCALE_INFO[locale].hreflang);
  // Related use cases, titled with the page they lead to, only when that page exists in this language.
  const related = entry.useCaseLinks
    .map((s) => getPageByTypeAndSlug("use-cases", s, locale))
    .filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <SEOPageShell
      locale={locale}
      breadcrumbs={[
        { label: t("seoHub.industries.label"), href: localePath("/industries", locale) },
        { label: entry.industryName },
      ]}
      relatedPages={entry.relatedSlugs}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />

      <SEOHeroSection locale={locale} label={entry.industryName} h1={entry.h1} subtitle={entry.subtitle} />

      <section className="mb-16">
        <h2 className="text-xl font-bold mb-6" style={{ color: "var(--color-text)" }}>
          {t("seoUi.challenges")}
        </h2>
        <ul className="space-y-3 list-none p-0 m-0">
          {entry.painPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-3">
              <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>{point}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="glow-line max-w-2xl mx-auto mb-16" />

      <section className="mb-16">
        {entry.howTonvoHelps.label && (
          <p className="section-label mb-3" style={{ color: "var(--color-accent-light)" }}>{entry.howTonvoHelps.label}</p>
        )}
        <h2 className="text-xl font-bold mb-4" style={{ color: "var(--color-text)" }}>
          {entry.howTonvoHelps.heading}
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
          {entry.howTonvoHelps.body}
        </p>
      </section>

      <section className="mb-16">
        <h2 className="text-xl font-bold text-center mb-8" style={{ color: "var(--color-text)" }}>
          {t("seoUi.industryFeatures", { name: entry.industryName })}
        </h2>
        <FeatureGrid features={entry.features} />
      </section>

      {related.length > 0 && (
        <section className="mb-16">
          <h2 className="text-xl font-bold mb-6" style={{ color: "var(--color-text)" }}>
            {t("seoUi.relatedUseCases")}
          </h2>
          <div className="flex flex-wrap gap-3">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={localePath(`/use-cases/${p.slug}`, locale)}
                className="text-xs font-medium no-underline px-4 py-2 rounded-lg border hover:text-(--color-text) transition-colors"
                style={{ borderColor: "var(--color-border)", color: "var(--color-accent-light)" }}
              >
                {p.h1}
              </Link>
            ))}
          </div>
        </section>
      )}

      <FAQAccordion items={entry.faq} locale={locale} />
    </SEOPageShell>
  );
}
