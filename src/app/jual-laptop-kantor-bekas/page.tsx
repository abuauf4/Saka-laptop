// ─── Jakarta Laptops — /jual-laptop-kantor-bekas (Server Component) ───
// LP anak untuk keyword "jual laptop kantor bekas" — B2B bulk acquisition.

import type { Metadata } from "next";
import { KANTOR_LP_CONTENT, LP_UTM_SOURCES } from "@/lib/lp-children-content";
import { LpPageClient } from "@/components/landing-page/LpPageClient";

// Static cache — content hanya berubah via admin (revalidatePath on-demand).
export const revalidate = false;

export const metadata: Metadata = {
  title: KANTOR_LP_CONTENT.metaTitle,
  description: KANTOR_LP_CONTENT.metaDescription,
  keywords: [
    "jual laptop kantor bekas",
    "jual laptop kantor bekas jakarta",
    "jual laptop office bekas",
    "jual thinkpad bekas jakarta",
    "jual latitude bekas jakarta",
    "jual elitebook bekas jakarta",
    "jual laptop korporat bekas",
    "bulk laptop acquisition jakarta",
    "corporate laptop disposal jakarta",
    "pickup laptop kantor jakarta",
  ],
  alternates: { canonical: "/jual-laptop-kantor-bekas" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/jual-laptop-kantor-bekas",
    siteName: "Jakarta Laptops",
    title: KANTOR_LP_CONTENT.ogTitle,
    description: KANTOR_LP_CONTENT.ogDescription,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Jual Laptop Kantor Bekas Jakarta — Jakarta Laptops" }],
  },
  twitter: {
    card: "summary_large_image",
    title: KANTOR_LP_CONTENT.ogTitle,
    description: KANTOR_LP_CONTENT.ogDescription,
    images: ["/og-image.png"],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

function buildSchemas() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jakartalaptops.com";
  const slug = "/jual-laptop-kantor-bekas";
  const fullUrl = `${siteUrl}${slug}`;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Corporate Laptop Buyback Service",
    name: "Jakarta Laptops Corporate Laptop Buyback Service",
    description:
      "Layanan pembelian laptop kantor bekas bulk (10+ unit) dari perusahaan di Jakarta. Pickup gratis Jabodetabek, data wipe bersertifikat, invoice corporate.",
    url: fullUrl,
    areaServed: { "@type": "City", name: "Jakarta" },
    provider: { "@type": "LocalBusiness", name: "Jakarta Laptops", url: siteUrl },
  };

  const offerCatalogSchema = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Jenis Laptop Kantor yang Dibeli",
    description: "Bulk acquisition 10+ unit. Semua brand office diterima.",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Lenovo ThinkPad (T/X/L/X1 series)" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Dell Latitude (5000/7000/9000)" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "HP EliteBook (800/1000 series)" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Asus ProArt/Business" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Acer TravelMate" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "MacBook untuk kantor" } },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: KANTOR_LP_CONTENT.faqs.map((faq) => ({
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
      { "@type": "ListItem", position: 2, name: "Jual Laptop Kantor Bekas", item: fullUrl },
    ],
  };

  return [serviceSchema, offerCatalogSchema, faqSchema, breadcrumbSchema];
}

export default function JualLaptopKantorBekasPage() {
  const schemas = buildSchemas();

  return (
    <>
      {schemas.map((schema, idx) => (
        <script
          key={`kantor-schema-${idx}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <LpPageClient
        content={KANTOR_LP_CONTENT}
        waMessage="Halo, saya mau jual laptop kantor bekas (bulk). Saya lampirkan foto, daftar unit, brand, model, dan jumlah."
      />
    </>
  );
}
