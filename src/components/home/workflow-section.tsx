import type { HomepageData } from "@/data/homepage-static";

export function WorkflowSection({
  homepage,
}: {
  homepage: HomepageData;
}) {
  const stages = homepage.workflowStages;

  return (
    <section id="proses" className="border-b border-border">
      <div className="page-container py-20 md:py-28">
        <div className="max-w-2xl mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">
            Alur Kerja
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Proses Kami
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Dari pengajuan sampai deal, lima langkah. Tidak ada yang
            disembunyikan.
          </p>
        </div>

        <div className="max-w-3xl">
          {stages.map((stage, i) => (
            <div key={stage.n} className="flex gap-6 md:gap-8 group">
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-primary text-primary font-bold text-sm bg-background group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {stage.n}
                </div>
                {i < stages.length - 1 && (
                  <div className="w-px flex-1 bg-border my-2 min-h-[40px]" />
                )}
              </div>

              <div className="flex-1 pb-12">
                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-1.5">
                  {stage.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl">
                  {stage.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
