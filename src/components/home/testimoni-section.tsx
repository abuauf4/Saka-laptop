import type { TestimoniData } from "@/data/homepage-static";

export function TestimoniSection({
  testimoni,
}: {
  testimoni: TestimoniData[];
}) {
  if (testimoni.length === 0) return null;

  return (
    <section id="testimoni" className="border-b border-border">
      <div className="page-container py-20 md:py-28 max-w-5xl">
        <div className="max-w-2xl mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">
            Testimoni
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Apa Kata Customer Kami
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimoni.slice(0, 6).map((t) => (
            <div
              key={t.id}
              className="p-5 rounded-xl border border-border/50 bg-card/40"
            >
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <span
                    key={idx}
                    className={`text-sm ${
                      idx < t.rating
                        ? "text-amber-500"
                        : "text-muted-foreground/30"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-4">
                "{t.teks}"
              </p>
              <div className="flex items-center gap-3">
                {t.avatar ? (
                  <img
                    src={t.avatar}
                    alt={t.nama}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary">
                    {t.nama.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold">{t.nama}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.role}
                    {t.laptop ? ` • ${t.laptop}` : ""}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
