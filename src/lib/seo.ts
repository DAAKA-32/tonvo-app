import type { Metadata } from "next";

/**
 * Shared metadata for search results and link previews (Open Graph, X, iMessage, WhatsApp, Slack, Discord...).
 *
 * Every public page builds its metadata with `pageMetadata()` so it always ships the same social image,
 * its own canonical URL and og:url, and matching title and description for browsers, crawlers and cards.
 * Next.js replaces a parent's `openGraph` object as a whole when a page defines one, so the image cannot
 * be left to inheritance: this helper adds it every time.
 *
 * The image is rendered by scripts/og/render-og.mjs (1200 x 630, opaque PNG). Change the file name
 * when the design changes, so platforms that cache by URL fetch the new one.
 */

export const SITE_URL = "https://tonvo.co";
export const SITE_NAME = "Tonvo";

export const HOME_TITLE = "Tonvo: your copilot for every conversation";
export const HOME_DESCRIPTION =
  "Tonvo follows a live conversation and puts three ready replies on your screen. For calls, interviews and everyday talks. Start free.";

// v2 (2026-10-21): new file name so platforms that cache by URL fetch the new card.
export const OG_IMAGE = {
  url: "/og/tonvo-og-v2.png",
  width: 1200,
  height: 630,
  type: "image/png",
  alt: 'Tonvo logo with the headline "Never freeze when it matters." and the line "Your copilot for every conversation."',
} as const;

/** One line, single spaces, no padding. */
function oneLine(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/** Titles: a dash used as a separator becomes a colon. */
export function cleanTitle(text: string): string {
  return oneLine(text).replace(/\s+[—–-]\s+/g, ": ").replace(/[—–]/g, ", ");
}

/** Descriptions: a dash used as a separator becomes a comma. Hyphenated words are left alone. */
export function cleanDescription(text: string): string {
  return oneLine(text).replace(/\s+[—–-]\s+/g, ", ").replace(/[—–]/g, ", ");
}

/** The title as browsers and cards show it: the brand is appended once, unless the title already names it. */
export function fullTitle(title: string): string {
  const t = cleanTitle(title);
  return /\btonvo\b/i.test(t) ? t : `${t} | ${SITE_NAME}`;
}

export interface PageSeo {
  /** Page title without the brand suffix (added by `fullTitle` when needed). */
  title: string;
  description: string;
  /** Route path starting with "/", resolved against metadataBase (https://tonvo.co). */
  path: string;
  /** Only when the social card should read differently from the page title. */
  socialTitle?: string;
  socialDescription?: string;
  type?: "website" | "article";
  keywords?: string[];
  noIndex?: boolean;
}

export function pageMetadata(page: PageSeo): Metadata {
  const title = fullTitle(page.title);
  const description = cleanDescription(page.description);
  const socialTitle = page.socialTitle ? fullTitle(page.socialTitle) : title;
  const socialDescription = page.socialDescription ? cleanDescription(page.socialDescription) : description;
  return {
    title: { absolute: title },
    description,
    ...(page.keywords ? { keywords: page.keywords } : {}),
    alternates: { canonical: page.path },
    openGraph: {
      type: page.type ?? "website",
      url: page.path,
      siteName: SITE_NAME,
      locale: "en_US",
      title: socialTitle,
      description: socialDescription,
      images: [{ ...OG_IMAGE }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: socialDescription,
      images: [{ url: OG_IMAGE.url, alt: OG_IMAGE.alt }],
    },
    ...(page.noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}
