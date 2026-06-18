"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/format";

export function ArticleDetailClient({
  article,
  related,
  siteName,
}: {
  article: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    createdAt: string;
    categoryName: string;
    metaTitle: string;
    metaDesc: string;
  };
  related: { title: string; slug: string; excerpt: string; coverImage: string; createdAt: string }[];
  siteName: string;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="page-container flex h-16 items-center justify-between">
          <a href="/" className="text-base font-semibold tracking-tight">{siteName}</a>
          <Button asChild size="sm" variant="ghost">
            <a href="/artikel">← Semua Artikel</a>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border">
          <div className="page-container py-12 md:py-16 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {article.categoryName && (
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3 block">
                  {article.categoryName}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                {article.title}
              </h1>
              {article.excerpt && (
                <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                  {article.excerpt}
                </p>
              )}
              <div className="flex items-center gap-2 mt-6 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                {formatDateTime(article.createdAt)}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Cover image */}
        {article.coverImage && (
          <section className="border-b border-border">
            <div className="page-container max-w-4xl py-0">
              <div className="aspect-[16/9] overflow-hidden rounded-xl">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </section>
        )}

        {/* Content */}
        <section className="page-container py-12 max-w-3xl">
          {article.content ? (
            <div
              className="prose prose-sm md:prose-base max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : (
            <p className="text-muted-foreground">Konten belum tersedia.</p>
          )}
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="border-t border-border bg-card/30">
            <div className="page-container py-12">
              <h2 className="text-xl font-bold mb-6">Artikel Lainnya</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {related.map((r, i) => (
                  <Link key={i} href={`/artikel/${r.slug}`}>
                    <article className="rounded-xl border border-border/50 overflow-hidden hover:border-primary/30 transition-all cursor-pointer group">
                      {r.coverImage && (
                        <div className="aspect-[16/9] overflow-hidden bg-muted">
                          <img src={r.coverImage} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">{r.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{r.excerpt}</p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-border bg-card/30 py-6">
        <div className="page-container text-center">
          <p className="text-xs text-muted-foreground">© 2026 Nauka Motion. Small movement, Real impact.</p>
        </div>
      </footer>
    </div>
  );
}
