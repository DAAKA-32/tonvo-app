import type { Metadata } from "next";
import Providers from "@/components/Providers";
import RootShell from "@/components/RootShell";
import { HOME_DESCRIPTION, HOME_TITLE, OG_IMAGE, SITE_NAME } from "@/lib/seo";
import { siteBaseMetadata, siteViewport } from "@/lib/site-metadata";
import "../globals.css";

// Root layout of the signed-in product: one URL per page, language kept in the browser.
// The public, localized pages have their own root layout in app/[locale].
export const viewport = siteViewport;

export const metadata: Metadata = {
  ...siteBaseMetadata,
  // Everything in this group is the signed-in product: robots.txt keeps crawlers out and this keeps any
  // URL that is found out of the index. Pages that differ (login) set their own.
  robots: { index: false, follow: false },
  title: { default: HOME_TITLE, template: "%s | Tonvo" },
  description: HOME_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "./",
    siteName: SITE_NAME,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [{ ...OG_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [{ url: OG_IMAGE.url, alt: OG_IMAGE.alt }],
  },
  alternates: { canonical: "./" },
};

export default function AppRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootShell lang="en">
      <Providers>{children}</Providers>
    </RootShell>
  );
}
