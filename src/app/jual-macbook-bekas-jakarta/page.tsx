// ─── Jakarta Laptops — /jual-macbook-bekas-jakarta (Server Component) ───
// LP anak untuk keyword "jual macbook bekas jakarta".
// Brand design 100% sama dengan /jual-laptop-bekas-jakarta (parent).
// Content hardcoded (no CMS) per brief user.

import type { Metadata } from "next";
import { MACBOOK_LP_CONTENT, LP_UTM_SOURCES } from "@/lib/lp-children-content";
import { LpPageClient } from "@/components/landing-page/LpPageClient";
import type { LandingPageData } from "@/lib/landing-page-data";

// Override utm source di content (untuk WA link tracking)
const content: LandingPageData = {
  ...MACBOOK_LP_CONTENT,
  // heroPrimaryCta & heroSecondaryCta tetap sama, yang beda utm di client component
};

// Static cache — content hanya berubah via admin (revalidatePath on-demand).
export const revalidate = false;

export const metadata: Metadata = {
  title: MACBOOK_LP_CONTENT.metaTitle,
  description: MACBOOK_LP_CONTENT.metaDescription,
  keywords: [
    "jual macbook bekas jakarta",
    "jual macbook air bekas",
    "jual macbook pro bekas",
    "jual macbook m1 bekas",
    "jual macbook m2 bekas",
    "jual macbook m3 bekas",
    "jual macbook intel bekas",
    "tempat jual macbook bekas jakarta",
    "harga macbook bekas",
    "pickup macbook bekas jakarta",
  ],
  alternates: {
    canonical: "/jual-macbook-bekas-jakarta",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/jual-macbook-bekas-jakarta",
    siteName: "Jakarta Laptops",
    title: MACBOOK_LP_CONTENT.ogTitle,
    description: MACBOOK_LP_CONTENT.ogDescription,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Jual MacBook Bekas Jakarta — Jakarta Laptops",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: MACBOOK_LP_CONTENT.ogTitle,
    description: MACBOOK_LP_CONTENT.ogDescription,
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

// ─── JSON-LD Schemas (Service + OfferCatalog + FAQPage + Breadcrumb) ───
function buildSchemas() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jakartalaptops.com";
  const slug = "/jual-macbook-bekas-jakarta";
  const fullUrl = `${siteUrl}${slug}`;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "MacBook Buyback Service",
    name: "Jakarta Laptops MacBook Buyback Service",
    description:
      "Layanan pembelian MacBook bekas dari individu di Jakarta. Spesialis Air/Pro M1, M2, M3, Intel. Inspeksi gratis, penawaran transparan, pembayaran spot.",
    url: fullUrl,
    areaServed: { "@type": "City", name: "Jakarta" },
    provider: { "@type": "LocalBusiness", name: "Jakarta Laptops", url: siteUrl },
  };

  const offerCatalogSchema = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Jenis MacBook yang Dibeli Jakarta Laptops",
    description: "Kami menerima pembelian MacBook bekas semua model dan kondisi.",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "MacBook Air M1" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "MacBook Air M2" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "MacBook Air M3" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "MacBook Pro M1" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "MacBook Pro M2" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "MacBook Pro M3" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "MacBook Pro M3 Pro/Max" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "MacBook Intel (2015-2020)" } },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: MACBOOK_LP_CONTENT.faqs.map((faq) => ({
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
      { "@type": "ListItem", position: 2, name: "Jual MacBook Bekas Jakarta", item: fullUrl },
    ],
  };

  return [serviceSchema, offerCatalogSchema, faqSchema, breadcrumbSchema];
}

export default function JualMacbookBekasJakartaPage() {
  const schemas = buildSchemas();

  return (
    <>
      {schemas.map((schema, idx) => (
        <script
          key={`macbook-schema-${idx}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <LpPageClient
        content={content}
        waMessage="Halo, saya mau jual MacBook bekas. Saya lampirkan foto, model, dan spek."
      />
    </>
  );
}
