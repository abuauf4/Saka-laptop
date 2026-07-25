// ─── Jakarta Laptops — /tukar-tambah-laptop (Server Component) ───
// LP anak untuk keyword "tukar tambah laptop jakarta".

import type { Metadata } from "next";
import { TUKAR_TAMBAH_LP_CONTENT, LP_UTM_SOURCES } from "@/lib/lp-children-content";
import { LpPageClient } from "@/components/landing-page/LpPageClient";

// Static cache — content hanya berubah via admin (revalidatePath on-demand).
export const revalidate = false;

export const metadata: Metadata = {
  title: TUKAR_TAMBAH_LP_CONTENT.metaTitle,
  description: TUKAR_TAMBAH_LP_CONTENT.metaDescription,
  keywords: [
    "tukar tambah laptop jakarta",
    "tukar tambah laptop bekas",
    "trade in laptop jakarta",
    "tukar laptop lama ke baru",
    "tukar tambah macbook jakarta",
    "tukar tambah thinkpad jakarta",
    "toko tukar tambah laptop jakarta",
    "tempat tukar tambah laptop jakarta",
    "cara tukar tambah laptop",
    "estimasi tukar tambah laptop",
  ],
  alternates: { canonical: "/tukar-tambah-laptop" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/tukar-tambah-laptop",
    siteName: "Jakarta Laptops",
    title: TUKAR_TAMBAH_LP_CONTENT.ogTitle,
    description: TUKAR_TAMBAH_LP_CONTENT.ogDescription,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Tukar Tambah Laptop Jakarta — Jakarta Laptops" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TUKAR_TAMBAH_LP_CONTENT.ogTitle,
    description: TUKAR_TAMBAH_LP_CONTENT.ogDescription,
    images: ["/og-image.png"],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

function buildSchemas() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jakartalaptops.com";
  const slug = "/tukar-tambah-laptop";
  const fullUrl = `${siteUrl}${slug}`;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Laptop Trade-In Service",
    name: "Jakarta Laptops Laptop Trade-In Service",
    description:
      "Layanan tukar tambah laptop di Jakarta. Estimasi harga laptop lama cepat, pilih laptop baru dari inventory 50+ unit, selisih fleksibel.",
    url: fullUrl,
    areaServed: { "@type": "City", name: "Jakarta" },
    provider: { "@type": "LocalBusiness", name: "Jakarta Laptops", url: siteUrl },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: TUKAR_TAMBAH_LP_CONTENT.faqs.map((faq) => ({
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
      { "@type": "ListItem", position: 2, name: "Tukar Tambah Laptop", item: fullUrl },
    ],
  };

  return [serviceSchema, faqSchema, breadcrumbSchema];
}

export default function TukarTambahLaptopPage() {
  const schemas = buildSchemas();

  return (
    <>
      {schemas.map((schema, idx) => (
        <script
          key={`tukar-schema-${idx}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <LpPageClient
        content={TUKAR_TAMBAH_LP_CONTENT}
        waMessage="Halo, saya mau tukar tambah laptop. Saya lampirkan foto laptop lama + spek, dan saya cari laptop baru."
      />
    </>
  );
}
