import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Kenali Saka Laptop — toko laptop terpercaya di Jakarta Selatan. Menyediakan laptop gaming, ultrabook, laptop kerja, dan laptop sekolah berkualitas sejak bertahun-tahun. Lokasi strategis, pelayanan ramah, dan garansi terjamin.",
  openGraph: {
    title: "Tentang Kami — Saka Laptop",
    description:
      "Kenali Saka Laptop — toko laptop terpercaya di Jakarta Selatan. Laptop berkualitas dengan pelayanan ramah dan garansi terjamin.",
    url: "/tentang",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tentang Kami — Saka Laptop",
    description:
      "Kenali Saka Laptop — toko laptop terpercaya di Jakarta Selatan. Laptop berkualitas dengan pelayanan ramah dan garansi terjamin.",
  },
  alternates: {
    canonical: "/tentang",
  },
};

export default function TentangLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
