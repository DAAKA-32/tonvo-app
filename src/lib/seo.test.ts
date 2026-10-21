import { describe, it, expect } from "vitest";
import type { Metadata } from "next";
import { NextRequest } from "next/server";
import {
  cleanDescription,
  cleanTitle,
  fullTitle,
  HOME_DESCRIPTION,
  HOME_TITLE,
  OG_IMAGE,
  localizedMetadata,
} from "@/lib/seo";
import { makeGenerateMetadata } from "@/lib/seo-server";
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_INFO,
  absoluteUrl,
  isPathAvailable,
  isPublicPath,
  localePath,
  localesForPath,
  publicHref,
  splitLocale,
  type Locale,
} from "@/i18n/locales-config";
import { SEO_PAGE_LOCALES, getAllSEOPages, getPageByTypeAndSlug, seoHubLocales, seoLocalesFor } from "@/data/seo/registry";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { middleware } from "../middleware";

const CJK = new Set<Locale>(["zh", "ja", "ko"]);

/** What a link preview and a search snippet will show must read as clean, single-line text. */
function expectClean(text: string, what: string) {
  expect(text, `${what} is empty`).toBeTruthy();
  expect(text, `${what} has padding`).toBe(text.trim());
  expect(text, `${what} has repeated or odd whitespace`).not.toMatch(/\s{2,}|[\n\t]/);
  expect(text, `${what} has a decorative dash`).not.toMatch(/[—–]|\s-\s/);
}

type Og = { title: string; description: string; url: string; locale: string; images: Array<{ url: string; width: number; height: number; alt: string }> };

function check(meta: Metadata, label: string, locale: Locale) {
  const og = meta.openGraph as unknown as Og;
  const tw = meta.twitter as { card: string; title: string; description: string; images: Array<{ url: string }> };
  const title = (meta.title as { absolute: string }).absolute;
  const description = meta.description as string;
  expectClean(title, `${label} title`);
  expectClean(description, `${label} description`);
  expectClean(og.title, `${label} og:title`);
  expect((title.match(/tonvo/gi) ?? []).length, `${label} title repeats the brand`).toBeLessThanOrEqual(1);
  // CJK characters are about twice as wide in a search result, so the limits are tighter.
  const maxTitle = CJK.has(locale) ? 40 : 64;
  const maxDesc = CJK.has(locale) ? 110 : 170;
  expect([...title].length, `${label} title too long`).toBeLessThanOrEqual(maxTitle);
  expect([...description].length, `${label} description too long`).toBeLessThanOrEqual(maxDesc);
  expect(og.images[0]).toMatchObject({ url: OG_IMAGE.url, width: 1200, height: 630 });
  expect(tw).toMatchObject({ card: "summary_large_image", title: og.title, description: og.description });
  expect(og.locale).toBe(LOCALE_INFO[locale].ogLocale);
  expect(og.url).toMatch(/^https:\/\/tonvo\.co(\/[a-z0-9-]+)*$/);
  expect((meta.alternates as { canonical: string }).canonical).toBe(og.url);
}

describe("seo helpers", () => {
  it("turns separator dashes into punctuation and collapses whitespace, leaving hyphenated words alone", () => {
    expect(cleanTitle("  AI Copilot for Sales Calls — Close More Deals ")).toBe("AI Copilot for Sales Calls: Close More Deals");
    expect(cleanDescription("Live  coaching — hidden from\nothers. Real-time, AI-powered.")).toBe("Live coaching, hidden from others. Real-time, AI-powered.");
  });

  it("appends the brand once", () => {
    expect(fullTitle("Pricing")).toBe("Pricing | Tonvo");
    expect(fullTitle("Why I built Tonvo")).toBe("Why I built Tonvo");
  });

  it("home title and description are clean and sized for previews", () => {
    expectClean(HOME_TITLE, "home title");
    expectClean(HOME_DESCRIPTION, "home description");
    expect(HOME_DESCRIPTION.length).toBeLessThanOrEqual(160);
    expect(HOME_TITLE.length).toBeLessThanOrEqual(60);
  });
});

