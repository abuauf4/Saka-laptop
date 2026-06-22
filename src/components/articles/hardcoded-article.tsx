"use client";

// ─── Jakarta Laptops — Hardcoded Article Wrapper ───
// Style 100% konsisten dengan homepage (SiteHeader + SiteFooter + WhatsappFab).
// Article content di-pass sebagai props (hardcoded, bukan dari CMS).
//
// Dipakai oleh artikel SEO yang dibikin hardcoded (bukan via /admin/articles):
//   - /jual-laptop-bekas
//   - /laptop-jakarta
//   - /laptop-binus
//   - /jual-laptop

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowRight, ArrowLeft } from "lucide-react";
import type { LokasiData } from "@/lib/homepage-data";
import { useLokasi } from "@/lib/lokasi-store";
import { SiteHeader } from "@/components/home/site-header";
import { SiteFooter } from "@/components/home/site-footer";
import { WhatsappFab } from "@/components/home/whatsapp-fab";
import { buildWaLink } from "@/components/home/shared";

export interface HardcodedArticleContent {
  /** Article category (e.g. "Panduan", "Tips") */
  category: string;
  /** Article title (H1) */
  title: string;
  /** Excerpt / subtitle di bawah H1 */
  excerpt: string;
  /** Article body — HTML string (dari markdown atau hardcoded) */
  content: string;
  /** Related articles (untuk footer artikel) */
  related?: {
    title: string;
    href: string;
    excerpt: string;
  }[];
  /** Custom WA pre-fill message (per-article context) */
  waMessage?: string;
}

interface HardcodedArticleProps {
  article: HardcodedArticleContent;
}

export function HardcodedArticle({ article }: HardcodedArticleProps) {
  const { lokasi } = useLokasi();

  // Convert LokasiToko → LokasiData (compatible shape)
  const lokasiData: LokasiData = {
    namaToko: lokasi.namaToko,
    tagline: lokasi.tagline,
    foto: lokasi.foto,
    alamat: lokasi.alamat,
    telepon: lokasi.telepon,
    whatsapp: lokasi.whatsapp,
    jamWeekday: lokasi.jamWeekday,
    jamWeekend: lokasi.jamWeekend,
    mapsLink: lokasi.mapsLink,
    lat: lokasi.lat,
    lng: lokasi.lng,
  };

  const logo = lokasi.foto || "/logo.png";
  const waLink = buildWaLink(lokasiData);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader lokasi={lokasiData} logo={logo} />

      <main className="flex-1">
        {/* Article Hero */}
        <section className="border-b border-border">
          <div className="page-container py-12 md:py-16 max-w-3xl">
            <Link
              href="/artikel"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Semua Artikel
            </Link>

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3 block">
              {article.category}
            </span>

            <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
                {article.excerpt}
              </p>
            )}
          </div>
        </section>

        {/* Article Body */}
        <section className="border-b border-border">
          <div className="page-container py-12 md:py-16 max-w-3xl">
            <article
              className="prose prose-slate max-w-none
                prose-headings:font-bold prose-headings:tracking-tight
                prose-h2:text-2xl prose-h2:mt-14 prose-h2:mb-5 prose-h2:scroll-mt-20
                prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-3 prose-h3:scroll-mt-20
                prose-p:text-foreground prose-p:leading-relaxed prose-p:my-6
                prose-a:text-primary prose-a:underline
                prose-strong:font-semibold
                prose-ul:my-6 prose-li:my-2 prose-ul:leading-relaxed
                prose-ol:my-6 prose-ol:leading-relaxed
                prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Inline CTA di akhir artikel */}
            <div className="mt-12 p-6 rounded-xl bg-card/50 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Mau jual laptop sekarang?
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Kirim foto laptop via WhatsApp. Estimasi harga dalam 1-2 jam, pembayaran cepat di jam kerja.
              </p>
              <a href={waLink} target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  className="min-h-[48px] px-6 gap-2 text-base font-semibold"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat WhatsApp Sekarang
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Related Articles */}
        {article.related && article.related.length > 0 && (
          <section className="border-b border-border bg-card/30">
            <div className="page-container py-12 md:py-16 max-w-5xl">
              <h2 className="text-2xl font-bold tracking-tight mb-6">
                Artikel Terkait
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {article.related.map((rel, i) => (
                  <Link
                    key={i}
                    href={rel.href}
                    className="block p-5 rounded-xl border border-border bg-background hover:border-primary/50 transition-colors"
                  >
                    <h3 className="text-base font-semibold text-foreground mb-2 leading-tight">
                      {rel.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {rel.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <SiteFooter lokasi={lokasiData} logo={logo} />
      <WhatsappFab lokasi={lokasiData} />
    </div>
  );
}
