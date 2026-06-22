import { MetadataRoute } from "next";
import { db } from "@/core/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jakartalaptops.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    // ─── Landing Pages (supply acquisition) ───
    // Parent LP (CMS-driven, paling penting)
    {
      url: `${baseUrl}/jual-laptop-bekas-jakarta`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    // 4 LP anak (hardcoded copy, target keyword spesifik)
    {
      url: `${baseUrl}/jual-macbook-bekas-jakarta`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/jual-laptop-gaming-bekas`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tukar-tambah-laptop`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/jual-laptop-kantor-bekas`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // LP baru (keyword "jual laptop jakarta" broad)
    {
      url: `${baseUrl}/jual-laptop-jakarta`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    // ─── Other static pages ───
    {
      url: `${baseUrl}/tentang`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/artikel`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Dynamic article pages
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
