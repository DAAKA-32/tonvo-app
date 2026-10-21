import type { MetadataRoute } from "next";
import {
  DEFAULT_LOCALE,
  LOCALE_INFO,
  absoluteUrl,
  localesForPath,
  type Locale,
} from "@/i18n/locales-config";
import { SEO_PAGE_LOCALES, getAllSEOPages, seoHubLocales, seoLocalesFor } from "@/data/seo/registry";
import type { SEOPageType } from "@/data/seo/types";

/**
 * One entry per language and per page that really exists in that language, each with the full set of
 * hreflang alternatives (and x-default = English). Only canonical, indexable, public URLs are listed:
 * no private pages, no /login, no /plans, and no /blog (its articles do not exist, so it is noindex).
 *
 * lastModified is a fixed date, not "now": a date that changes on every build tells crawlers nothing.
 */
const SITE_UPDATED = "2026-10-21";

const CORE_PATHS = ["/", "/pricing", "/about", "/privacy", "/terms", "/cookies", "/legal"];
const HUBS: SEOPageType[] = ["use-cases", "features", "industries", "compare", "guides"];

function entry(path: string, locale: Locale, available: readonly Locale[], lastModified: string): MetadataRoute.Sitemap[number] {
  const languages: Record<string, string> = {};
  if (available.length > 1) {
    for (const l of available) languages[LOCALE_INFO[l].hreflang] = absoluteUrl(path, l);
    if (available.includes(DEFAULT_LOCALE)) languages["x-default"] = absoluteUrl(path, DEFAULT_LOCALE);
  }
  return {
    url: absoluteUrl(path, locale),
    lastModified,
    ...(Object.keys(languages).length ? { alternates: { languages } } : {}),
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [];

  for (const path of CORE_PATHS) {
    const available = localesForPath(path);
    for (const locale of available) out.push(entry(path, locale, available, SITE_UPDATED));
  }

  for (const type of HUBS) {
    const available = seoHubLocales(type);
    for (const locale of available) out.push(entry(`/${type}`, locale, available, SITE_UPDATED));
  }

  // Programmatic pages: take the language list and the date from the data itself.
  for (const base of getAllSEOPages(DEFAULT_LOCALE)) {
    const available = seoLocalesFor(base.type, base.slug);
    for (const locale of SEO_PAGE_LOCALES) {
      if (!available.includes(locale)) continue;
      out.push(entry(`/${base.type}/${base.slug}`, locale, available, base.lastModified));
    }
  }

  return out;
}
