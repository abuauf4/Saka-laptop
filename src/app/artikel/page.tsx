// ─── Jakarta Laptops — Artikel (Blog List) ───
import type { Metadata } from "next";
import { db } from "@/core/lib/db";
import { ArtikelClient } from "./artikel-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Artikel & Tips",
  description: "Tips jual laptop bekas, review, dan berita seputar laptop dari Jakarta Laptops.",
};

export default async function ArtikelPage() {
  const [articles, categories, branding] = await Promise.all([
    db.article.findMany({
      where: { status: "published" },
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    db.articleCategory.findMany({
      orderBy: { name: "asc" },
    }),
    db.branding.findUnique({ where: { id: "default" } }).catch(() => null),
  ]);

  return (
    <ArtikelClient
      articles={articles.map((a) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt || "",
        coverImage: a.coverImage || "",
        createdAt: a.createdAt.toISOString(),
        categoryName: a.category?.name || "",
      }))}
      categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
      siteName={branding?.siteName || "Jakarta Laptops"}
    />
  );
}
