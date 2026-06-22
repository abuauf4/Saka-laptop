"use client";

// ─── Jakarta Laptops — Landing Page Section: Hero ───
// Style 100% konsisten dengan src/components/home/hero-section.tsx
// Accept LandingPageData props (bukan HomepageData).

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import type { LandingPageData } from "@/lib/landing-page-data";
import type { LokasiData } from "@/lib/homepage-data";
import { buildWaLink } from "@/components/home/shared";

interface LpHeroSectionProps {
  content: LandingPageData;
  lokasi: LokasiData;
  /** Custom WA pre-fill message */
  waMessage?: string;
}

export function LpHeroSection({ content, lokasi, waMessage }: LpHeroSectionProps) {
  // Build WA link with custom message (per-LP context)
  const waNumber = lokasi.whatsapp ? lokasi.whatsapp.replace(/^0/, "62") : "";
  const message = encodeURIComponent(
    waMessage || "Halo, saya mau jual laptop bekas. Saya lampirkan foto dan spek."
  );
  const waLink = waNumber
    ? `https://wa.me/${waNumber}?text=${message}&utm_source=lp_jual_laptop_bekas&utm_medium=organic&utm_campaign=supply_acquisition`
    : "#";

  return (
    <section className="relative min-h-[85vh] flex items-end overflow-hidden border-b border-border">
      {/* Background image — pakai hero image lokal (same untuk semua LP, brand consistency) */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-laptop-inspeksi.webp"
          alt="Teknisi Jakarta Laptops sedang inspeksi laptop bekas"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
      </div>

      <div className="relative z-10 page-container w-full pb-20 md:pb-28 pt-32">
        <div className="max-w-2xl animate-fade-in-up">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-4 py-1.5 mb-7">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-xs font-medium text-white/90 tracking-wide">
              {content.heroEyebrow}
            </span>
          </div>

          {/* H1 */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05] text-white">
            {content.heroTitle}
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base md:text-lg text-white/85 leading-relaxed max-w-xl">
            {content.heroSubtitle}
          </p>

          {/* CTAs — both WA direct per business brief */}
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <a href={waLink} target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto min-h-[54px] px-8 gap-2 text-base font-semibold rounded-xl border-white/60 text-white bg-white/5 hover:bg-white/15 hover:text-white hover:border-white"
              >
                <MessageCircle className="h-4 w-4" />
                {content.heroPrimaryCta}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <a href={waLink} target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto min-h-[54px] px-8 text-base font-semibold rounded-xl bg-white/10 backdrop-blur-md border-white/40 text-white hover:bg-white/20 hover:text-white"
              >
                {content.heroSecondaryCta}
              </Button>
            </a>
          </div>

          {/* Trust micro-badges */}
          {content.heroTrustBadges.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
              {content.heroTrustBadges.map((badge, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1.5 text-sm text-white/80"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  {badge.text}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
