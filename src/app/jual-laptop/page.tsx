// ─── /jual-laptop (Hardcoded Article) ───
import type { Metadata } from "next";
import { HardcodedArticle } from "@/components/articles/hardcoded-article";
import { JUAL_LAPTOP_ARTICLE } from "@/lib/hardcoded-articles-content";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: JUAL_LAPTOP_ARTICLE.title,
  description: JUAL_LAPTOP_ARTICLE.excerpt,
  keywords: [
    "jual laptop",
    "cara jual laptop",
    "tempat jual laptop",
    "harga jual laptop",
    "jual laptop bekas",
    "jual laptop second",
    "jual laptop cepat",
  ],
  alternates: { canonical: "/jual-laptop" },
  openGraph: {
    type: "article",
    locale: "id_ID",
    url: "/jual-laptop",
    siteName: "Jakarta Laptops",
    title: JUAL_LAPTOP_ARTICLE.title,
    description: JUAL_LAPTOP_ARTICLE.excerpt,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <HardcodedArticle article={JUAL_LAPTOP_ARTICLE} />;
}
