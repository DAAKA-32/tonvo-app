/**
 * Locale configuration shared by the middleware, server components, sitemap and client code.
 * No React and no JSON imports here: it must stay safe to load anywhere (including the edge).
 *
 * URL scheme: English lives at the root (/about), every other language under its code (/fr/about).
 * Only the public marketing pages are localized in the URL. The signed-in product (/dashboard, /session...)
 * keeps one URL per page and follows the language the person chose.
 */

export const LOCALES = ["en", "fr", "es", "de", "pt", "it", "nl", "zh", "ja", "ko"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_INFO: Record<
  Locale,
  { label: string; hreflang: string; ogLocale: string; dir: "ltr" | "rtl" }
> = {
  en: { label: "English", hreflang: "en", ogLocale: "en_US", dir: "ltr" },
  fr: { label: "Français", hreflang: "fr", ogLocale: "fr_FR", dir: "ltr" },
  es: { label: "Español", hreflang: "es", ogLocale: "es_ES", dir: "ltr" },
  de: { label: "Deutsch", hreflang: "de", ogLocale: "de_DE", dir: "ltr" },
  pt: { label: "Português", hreflang: "pt", ogLocale: "pt_PT", dir: "ltr" },
  it: { label: "Italiano", hreflang: "it", ogLocale: "it_IT", dir: "ltr" },
  nl: { label: "Nederlands", hreflang: "nl", ogLocale: "nl_NL", dir: "ltr" },
  zh: { label: "中文", hreflang: "zh", ogLocale: "zh_CN", dir: "ltr" },
  ja: { label: "日本語", hreflang: "ja", ogLocale: "ja_JP", dir: "ltr" },
  ko: { label: "한국어", hreflang: "ko", ogLocale: "ko_KR", dir: "ltr" },
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

/** First path segments that belong to the public, localized site. "/" is public too. */
export const PUBLIC_ROOTS = [
  "about",
  "blog",
  "pricing",
  "privacy",
  "terms",
  "cookies",
  "legal",
  "use-cases",
  "features",
  "industries",
  "compare",
  "guides",
] as const;

export function isPublicPath(path: string): boolean {
  if (path === "/" || path === "") return true;
  const first = path.split("/")[1];
  return (PUBLIC_ROOTS as readonly string[]).includes(first);
}

/** Prefix a public path with the locale ("/about", "fr" -> "/fr/about"; English stays unprefixed). */
export function localePath(path: string, locale: Locale): string {
  const clean = path === "" ? "/" : path.startsWith("/") ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/** Split "/fr/about" into { locale: "fr", path: "/about" }. Unprefixed paths are English. */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  const [, first, ...rest] = pathname.split("/");
  if (isLocale(first) && first !== DEFAULT_LOCALE) {
    return { locale: first, path: "/" + rest.join("/") };
  }
  return { locale: DEFAULT_LOCALE, path: pathname || "/" };
}

/**
 * Which languages each public page exists in. A page is listed (hreflang, sitemap, language switcher)
 * only in the languages where it is really translated: a /es/ page with English body copy would be
 * a thin, duplicate page.
 *
 *  - core pages: every language
 *  - SEO hubs and the programmatic pages (use-cases, features, industries, compare, guides): en + fr
 *  - blog: English only, and not indexed (articles do not exist yet)
 */
const CORE_PATHS = new Set(["/", "/pricing", "/about", "/privacy", "/terms", "/cookies", "/legal"]);
const SEO_ROOTS = new Set(["use-cases", "features", "industries", "compare", "guides"]);
export const SEO_LOCALES: readonly Locale[] = ["en", "fr"];

export function localesForPath(path: string): readonly Locale[] {
  if (CORE_PATHS.has(path)) return LOCALES;
  const root = path.split("/")[1];
  if (SEO_ROOTS.has(root)) return SEO_LOCALES;
  return [DEFAULT_LOCALE];
}

export function isPathAvailable(path: string, locale: Locale): boolean {
  return localesForPath(path).includes(locale);
}

/**
 * The link to use for a public page from a page in `locale`: the localized URL when the page exists in that
 * language, the English one otherwise (never a link to a page that does not exist).
 */
export function publicHref(path: string, locale: Locale): string {
  return localePath(path, isPathAvailable(path, locale) ? locale : DEFAULT_LOCALE);
}

export const SITE_URL = "https://tonvo.co";

export function absoluteUrl(path: string, locale: Locale): string {
  const p = localePath(path, locale);
  return p === "/" ? SITE_URL : `${SITE_URL}${p}`;
}

/**
 * Translation namespaces the client needs on EVERY public page. The layout sends only these (plus the page's
 * own namespace) to the browser instead of the whole language file: a full file is 60 to 85 KB, about 25 to
 * 35 KB gzipped extra per page. English is bundled in the client anyway, and missing keys fall back to it.
 * A test checks that client code on public pages only uses namespaces listed here or owned by its page.
 */
export const BASE_NAMESPACES = [
  "landing",
  "pricing",
  "pricingPage",
  "footer",
  "nav",
  "common",
  "mockup",
  "socialProof",
  "upgrade",
  "ui",
  "notFound",
  "consent",
] as const;

/** Extra namespace loaded by one public page (its layout adds it). */
export const PAGE_NAMESPACES: Record<string, string> = {
  about: "aboutPage",
  privacy: "privacyPage",
  terms: "termsPage",
  cookies: "cookiesPage",
  legal: "legalPage",
};
