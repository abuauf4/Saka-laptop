import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ajukan Laptop — Inspeksi & Penawaran Gratis",
  description:
    "Kirim data laptop bekas kamu. Tim kami akan melakukan QC dan memberikan penawaran harga transparan dalam 1×24 jam.",
  openGraph: {
    title: "Ajukan Laptop — Jakarta Laptops",
    description:
      "Kirim data laptop bekas. QC transparan, penawaran jelas, proses cepat.",
    url: "/ajukan",
  },
  alternates: { canonical: "/ajukan" },
};

export default function AjukanLayout({ children }: { children: React.ReactNode }) {
  return children;
}
