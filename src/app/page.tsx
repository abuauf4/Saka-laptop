"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  ShieldCheck,
  Eye,
  Clock,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { StoreLogo } from "@/components/store-logo";
import { StoreName, StoreNamePlain } from "@/components/store-name";
import { useLokasi } from "@/lib/lokasi-store";

/* ───────────────────────────────────────────
   SAKA LAPTOP — PUSAT INSPEKSI & TRADE-IN
   Homepage per PM brief v2:
   1. Hero
   2. Brand Statement
   3. Workflow (5 stages)
   4. Toko & Aktivitas (trust photos)
   5. Perangkat yang Diterima
   6. FAQ
   7. Closing CTA
   ─────────────────────────────────────────── */

const menuLinks = [
  { href: "/#proses", label: "Proses" },
  { href: "/#toko", label: "Toko" },
  { href: "/#faq", label: "FAQ" },
  { href: "/admin", label: "Admin" },
];

const brandPoints = [
  {
    icon: Eye,
    title: "Transparan",
    desc: "Setiap pengecekan dilakukan terbuka. Kamu tahu persis apa yang diperiksa dan kenapa harganya segitu.",
  },
  {
    icon: ShieldCheck,
    title: "Profesional",
    desc: "Tim teknisi berpengalaman menilai perangkat secara objektif, bukan asal tebak harga.",
  },
  {
    icon: Clock,
    title: "Cepat",
    desc: "Dari pengajuan ke penawaran, prosesnya gak berhari-hari. Tim kami responsif.",
  },
];

const workflowStages = [
  {
    n: "01",
    title: "Ajukan Laptop",
    desc: "Kirim foto dan spesifikasi laptop via WhatsApp. Sebut kondisi sejujurnya.",
  },
  {
    n: "02",
    title: "Review Awal",
    desc: "Tim kami cek data awal dan kembali ke kamu dengan pertanyaan klarifikasi kalau perlu.",
  },
  {
    n: "03",
    title: "Pengecekan",
    desc: "Bawa laptop ke toko. Teknisi inspeksi 12 titik: layar, keyboard, baterai, port, fisik, dll.",
  },
  {
    n: "04",
    title: "Penawaran",
    desc: "Harga diberikan berdasarkan hasil inspeksi. Bukan tebakan, bukan asal — ada dasarnya.",
  },
  {
    n: "05",
    title: "Deal",
    desc: "Kamu bebas terima atau tolak. Kalau deal, pembayaran dilakukan langsung.",
  },
];

const deviceCategories = [
  { label: "Laptop Kantor", emoji: "💼" },
  { label: "Laptop Gaming", emoji: "🎮" },
  { label: "MacBook", emoji: "🍎" },
  { label: "Workstation", emoji: "🖥️" },
];

const faqs = [
  {
    q: "Laptop rusak diterima?",
    a: "Ya, kami tetap nerima. Hasil QC yang menentukan harga — kalau banyak komponen yang gagal, penawaran menyesuaikan. Tapi selama masih ada nilai (komponen masih bisa dipakai atau dijual parts), kami tetap kasih penawaran jujur.",
  },
  {
    q: "Harus datang langsung?",
    a: "Pengajuan awal bisa online via WhatsApp. Tapi untuk inspeksi fisik & finalisasi harga, laptop harus dibawa ke toko. Kalau kamu di luar kota, hubungi kami dulu — mungkin bisa diatur via kurir.",
  },
  {
    q: "Berapa lama proses?",
    a: "Dari kamu ajukan via WA sampai dapat penawaran awal: biasanya 1×24 jam. Kalau lanjut inspeksi fisik di toko: 30-60 menit. Jadi total 1-2 hari kerja dari awal sampai deal.",
  },
  {
    q: "Bagaimana pembayaran?",
    a: "Setelah deal, pembayaran langsung. Bisa transfer bank (BCA/Mandiri/BRI) atau tunai di toko. Untuk trade-in, nilai laptop dipakai sebagai potongan kalau kamu mau tukar dengan unit lain di inventory.",
  },
  {
    q: "Jika harga tidak cocok?",
    a: "Gak masalah. Kamu bebas tolak tanpa biaya. Laptop dikembalikan dalam kondisi sama persis seperti saat dibawa. Kami gak maksa — penawaran cuma referensi, keputusan tetap di kamu.",
  },
];

