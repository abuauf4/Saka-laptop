"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, FileText, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  createdAt: string;
  categoryName: string;
}

export function ArtikelClient({
  articles,
  categories,
  siteName,
}: {
  articles: ArticleItem[];
  categories: { id: string; name: string; slug: string }[];
  siteName: string;
}) {
  const [activeCat, setActiveCat] = useState<string>("all");

  const filtered = useMemo(() => {
    if (activeCat === "all") return articles;
    return articles.filter((a) => a.categoryName === activeCat);
  }, [articles, activeCat]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="page-container flex h-16 items-center justify-between">
          <a href="/" className="text-base font-semibold tracking-tight">{siteName}</a>
          <Button asChild size="sm" variant="ghost">
            <a href="/">← Beranda</a>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border">
          <div className="page-container py-12 md:py-16 max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Blog & Tips</p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Artikel & Tips</h1>
            <p className="mt-4 text-muted-foreground">
              Tips jual laptop bekas, review, dan berita seputar laptop.
            </p>
          </div>
        </section>

        {/* Category filter */}
        {categories.length > 0 && (
          <div className="border-b border-border bg-card/30">
            <div className="page-container py-4 flex gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveCat("all")}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  activeCat === "all" ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                Semua
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(cat.name)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    activeCat === cat.name ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Articles grid */}
        <section className="page-container py-12">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">Belum ada artikel.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((article, i) => (
                <div
                  key={article.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
                >
                  <Link href={`/artikel/${article.slug}`}>
                    <article className="rounded-xl border border-border/50 overflow-hidden hover:border-primary/30 hover:shadow-soft-sm transition-all cursor-pointer group">
                      {article.coverImage && (
                        <div className="aspect-[16/9] overflow-hidden bg-muted">
                          <img
                            src={article.coverImage}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-5">
                        {article.categoryName && (
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                            {article.categoryName}
                          </span>
                        )}
                        <h2 className="text-base font-semibold mt-1.5 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {article.title}
                        </h2>
                        <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
                        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground" suppressHydrationWarning>
                          <Calendar className="h-3 w-3" />
                          <span suppressHydrationWarning>
                            {new Date(article.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-border bg-card/30 py-6">
        <div className="page-container text-center">
          <p className="text-xs text-muted-foreground">© 2026 Nauka Motion. Laptop Lamamu Masih Bernilai.</p>
        </div>
      </footer>
    </div>
  );
}
