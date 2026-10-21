import type { SEOPageEntry, SEOPageType } from "./types";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/locales-config";
import { useCases } from "./use-cases";
import { features } from "./features";
import { industries } from "./industries";
import { comparisons } from "./comparisons";
import { guides } from "./guides";
import { useCasesFr } from "./fr/use-cases";
import { featuresFr } from "./fr/features";
import { industriesFr } from "./fr/industries";
import { comparisonsFr } from "./fr/comparisons";
import { guidesFr } from "./fr/guides";

/**
 * The programmatic SEO pages (use-cases, features, industries, compare, guides), per language.
 * A page exists in a language only if it is fully translated there: a thin or half-English page
 * would hurt more than it helps, so other languages simply have no entry and link to the English page.
 * To add a language, add its five data files (same slugs) and one line to DATA.
 */
type PageSet = Record<SEOPageType, SEOPageEntry[]>;

const DATA: Partial<Record<Locale, PageSet>> = {
  en: { "use-cases": useCases, features, industries, compare: comparisons, guides },
  fr: {
    "use-cases": useCasesFr,
    features: featuresFr,
    industries: industriesFr,
    compare: comparisonsFr,
    guides: guidesFr,
  },
};

/** Languages that have programmatic SEO pages. */
export const SEO_PAGE_LOCALES = Object.keys(DATA) as Locale[];

export function getAllSEOPages(locale: Locale = DEFAULT_LOCALE): SEOPageEntry[] {
  const set = DATA[locale];
  return set ? Object.values(set).flat() : [];
}

export function getSEOPagesByType(type: SEOPageType, locale: Locale = DEFAULT_LOCALE): SEOPageEntry[] {
  return DATA[locale]?.[type] ?? [];
}

export function getPageByTypeAndSlug(
  type: SEOPageType,
  slug: string,
  locale: Locale = DEFAULT_LOCALE
): SEOPageEntry | undefined {
  return getSEOPagesByType(type, locale).find((p) => p.slug === slug);
}

/** Languages in which this exact page exists (drives hreflang and the sitemap). */
export function seoLocalesFor(type: SEOPageType, slug: string): Locale[] {
  return SEO_PAGE_LOCALES.filter((l) => !!getPageByTypeAndSlug(type, slug, l));
}

/** Languages in which a hub page (/use-cases, /features...) lists at least one page. */
export function seoHubLocales(type: SEOPageType): Locale[] {
  return SEO_PAGE_LOCALES.filter((l) => getSEOPagesByType(type, l).length > 0);
}

/** Section hubs. The label is a translation key (footer.*) so it follows the page language. */
export const SEO_SECTIONS: { type: SEOPageType; labelKey: string; href: string }[] = [
  { type: "use-cases", labelKey: "footer.useCases", href: "/use-cases" },
  { type: "features", labelKey: "footer.features", href: "/features" },
  { type: "industries", labelKey: "footer.industries", href: "/industries" },
  { type: "compare", labelKey: "footer.comparisons", href: "/compare" },
  { type: "guides", labelKey: "footer.guides", href: "/guides" },
];
