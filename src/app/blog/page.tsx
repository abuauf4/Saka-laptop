"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Calendar,
  Tag,
  Laptop,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SkeletonCard } from "@/components/ui/skeleton";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { StoreLogo } from "@/components/store-logo";
import { StoreName } from "@/components/store-name";

interface Article {
  id: string;
  slug: string;
  judul: string;
  excerpt: string;
  gambar: string;
  kategori: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

const categories = ["Semua", "Tips & Review", "Berita", "Rekomendasi"];

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

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("Semua");

  useEffect(() => {
    async function fetchArticles() {
      try {
        const params = new URLSearchParams();
        if (kategori !== "Semua") params.set("kategori", kategori);
        if (search) params.set("search", search);

        const res = await fetch(`/api/articles?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setArticles(data);
        }
      } catch (err) {
        console.error("Failed to fetch articles:", err);
      } finally {
        setIsLoaded(true);
      }
    }
    fetchArticles();
  }, [kategori, search]);

  return (
    <div className="min-h-screen flex flex-col bg-background page-animate">
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl shadow-soft-sm">
        <div className="page-container py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="/" className="flex items-center gap-2">
                <StoreLogo className="h-8 w-8 rounded-xl object-cover" />
                <h1 className="text-lg font-bold">Blog</h1>
              </a>
              <nav className="hidden md:flex items-center gap-1 ml-4">
                <a href="/" className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-lg transition-colors">Home</a>
                <a href="/finder" className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-lg transition-colors">AI Finder</a>
                <a href="/produk" className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-lg transition-colors">Katalog</a>
                <a href="/tentang" className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-lg transition-colors">Tentang</a>
              </nav>
            </div>
            <ThemeSwitcher />
          </div>

          {/* Search */}
          <div className="mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari artikel..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-12 bg-card border-border/50 text-base rounded-xl"
              />
            </div>
          </div>
        </div>
      </header>

      {/* ── CATEGORY CHIPS ── */}
      <div className="border-b border-border/50">
        <div className="page-container py-3 flex gap-2 overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={kategori === cat ? "default" : "outline"}
              size="sm"
              className="text-sm rounded-full whitespace-nowrap min-h-[44px] px-5"
              onClick={() => setKategori(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* ── ARTICLE LIST ── */}
      <div className="page-container py-5 flex-1 pb-24 md:pb-8">
        {!isLoaded ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-muted-foreground">Belum ada artikel</p>
            <p className="text-sm text-muted-foreground mt-1">
              Artikel terbaru seputar tips laptop dan review akan segera hadir.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {articles.length} artikel ditemukan
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
              <AnimatePresence mode="popLayout">
                {articles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.03, duration: 0.25 }}
                  >
                    <Link href={`/blog/${article.slug}`}>
                      <Card className="card-interactive overflow-hidden h-full">
                        {/* Cover Image */}
                        <div className="relative flex items-center justify-center bg-muted/10 overflow-hidden" style={{ minHeight: article.gambar ? "180px" : undefined }}>
                          {article.gambar ? (
                            <img
                              src={article.gambar}
                              alt={article.judul}
                              className="w-full h-48 object-cover"
                            />
                          ) : (
                            <div className="py-6">
                              <BookOpen className="h-14 w-14 text-muted-foreground/20" />
                            </div>
                          )}
                          <Badge
                            variant="outline"
                            className={`absolute top-3 left-3 text-xs px-1.5 py-0.5 ${
                              categoryColors[article.kategori] || "bg-muted text-muted-foreground"
                            }`}
                          >
                            {article.kategori}
                          </Badge>
                        </div>

                        {/* Content */}
                        <CardContent className="p-4 space-y-2">
                          <h3 className="font-bold text-base leading-snug line-clamp-2">
                            {article.judul}
                          </h3>
                          {article.excerpt && (
                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                              {article.excerpt}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{formatDate(article.createdAt)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border/50 bg-card/50 mt-auto">
        <div className="page-container py-6">
          <p className="text-xs text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} Saka Creative Digital. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
