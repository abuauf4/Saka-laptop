// ─── Jakarta Laptops — /jual-laptop-jakarta (Server Component) ───
// LP anak baru untuk keyword "jual laptop jakarta" (broad, gak specify 'bekas').
// Hardcoded copy (not CMS). Style 100% konsisten homepage via LpPageClient.

import type { Metadata } from "next";
import { LpPageClient } from "@/components/landing-page/LpPageClient";
import type { LandingPageData } from "@/lib/landing-page-data";

const CONTENT: LandingPageData = {
  heroEyebrow: "JUAL LAPTOP JAKARTA",
  heroTitle: "Jual Laptop Anda di Jakarta Hari Ini.",
  heroSubtitle:
    "Estimasi harga cepat, proses transparan, pembayaran langsung di jam kerja. Pickup gratis Jabodetabek. Terima ThinkPad, Latitude, EliteBook, MacBook, dan brand lainnya.",
  heroPrimaryCta: "Kirim Foto Laptop",
  heroSecondaryCta: "Chat WhatsApp",
  heroTrustBadges: [
    { text: "Respons cepat" },
    { text: "Pembayaran cepat di jam kerja" },
    { text: "Terima kondisi minus" },
  ],

  valuePillars: [
    {
      icon: "Clock",
      headline: "Respons Cepat",
      subCopy: "Tim kami responsif di jam kerja (08:00-21:00) setiap hari.",
    },
    {
      icon: "Camera",
      headline: "Estimasi Harga Instan",
      subCopy: "Kirim foto, dapatkan estimasi dalam 1-2 jam.",
    },
    {
      icon: "Truck",
      headline: "Pickup Gratis Jabodetabek",
      subCopy: "Penjemputan gratis untuk laptop di atas Rp 2 juta.",
    },
    {
      icon: "Wallet",
      headline: "Pembayaran Cepat",
      subCopy: "Cash atau transfer langsung setelah inspeksi selesai (selama jam kerja 08:00-21:00).",
    },
    {
      icon: "AlertCircle",
      headline: "Terima Kondisi Minus",
      subCopy: "Laptop ret, ngedrop, atau rusak tetap diterima, harga disesuaikan.",
    },
  ],

  processSteps: [
    {
      step: "1",
      headline: "Kirim Foto",
      subCopy: "WA atau form upload foto laptop + spek.",
      duration: "5 menit",
    },
    {
      step: "2",
      headline: "Dapat Estimasi",
      subCopy: "Tim berikan estimasi harga berdasarkan foto.",
      duration: "1-2 jam",
    },
    {
      step: "3",
      headline: "QC & Inspeksi",
      subCopy: "Inspeksi fisik 12 titik di lokasi atau video call.",
      duration: "30-60 menit",
    },
    {
      step: "4",
      headline: "Bayar",
      subCopy: "Cash atau transfer langsung, selesai.",
      duration: "5 menit",
    },
  ],

  estimasiTitle: "Cek Estimasi Harga Laptop Anda",
  estimasiSubtitle: "Interactive widget, no commit, hasil instan",
  estimasiCtaLabel: "Lanjut Chat WhatsApp untuk Penawaran Akurat",

  faqs: [
    {
      q: "Berapa harga laptop saya di Jakarta?",
      a: "Harga tergantung brand, model, tahun, dan kondisi. Kirim foto via WA, dapatkan estimasi dalam 1-2 jam. Harga final setelah inspeksi fisik 12 titik QC.",
      keyword: "harga laptop jakarta",
    },
    {
      q: "Laptop rusak bisa dijual di Jakarta?",
      a: "Ya, kami menerima laptop dalam kondisi rusak (mati, layar pecah, keyboard rusak, baterai ngedrop). Harga disesuaikan dengan kondisi setelah inspeksi.",
      keyword: "jual laptop rusak jakarta",
    },
    {
      q: "MacBook bisa dijual?",
      a: "Ya, kami spesialis MacBook. Menerima MacBook Air/Pro M1, M2, M3, Intel. Penawaran di atas pasar untuk unit kondisi mulus dengan kelengkapan box/charger.",
      keyword: "jual macbook jakarta",
    },
    {
      q: "Laptop kantor bisa dijual?",
      a: "Ya, kami menerima bulk acquisition laptop kantor 10+ unit. Pickup gratis Jabodetabek, data wipe bersertifikat, pembayaran corporate via invoice + transfer.",
      keyword: "jual laptop kantor jakarta",
    },
    {
      q: "Berapa lama proses jual laptop di Jakarta?",
      a: "Inspeksi fisik 30-60 menit di lokasi Jakarta. Untuk online, kirim foto via WA dan dapatkan estimasi dalam 1-2 jam. Setelah deal, pembayaran spot selama jam kerja (08:00-21:00).",
      keyword: "lama proses jual laptop jakarta",
    },
    {
      q: "Apakah pickup gratis di Jakarta?",
      a: "Ya, pickup gratis area Jabodetabek untuk laptop dengan estimasi harga di atas Rp 2 juta. Untuk di bawah Rp 2 juta, bisa diantar ke lokasi atau pickup dengan biaya transport.",
      keyword: "pickup laptop jakarta",
    },
    {
      q: "Pembayaran cash atau transfer?",
      a: "Keduanya. Cash untuk deal B2C langsung setelah inspeksi (selama jam kerja 08:00-21:00). Transfer bank untuk deal corporate atau atas request. QRIS juga tersedia untuk nominal di bawah Rp 5 juta.",
      keyword: "jual laptop cash jakarta",
    },
    {
      q: "Area layanan Jakarta mana saja?",
      a: "Seluruh Jakarta (Pusat, Selatan, Barat, Timur, Utara), plus Bodetabek (Bogor, Depok, Tangerang, Bekasi). Pickup gratis untuk estimasi di atas Rp 2 juta.",
      keyword: "jual laptop jakarta",
    },
  ],

  trustStats: [
    { stat: "12 titik", label: "QC inspection per unit" },
    { stat: "1-2 jam", label: "Estimasi harga setelah foto" },
    { stat: "Jabodetabek", label: "Area pickup gratis" },
  ],
  trustTitle: "Proses Transparan, Penawaran Jujur",
  trustSubtitle: "Inspeksi menyeluruh sebelum deal",

  finalCtaTitle: "Siap Jual Laptop Anda di Jakarta?",
  finalCtaSubtitle:
    "Estimasi harga dalam 1-2 jam. Pickup gratis Jabodetabek. Pembayaran cepat di jam kerja.",
  finalCtaPrimary: "Kirim Foto Laptop",
  finalCtaSecondary: "Chat WhatsApp",

  metaTitle:
    "Jual Laptop Jakarta — Estimasi Cepat, Pickup Gratis | Jakarta Laptops",
  metaDescription:
    "Jual laptop Jakarta (semua brand: ThinkPad, Latitude, EliteBook, MacBook, dll). Estimasi harga cepat, proses transparan, pickup gratis Jabodetabek. Chat WA sekarang!",
  ogTitle: "Jual Laptop Anda di Jakarta Hari Ini — Jakarta Laptops",
  ogDescription:
    "Estimasi cepat, proses transparan, pembayaran cepat. Pickup gratis Jabodetabek.",
};

