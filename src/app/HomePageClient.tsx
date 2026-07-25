"use client";

import type { HomepageData, LokasiData, TestimoniData } from "@/data/homepage-static";
import { SiteHeader } from "@/components/home/site-header";
import { HeroSection } from "@/components/home/hero-section";
import { TrustStatsSection } from "@/components/home/trust-stats-section";
import { BrandStatementSection } from "@/components/home/brand-statement-section";
import { WorkflowSection } from "@/components/home/workflow-section";
import { TokoSection } from "@/components/home/toko-section";
import { DevicesSection } from "@/components/home/devices-section";
import { FaqSection } from "@/components/home/faq-section";
import { TestimoniSection } from "@/components/home/testimoni-section";
import { ClosingCtaSection } from "@/components/home/closing-cta-section";
import { SiteFooter } from "@/components/home/site-footer";
import { WhatsappFab } from "@/components/home/whatsapp-fab";

/**
 * SAKA LAPTOP — HOMEPAGE CLIENT (refactored)
 *
 * Receives all content as props from server component.
 * No client-side fetch — no flicker, no stale content.
 *
 * Structure:
 *   1. Hero
 *   2. Trust Stats
 *   3. Brand Statement
 *   4. Workflow (5 stages)
 *   5. Toko & Aktivitas
 *   6. Perangkat yang Diterima
 *   7. FAQ
 *   8. Testimoni
 *   9. Closing CTA
 *
 * Each section is its own component under src/components/home/.
 * Animations use CSS classes (animate-fade-in-up etc.) — no framer-motion.
 */
export function HomePageClient({
  homepage,
  lokasi,
  logo,
  testimoni,
}: {
  homepage: HomepageData;
  lokasi: LokasiData;
  logo: string;
  testimoni: TestimoniData[];
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader lokasi={lokasi} logo={logo} />

      <main className="flex-1">
        <HeroSection homepage={homepage} lokasi={lokasi} />
        <TrustStatsSection trustStats={homepage.trustStats} />
        <BrandStatementSection homepage={homepage} />
        <WorkflowSection homepage={homepage} />
        <TokoSection homepage={homepage} />
        <DevicesSection homepage={homepage} />
        <FaqSection homepage={homepage} />
        <TestimoniSection testimoni={testimoni} />
        <ClosingCtaSection homepage={homepage} lokasi={lokasi} />
      </main>

      <SiteFooter lokasi={lokasi} logo={logo} />

      {/* Floating WhatsApp CTA — appears after hero */}
      <WhatsappFab lokasi={lokasi} />
    </div>
  );
}
