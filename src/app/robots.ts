import type { MetadataRoute } from "next";
import { SITE_URL } from "@/i18n/locales-config";

/**
 * Crawl rules. robots.txt only controls crawling: pages that must stay out of search results also carry
 * a noindex meta tag (/login, /blog) or are behind a sign-in (the app routes below).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // No trailing slash: "/dashboard/" would not match the page "/dashboard" itself.
        disallow: [
          "/api/",
          "/admin",
          "/dashboard",
          "/session",
          "/history",
          "/analytics",
          "/profile",
          "/settings",
          "/summary",
          "/analyze-text",
          "/plans",
          "/demo",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
