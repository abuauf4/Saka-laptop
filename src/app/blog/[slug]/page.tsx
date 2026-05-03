import type { Metadata } from "next";
import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ArticlePageClient from "./ArticlePageClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://saka-laptop.vercel.app";

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  let article;
  try {
    article = await db.article.findUnique({ where: { slug } });
  } catch {
    notFound();
  }

  if (!article || !article.published) {
    return {
      title: "Artikel Tidak Ditemukan",
    };
  }

  const imageUrl = article.gambar?.startsWith("http")
    ? article.gambar
    : article.gambar
      ? `${siteUrl}${article.gambar}`
      : `${siteUrl}/store-front.png`;

  return {
    title: article.judul,
    description: article.excerpt || article.judul,
    openGraph: {
      title: article.judul,
      description: article.excerpt || article.judul,
      type: "article",
      publishedTime: article.createdAt.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      authors: ["Saka Laptop"],
      tags: [article.kategori, "laptop", "tips laptop"],
      url: `/blog/${article.slug}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.judul,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.judul,
      description: article.excerpt || article.judul,
      images: [imageUrl],
    },
    alternates: {
      canonical: `/blog/${article.slug}`,
    },
  };
}

// Server component: fetches data and renders client component
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article = await db.article.findUnique({ where: { slug } });

  if (!article || !article.published) {
    notFound();
  }

  // Fetch related articles (same category, excluding current)
  const relatedArticles = await db.article.findMany({
    where: {
      published: true,
      kategori: article.kategori,
      slug: { not: article.slug },
    },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  // Also get some recent articles if not enough related
  let allRelated = relatedArticles;
  if (relatedArticles.length < 3) {
    const moreArticles = await db.article.findMany({
      where: {
        published: true,
        slug: { not: article.slug },
        id: { notIn: relatedArticles.map((a) => a.id) },
      },
      orderBy: { createdAt: "desc" },
      take: 3 - relatedArticles.length,
    });
    allRelated = [...relatedArticles, ...moreArticles];
  }

  // Get store name for author
  const lokasi = await db.lokasi.findUnique({ where: { id: "default" } });
  const storeName = lokasi?.namaToko || "Saka Laptop";

  // Build JSON-LD for article
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.judul,
    description: article.excerpt || article.judul,
    image: article.gambar?.startsWith("http")
      ? article.gambar
      : article.gambar
        ? `${siteUrl}${article.gambar}`
        : `${siteUrl}/store-front.png`,
    datePublished: article.createdAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: {
      "@type": "Organization",
      name: storeName,
    },
    publisher: {
      "@type": "Organization",
      name: storeName,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${article.slug}`,
    },
  };

  const serializedArticle = {
    ...article,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
  };

  const serializedRelated = allRelated.map((a) => ({
    ...a,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      <ArticlePageClient
        article={serializedArticle}
        relatedArticles={serializedRelated}
        storeName={storeName}
      />
    </>
  );
}