describe("locale URLs", () => {
  it("English has no prefix, every other language has its code", () => {
    expect(localePath("/about", "en")).toBe("/about");
    expect(localePath("/", "en")).toBe("/");
    expect(localePath("/about", "fr")).toBe("/fr/about");
    expect(localePath("/", "ja")).toBe("/ja");
    expect(absoluteUrl("/", "en")).toBe("https://tonvo.co");
    expect(absoluteUrl("/pricing", "de")).toBe("https://tonvo.co/de/pricing");
  });

  it("splits a pathname back into language and page", () => {
    expect(splitLocale("/fr/about")).toEqual({ locale: "fr", path: "/about" });
    expect(splitLocale("/es")).toEqual({ locale: "es", path: "/" });
    expect(splitLocale("/about")).toEqual({ locale: "en", path: "/about" });
    expect(splitLocale("/")).toEqual({ locale: "en", path: "/" });
  });

  it("only links to pages that exist in the page language", () => {
    expect(isPathAvailable("/about", "ko")).toBe(true);
    expect(isPathAvailable("/use-cases/x", "ko")).toBe(false);
    expect(publicHref("/about", "ko")).toBe("/ko/about");
    expect(publicHref("/use-cases", "ko")).toBe("/use-cases");
    expect(publicHref("/use-cases", "fr")).toBe("/fr/use-cases");
  });

  it("knows which paths are public", () => {
    for (const p of ["/", "/about", "/pricing", "/use-cases/some-page", "/guides"]) expect(isPublicPath(p), p).toBe(true);
    for (const p of ["/dashboard", "/session", "/login", "/plans", "/api/health", "/admin/analytics"]) expect(isPublicPath(p), p).toBe(false);
  });
});

describe("core pages: every language ships a complete, clean preview with reciprocal hreflang", () => {
  const PAGES: Array<[string, string, string]> = [
    ["/", "home", "home"], ["/pricing", "pricing", "pricing"], ["/about", "about", "about"],
    ["/privacy", "privacy", "privacy"], ["/terms", "terms", "terms"], ["/cookies", "cookies", "cookies"],
    ["/legal", "legal", "legal"],
  ];

  for (const [path, key, label] of PAGES) {
    it(`${label} in ${LOCALES.length} languages`, async () => {
      const titles = new Set<string>();
      for (const locale of LOCALES) {
        const meta = await makeGenerateMetadata(path, key)({ params: Promise.resolve({ locale }) });
        check(meta, `${label}/${locale}`, locale);
        titles.add((meta.title as { absolute: string }).absolute);

        const langs = (meta.alternates as { languages: Record<string, string> }).languages;
        expect(Object.keys(langs).sort(), `${label}/${locale} hreflang set`).toEqual(
          [...LOCALES.map((l) => LOCALE_INFO[l].hreflang), "x-default"].sort()
        );
        expect(langs["x-default"], `${label}/${locale} x-default`).toBe(absoluteUrl(path, DEFAULT_LOCALE));
        for (const l of LOCALES) expect(langs[LOCALE_INFO[l].hreflang]).toBe(absoluteUrl(path, l));
        // a page must list itself
        expect(Object.values(langs)).toContain((meta.alternates as { canonical: string }).canonical);
      }
      // a translated page must not be a copy of the English one (the home title is allowed to stay close)
      expect(titles.size, `${label}: titles identical across languages`).toBeGreaterThan(5);
    });
  }

  it("titles are unique inside one language", async () => {
    for (const locale of LOCALES) {
      const seen = new Map<string, string>();
      for (const [path, key, label] of PAGES) {
        const meta = await makeGenerateMetadata(path, key)({ params: Promise.resolve({ locale }) });
        const t = (meta.title as { absolute: string }).absolute;
        expect(seen.has(t), `${locale}: ${label} and ${seen.get(t)} share the title "${t}"`).toBe(false);
        seen.set(t, label);
      }
    }
  });

  it("the blog is not indexed", async () => {
    const meta = await makeGenerateMetadata("/blog", "blog", { noIndex: true })({ params: Promise.resolve({ locale: "en" }) });
    expect(meta.robots).toMatchObject({ index: false });
    expect((meta.alternates as { languages?: unknown }).languages).toBeUndefined();
  });
});

