// ─── Jakarta Laptops — /jual-laptop-gaming-bekas (Server Component) ───
// LP anak untuk keyword "jual laptop gaming bekas".
// Brand design 100% sama dengan /jual-laptop-bekas-jakarta (parent).

import type { Metadata } from "next";
import { GAMING_LP_CONTENT, LP_UTM_SOURCES } from "@/lib/lp-children-content";
import { LpPageClient } from "@/components/landing-page/LpPageClient";

// Static cache — content hanya berubah via admin (revalidatePath on-demand).
export const revalidate = false;

export const metadata: Metadata = {
  title: GAMING_LP_CONTENT.metaTitle,
  description: GAMING_LP_CONTENT.metaDescription,
  keywords: [
    "jual laptop gaming bekas",
    "jual laptop gaming bekas jakarta",
    "jual asus rog bekas",
    "jual msi gaming bekas",
    "jual acer predator bekas",
    "jual lenovo legion bekas",
    "jual laptop rtx bekas",
    "tempat jual laptop gaming bekas",
    "harga laptop gaming bekas",
    "pickup laptop gaming bekas jakarta",
  ],
  alternates: { canonical: "/jual-laptop-gaming-bekas" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/jual-laptop-gaming-bekas",
    siteName: "Jakarta Laptops",
    title: GAMING_LP_CONTENT.ogTitle,
    description: GAMING_LP_CONTENT.ogDescription,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Jual Laptop Gaming Bekas — Jakarta Laptops" }],
  },
  twitter: {
    card: "summary_large_image",
    title: GAMING_LP_CONTENT.ogTitle,
    description: GAMING_LP_CONTENT.ogDescription,
    images: ["/og-image.png"],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

function buildSchemas() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jakartalaptops.com";
  const slug = "/jual-laptop-gaming-bekas";
  const fullUrl = `${siteUrl}${slug}`;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Laptop Gaming Buyback Service",
    name: "Jakarta Laptops Gaming Buyback Service",
    description:
      "Layanan pembelian laptop gaming bekas di Jakarta. Spesialis Asus ROG, MSI, Acer Predator, Lenovo Legion. Stress test GPU, penawaran transparan, pembayaran spot.",
    url: fullUrl,
    areaServed: { "@type": "City", name: "Jakarta" },
    provider: { "@type": "LocalBusiness", name: "Jakarta Laptops", url: siteUrl },
  };

  const offerCatalogSchema = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Jenis Laptop Gaming yang Dibeli",
    description: "Kami menerima pembelian laptop gaming bekas semua brand.",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Asus ROG (Strix, Zephyrus, Scar)" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Asus TUF Gaming" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "MSI Gaming (GE, GF, GP, Cyborg)" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Acer Predator (Helios, Triton)" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Acer Nitro" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Lenovo Legion" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "HP Omen" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Dell G-Series / Alienware" } },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: GAMING_LP_CONTENT.faqs.map((faq) => ({
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
      { "@type": "ListItem", position: 2, name: "Jual Laptop Gaming Bekas", item: fullUrl },
    ],
  };

  return [serviceSchema, offerCatalogSchema, faqSchema, breadcrumbSchema];
}

export default function JualLaptopGamingBekasPage() {
  const schemas = buildSchemas();

  return (
    <>
      {schemas.map((schema, idx) => (
        <script
          key={`gaming-schema-${idx}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <LpPageClient
        content={GAMING_LP_CONTENT}
        waMessage="Halo, saya mau jual laptop gaming bekas. Saya lampirkan foto, brand, GPU, dan spek."
      />
    </>
  );
}
