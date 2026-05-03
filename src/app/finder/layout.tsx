import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Laptop Finder",
  description:
    "Temukan laptop yang tepat dengan AI Finder dari Saka Laptop. Jawab 3 pertanyaan mudah dan dapatkan rekomendasi laptop terbaik sesuai kebutuhan dan budget kamu.",
  openGraph: {
    title: "AI Laptop Finder — Saka Laptop",
    description:
      "Temukan laptop yang tepat dengan AI Finder. Jawab 3 pertanyaan mudah dan dapatkan rekomendasi laptop terbaik.",
    url: "/finder",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Laptop Finder — Saka Laptop",
    description:
      "Temukan laptop yang tepat dengan AI Finder. Jawab 3 pertanyaan mudah dan dapatkan rekomendasi laptop terbaik.",
  },
  alternates: {
    canonical: "/finder",
  },
};

export default function FinderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
