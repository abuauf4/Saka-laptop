"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  Calendar,
  Tag,
  ArrowLeft,
  Share2,
  MessageCircle,
  Copy,
  Check,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { StoreLogo } from "@/components/store-logo";
import { toast } from "sonner";

interface Article {
  id: string;
  slug: string;
  judul: string;
  konten: string;
  excerpt: string;
  gambar: string;
  kategori: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

const categoryColors: Record<string, string> = {
  "Tips & Review": "bg-sky-500/15 text-sky-400 border-sky-500/30",
  Berita: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Rekomendasi: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ArticlePageClient({
  article,
  relatedArticles,
  storeName,
}: {
  article: Article;
  relatedArticles: Article[];
  storeName: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Link berhasil disalin!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Gagal menyalin link");
    }
  };

  const handleShareWhatsApp = () => {
    const text = `Baca artikel: ${article.judul} — ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background page-animate">
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl shadow-soft-sm">
        <div className="page-container flex h-14 items-center justify-between">
          <Link href="/blog" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Blog</span>
          </Link>
          <div className="flex items-center gap-1">
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* ── ARTICLE CONTENT ── */}
      <main className="flex-1">
        <article className="page-container py-6 md:py-10">
          <div className="max-w-3xl mx-auto">
            {/* Category + Date */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3 mb-4"
            >
              <Badge
                variant="outline"
                className={`text-xs px-2 py-1 ${
                  categoryColors[article.kategori] || "bg-muted text-muted-foreground"
                }`}
              >
                <Tag className="h-3 w-3 mr-1" />
                {article.kategori}
              </Badge>
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(article.createdAt)}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-2xl md:text-4xl font-extrabold leading-tight tracking-tight"
            >
              {article.judul}
            </motion.h1>

            {/* Author */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="flex items-center gap-3 mt-4 mb-6"
            >
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center overflow-hidden">
                <StoreLogo className="h-10 w-10 rounded-full object-cover" alt={storeName} />
              </div>
              <div>
                <p className="text-sm font-semibold">{storeName}</p>
                <p className="text-xs text-muted-foreground">
                  Diperbarui {formatDate(article.updatedAt)}
                </p>
              </div>
            </motion.div>

            {/* Cover Image */}
            {article.gambar && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="relative overflow-hidden rounded-2xl border border-border/50 shadow-soft-md mb-8"
              >
                <img
                  src={article.gambar}
                  alt={article.judul}
                  className="w-full h-48 md:h-80 object-cover"
                />
              </motion.div>
            )}

            {/* Markdown Content */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="prose prose-lg max-w-none dark:prose-invert
                prose-headings:font-bold prose-headings:tracking-tight
                prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4
                prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
                prose-p:text-muted-foreground prose-p:leading-relaxed
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground
                prose-ul:my-4 prose-ol:my-4
                prose-li:text-muted-foreground
                prose-img:rounded-xl prose-img:border prose-img:border-border/50
                prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-xl prose-blockquote:py-2 prose-blockquote:px-4"
            >
              <ReactMarkdown>{article.konten}</ReactMarkdown>
            </motion.div>

            {/* Share Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.35 }}
              className="mt-10 pt-6 border-t border-border/50"
            >
              <p className="text-sm font-medium mb-3">Bagikan artikel ini</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-xl min-h-[44px]"
                  onClick={handleShareWhatsApp}
                >
                  <MessageCircle className="h-4 w-4 text-[#25D366]" />
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-xl min-h-[44px]"
                  onClick={handleCopyLink}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied ? "Tersalin!" : "Salin Link"}
                </Button>
              </div>
            </motion.div>
          </div>
        </article>

        {/* ── RELATED ARTICLES ── */}
        {relatedArticles.length > 0 && (
          <section className="page-container py-8 border-t border-border/50">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-lg font-bold mb-5">Artikel Terkait</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedArticles.map((related, i) => (
                  <motion.div
                    key={related.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.3 }}
                  >
                    <Link href={`/blog/${related.slug}`}>
                      <Card className="card-interactive overflow-hidden h-full">
                        {related.gambar && (
                          <div className="w-full h-32 overflow-hidden">
                            <img
                              src={related.gambar}
                              alt={related.judul}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <CardContent className="p-3">
                          <Badge
                            variant="outline"
                            className={`text-[10px] px-1.5 py-0 mb-2 ${
                              categoryColors[related.kategori] || "bg-muted text-muted-foreground"
                            }`}
                          >
                            {related.kategori}
                          </Badge>
                          <h3 className="text-sm font-semibold leading-snug line-clamp-2">
                            {related.judul}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1.5">
                            {formatDate(related.createdAt)}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border/50 bg-card/50 mt-auto">
        <div className="page-container py-6">
          <p className="text-xs text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} Nauka Creative Digital. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
