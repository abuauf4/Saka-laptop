import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ProductProvider } from "@/lib/product-store";
import { TransactionProvider } from "@/lib/transaction-store";
import { TestimoniProvider } from "@/lib/testimoni-store";
import { ThemeProvider } from "@/lib/theme-store";
import { LokasiProvider } from "@/lib/lokasi-store";
import { ThemeAwareToaster } from "@/components/theme-aware-toaster";
import { SchemaOrg } from "@/components/schema-org";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://saka-laptop.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Saka Laptop — Toko Laptop Terpercaya",
    template: "%s — Saka Laptop",
  },
  description:
    "Saka Laptop adalah toko laptop terpercaya di Jakarta Selatan yang menyediakan laptop gaming, ultrabook, laptop kerja, dan laptop sekolah berkualitas dengan harga terbaik. Dilengkapi AI Finder untuk rekomendasi laptop yang tepat.",
  keywords: [
    "toko laptop",
    "laptop bekas berkualitas",
    "laptop gaming",
    "ultrabook",
    "laptop kerja",
    "laptop sekolah",
    "rekomendasi laptop",
    "laptop Jakarta Selatan",
    "Saka Laptop",
    "laptop murah",
    "laptop second",
  ],
  authors: [{ name: "Saka Creative Digital" }],
  creator: "Saka Creative Digital",
  publisher: "Saka Laptop",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: "Saka Laptop",
    title: "Saka Laptop — Toko Laptop Terpercaya",
    description:
      "Toko laptop terpercaya di Jakarta Selatan. Laptop gaming, ultrabook, kerja & sekolah berkualitas dengan AI Finder.",
    images: [
      {
        url: "/store-front.png",
        width: 1200,
        height: 630,
        alt: "Saka Laptop — Toko Laptop Terpercaya",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saka Laptop — Toko Laptop Terpercaya",
    description:
      "Toko laptop terpercaya di Jakarta Selatan. Laptop gaming, ultrabook, kerja & sekolah berkualitas.",
    images: ["/store-front.png"],
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          <LokasiProvider>
            <ProductProvider>
              <TransactionProvider>
                <TestimoniProvider>
                  <SchemaOrg />
                  {children}
                  <ThemeAwareToaster />
                </TestimoniProvider>
              </TransactionProvider>
            </ProductProvider>
          </LokasiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