// Static cache — content hanya berubah via admin (revalidatePath on-demand).
export const revalidate = false;

export const metadata: Metadata = {
  title: CONTENT.metaTitle,
  description: CONTENT.metaDescription,
  keywords: [
    "jual laptop jakarta",
    "jual laptop di jakarta",
    "tempat jual laptop jakarta",
    "jual laptop bekas jakarta",
    "jual laptop second jakarta",
    "jual laptop cash jakarta",
    "pickup laptop jakarta",
    "harga laptop jakarta",
    "jual macbook jakarta",
    "jual laptop kantor jakarta",
  ],
  alternates: { canonical: "/jual-laptop-jakarta" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/jual-laptop-jakarta",
    siteName: "Jakarta Laptops",
    title: CONTENT.ogTitle,
    description: CONTENT.ogDescription,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Jual Laptop Jakarta — Jakarta Laptops" }],
  },
  twitter: {
    card: "summary_large_image",
    title: CONTENT.ogTitle,
    description: CONTENT.ogDescription,
    images: ["/og-image.png"],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

function buildSchemas() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jakartalaptops.com";
  const slug = "/jual-laptop-jakarta";
  const fullUrl = `${siteUrl}${slug}`;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Laptop Buyback Service",
    name: "Jakarta Laptops Buyback Service",
    description:
      "Layanan pembelian laptop bekas dari individu dan perusahaan di Jakarta. Inspeksi gratis, penawaran transparan, pembayaran spot.",
    url: fullUrl,
    areaServed: { "@type": "City", name: "Jakarta" },
    provider: { "@type": "LocalBusiness", name: "Jakarta Laptops", url: siteUrl },
  };

  const offerCatalogSchema = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Jenis Laptop yang Dibeli Jakarta Laptops",
    description: "Kami menerima pembelian laptop bekas semua brand dengan kondisi normal maupun minus.",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Apple MacBook" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Laptop Gaming" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Laptop Office/ThinkPad" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Laptop Korporat Bekas" } },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: CONTENT.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Jual Laptop Jakarta", item: fullUrl },
    ],
  };

  return [serviceSchema, offerCatalogSchema, faqSchema, breadcrumbSchema];
}

export default function JualLaptopJakartaPage() {
  const schemas = buildSchemas();

  return (
    <>
      {schemas.map((schema, idx) => (
        <script
          key={`jl-jkt-schema-${idx}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <LpPageClient
        content={CONTENT}
        waMessage="Halo, saya mau jual laptop. Saya lampirkan foto dan spek."
      />
    </>
  );
}
