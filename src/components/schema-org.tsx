"use client";

import { useEffect, useState } from "react";
import { useLokasi } from "@/lib/lokasi-store";
import { usePathname } from "next/navigation";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://saka-laptop.vercel.app";

/**
 * Schema.org Structured Data (JSON-LD) component.
 * Outputs LocalBusiness, WebSite, and (on product pages) Product schemas.
 * Added to root layout so it appears on every page.
 */
export function SchemaOrg() {
  const { lokasi, isLoaded } = useLokasi();
  const pathname = usePathname();
  const [products, setProducts] = useState<
    { nama: string; harga: number; kategori: string; image: string }[]
  >([]);

  // Fetch products for Product schema on /produk page
  useEffect(() => {
    if (pathname === "/produk" || pathname === "/") {
      fetch("/api/products")
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setProducts(data.slice(0, 10));
          }
        })
        .catch(() => {});
    }
  }, [pathname]);

  // WebSite schema — always present
  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: lokasi.namaToko || "Saka Laptop",
    url: siteUrl,
    description:
      "Toko laptop terpercaya yang menyediakan laptop gaming, ultrabook, laptop kerja, dan laptop sekolah berkualitas.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/produk?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  // LocalBusiness schema — uses Lokasi data
  const localBusinessSchema = isLoaded
    ? {
        "@context": "https://schema.org",
        "@type": "ElectronicsStore",
        name: lokasi.namaToko || "Saka Laptop",
        description: `${lokasi.namaToko} adalah toko laptop terpercaya di ${lokasi.alamat || "Jakarta Selatan"} yang menyediakan laptop gaming, ultrabook, laptop kerja, dan laptop sekolah berkualitas dengan harga terbaik.`,
        url: siteUrl,
        image: lokasi.foto?.startsWith("http")
          ? lokasi.foto
          : `${siteUrl}${lokasi.foto || "/store-front.png"}`,
        telephone: lokasi.telepon || "",
        address: {
          "@type": "PostalAddress",
          streetAddress: lokasi.alamat || "Jl. Raya Kebayoran Lama No. 12",
          addressLocality: "Jakarta Selatan",
          addressRegion: "DKI Jakarta",
          postalCode: "12210",
          addressCountry: "ID",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: lokasi.lat || -6.2445,
          longitude: lokasi.lng || 106.7813,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
            opens: "09:00",
            closes: "21:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Sunday",
            opens: "10:00",
            closes: "18:00",
          },
        ],
        priceRange: "Rp 3.000.000 - Rp 30.000.000",
        sameAs: [],
      }
    : null;

  // Product schemas — on /produk page
  const productSchemas =
    products.length > 0
      ? products.map((p) => ({
          "@context": "https://schema.org",
          "@type": "Product",
          name: p.nama,
          description: `Laptop ${p.kategori} — ${p.nama} tersedia di ${lokasi.namaToko || "Saka Laptop"}`,
          image: p.image?.startsWith("http")
            ? p.image
            : p.image
              ? `${siteUrl}${p.image}`
              : undefined,
          brand: {
            "@type": "Brand",
            name: p.nama.split(" ")[0] || "Laptop",
          },
          offers: {
            "@type": "Offer",
            price: p.harga,
            priceCurrency: "IDR",
            availability: "https://schema.org/InStock",
            seller: {
              "@type": "Organization",
              name: lokasi.namaToko || "Saka Laptop",
            },
          },
        }))
      : [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webSiteSchema),
        }}
      />
      {localBusinessSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
      )}
      {productSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
    </>
  );
}
