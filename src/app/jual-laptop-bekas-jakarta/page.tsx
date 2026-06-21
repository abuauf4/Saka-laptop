// ─── Jakarta Laptops — /jual-laptop-bekas-jakarta (Server Component) ───
// SEO-targeted landing page untuk supply acquisition.
// Fetch LP content di server, pass ke client component.
//
// Pattern: mirror /page.tsx (homepage) — server fetch + ISR 5 menit.

import type { Metadata } from "next";
import { fetchLandingPageContent } from "@/lib/landing-page-data";
import { LandingPageClient } from "@/components/landing-page/LandingPageClient";

// Cache di edge/CDN selama 5 menit (sama dengan homepage).
// LP content gak berubah tiap menit, jadi caching ngurangin TTFB drastis.
// Admin masih bisa lihat perubahan setelah revalidate.
export const revalidate = 300;

// ─── Dynamic metadata (pakai content dari DB) ───
export async function generateMetadata(): Promise<Metadata> {
  const content = await fetchLandingPageContent();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jakartalaptops.com";
  const slug = "/jual-laptop-bekas-jakarta";
  const fullUrl = `${siteUrl}${slug}`;

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    keywords: [
      "jual laptop bekas jakarta",
      "tempat jual laptop bekas jakarta",
      "jual macbook bekas jakarta",
      "jual laptop gaming bekas jakarta",
      "jual laptop kantor bekas",
      "buyback laptop jakarta",
      "tukar tambah laptop jakarta",
      "pickup laptop bekas jakarta",
      "jual laptop rusak jakarta",
      "jual laptop cash jakarta",
    ],
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: fullUrl,
      siteName: "Jakarta Laptops",
      title: content.ogTitle,
      description: content.ogDescription,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Jual Laptop Bekas Jakarta — Jakarta Laptops",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: content.ogTitle,
      description: content.ogDescription,
      images: ["/og-image.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// ─── JSON-LD Schema injection (Service + OfferCatalog + FAQPage + Breadcrumb) ───
// Note: LocalBusiness & Organization schema sudah di-handle oleh <SchemaOrg /> di root layout.
// Disini kita tambah schema yang spesifik untuk LP ini.
function buildLpSchemas(content: Awaited<ReturnType<typeof fetchLandingPageContent>>) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jakartalaptops.com";
  const slug = "/jual-laptop-bekas-jakarta";
  const fullUrl = `${siteUrl}${slug}`;

  // Service schema — Laptop Buyback Service
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Laptop Buyback Service",
    name: "Jakarta Laptops Buyback Service",
    description:
      "Layanan pembelian laptop bekas dari individu dan perusahaan di Jakarta. Inspeksi gratis, penawaran transparan, pembayaran spot.",
    url: fullUrl,
    areaServed: {
      "@type": "City",
      name: "Jakarta",
    },
    provider: {
      "@type": "LocalBusiness",
      name: "Jakarta Laptops",
      url: siteUrl,
    },
  };

  // OfferCatalog schema — jenis laptop yang dibeli
  const offerCatalogSchema = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Jenis Laptop yang Dibeli Jakarta Laptops",
    description:
      "Kami menerima pembelian laptop bekas semua brand dengan kondisi normal maupun minus.",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: { "@type": "Product", name: "Apple MacBook" },
        description: "MacBook Air/Pro M1, M2, M3, Intel. Semua kondisi.",
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Product", name: "Laptop Gaming" },
        description: "Asus ROG, MSI, Acer Predator, Lenovo Legion. RTX 20 series ke atas.",
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Product", name: "Laptop Office/ThinkPad" },
        description: "Lenovo ThinkPad, Dell Latitude, HP EliteBook. Bulk B2B welcome.",
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Product", name: "Laptop Korporat Bekas" },
        description: "Bulk acquisition 10+ unit. Pickup gratis Jabodetabek.",
      },
    ],
  };

  // FAQPage schema — dari content.faqs
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  // BreadcrumbList schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Jual Laptop Bekas Jakarta",
        item: fullUrl,
      },
    ],
  };

  return [serviceSchema, offerCatalogSchema, faqSchema, breadcrumbSchema];
}

// ─── Page component ───
export default async function JualLaptopBekasJakartaPage() {
  const content = await fetchLandingPageContent();
  const schemas = buildLpSchemas(content);

  return (
    <>
      {/* JSON-LD Schemas */}
      {schemas.map((schema, idx) => (
        <script
          key={`lp-schema-${idx}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <LandingPageClient content={content} />
    </>
  );
}
