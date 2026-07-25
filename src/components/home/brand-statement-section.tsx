import type { HomepageData } from "@/data/homepage-static";
import { resolveIcon } from "./shared";

export function BrandStatementSection({
  homepage,
}: {
  homepage: HomepageData;
}) {
  const points = homepage.brandPoints;
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

        <div className="flex flex-col divide-y divide-border">
          {points.map((point) => {
            const Icon = resolveIcon(point.icon);
            return (
              <div key={point.title} className="flex items-start gap-5 py-8 first:pt-0 last:pb-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1.5">
                    {point.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {point.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
