"use client";

// ─── Jakarta Laptops — Landing Page Wrapper ───
// Compose semua section LP dengan style 100% konsisten dengan homepage.
// Reuse: SiteHeader, SiteFooter, WhatsappFab dari src/components/home/
// Custom: LP sections di src/components/landing-page/sections/ (style identik home/, accept LandingPageData)
//
// Tujuan: User yang buka LP anak gak kerasa kayak pindah website.
// Header, footer, font, color, spacing — semua sama dengan homepage.

import type { LandingPageData } from "@/lib/landing-page-data";
import type { LokasiData } from "@/lib/homepage-data";
import { useLokasi } from "@/lib/lokasi-store";
import { SiteHeader } from "@/components/home/site-header";
import { SiteFooter } from "@/components/home/site-footer";
import { WhatsappFab } from "@/components/home/whatsapp-fab";
import { LpHeroSection } from "./sections/lp-hero-section";
import { LpTrustStatsSection } from "./sections/lp-trust-stats-section";
import { LpProcessSection } from "./sections/lp-process-section";
import { LpFaqSection } from "./sections/lp-faq-section";
import { LpClosingCtaSection } from "./sections/lp-closing-cta-section";

interface LpPageClientProps {
  content: LandingPageData;
  /** Custom WA pre-fill message (per-LP context) */
  waMessage?: string;
}

export function LpPageClient({ content, waMessage }: LpPageClientProps) {
  const { lokasi } = useLokasi();

  // Convert LokasiToko (from store) → LokasiData (expected by home/ components)
  // Shape kompatibel, just type assertion.
  const lokasiData: LokasiData = {
    namaToko: lokasi.namaToko,
    tagline: lokasi.tagline,
    foto: lokasi.foto,
    alamat: lokasi.alamat,
    telepon: lokasi.telepon,
    whatsapp: lokasi.whatsapp,
    jamWeekday: lokasi.jamWeekday,
    jamWeekend: lokasi.jamWeekend,
    mapsLink: lokasi.mapsLink,
    lat: lokasi.lat,
    lng: lokasi.lng,
  };

  // Logo fallback — pakai lokasi.foto atau "/logo.png"
  const logo = lokasi.foto || "/logo.png";

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader lokasi={lokasiData} logo={logo} />

      <main className="flex-1">
        <LpHeroSection
          content={content}
          lokasi={lokasiData}
          waMessage={waMessage}
        />
        <LpTrustStatsSection content={content} />
        <LpProcessSection content={content} />
        <LpFaqSection content={content} />
        <LpClosingCtaSection
          content={content}
          lokasi={lokasiData}
          waMessage={waMessage}
        />
      </main>

      <SiteFooter lokasi={lokasiData} logo={logo} />

      {/* Floating WhatsApp CTA — same dengan homepage */}
      <WhatsappFab lokasi={lokasiData} />
    </div>
  );
}
