import HomePage from "@/components/landing/HomePage";
import { getServerT } from "@/i18n/messages";
import { LOCALE_INFO, SITE_URL, isLocale } from "@/i18n/locales-config";
import { makeGenerateMetadata } from "@/lib/seo-server";
import { OG_IMAGE } from "@/lib/seo";
import { notFound } from "next/navigation";

export const generateMetadata = makeGenerateMetadata("/", "home");

export default async function LocalizedHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getServerT(locale);

  // Only what the page shows and the product does. No ratings, reviews or user counts.
  const software = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Tonvo",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: locale === "en" ? SITE_URL : `${SITE_URL}/${locale}`,
    inLanguage: LOCALE_INFO[locale].hreflang,
    description: t("seo.home.description"),
    featureList: [
      t("landing.features.liveTone"),
      t("landing.features.smartSuggestions"),
      t("landing.features.conversationInsights"),
      t("landing.features.textAnalysis"),
    ],
    screenshot: `${SITE_URL}${OG_IMAGE.url}`,
    offers: [
      { "@type": "Offer", price: "0", priceCurrency: "USD", name: t("pricing.planFree.name"), description: t("pricing.planFree.description") },
      {
        "@type": "Offer",
        price: "19",
        priceCurrency: "USD",
        name: t("pricing.planPro.name"),
        description: t("pricing.planPro.description"),
        priceSpecification: { "@type": "UnitPriceSpecification", price: "19", priceCurrency: "USD", billingDuration: "P1M" },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(software) }} />
      <HomePage />
    </>
  );
}
