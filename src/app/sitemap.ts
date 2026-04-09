import type { MetadataRoute } from "next";
import { getAllSEOPages } from "@/data/seo/registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://tonvo.co";
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const seoIndexPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/use-cases`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/features`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/industries`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/compare`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/guides`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  const seoPages: MetadataRoute.Sitemap = getAllSEOPages().map((entry) => ({
    url: `${baseUrl}/${entry.type}/${entry.slug}`,
    lastModified: entry.lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...seoIndexPages, ...seoPages];
}
