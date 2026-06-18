import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/lib/theme-store";
import { LokasiProvider } from "@/lib/lokasi-store";
import { SubmissionProvider } from "@/lib/submission-store";
import { ThemeAwareToaster } from "@/components/theme-aware-toaster";
import { SchemaOrg } from "@/components/schema-org";
import { TrackingScripts } from "@/components/tracking-scripts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jakartalaptops.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Jakarta Laptops — Pusat Inspeksi & Trade-in Laptop Bekas",
    template: "%s — Jakarta Laptops",
  },
  description:
    "Kirim data laptop bekas kamu. Tim kami akan melakukan pengecekan, QC, dan memberikan penawaran harga yang transparan. Pusat inspeksi & trade-in laptop terpercaya.",
  keywords: [
    "terima laptop bekas",
    "trade in laptop",
    "inspeksi laptop",
    "QC laptop bekas",
    "jual laptop bekas",
    "tukar tambah laptop",
    "pusat trade-in laptop",
    "penawaran laptop bekas",
    "laptop bekas Jakarta",
    "Jakarta Laptops",
    "pengecekan laptop",
  ],
  authors: [{ name: "Nauka Creative Digital" }],
  creator: "Nauka Creative Digital",
  publisher: "Jakarta Laptops",
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
    siteName: "Jakarta Laptops",
    title: "Jakarta Laptops — Pusat Inspeksi & Trade-in Laptop Bekas",
    description:
      "Kirim data laptop bekas kamu. Tim kami melakukan QC & memberikan penawaran transparan.",
    images: [
      {
        url: "/store-front.png",
        width: 1200,
        height: 630,
        alt: "Jakarta Laptops — Pusat Inspeksi & Trade-in Laptop Bekas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jakarta Laptops — Pusat Inspeksi & Trade-in Laptop Bekas",
    description:
      "Kirim data laptop bekas. QC transparan, penawaran jelas, proses cepat.",
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
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          <LokasiProvider>
            <SubmissionProvider>
              <SchemaOrg />
              <TrackingScripts />
              {children}
              <ThemeAwareToaster />
            </SubmissionProvider>
          </LokasiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
