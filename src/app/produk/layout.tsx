import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Katalog Laptop",
  description:
    "Jelajahi katalog laptop lengkap di Saka Laptop. Temukan laptop gaming, ultrabook, laptop kerja, dan laptop sekolah dengan spesifikasi terbaik dan harga terjangkau.",
  openGraph: {
    title: "Katalog Laptop — Saka Laptop",
    description:
      "Jelajahi katalog laptop lengkap. Laptop gaming, ultrabook, kerja & sekolah berkualitas dengan harga terbaik.",
    url: "/produk",
  },
  twitter: {
    card: "summary_large_image",
    title: "Katalog Laptop — Saka Laptop",
    description:
      "Jelajahi katalog laptop lengkap. Laptop gaming, ultrabook, kerja & sekolah berkualitas dengan harga terbaik.",
  },
  alternates: {
    canonical: "/produk",
  },
};

export default function ProdukLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
