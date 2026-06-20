import type { HomepageData } from "@/lib/homepage-data";

export function DevicesSection({ homepage }: { homepage: HomepageData }) {
  return (
    <section className="border-b border-border">
      <div className="page-container py-20 md:py-28">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">
            Yang Diterima
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Perangkat yang Diterima
          </h2>
        </div>

        <div className="flex flex-wrap gap-3">
          {homepage.deviceCategories.map((cat) => (
            <div
              key={cat.label}
              className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-5 py-2.5"
            >
              <span className="text-lg">{cat.emoji}</span>
              <span className="text-sm font-medium text-foreground">
                {cat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