describe("programmatic SEO pages", () => {
  it("English and French have the same set of pages (no page exists in one language only)", () => {
    const key = (l: Locale) => getAllSEOPages(l).map((p) => `${p.type}/${p.slug}`).sort();
    expect(key("fr")).toEqual(key("en"));
    expect(getAllSEOPages("en").length).toBeGreaterThanOrEqual(34);
  });

  for (const locale of SEO_PAGE_LOCALES) {
    it(`all pages in ${locale} ship a complete, clean preview and unique titles`, () => {
      const titles = new Set<string>();
      for (const e of getAllSEOPages(locale)) {
        const meta = localizedMetadata({
          locale,
          path: `/${e.type}/${e.slug}`,
          title: e.title,
          description: e.metaDescription,
          locales: seoLocalesFor(e.type, e.slug),
        });
        check(meta, `${locale}:${e.type}/${e.slug}`, locale);
        const t = (meta.title as { absolute: string }).absolute;
        expect(titles.has(t), `${locale}: duplicate title ${t}`).toBe(false);
        titles.add(t);
      }
    });
  }

  it("French pages are real translations, not copies of the English text", () => {
    const en = getAllSEOPages("en");
    const fr = getAllSEOPages("fr");
    for (const e of en) {
      const f = fr.find((p) => p.type === e.type && p.slug === e.slug)!;
      expect(f.title, `${e.slug} title untranslated`).not.toBe(e.title);
      expect(f.metaDescription, `${e.slug} description untranslated`).not.toBe(e.metaDescription);
    }
  });

  it("hub pages exist exactly where they have pages", () => {
    for (const type of ["use-cases", "features", "industries", "compare", "guides"] as const) {
      expect(seoHubLocales(type).sort()).toEqual(["en", "fr"]);
      expect(localesForPath(`/${type}`)).toEqual(["en", "fr"]);
    }
  });
});

describe("sitemap", () => {
  const entries = sitemap();
  const urls = entries.map((e) => e.url);

  it("lists only canonical public URLs, once each", () => {
    expect(new Set(urls).size).toBe(urls.length);
    for (const u of urls) expect(u, u).toMatch(/^https:\/\/tonvo\.co(\/[a-z0-9-]+)*$/);
    for (const u of urls) expect(u, `private or non-indexed page in the sitemap: ${u}`).not.toMatch(/\/(login|plans|dashboard|session|history|settings|profile|admin|analytics|analyze-text|summary|demo|api|blog)(\/|$)/);
  });

  it("covers the core pages in every language", () => {
    for (const locale of LOCALES) {
      for (const p of ["/", "/pricing", "/about", "/privacy", "/terms", "/cookies", "/legal"]) {
        expect(urls, `${locale} ${p}`).toContain(absoluteUrl(p, locale));
      }
    }
  });

  it("every hreflang alternative is itself in the sitemap, and every alternate set is reciprocal", () => {
    const byUrl = new Map(entries.map((e) => [e.url, e]));
    for (const e of entries) {
      const langs = (e.alternates?.languages ?? {}) as Record<string, string>;
      if (!Object.keys(langs).length) continue;
      expect(Object.values(langs), `${e.url} does not list itself`).toContain(e.url);
      for (const alt of Object.values(langs)) {
        const other = byUrl.get(alt);
        expect(other, `${e.url} points to ${alt}, which is not in the sitemap`).toBeTruthy();
        expect(JSON.stringify((other!.alternates?.languages ?? {})), `${alt} does not point back (same set) to ${e.url}`).toBe(JSON.stringify(langs));
      }
    }
  });

  it("uses fixed dates, not the build time", () => {
    for (const e of entries) expect(String(e.lastModified)).toMatch(/^\d{4}-\d{2}-\d{2}/);
    expect(new Set(entries.map((e) => String(e.lastModified).slice(0, 10))).size).toBeLessThan(entries.length);
  });
});

describe("robots", () => {
  const rule = (robots().rules as Array<{ disallow: string[] }>)[0];
  it("blocks the private areas, including the bare page paths", () => {
    for (const p of ["/api/", "/dashboard", "/session", "/history", "/settings", "/profile", "/plans", "/admin", "/analytics", "/summary", "/analyze-text"]) {
      expect(rule.disallow, p).toContain(p);
    }
  });
  it("does not block public pages or any language", () => {
    for (const locale of LOCALES) {
      const path = localePath("/pricing", locale);
      expect(rule.disallow.some((d) => path.startsWith(d)), path).toBe(false);
    }
    expect(rule.disallow.some((d) => "/".startsWith(d) && d !== "/")).toBe(false);
  });
  it("declares the sitemap", () => {
    expect(robots().sitemap).toBe("https://tonvo.co/sitemap.xml");
  });
});

