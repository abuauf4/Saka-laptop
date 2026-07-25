import { MetadataRoute } from "next";
import { db } from "@/core/lib/db";

// Stable date for static pages — sitemap output must be deterministic
// so it doesn't produce a different response on every request.
// Note: this only affects the sitemap XML itself, not other pages.
const SITE_LAST_MODIFIED = new Date("2025-07-25");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jakartalaptops.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: "daily",
      priority: 1,
    },
    // ─── Landing Pages (supply acquisition) ───
    // Parent LP (CMS-driven, paling penting)
    {
      url: `${baseUrl}/jual-laptop-bekas-jakarta`,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    // 4 LP anak (hardcoded copy, target keyword spesifik)
    {
      url: `${baseUrl}/jual-macbook-bekas-jakarta`,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/jual-laptop-gaming-bekas`,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tukar-tambah-laptop`,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/jual-laptop-kantor-bekas`,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // LP baru (keyword "jual laptop jakarta" broad)
    {
      url: `${baseUrl}/jual-laptop-jakarta`,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    // ─── Other static pages ───
    {
      url: `${baseUrl}/tentang`,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/artikel`,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Dynamic article pages — use updatedAt from DB (stable per article)
  let articlePages: MetadataRoute.Sitemap = [];
  try {
    const articles = await db.article.findMany({
      where: { status: "published" },
      select: { slug: true, updatedAt: true },
    });
    articlePages = articles.map((a) => ({
      url: `${baseUrl}/artikel/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // DB error, skip articles
  }

  return [...staticPages, ...articlePages];
}
