"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Clock,
  MessageCircle,
  ExternalLink,
  Shield,
  Award,
  HeartHandshake,
  Laptop,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLokasi } from "@/lib/lokasi-store";
import { StoreMap } from "@/components/store-map";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { StoreLogo } from "@/components/store-logo";
import { StoreName, StoreNamePlain } from "@/components/store-name";

const menuLinks = [
  { href: "/", label: "Home" },
  { href: "/finder", label: "AI Finder" },
  { href: "/produk", label: "Katalog Produk" },
  { href: "/tentang", label: "Tentang" },
  { href: "/blog", label: "Blog" },
  { href: "/admin", label: "Admin" },
];

export default function TentangPage() {
  const { lokasi, isLoaded } = useLokasi();

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
          <div className="flex items-center gap-1">
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-12 md:py-20">
          <div className="absolute inset-0 z-0">
            <div className="absolute right-[-5%] top-[10%] h-[60%] w-[55%] rounded-full bg-primary/8 blur-[120px]" />
          </div>
          <div className="relative z-10 page-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <Badge className="mb-4 bg-primary/15 text-primary border-primary/30 px-3 py-1.5 text-sm">
                Tentang Kami
              </Badge>
              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
                {lokasi.namaToko || "Saka Laptop"} —{" "}
                <span className="bg-gradient-to-r from-primary via-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  Toko Laptop Terpercaya
                </span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed max-w-2xl">
                {lokasi.tagline || "Toko Laptop Terpercaya"} — menyediakan laptop
                berkualitas untuk berbagai kebutuhan Anda.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── LONG-FORM SEO CONTENT ── */}
        <section className="page-container py-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="max-w-3xl space-y-6 text-muted-foreground leading-relaxed"
          >
            <h2 className="text-2xl font-bold text-foreground">
              Selamat Datang di {lokasi.namaToko || "Saka Laptop"}
            </h2>
            <p>
              <strong className="text-foreground">{lokasi.namaToko || "Saka Laptop"}</strong> adalah
              toko laptop terpercaya yang berlokasi di{" "}
              <strong className="text-foreground">{lokasi.alamat || "Jakarta Selatan"}</strong>.
              Sebagai destinasi utama untuk pembelian laptop berkualitas, kami menyediakan
              beragam pilihan laptop mulai dari{" "}
              <strong className="text-foreground">laptop gaming</strong> dengan performa tinggi,{" "}
              <strong className="text-foreground">ultrabook</strong> yang ringan dan portabel,{" "}
              <strong className="text-foreground">laptop kerja</strong> yang andal untuk produktivitas
              sehari-hari, hingga <strong className="text-foreground">laptop sekolah</strong> dengan
              harga terjangkau namun tetap handal.
            </p>
            <p>
              Kami memahami bahwa memilih laptop yang tepat bisa menjadi keputusan yang membingungkan.
              Itulah mengapa {lokasi.namaToko || "Saka Laptop"} hadir dengan layanan{" "}
              <strong className="text-foreground">AI Laptop Finder</strong> — teknologi cerdas yang
              membantu Anda menemukan laptop terbaik berdasarkan kebutuhan, prioritas, dan budget.
              Cukup jawab 3 pertanyaan mudah, dan kami akan memberikan rekomendasi laptop yang paling
              cocok untuk Anda.
            </p>
            <p>
              Setiap laptop yang kami jual telah melalui proses pengecekan ketat untuk memastikan
              kualitas dan performa yang optimal. Baik Anda mencari{" "}
              <strong className="text-foreground">laptop bekas berkualitas</strong> maupun laptop
              baru dengan garansi resmi, {lokasi.namaToko || "Saka Laptop"} adalah pilihan yang
              tepat. Kami juga menyediakan layanan konsultasi gratis melalui WhatsApp, sehingga
              Anda bisa mendapatkan saran langsung dari tim ahli kami sebelum membeli.
            </p>

            <h2 className="text-2xl font-bold text-foreground pt-4">
              Mengapa Memilih {lokasi.namaToko || "Saka Laptop"}?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 !mt-4">
              <Card className="border-border/50 bg-card">
                <CardContent className="p-5 text-center space-y-2">
                  <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 mx-auto">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground">Garansi Terjamin</h3>
                  <p className="text-sm">
                    Setiap laptop dilengkapi garansi untuk ketenangan pikiran Anda.
                    Kami berkomitmen pada kualitas produk yang kami jual.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-card">
                <CardContent className="p-5 text-center space-y-2">
                  <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 mx-auto">
                    <Award className="h-6 w-6 text-emerald-500" />
                  </div>
                  <h3 className="font-bold text-foreground">Kualitas Terbaik</h3>
                  <p className="text-sm">
                    Semua laptop melewati pengecekan menyeluruh sebelum dipasarkan.
                    Performa, kondisi fisik, dan fungsi dijamin prima.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-card">
                <CardContent className="p-5 text-center space-y-2">
                  <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15 mx-auto">
                    <HeartHandshake className="h-6 w-6 text-amber-500" />
                  </div>
                  <h3 className="font-bold text-foreground">Pelayanan Ramah</h3>
                  <p className="text-sm">
                    Tim kami siap membantu Anda memilih laptop yang tepat.
                    Konsultasi gratis via WhatsApp atau langsung datang ke toko.
                  </p>
                </CardContent>
              </Card>
            </div>

            <p className="pt-4">
              Dengan lokasi yang strategis di {lokasi.alamat || "Jakarta Selatan"},{" "}
              {lokasi.namaToko || "Saka Laptop"} mudah dijangkau dari berbagai wilayah
              Jabodetabek. Kami buka setiap hari untuk melayani kebutuhan laptop Anda —
              mulai dari {lokasi.jamWeekday || "Senin - Sabtu: 09.00 - 21.00 WIB"} dan{" "}
              {lokasi.jamWeekend || "Minggu: 10.00 - 18.00 WIB"}. Kunjungi toko kami dan
              rasakan pengalaman belanja laptop yang berbeda!
            </p>
          </motion.div>
        </section>

        {/* ── STORE INFO ── */}
        <section className="page-container py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">Informasi Toko</h2>
            <a
              href={lokasi.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
            >
              Buka Maps <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {/* Info Cards */}
            <div className="space-y-4">
              {/* Store Photo */}
              <div className="relative overflow-hidden rounded-2xl border border-border/50 shadow-soft-md">
                {isLoaded && lokasi.foto ? (
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

              {/* Address */}
              <div className="flex items-start gap-3 bg-card border border-border/50 rounded-xl p-3.5 shadow-soft-sm">
                <div className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Alamat</p>
                  <p className="text-sm font-medium mt-0.5 leading-relaxed">{lokasi.alamat}</p>
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

            {/* Map */}
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-2xl border border-border/50 shadow-soft-md h-[300px] md:h-full md:min-h-[360px]">
                <StoreMap
                  lat={lokasi.lat}
                  lng={lokasi.lng}
                  namaToko={lokasi.namaToko}
                  alamat={lokasi.alamat}
                  className="h-[300px] md:h-full md:min-h-[360px]"
                />
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

        {/* ── CTA ── */}
        <section className="page-container py-8 pb-24 md:pb-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-center max-w-lg mx-auto"
          >
            <h2 className="text-xl font-bold">Siap Menemukan Laptop Impianmu?</h2>
            <p className="text-sm text-muted-foreground mt-2 mb-6">
              Gunakan AI Finder kami atau langsung chat admin untuk konsultasi gratis.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/finder">
                <Button className="gap-2 min-h-[48px] rounded-2xl px-6 font-semibold shadow-soft-md shadow-primary/20 hover:shadow-soft-lg hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5">
                  AI Laptop Finder
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <a
                href={`https://wa.me/${lokasi.whatsapp}?text=${encodeURIComponent(
                  `Halo, saya ingin konsultasi tentang laptop di ${lokasi.namaToko}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  className="gap-2 min-h-[48px] rounded-2xl px-6 font-semibold border-primary/40 text-primary hover:bg-primary/10 transition-all duration-300"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat WhatsApp
                </Button>
              </a>
            </div>
          </motion.div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border/50 bg-card/50 mt-auto">
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
