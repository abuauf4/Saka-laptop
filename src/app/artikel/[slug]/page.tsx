// ─── Jakarta Laptops — Article Detail Page ───
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/core/lib/db";
import { ArticleDetailClient } from "./article-detail-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await db.article.findUnique({ where: { slug } });
  if (!article) return { title: "Artikel tidak ditemukan" };

  return {
    title: article.title,
    description: article.excerpt || article.metaDesc || "",
    openGraph: {
      title: article.title,
      description: article.excerpt || "",
      images: article.coverImage ? [article.coverImage] : [],
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [article, branding] = await Promise.all([
    db.article.findUnique({
      where: { slug },
      include: { category: true },
    }),
    db.branding.findUnique({ where: { id: "default" } }).catch(() => null),
  ]);

  if (!article || article.status !== "published") {
    notFound();
  }

  // Get related articles (same category, exclude current)
  const related = await db.article.findMany({
    where: {
      status: "published",
      categoryId: article.categoryId,
      id: { not: article.id },
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  return (
    <ArticleDetailClient
      article={{
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt || "",
        content: article.content || "",
        coverImage: article.coverImage || "",
        createdAt: article.createdAt.toISOString(),
        categoryName: article.category?.name || "",
        metaTitle: article.metaTitle || "",
        metaDesc: article.metaDesc || "",
      }}
      related={related.map((r) => ({
        title: r.title,
        slug: r.slug,
        excerpt: r.excerpt || "",
        coverImage: r.coverImage || "",
        createdAt: r.createdAt.toISOString(),
      }))}
      siteName={branding?.siteName || "Jakarta Laptops"}
    />
  );
}
