import { describe, it, expect } from "vitest";
import { cleanDescription, cleanTitle, fullTitle, HOME_DESCRIPTION, HOME_TITLE, OG_IMAGE, pageMetadata } from "@/lib/seo";
import { features } from "@/data/seo/features";
import { comparisons } from "@/data/seo/comparisons";
import { guides } from "@/data/seo/guides";
import { industries } from "@/data/seo/industries";
import { useCases } from "@/data/seo/use-cases";
import { metadata as aboutMeta } from "@/app/about/layout";
import { metadata as pricingMeta } from "@/app/pricing/layout";
import { metadata as loginMeta } from "@/app/login/layout";
import { metadata as blogMeta } from "@/app/blog/layout";
import { metadata as privacyMeta } from "@/app/privacy/layout";
import { metadata as termsMeta } from "@/app/terms/layout";
import { metadata as cookiesMeta } from "@/app/cookies/layout";
import { metadata as legalMeta } from "@/app/legal/layout";
import type { Metadata } from "next";

/** What a link preview and a search snippet will show must read as clean, single-line text. */
function expectClean(text: string, what: string) {
  expect(text, `${what} is empty`).toBeTruthy();
  expect(text, `${what} has padding`).toBe(text.trim());
  expect(text, `${what} has repeated or odd whitespace`).not.toMatch(/\s{2,}|[\n\t]/);
  expect(text, `${what} has a decorative dash`).not.toMatch(/[—–]|\s-\s/);
}

function check(meta: Metadata, label: string) {
  const og = meta.openGraph as { title: string; description: string; url: string; images: Array<{ url: string; width: number; height: number; alt: string }> };
  const tw = meta.twitter as { card: string; title: string; description: string; images: Array<{ url: string; alt: string }> };
  const title = (meta.title as { absolute: string }).absolute;
  expectClean(title, `${label} title`);
  expectClean(meta.description as string, `${label} description`);
  expectClean(og.title, `${label} og:title`);
  expectClean(og.description, `${label} og:description`);
  expect((title.match(/tonvo/gi) ?? []).length, `${label} title repeats the brand`).toBeLessThanOrEqual(1);
  expect((meta.description as string).length, `${label} description too long`).toBeLessThanOrEqual(170);
  expect(og.images[0]).toMatchObject({ url: OG_IMAGE.url, width: 1200, height: 630 });
  expect(og.images[0].alt).toBeTruthy();
  expect(tw).toMatchObject({ card: "summary_large_image", title: og.title, description: og.description });
  expect(tw.images[0].url).toBe(OG_IMAGE.url);
  expect(og.url).toMatch(/^\/[a-z0-9/-]*$/);
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

describe("every public page ships a complete, clean link preview", () => {
  const layouts: Array<[string, Metadata]> = [
    ["about", aboutMeta], ["pricing", pricingMeta], ["login", loginMeta], ["blog", blogMeta],
    ["privacy", privacyMeta], ["terms", termsMeta], ["cookies", cookiesMeta], ["legal", legalMeta],
  ];
  it.each(layouts)("%s", (label, meta) => check(meta, label));

  const dynamic = [
    ...features.map((e) => ["features", e] as const),
    ...comparisons.map((e) => ["compare", e] as const),
    ...guides.map((e) => ["guides", e] as const),
    ...industries.map((e) => ["industries", e] as const),
    ...useCases.map((e) => ["use-cases", e] as const),
  ];
  it(`all ${dynamic.length} SEO pages`, () => {
    for (const [section, e] of dynamic) {
      check(pageMetadata({ title: e.title, description: e.metaDescription, path: `/${section}/${e.slug}` }), `${section}/${e.slug}`);
    }
  });
});