describe("middleware", () => {
  const run = (path: string) => middleware(new NextRequest(new URL(path, "https://tonvo.co")));
  const rewrite = (path: string) => run(path).headers.get("x-middleware-rewrite");
  const location = (path: string) => run(path).headers.get("location");

  it("serves English from /en internally, without changing the URL", () => {
    expect(rewrite("/")).toBe("https://tonvo.co/en");
    expect(rewrite("/about")).toBe("https://tonvo.co/en/about");
    expect(rewrite("/use-cases/some-page")).toBe("https://tonvo.co/en/use-cases/some-page");
  });

  it("lets a language URL through untouched", () => {
    expect(rewrite("/fr/about")).toBeNull();
    expect(location("/fr/about")).toBeNull();
    expect(rewrite("/ja")).toBeNull();
  });

  it("redirects duplicates and impossible URLs permanently, with no chain", () => {
    expect(run("/en/about").status).toBe(308);
    expect(location("/en/about")).toBe("https://tonvo.co/about");
    expect(location("/en")).toBe("https://tonvo.co/");
    expect(location("/fr/dashboard")).toBe("https://tonvo.co/dashboard");
    expect(location("/es/login")).toBe("https://tonvo.co/login");
  });

  it("redirects any non-lower-case public URL in one hop (a mixed-case language once poisoned the cache of the real page)", () => {
    const cases: Array<[string, string]> = [
      ["/EN", "https://tonvo.co/"],
      ["/Es", "https://tonvo.co/es"],
      ["/FR", "https://tonvo.co/fr"],
      ["/FR/about", "https://tonvo.co/fr/about"],
      ["/Fr/Use-Cases/AI-Coaching-For-Job-Interviews", "https://tonvo.co/fr/use-cases/ai-coaching-for-job-interviews"],
      ["/About", "https://tonvo.co/about"],
      ["/EN/About", "https://tonvo.co/about"],
    ];
    for (const [from, to] of cases) {
      expect(run(from).status, from).toBe(308);
      expect(location(from), from).toBe(to);
      expect(rewrite(from), from).toBeNull();
      // the target must itself be final: no second redirect
      const next = new URL(to).pathname;
      expect(location(next) === null || location(next) === to.replace("https://tonvo.co", "") || next === "/", `${from} -> ${to} chains`).toBe(true);
    }
  });

  it("keeps the case of non-public paths (ids are case sensitive)", () => {
    expect(rewrite("/summary/AbC123")).toBeNull();
    expect(location("/summary/AbC123")).toBeNull();
    expect(location("/fr/summary/AbC123")).toBe("https://tonvo.co/summary/AbC123");
    expect(location("/en/summary/AbC123")).toBe("https://tonvo.co/summary/AbC123");
  });

  it("leaves the app and the API alone", () => {
    for (const p of ["/dashboard", "/session", "/login", "/plans"]) {
      expect(rewrite(p), p).toBeNull();
      expect(location(p), p).toBeNull();
    }
    expect(rewrite("/api/health")).toBeNull();
  });
});

describe("renamed pages keep their inbound links", () => {
  it("the old feature slug redirects permanently to a page that exists, in both languages", async () => {
    const { default: nextConfig } = await import("../../next.config");
    const rules = (await nextConfig.redirects?.()) ?? [];
    for (const [source, locale] of [
      ["/features/invisible-copilot-mode", "en"],
      ["/fr/features/invisible-copilot-mode", "fr"],
    ] as const) {
      const rule = rules.find((r) => r.source === source);
      expect(rule, source).toBeTruthy();
      expect(rule!.permanent, source).toBe(true);
      const slug = rule!.destination.split("/").pop()!;
      expect(getPageByTypeAndSlug("features", slug, locale), `${source} -> ${rule!.destination}`).toBeTruthy();
    }
    expect(getPageByTypeAndSlug("features", "invisible-copilot-mode", "en")).toBeUndefined();
  });
});
