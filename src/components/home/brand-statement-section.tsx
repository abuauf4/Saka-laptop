import type { HomepageData } from "@/lib/homepage-data";
import { resolveIcon } from "./shared";

export function BrandStatementSection({
  homepage,
}: {
  homepage: HomepageData;
}) {
  return (
    <section className="border-b border-border bg-card/50">
      <div className="page-container py-20 md:py-28">
        <div className="max-w-3xl mb-14">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {homepage.brandTitle}
          </h2>
          <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
            {homepage.brandCopy}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {homepage.brandPoints.map((point) => {
            const Icon = resolveIcon(point.icon);
            return (
              <div key={point.title}>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {point.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {point.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
