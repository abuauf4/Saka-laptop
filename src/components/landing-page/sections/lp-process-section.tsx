"use client";

// ─── Jakarta Laptops — LP Section: Process Steps ───
// Style 100% konsisten dengan src/components/home/workflow-section.tsx
// Adaptasi: 4 steps dengan duration badge (bukan 5 stages).

import type { LandingPageData } from "@/lib/landing-page-data";

export function LpProcessSection({
  content,
}: {
  content: LandingPageData;
}) {
  const steps = content.processSteps;

  return (
    <section id="proses" className="border-b border-border">
      <div className="page-container py-20 md:py-28">
        <div className="max-w-2xl mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">
            Alur Kerja
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Proses Jual Laptop
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {steps.length} langkah simpel, selesai cepat. Tidak ada yang
            disembunyikan.
          </p>
        </div>

        <div className="max-w-3xl">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-6 md:gap-8 group">
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-primary text-primary font-bold text-sm bg-background group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {step.step}
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px flex-1 bg-border my-2 min-h-[40px]" />
                )}
              </div>

              <div className="flex-1 pb-12">
                <div className="flex items-center gap-3 mb-1.5">
                  <h3 className="text-lg md:text-xl font-semibold text-foreground">
                    {step.headline}
                  </h3>
                  <span className="inline-block bg-secondary text-primary text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {step.duration}
                  </span>
                </div>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl">
                  {step.subCopy}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
