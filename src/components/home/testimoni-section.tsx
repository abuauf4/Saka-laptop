import type { TestimoniData } from "@/data/homepage-static";
import { Quote } from "lucide-react";

export function TestimoniSection({
  testimoni,
}: {
  testimoni: TestimoniData[];
}) {
  if (testimoni.length === 0) return null;

  return (
    <section id="testimoni" className="border-b border-border bg-card/30">
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
              className="group relative flex flex-col rounded-xl border border-border/50 bg-background p-6 transition-colors hover:bg-card/80 hover:border-border"
            >
              {/* Quote icon */ }
              <Quote className="h-6 w-6 text-primary/20 mb-3" />

              {/* Stars */ }
              <div className="flex items-center gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <svg
                    key={idx}
                    className={`h-3.5 w-3.5 ${
                      idx < t.rating
                        ? "text-amber-400"
                        : "text-muted-foreground/20"
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                  </svg>
                ))}
              </div>

              {/* Quote text */ }
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-4 flex-1">
                &ldquo;{t.teks}&rdquo;
              </p>

              {/* Author */ }
              <div className="flex items-center gap-3 pt-4 border-t border-border/40">
                {t.avatar ? (
                  <img
                    src={t.avatar}
                    alt={t.nama}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-background"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary ring-2 ring-background">
                    {t.nama.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {t.nama}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {t.role}
                    {t.laptop ? ` &middot; ${t.laptop}` : ""}
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
