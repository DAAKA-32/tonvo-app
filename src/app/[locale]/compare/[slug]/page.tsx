import { notFound } from "next/navigation";
import SEOPageShell from "@/components/seo/SEOPageShell";
import SEOHeroSection from "@/components/seo/SEOHeroSection";
import ComparisonTable from "@/components/seo/ComparisonTable";
import FeatureGrid from "@/components/seo/FeatureGrid";
import FAQAccordion from "@/components/seo/FAQAccordion";
import { getPageByTypeAndSlug } from "@/data/seo/registry";
import { buildWebPageJsonLd } from "@/data/seo/json-ld";
import { LOCALE_INFO, SITE_URL, isLocale, localePath } from "@/i18n/locales-config";
import { getServerT } from "@/i18n/messages";
import { makeSlugMetadata, slugStaticParams } from "@/lib/seo-server";

export const dynamicParams = false;
export const generateStaticParams = slugStaticParams("compare");
export const generateMetadata = makeSlugMetadata("compare");

// No Product structured data for Tonvo or the competitor: it adds nothing a search engine can use here
// and would describe a third party's product in our own markup.
export default async function ComparisonPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const entry = getPageByTypeAndSlug("compare", slug, locale);
  if (!entry || entry.type !== "compare") notFound();
  const t = await getServerT(locale);

  const webPageJsonLd = buildWebPageJsonLd(entry, `${SITE_URL}${localePath(`/compare/${slug}`, locale)}`, LOCALE_INFO[locale].hreflang);

  return (
    <SEOPageShell
      locale={locale}
      breadcrumbs={[
        { label: t("seoHub.compare.label"), href: localePath("/compare", locale) },
        { label: t("seoUi.tonvoVs", { name: entry.competitorName }) },
      ]}
      relatedPages={entry.relatedSlugs}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />

      <SEOHeroSection locale={locale} label={t("seoUi.typeComparison")} h1={entry.h1} subtitle={entry.subtitle} />

      <section className="mb-16">
        <h2 className="text-xl font-bold text-center mb-8" style={{ color: "var(--color-text)" }}>
          {t("seoUi.comparisonTitle")}
        </h2>
        <ComparisonTable
          featureLabel={t("seoUi.featureColumn")}
          competitorName={entry.competitorName}
          rows={entry.comparisonRows}
        />
      </section>

      <div className="glow-line max-w-2xl mx-auto mb-16" />

      <section className="mb-16">
        <h2 className="text-xl font-bold text-center mb-8" style={{ color: "var(--color-text)" }}>
          {t("seoUi.whyChoose")}
        </h2>
        <FeatureGrid features={entry.tonvoAdvantages} />
      </section>

      <section className="mb-16">
        {entry.summary.label && (
          <p className="section-label mb-3" style={{ color: "var(--color-accent-light)" }}>{entry.summary.label}</p>
        )}
        <h2 className="text-xl font-bold mb-4" style={{ color: "var(--color-text)" }}>
          {entry.summary.heading}
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
          {entry.summary.body}
        </p>
      </section>

      <FAQAccordion items={entry.faq} locale={locale} />
    </SEOPageShell>
  );
}
