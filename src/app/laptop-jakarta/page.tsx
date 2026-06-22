// ─── /laptop-jakarta (Hardcoded Article) ───
import type { Metadata } from "next";
import { HardcodedArticle } from "@/components/articles/hardcoded-article";
import { LAPTOP_JAKARTA_ARTICLE } from "@/lib/hardcoded-articles-content";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: LAPTOP_JAKARTA_ARTICLE.title,
  description: LAPTOP_JAKARTA_ARTICLE.excerpt,
  keywords: [
    "laptop jakarta",
    "jakarta laptop",
    "jual laptop jakarta",
    "laptop bekas jakarta",
    "laptop second jakarta",
    "tempat jual laptop jakarta",
    "pickup laptop jakarta",
  ],
  alternates: { canonical: "/laptop-jakarta" },
  openGraph: {
    type: "article",
    locale: "id_ID",
    url: "/laptop-jakarta",
    siteName: "Jakarta Laptops",
    title: LAPTOP_JAKARTA_ARTICLE.title,
    description: LAPTOP_JAKARTA_ARTICLE.excerpt,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <HardcodedArticle article={LAPTOP_JAKARTA_ARTICLE} />;
}
