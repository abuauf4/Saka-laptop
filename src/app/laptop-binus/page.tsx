// ─── /laptop-binus (Hardcoded Article) ───
import type { Metadata } from "next";
import { HardcodedArticle } from "@/components/articles/hardcoded-article";
import { LAPTOP_BINUS_ARTICLE } from "@/lib/hardcoded-articles-content";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: LAPTOP_BINUS_ARTICLE.title,
  description: LAPTOP_BINUS_ARTICLE.excerpt,
  keywords: [
    "laptop binus",
    "jual laptop binus",
    "jual laptop bekas binus",
    "pickup laptop binus",
    "laptop mahasiswa binus",
    "jual macbook binus",
    "laptop bekas binus jakarta",
  ],
  alternates: { canonical: "/laptop-binus" },
  openGraph: {
    type: "article",
    locale: "id_ID",
    url: "/laptop-binus",
    siteName: "Jakarta Laptops",
    title: LAPTOP_BINUS_ARTICLE.title,
    description: LAPTOP_BINUS_ARTICLE.excerpt,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <HardcodedArticle article={LAPTOP_BINUS_ARTICLE} />;
}
