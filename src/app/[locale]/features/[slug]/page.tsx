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
export const generateStaticParams = slugStaticParams("features");
export const generateMetadata = makeSlugMetadata("features");

export default async function FeaturePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const entry = getPageByTypeAndSlug("features", slug, locale);
  if (!entry || entry.type !== "features") notFound();
  const t = await getServerT(locale);

  const webPageJsonLd = buildWebPageJsonLd(entry, `${SITE_URL}${localePath(`/features/${slug}`, locale)}`, LOCALE_INFO[locale].hreflang);

  return (
    <SEOPageShell
      locale={locale}
      breadcrumbs={[
        { label: t("seoHub.features.label"), href: localePath("/features", locale) },
        { label: entry.featureName },
      ]}
      relatedPages={entry.relatedSlugs}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />

      <SEOHeroSection locale={locale} label={t("seoUi.typeFeature")} h1={entry.h1} subtitle={entry.subtitle} />

      <section className="mb-16">
        {entry.howItWorks.label && (
          <p className="section-label mb-3" style={{ color: "var(--color-accent-light)" }}>{entry.howItWorks.label}</p>
        )}
        <h2 className="text-xl font-bold mb-4" style={{ color: "var(--color-text)" }}>
          {entry.howItWorks.heading}
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
          {entry.howItWorks.body}
        </p>
      </section>

      <div className="glow-line max-w-2xl mx-auto mb-16" />

      <section className="mb-16">
        <h2 className="text-xl font-bold text-center mb-8" style={{ color: "var(--color-text)" }}>
          {t("seoUi.keyBenefits")}
        </h2>
        <FeatureGrid features={entry.benefits} />
      </section>

      <section className="mb-16">
        <h2 className="text-xl font-bold mb-6" style={{ color: "var(--color-text)" }}>
          {t("seoUi.whoUses")}
        </h2>
        <ul className="space-y-3 list-none p-0 m-0">
          {entry.useCasesForFeature.map((uc, i) => (
            <li key={i} className="flex items-start gap-3">
              <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>{uc}</span>
            </li>
          ))}
        </ul>
      </section>

      {entry.technicalDetail && (
        <section className="mb-16">
          {entry.technicalDetail.label && (
            <p className="section-label mb-3" style={{ color: "var(--color-accent-light)" }}>{entry.technicalDetail.label}</p>
          )}
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--color-text)" }}>
            {entry.technicalDetail.heading}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
            {entry.technicalDetail.body}
          </p>
        </section>
      )}

      <FAQAccordion items={entry.faq} locale={locale} />
    </SEOPageShell>
  );
}
