"use client";

// ─── Jakarta Laptops — LP Section: Closing CTA ───
// Style 100% konsisten dengan src/components/home/closing-cta-section.tsx

import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowRight } from "lucide-react";
import type { LandingPageData } from "@/lib/landing-page-data";
import type { LokasiData } from "@/lib/homepage-data";

interface LpClosingCtaSectionProps {
  content: LandingPageData;
  lokasi: LokasiData;
  waMessage?: string;
}

export function LpClosingCtaSection({
  content,
  lokasi,
  waMessage,
}: LpClosingCtaSectionProps) {
  const waNumber = lokasi.whatsapp ? lokasi.whatsapp.replace(/^0/, "62") : "";
  const message = encodeURIComponent(
    waMessage || "Halo, saya mau jual laptop bekas. Saya lampirkan foto dan spek."
  );
  const waLink = waNumber
    ? `https://wa.me/${waNumber}?text=${message}&utm_source=lp_jual_laptop_bekas&utm_medium=organic&utm_campaign=supply_acquisition`
    : "#";

  return (
    <section className="bg-[#000000] text-white">
      <div className="page-container py-20 md:py-32 text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight max-w-3xl mx-auto leading-tight">
          {content.finalCtaTitle}
        </h2>
        <p className="mt-6 text-white/70 max-w-xl mx-auto text-base">
          {content.finalCtaSubtitle}
        </p>
        <div className="mt-10 flex justify-center">
          <a href={waLink} target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              className="min-h-[52px] px-8 gap-2 text-base font-semibold bg-white text-black hover:bg-white/90"
            >
              <MessageCircle className="h-4 w-4" />
              {content.finalCtaPrimary}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
