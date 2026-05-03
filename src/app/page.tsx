"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { Menu, X, Laptop, ArrowRight, MessageCircle, Star, Quote, MapPin, Phone, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { formatPrice } from "@/lib/format";
import { useProducts } from "@/lib/product-store";
import { useTestimoni } from "@/lib/testimoni-store";
import { useLokasi } from "@/lib/lokasi-store";
import { StoreMap } from "@/components/store-map";
import { SkeletonCard } from "@/components/ui/skeleton";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useTheme } from "@/lib/theme-store";
import { StoreLogo } from "@/components/store-logo";
import { StoreName, StoreNamePlain } from "@/components/store-name";
import type { Product } from "@/lib/products";

const categoryColors: Record<string, string> = {
  Gaming: "bg-red-500/20 text-red-400 border-red-500/30",
  Ultrabook: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  Editing: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Kerja: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Sekolah: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

const menuLinks = [
  { href: "/", label: "Home" },
  { href: "/finder", label: "AI Finder" },
  { href: "/produk", label: "Katalog Produk" },
  { href: "/tentang", label: "Tentang" },
  { href: "/blog", label: "Blog" },
  { href: "/#testimoni", label: "Testimoni" },
  { href: "/#lokasi", label: "Lokasi Toko" },
  { href: "/admin", label: "Admin" },
];

export default function HomePage() {
  const { products, isLoaded } = useProducts();
  const { testimoni, isLoaded: testimoniLoaded } = useTestimoni();
  const { lokasi, isLoaded: lokasiLoaded } = useLokasi();
  const [menuOpen, setMenuOpen] = useState(false);

  const featuredProducts = products.slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col bg-background page-animate">
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl shadow-soft-sm">
        <div className="page-container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <StoreLogo />
            <span className="text-lg font-bold tracking-tight">
              <StoreName />
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {menuLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <ThemeSwitcher />
            {/* Mobile hamburger only */}
            <button
              onClick={() => setMenuOpen(true)}
              className="flex md:hidden h-10 w-10 items-center justify-center rounded-xl text-foreground hover:bg-muted/60 transition-colors touch-target"
              aria-label="Buka menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE MENU DRAWER ── */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent className="w-[280px] bg-card border-border p-0">
          <div className="flex items-center justify-between border-b border-border/50 px-4 h-14">
            <div className="flex items-center gap-2">
              <StoreLogo className="h-8 w-8 rounded-lg object-cover" />
              <span className="font-bold"><StoreNamePlain /></span>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted/60 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <nav className="flex flex-col p-4 gap-1">
            {menuLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium hover:bg-muted/60 transition-colors min-h-[48px]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          {/* Theme switcher in drawer */}
          <div className="border-t border-border/50 p-4">
            <DrawerThemeButton onClose={() => setMenuOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 pb-24 md:pb-0">
        {/* ── HERO ── */}
        <section className="relative overflow-hidden min-h-[85vh] md:min-h-[560px] flex items-center">
          {/* Blended background illustration */}
          <div className="absolute inset-0 z-0" aria-hidden="true">
            {/* Main image: visible but positioned right, fading into bg on the left */}
            <div className="absolute inset-0 md:left-[15%]">
              <Image
                src="/hero-laptop.png"
                alt=""
                fill
                className="object-cover object-center md:object-right-center opacity-60 md:opacity-80"
                priority
              />
            </div>

            {/* Left gradient fade — image melts into solid background color */}
            <div className="absolute inset-y-0 left-0 w-[55%] md:w-[50%] bg-gradient-to-r from-background via-background/80 to-transparent" />

            {/* Bottom gradient fade — smooth transition to next section */}
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent" />

            {/* Top subtle fade from header */}
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background/60 to-transparent" />

            {/* Soft color glow behind the image for atmosphere */}
            <div className="absolute right-[-5%] top-[10%] h-[60%] w-[55%] rounded-full bg-primary/12 blur-[120px]" />
            <div className="absolute right-[10%] bottom-[5%] h-[40%] w-[40%] rounded-full bg-emerald-500/8 blur-[100px]" />
          </div>

          {/* Content */}
          <div className="relative z-10 page-container w-full py-14 md:py-20">
            {/* Mobile: Centered text over blended bg */}
            <div className="flex flex-col items-center text-center md:hidden">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <h1 className="text-[2rem] leading-tight font-extrabold tracking-tight">
                  Temukan Laptop{" "}
                  <span className="bg-gradient-to-r from-primary via-emerald-400 to-teal-300 bg-clip-text text-transparent">
                    yang Cocok
                  </span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
                className="mt-4 max-w-xs text-muted-foreground text-sm leading-relaxed"
              >
                Ga perlu ngerti spek. Kami bantu pilihkan laptop impianmu.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
                className="mt-8 flex flex-col gap-3 w-full max-w-xs"
              >
                <Link href="/finder" className="block">
                  <Button className="w-full min-h-[52px] text-base font-semibold gap-2 rounded-2xl shadow-soft-md shadow-primary/20 hover:shadow-soft-lg hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0">
                    Mulai Sekarang
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/produk" className="block">
                  <Button variant="outline" className="w-full min-h-[48px] text-base font-semibold gap-2 rounded-2xl transition-all duration-300">
                    Lihat Katalog
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Desktop: Left-aligned text, image bleeds behind from right */}
            <div className="hidden md:block md:max-w-2xl lg:max-w-3xl">
              <motion.div
                initial={{ opacity: 0, x: -32 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <h1 className="text-5xl lg:text-6xl leading-[1.1] font-extrabold tracking-tight">
                  Temukan Laptop{" "}
                  <span className="bg-gradient-to-r from-primary via-emerald-400 to-teal-300 bg-clip-text text-transparent">
                    yang Cocok
                  </span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
                className="mt-5 max-w-md text-muted-foreground text-lg leading-relaxed"
              >
                Ga perlu ngerti spek. Kami bantu pilihkan laptop impianmu dengan teknologi AI Finder.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                className="mt-8 flex gap-3"
              >
                <Link href="/finder">
                  <Button className="min-h-[52px] text-base font-semibold gap-2 rounded-2xl shadow-soft-md shadow-primary/20 hover:shadow-soft-lg hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 px-8">
                    Mulai Sekarang
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/produk">
                  <Button variant="outline" className="min-h-[52px] text-base font-semibold gap-2 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 px-8">
                    Lihat Katalog
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── PRODUK UNGGULAN ── */}
        <section className="page-container py-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold">Produk Unggulan</h2>
            <Link href="/produk">
              <Button variant="ghost" size="sm" className="text-sm gap-1 text-primary hover:text-primary min-h-[44px]">
                Lihat Semua <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {!isLoaded ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground text-base">
              Belum ada produk
            </div>
          ) : (
            <>
              {/* Mobile: horizontal scroll */}
              <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 snap-x snap-mandatory scrollbar-none md:hidden">
                {featuredProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    className="min-w-[170px] max-w-[170px] snap-start"
                  >
                    <ProductMiniCard product={product} />
                  </motion.div>
                ))}
              </div>

              {/* Desktop: 4-column grid */}
              <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
                {featuredProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.35 }}
                  >
                    <ProductMiniCard product={product} />
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* ── TESTIMONI ── */}
        <section id="testimoni" className="page-container py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">Testimoni Pelanggan</h2>
            <div className="flex items-center gap-1.5 text-primary">
              <Star className="h-4 w-4 fill-primary" />
              <span className="text-sm font-semibold">
                {testimoniLoaded && testimoni.length > 0
                  ? (testimoni.reduce((a, t) => a + t.rating, 0) / testimoni.length).toFixed(1)
                  : "5.0"}
              </span>
            </div>
          </div>

          {!testimoniLoaded ? (
            <div className="flex gap-3 overflow-x-auto -mx-4 px-4 scrollbar-none">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="min-w-[280px] max-w-[280px] h-40 rounded-xl bg-muted/20 animate-pulse" />
              ))}
            </div>
          ) : testimoni.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              Belum ada testimoni
            </div>
          ) : (
            <>
              {/* Mobile: horizontal scroll */}
              <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 snap-x snap-mandatory scrollbar-none md:hidden">
                {testimoni.map((t, i) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="min-w-[280px] max-w-[280px] snap-start"
                  >
                    <TestimoniCard testimoni={t} />
                  </motion.div>
                ))}
              </div>

              {/* Desktop: 3-column grid */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {testimoni.slice(0, 6).map((t, i) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.35 }}
                  >
                    <TestimoniCard testimoni={t} />
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </section>
        {/* ── LOKASI TOKO ── */}
        <section id="lokasi" className="page-container py-8 md:pb-8 pb-32">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">Lokasi Toko</h2>
            <a
              href={lokasi.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
            >
              Buka Maps <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Store Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {/* Photo + Info */}
            <div className="space-y-4">
              {/* Store Photo */}
              <div className="relative overflow-hidden rounded-2xl border border-border/50 shadow-soft-md">
                {lokasiLoaded && lokasi.foto ? (
                  <img
                    src={lokasi.foto}
                    alt={lokasi.namaToko}
                    className="w-full h-48 md:h-56 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 md:h-56 bg-muted/15 flex items-center justify-center">
                    <Laptop className="h-10 w-10 text-muted-foreground/25" />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <div className="flex items-center gap-2">
                    <StoreLogo className="h-9 w-9 rounded-xl object-cover shadow-lg" alt={lokasi.namaToko} />
                    <div>
                      <p className="text-sm font-bold text-white drop-shadow-lg">{lokasi.namaToko}</p>
                      <p className="text-xs text-white/80 drop-shadow">{lokasi.tagline}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Store Info Cards */}
              <div className="space-y-2.5">
                {/* Address */}
                <div className="flex items-start gap-3 bg-card border border-border/50 rounded-xl p-3.5 shadow-soft-sm">
                  <div className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Alamat</p>
                    <p className="text-sm font-medium mt-0.5 leading-relaxed">
                      {lokasi.alamat}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3 bg-card border border-border/50 rounded-xl p-3.5 shadow-soft-sm">
                  <div className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15">
                    <Phone className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Telepon / WhatsApp</p>
                    <a
                      href={`https://wa.me/${lokasi.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium mt-0.5 hover:text-primary transition-colors"
                    >
                      {lokasi.telepon}
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3 bg-card border border-border/50 rounded-xl p-3.5 shadow-soft-sm">
                  <div className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15">
                    <Clock className="h-4 w-4 text-amber-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Jam Operasional</p>
                    <p className="text-sm font-medium mt-0.5">{lokasi.jamWeekday}</p>
                    <p className="text-sm text-muted-foreground">{lokasi.jamWeekend}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Map */}
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-2xl border border-border/50 shadow-soft-md h-[300px] md:h-full md:min-h-[360px]">
                <StoreMap
                  lat={lokasi.lat}
                  lng={lokasi.lng}
                  namaToko={lokasi.namaToko}
                  alamat={lokasi.alamat}
                  className="h-[300px] md:h-full md:min-h-[360px]"
                />
                {/* Overlay badge */}
                <div className="absolute top-3 left-3 z-[1000]">
                  <Badge className="bg-card/90 text-foreground border-border/50 backdrop-blur-md shadow-soft-sm gap-1.5 px-3 py-1.5">
                    <MapPin className="h-3 w-3 text-primary" />
                    <span className="text-xs font-medium">Lokasi Toko</span>
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border/50 bg-card/50">
        <div className="page-container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <StoreLogo className="h-8 w-8 rounded-xl object-cover" alt={lokasi.namaToko} />
              <span className="text-sm font-bold">
                {lokasi.namaToko.split(" ")[0]}<span className="text-primary"> {lokasi.namaToko.split(" ").slice(1).join(" ")}</span>
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <Link href="/finder" className="hover:text-foreground transition-colors">AI Finder</Link>
              <Link href="/produk" className="hover:text-foreground transition-colors">Katalog</Link>
              <Link href="/tentang" className="hover:text-foreground transition-colors">Tentang</Link>
              <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
              <Link href="/#lokasi" className="hover:text-foreground transition-colors">Lokasi</Link>
            </div>
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Saka Creative Digital. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* ── STICKY BOTTOM: WHATSAPP (Mobile only) ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/90 backdrop-blur-xl safe-area-bottom shadow-soft-lg">
        <div className="page-container py-3">
          <a
            href={`https://wa.me/${lokasi.whatsapp}?text=${encodeURIComponent(
              `Halo, saya tertarik dengan laptop di ${lokasi.namaToko}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button className="w-full min-h-[52px] text-base font-semibold gap-2 rounded-2xl bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-soft-md shadow-[#25D366]/20 hover:shadow-soft-lg hover:shadow-[#25D366]/30 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0">
              <MessageCircle className="h-5 w-5" />
              Chat Admin
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

/* ── DRAWER THEME BUTTON ── */
function DrawerThemeButton({ onClose }: { onClose: () => void }) {
  const { themeInfo } = useTheme();
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{themeInfo.emoji}</span>
        <span>{themeInfo.label}</span>
      </div>
      <ThemeSwitcher />
    </div>
  );
}

/* ── SMALL PRODUCT CARD ── */
function ProductMiniCard({ product }: { product: Product }) {
  return (
    <Card className="card-interactive overflow-hidden h-full">
      {/* Image area */}
      <div className="relative flex items-center justify-center bg-muted/15 overflow-hidden" style={{ minHeight: product.image ? '140px' : '80px' }}>
        {product.image ? (
          <img
            src={product.image}
            alt={product.nama}
            className="w-full h-36 object-cover"
          />
        ) : (
          <div className="py-5">
            <Laptop className="h-10 w-10 text-muted-foreground/25" />
          </div>
        )}
        <Badge
          variant="outline"
          className={`absolute top-2 left-2 text-xs px-1.5 py-0.5 ${categoryColors[product.kategori] || "bg-muted text-muted-foreground"}`}
        >
          {product.kategori}
        </Badge>
      </div>
      <CardContent className="p-3">
        <h3 className="text-sm font-semibold leading-snug line-clamp-2 min-h-[2.5rem]">
          {product.nama}
        </h3>
        <p className="text-primary font-bold text-sm mt-2">
          {formatPrice(product.harga)}
        </p>
      </CardContent>
    </Card>
  );
}

/* ── TESTIMONI CARD ── */
function TestimoniCard({ testimoni: t }: { testimoni: import("@/lib/testimoni-store").Testimoni }) {
  const initials = t.nama
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const roleColors: Record<string, string> = {
    Gamer: "bg-red-500/15 text-red-400 border-red-500/30",
    "Content Creator": "bg-purple-500/15 text-purple-400 border-purple-500/30",
    Mahasiswa: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    Freelancer: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    Designer: "bg-pink-500/15 text-pink-400 border-pink-500/30",
    Karyawan: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    Pelajar: "bg-teal-500/15 text-teal-400 border-teal-500/30",
  };

  return (
    <Card className="card-interactive h-full flex flex-col">
      <CardContent className="p-5 flex flex-col flex-1">
        {/* Quote icon */}
        <Quote className="h-5 w-5 text-primary/30 mb-3 flex-shrink-0" />

        {/* Review text */}
        <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-4">
          &ldquo;{t.teks}&rdquo;
        </p>

        {/* Laptop badge */}
        {t.laptop && (
          <Badge variant="outline" className="mt-3 text-xs w-fit bg-primary/5 border-primary/20 text-primary/80">
            {t.laptop}
          </Badge>
        )}

        {/* Author info */}
        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border/30">
          {/* Avatar */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center overflow-hidden">
            {t.avatar ? (
              <img src={t.avatar} alt={t.nama} className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-primary">{initials}</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{t.nama}</p>
            <Badge
              variant="outline"
              className={`text-[10px] px-1.5 py-0 mt-0.5 ${roleColors[t.role] || "bg-muted/50 text-muted-foreground border-muted/50"}`}
            >
              {t.role}
            </Badge>
          </div>

          {/* Star rating */}
          <div className="flex items-center gap-0.5 flex-shrink-0">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < t.rating
                    ? "fill-amber-400 text-amber-400"
                    : "fill-muted/30 text-muted/30"
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
