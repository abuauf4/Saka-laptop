import { Monitor, Laptop, Tablet, Server, HardDrive, Tv, Building2 } from "lucide-react";
import type { HomepageData } from "@/data/homepage-static";

const DEVICE_ICONS: Record<string, React.ElementType> = {
  "Laptop Kantor": Laptop,
  "Laptop Gaming": Laptop,
  MacBook: Laptop,
  Workstation: Server,
  Komputer: Monitor,
  Monitor: Monitor,
  "Aset IT Kantor": Building2,
};

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
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Kami terima berbagai jenis perangkat — laptop, komputer, monitor, sampai aset IT kantor.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {homepage.deviceCategories.map((cat) => {
            const Icon = DEVICE_ICONS[cat.label] || Monitor;
            return (
              <div
                key={cat.label}
                className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/40 px-4 py-3.5 transition-colors hover:bg-card/70 hover:border-border"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/60 text-muted-foreground">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {cat.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
