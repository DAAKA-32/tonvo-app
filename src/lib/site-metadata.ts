import type { Metadata, Viewport } from "next";
import { SITE_URL } from "@/lib/seo";

/** Viewport and site-wide metadata shared by the two root layouts ((app) and [locale]). */
export const siteViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#09090b",
  colorScheme: "dark",
};

export const siteBaseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  authors: [{ name: "Tonvo", url: SITE_URL }],
  creator: "Tonvo",
  publisher: "Tonvo",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Tonvo",
  },
  other: {
    "mobile-web-app-capable": "yes",
    google: "notranslate",
  },
  category: "technology",
  verification: {
    google: "B5nixBEKZFroUuUqTwfB7CoJQ0vxrIAJUuykH5hva18",
  },
};
