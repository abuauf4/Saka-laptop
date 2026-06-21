"use client";

// ─── Jakarta Laptops — LP Section: Trust Stats ───
// Style 100% konsisten dengan src/components/home/trust-stats-section.tsx

import type { LandingPageData } from "@/lib/landing-page-data";

export function LpTrustStatsSection({
  content,
}: {
  content: LandingPageData;
}) {
  return (
    <section className="border-b border-border bg-background">
      <div className="page-container py-12 md:py-16">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            {content.trustTitle}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {content.trustSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
          {content.trustStats.map((item, i) => (
            <div key={i} className="text-center md:text-left">
              <p className="text-5xl md:text-6xl font-bold tracking-tight text-foreground">
                {item.stat}
              </p>
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary mt-2">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