const tokoPhotos = [
  {
    src: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80",
    alt: "Teknisi sedang mengecek laptop",
    label: "Area Teknisi",
  },
  {
    src: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80",
    alt: "Meja kerja dengan laptop",
    label: "Meja Inspeksi",
  },
  {
    src: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80",
    alt: "Proses pengecekan perangkat",
    label: "Pengecekan Fisik",
  },
  {
    src: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80",
    alt: "Rak penyimpanan laptop",
    label: "Rak Penyimpanan",
  },
];

export default function HomePage() {
  const { lokasi, isLoaded } = useLokasi();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // WhatsApp number from Lokasi config, fallback to placeholder
  const waNumber = (isLoaded && lokasi.whatsapp) ? lokasi.whatsapp.replace(/^0/, "62") : "6281234567890";
  const waMessage = encodeURIComponent(
    "Halo Saka Laptop, saya mau jual laptop bekas. Bisa dibantu prosesnya?"
  );
  const waLink = `https://wa.me/${waNumber}?text=${waMessage}`;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="page-container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <StoreLogo />
            <span className="text-base font-semibold tracking-tight">
              <StoreName />
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {menuLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a href={waLink} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="gap-1.5">
                <MessageCircle className="h-3.5 w-3.5" />
                Ajukan Laptop
              </Button>
            </a>
            <button
              onClick={() => setMenuOpen(true)}
              className="flex md:hidden h-10 w-10 items-center justify-center rounded-xl hover:bg-muted transition-colors"
              aria-label="Buka menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE MENU ── */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent className="w-[300px] bg-background border-border p-0">
          <div className="flex items-center justify-between border-b border-border px-4 h-16">
            <div className="flex items-center gap-2">
              <StoreLogo className="h-8 w-8 rounded-lg object-cover" />
              <span className="font-semibold"><StoreNamePlain /></span>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted"
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
                className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium hover:bg-muted transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="mt-2"
            >
              <Button className="w-full gap-2">
                <MessageCircle className="h-4 w-4" />
                Ajukan via WhatsApp
              </Button>
            </a>
          </nav>
        </SheetContent>
      </Sheet>

      <main className="flex-1">
        {/* ─────────────────────────────────────
            SECTION 1 — HERO (full-bleed image)
            ───────────────────────────────────── */}
        <section className="relative min-h-[88vh] md:min-h-[92vh] flex items-center overflow-hidden">
          {/* Full-bleed background image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1920&q=90"
              alt="Teknisi Saka Laptop sedang mengecek perangkat di meja inspeksi"
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
          </div>

          {/* Content overlay */}
          <div className="relative z-10 page-container w-full py-20 md:py-28">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="max-w-2xl"
            >
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-4 py-1.5 mb-7"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-xs font-medium text-white/90 tracking-wide">
                  Pusat Inspeksi & Trade-in Laptop Bekas
                </span>
              </motion.div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-white">
                Jual Laptop Bekas{" "}
                <span className="text-white">Tanpa Ribet.</span>
              </h1>

              {/* Subheadline */}
              <p className="mt-6 text-base md:text-lg text-white/85 leading-relaxed max-w-xl">
                Kirim foto dan spesifikasi laptop melalui WhatsApp. Tim kami
                akan membantu proses pengecekan dan penawaran.
              </p>

              {/* CTAs */}
              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <a href={waLink} target="_blank" rel="noopener noreferrer">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto min-h-[54px] px-8 gap-2 text-base font-semibold rounded-xl"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Ajukan Laptop
                  </Button>
                </a>
                <Link href="#proses">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto min-h-[54px] px-8 text-base font-semibold rounded-xl bg-white/10 backdrop-blur-md border-white/40 text-white hover:bg-white/20 hover:text-white"
                  >
                    Lihat Proses
                  </Button>
                </Link>
              </div>

              {/* Mini trust line */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-10 flex items-center gap-5 text-white/70 text-xs"
              >
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-white" />
                  QC Transparan
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-white" />
                  Penawaran Jelas
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-white" />
                  Proses Cepat
                </span>
              </motion.div>
            </motion.div>
          </div>

        </section>

        {/* ─────────────────────────────────────
            SECTION 2 — BRAND STATEMENT
            ───────────────────────────────────── */}
        <section className="border-b border-border bg-card/50">
          <div className="page-container py-20 md:py-28">
            <div className="max-w-3xl mb-14">
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-4xl font-bold tracking-tight text-foreground"
              >
                Bukan Sekadar Membeli Laptop.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed"
              >
                Kami membantu proses penilaian perangkat secara transparan
                sebelum memberikan penawaran.
              </motion.p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              {brandPoints.map((point, i) => (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary mb-4">
                    <point.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {point.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {point.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────
            SECTION 3 — WORKFLOW (5 stages)
            ───────────────────────────────────── */}
        <section id="proses" className="border-b border-border">
          <div className="page-container py-20 md:py-28">
            <div className="max-w-2xl mb-16">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3"
              >
                Alur Kerja
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl font-bold tracking-tight"
              >
                Proses Kami
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-muted-foreground leading-relaxed"
              >
                Dari pengajuan sampai deal, lima langkah. Tidak ada yang
                disembunyikan.
              </motion.p>
            </div>

            <div className="max-w-3xl">
              {workflowStages.map((stage, i) => (
                <motion.div
                  key={stage.n}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="flex gap-6 md:gap-8 group"
                >
                  {/* Number + line */}
                  <div className="flex flex-col items-center">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-primary text-primary font-bold text-sm bg-background group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {stage.n}
                    </div>
                    {i < workflowStages.length - 1 && (
                      <div className="w-px flex-1 bg-border my-2 min-h-[40px]" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-12">
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-1.5">
                      {stage.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl">
                      {stage.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────
            SECTION 4 — TOKO & AKTIVITAS
            ───────────────────────────────────── */}
        <section id="toko" className="border-b border-border bg-card/50">
          <div className="page-container py-20 md:py-28">
            <div className="max-w-2xl mb-14">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3"
              >
                Trust
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl font-bold tracking-tight"
              >
                Toko & Aktivitas
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-muted-foreground leading-relaxed"
              >
                Tempat di mana laptop kamu ditangani. Bukan dekorasi, bukan
                render — ini lapangan kerja kami.
              </motion.p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {tokoPhotos.map((photo, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className={`relative rounded-xl overflow-hidden border border-border bg-muted ${
                    i === 0 ? "col-span-2 lg:col-span-2 aspect-[4/3]" : "aspect-square"
                  }`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-xs font-medium text-white drop-shadow">
                      {photo.label}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────
            SECTION 5 — PERANGKAT YANG DITERIMA
            ───────────────────────────────────── */}
        <section className="border-b border-border">
          <div className="page-container py-20 md:py-28">
            <div className="max-w-2xl mb-12">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3"
              >
                Yang Diterima
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl font-bold tracking-tight"
              >
                Perangkat yang Diterima
              </motion.h2>
            </div>

            <div className="flex flex-wrap gap-3">
              {deviceCategories.map((cat, i) => (
                <motion.div
                  key={cat.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-5 py-2.5"
                >
                  <span className="text-lg">{cat.emoji}</span>
                  <span className="text-sm font-medium text-foreground">
                    {cat.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────
            SECTION 6 — FAQ
            ───────────────────────────────────── */}
        <section id="faq" className="border-b border-border bg-card/50">
          <div className="page-container py-20 md:py-28 max-w-3xl">
            <div className="mb-14">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3"
              >
                FAQ
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl font-bold tracking-tight"
              >
                Pertanyaan Umum
              </motion.h2>
            </div>

            <div className="space-y-2">
              {faqs.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="rounded-xl border border-border bg-background overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="flex items-center justify-between w-full p-5 text-left hover:bg-muted/50 transition-colors"
                    >
                      <span className="text-sm md:text-base font-semibold text-foreground pr-4">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────
            SECTION 7 — CLOSING CTA (dark bg)
            ───────────────────────────────────── */}
        <section className="bg-[#000000] text-white">
          <div className="page-container py-20 md:py-32 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-5xl font-bold tracking-tight max-w-3xl mx-auto leading-tight"
            >
              Laptop Lama Masih Bernilai.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-white/70 max-w-xl mx-auto text-base"
            >
              Chat kami sekarang via WhatsApp. Gratis, tanpa komitmen.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-10 flex justify-center"
            >
              <a href={waLink} target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  className="min-h-[52px] px-8 gap-2 text-base font-semibold bg-white text-black hover:bg-white/90"
                >
                  <MessageCircle className="h-4 w-4" />
                  Ajukan Laptop Sekarang
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border bg-background">
        <div className="page-container py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <StoreLogo className="h-7 w-7 rounded-lg object-cover" />
              <span className="text-sm font-semibold"><StoreNamePlain /></span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              &copy; 2026 <StoreNamePlain />. Pusat Inspeksi & Trade-in Laptop Bekas.
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                WhatsApp
              </a>
              <Link href="/admin" className="hover:text-foreground transition-colors">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
