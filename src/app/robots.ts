import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://tonvo.co";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/dashboard/",
          "/session/",
          "/history/",
          "/analytics/",
          "/profile/",
          "/settings/",
          "/summary/",
          "/analyze-text/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
