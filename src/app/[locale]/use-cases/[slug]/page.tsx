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

// Only pages that exist in the requested language are generated; anything else is a 404.
export const dynamicParams = false;
export const generateStaticParams = slugStaticParams("use-cases");
export const generateMetadata = makeSlugMetadata("use-cases");

export default async function UseCasePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const entry = getPageByTypeAndSlug("use-cases", slug, locale);
  if (!entry || entry.type !== "use-cases") notFound();
  const t = await getServerT(locale);

  const webPageJsonLd = buildWebPageJsonLd(entry, `${SITE_URL}${localePath(`/use-cases/${slug}`, locale)}`, LOCALE_INFO[locale].hreflang);

  return (
    <SEOPageShell
      locale={locale}
      breadcrumbs={[
        { label: t("seoHub.useCases.label"), href: localePath("/use-cases", locale) },
        { label: entry.h1 },
      ]}
      relatedPages={entry.relatedSlugs}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />

      <SEOHeroSection locale={locale} label={t("seoUi.typeUseCase")} h1={entry.h1} subtitle={entry.subtitle} />

      <section className="mb-16">
        {entry.problem.label && (
          <p className="section-label mb-3" style={{ color: "var(--color-accent-light)" }}>{entry.problem.label}</p>
        )}
        <h2 className="text-xl font-bold mb-4" style={{ color: "var(--color-text)" }}>
          {entry.problem.heading}
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
          {entry.problem.body}
        </p>
      </section>

      <div className="glow-line max-w-2xl mx-auto mb-16" />

      <section className="mb-16">
        {entry.solution.label && (
          <p className="section-label mb-3" style={{ color: "var(--color-accent-light)" }}>{entry.solution.label}</p>
        )}
        <h2 className="text-xl font-bold mb-4" style={{ color: "var(--color-text)" }}>
          {entry.solution.heading}
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
          {entry.solution.body}
        </p>
      </section>

      <section className="mb-16">
        <h2 className="text-xl font-bold text-center mb-8" style={{ color: "var(--color-text)" }}>
          {t("seoUi.keyFeaturesUseCase")}
        </h2>
        <FeatureGrid features={entry.features} />
      </section>

      <FAQAccordion items={entry.faq} locale={locale} />
    </SEOPageShell>
  );
}
