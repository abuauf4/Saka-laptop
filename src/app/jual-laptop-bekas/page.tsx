// ─── /jual-laptop-bekas (Hardcoded Article) ───
import type { Metadata } from "next";
import { HardcodedArticle } from "@/components/articles/hardcoded-article";
import { JUAL_LAPTOP_BEKAS_ARTICLE } from "@/lib/hardcoded-articles-content";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: JUAL_LAPTOP_BEKAS_ARTICLE.title,
  description: JUAL_LAPTOP_BEKAS_ARTICLE.excerpt,
  keywords: [
    "jual laptop bekas",
    "cara jual laptop bekas",
    "harga laptop bekas",
    "tempat jual laptop bekas",
    "jual laptop bekas jakarta",
    "jual laptop second",
    "jual laptop bekas harga tinggi",
  ],
  alternates: { canonical: "/jual-laptop-bekas" },
  openGraph: {
    type: "article",
    locale: "id_ID",
    url: "/jual-laptop-bekas",
    siteName: "Jakarta Laptops",
    title: JUAL_LAPTOP_BEKAS_ARTICLE.title,
    description: JUAL_LAPTOP_BEKAS_ARTICLE.excerpt,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <HardcodedArticle article={JUAL_LAPTOP_BEKAS_ARTICLE} />;
}
