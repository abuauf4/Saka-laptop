import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Tips & Review Laptop",
  description:
    "Baca artikel terbaru seputar laptop di blog Saka Laptop. Tips memilih laptop, review laptop terbaru, rekomendasi laptop gaming, ultrabook, dan lainnya.",
  openGraph: {
    title: "Blog — Tips & Review Laptop — Saka Laptop",
    description:
      "Baca artikel terbaru seputar laptop. Tips memilih laptop, review laptop terbaru, dan rekomendasi laptop terbaik.",
    url: "/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Tips & Review Laptop — Saka Laptop",
    description:
      "Baca artikel terbaru seputar laptop. Tips memilih laptop, review laptop terbaru, dan rekomendasi laptop terbaik.",
  },
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
