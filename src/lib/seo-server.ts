import type { Metadata } from "next";
import { getServerT } from "@/i18n/messages";
import { isLocale } from "@/i18n/locales-config";
import { localizedMetadata } from "@/lib/seo";
import {
  SEO_PAGE_LOCALES,
  getPageByTypeAndSlug,
  getSEOPagesByType,
  seoHubLocales,
  seoLocalesFor,
} from "@/data/seo/registry";
import type { SEOPageType } from "@/data/seo/types";

type LocaleParams = { params: Promise<{ locale: string }> };
type SlugParams = { params: Promise<{ locale: string; slug: string }> };

/**
 * generateMetadata for a public page whose title and description live in the translation files
 * under `seo.<key>.title` and `seo.<key>.description`.
 */
export function makeGenerateMetadata(path: string, key: string, opts?: { noIndex?: boolean }) {
  return async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const t = await getServerT(locale);
    return localizedMetadata({
      locale,
      path,
      title: t(`seo.${key}.title`),
      description: t(`seo.${key}.description`),
      noIndex: opts?.noIndex,
    });
  };
}

const HUB_KEYS: Record<SEOPageType, string> = {
  "use-cases": "useCases",
  features: "features",
  industries: "industries",
  compare: "compare",
  guides: "guides",
};

/** Metadata of a hub page (/use-cases, /features...): copy from `seoHub.<key>`, hreflang for the languages it exists in. */
export function makeHubMetadata(type: SEOPageType) {
  return async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale) || !seoHubLocales(type).includes(locale)) return {};
    const t = await getServerT(locale);
    const key = HUB_KEYS[type];
    return localizedMetadata({
      locale,
      path: `/${type}`,
      title: t(`seoHub.${key}.title`),
      description: t(`seoHub.${key}.description`),
      locales: seoHubLocales(type),
    });
  };
}

export function hubStaticParams(type: SEOPageType) {
  return () => seoHubLocales(type).map((locale) => ({ locale }));
}

/** Metadata of a programmatic page: its own title and description, hreflang only for languages where it exists. */
export function makeSlugMetadata(type: SEOPageType) {
  return async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
    const { locale, slug } = await params;
    if (!isLocale(locale)) return {};
    const entry = getPageByTypeAndSlug(type, slug, locale);
    if (!entry) return {};
    return localizedMetadata({
      locale,
      path: `/${type}/${slug}`,
      title: entry.title,
      description: entry.metaDescription,
      keywords: entry.targetKeywords,
      type: type === "guides" ? "article" : "website",
      locales: seoLocalesFor(type, slug),
    });
  };
}

export function slugStaticParams(type: SEOPageType) {
  return () =>
    SEO_PAGE_LOCALES.flatMap((locale) => getSEOPagesByType(type, locale).map((p) => ({ locale, slug: p.slug })));
}
