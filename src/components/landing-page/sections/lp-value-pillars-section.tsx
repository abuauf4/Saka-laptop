"use client";

// ─── Jakarta Laptops — LP Section: Value Pillars ───
// Style 100% konsisten dengan src/components/home/brand-statement-section.tsx
// Adaptasi: 5 pillars (bukan 3 brand points).

import type { LandingPageData } from "@/lib/landing-page-data";
import { resolveIcon } from "@/components/home/shared";

export function LpValuePillarsSection({
  content,
}: {
  content: LandingPageData;
}) {
  return (
    <section className="border-b border-border bg-card/50">
      <div className="page-container py-20 md:py-28">
        <div className="max-w-3xl mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">
            Kenapa Pilih Kami
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Kenapa Jual ke Jakarta Laptops?
          </h2>
          <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
            Alasan kenapa supplier memilih kami daripada kompetitor.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-6">
          {content.valuePillars.map((pillar, i) => {
            const Icon = resolveIcon(pillar.icon);
            return (
              <div key={i}>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">
                  {pillar.headline}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {pillar.subCopy}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
