"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
  Eye,
  Lock,
  Clock,
  ClipboardCheck,
  Tag,
  ChevronDown,
  Smartphone,
  Laptop,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { StoreLogo } from "@/components/store-logo";
import { StoreName, StoreNamePlain } from "@/components/store-name";
import { useLokasi } from "@/lib/lokasi-store";
import { StoreMap } from "@/components/store-map";

const menuLinks = [
  { href: "/", label: "Beranda" },
  { href: "/#proses", label: "Proses" },
  { href: "/#inspeksi", label: "Inspeksi" },
  { href: "/#status", label: "Status" },
  { href: "/#faq", label: "FAQ" },
  { href: "/admin", label: "Admin" },
];

const trustIndicators = [
  { icon: Eye, title: "QC Transparan", desc: "Hasil inspeksi shared ke customer" },
  { icon: Tag, title: "Penawaran Jelas", desc: "Harga dasar hasil inspeksi" },
  { icon: Lock, title: "Data Aman", desc: "Data customer terenkripsi" },
  { icon: Clock, title: "Proses Cepat", desc: "Penawaran dalam 1×24 jam" },
];

const processSteps = [
  {
    n: "01",
    title: "Ajukan Laptop",
    desc: "Isi tipe, spesifikasi, kondisi, dan foto. Tidak perlu datang langsung di tahap ini.",
  },
  {
    n: "02",
    title: "Proses QC",
    desc: "Tim melakukan pemeriksaan perangkat dan kondisi fisik secara menyeluruh.",
  },
  {
    n: "03",
    title: "Terima Penawaran",
    desc: "Harga diberikan berdasarkan hasil inspeksi. Kamu bebas menerima atau menolak.",
  },
];

const inspectionItems = [
  { label: "Layar", icon: "🖥️" },
  { label: "Keyboard", icon: "⌨️" },
  { label: "Touchpad", icon: "🖱️" },
  { label: "Baterai", icon: "🔋" },
  { label: "Charger", icon: "🔌" },
  { label: "Storage", icon: "💾" },
  { label: "RAM", icon: "⚡" },
  { label: "Kamera", icon: "📷" },
  { label: "Speaker", icon: "🔊" },
  { label: "Port", icon: "🔗" },
  { label: "WiFi", icon: "📶" },
  { label: "Fisik", icon: "✨" },
];

const statusFlow = [
  { code: "RECEIVED", label: "Data Diterima", desc: "Pengajuan masuk sistem" },
  { code: "QC_PROCESS", label: "QC Berjalan", desc: "Inspeksi perangkat" },
  { code: "OFFER_SENT", label: "Penawaran Dikirim", desc: "Harga dikirim ke customer" },
  { code: "ACCEPTED", label: "Deal", desc: "Customer setuju" },
];

const faqs = [
  {
    q: "Apakah laptop rusak diterima?",
    a: "Ya, kami menerima laptop dalam berbagai kondisi — termasuk yang rusak. Hasil QC akan menentukan penawaran harga. Untuk laptop rusak berat, penawaran mungkin lebih rendah, tapi tetap ada nilai dari komponen yang masih berfungsi.",
  },
  {
    q: "Apakah harus datang langsung?",
    a: "Untuk pengajuan awal, semua dilakukan online lewat form. Setelah penawaran awal dikirim, customer perlu membawa laptop ke toko untuk inspeksi fisik & finalisasi harga. Untuk lokasi jauh, hubungi admin via WhatsApp.",
  },
  {
    q: "Berapa lama proses QC?",
    a: "QC fisik di toko biasanya 30-60 menit. Setelah QC selesai, penawaran dikirim dalam 1×24 jam. Total proses dari pengajuan ke penawaran final biasanya 1-2 hari kerja.",
  },
  {
    q: "Bagaimana metode pembayaran?",
    a: "Pembayaran dilakukan setelah deal, bisa via transfer bank (BCA/Mandiri/BRI) atau tunai langsung di toko. Untuk trade-in, nilai laptop dipakai sebagai potongan harga laptop lain yang ada di inventory kami.",
  },
  {
    q: "Apakah data aman?",
    a: "Sangat aman. Sebelum QC, kami minta customer backup data & wipe sendiri. Jika lupa, tim kami melakukan secure wipe (DoD 3-pass) sebelum laptop masuk inventory. Data customer (nama, kontak) disimpan terenkripsi & tidak dibagikan ke pihak ketiga.",
  },
];

export default function HomePage() {
  const { lokasi, isLoaded: lokasiLoaded } = useLokasi();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
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
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <Link href="/ajukan" className="hidden sm:block">
              <Button size="sm" className="gap-1.5">
                Ajukan Laptop <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <button
              onClick={() => setMenuOpen(true)}
              className="flex md:hidden h-10 w-10 items-center justify-center rounded-xl hover:bg-muted/60 transition-colors"
              aria-label="Buka menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE MENU ── */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent className="w-[300px] bg-card border-border p-0">
          <div className="flex items-center justify-between border-b border-border/40 px-4 h-16">
            <div className="flex items-center gap-2">
              <StoreLogo className="h-8 w-8 rounded-lg object-cover" />
              <span className="font-semibold"><StoreNamePlain /></span>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted/60"
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
                className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium hover:bg-muted/60 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/ajukan"
              onClick={() => setMenuOpen(false)}
              className="mt-2"
            >
              <Button className="w-full gap-2">
                Ajukan Laptop <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </nav>
        </SheetContent>
      </Sheet>

      <main className="flex-1">
        {/* ── HERO ── */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-[-10%] top-[5%] h-[50%] w-[50%] rounded-full bg-primary/8 blur-[120px]" />
            <div className="absolute right-[-5%] bottom-[5%] h-[40%] w-[40%] rounded-full bg-emerald-500/6 blur-[100px]" />
          </div>

          <div className="relative page-container py-20 md:py-32 max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 backdrop-blur-sm px-4 py-1.5 mb-8"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-muted-foreground">
                Pusat Inspeksi & Trade-in Laptop
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
            >
              Laptop Lama
              <br />
              <span className="bg-gradient-to-r from-primary via-emerald-400 to-teal-300 bg-clip-text text-transparent">
                Masih Bernilai.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
              className="mt-8 max-w-2xl mx-auto text-base md:text-lg text-muted-foreground leading-relaxed"
            >
              Kirim data laptop kamu. Tim kami akan melakukan pengecekan, QC,
              dan memberikan penawaran harga yang transparan.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="mt-10 flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Link href="/ajukan">
                <Button size="lg" className="w-full sm:w-auto min-h-[52px] px-8 gap-2 text-base font-semibold rounded-xl">
                  Ajukan Laptop
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#proses">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto min-h-[52px] px-8 text-base font-semibold rounded-xl"
                >
                  Lihat Proses
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ── TRUST INDICATORS ── */}
        <section className="border-y border-border/40 bg-card/30">
          <div className="page-container py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
              {trustIndicators.map((t, i) => (
                <motion.div
                  key={t.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="flex flex-col items-center text-center md:flex-row md:text-left gap-3"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <t.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.title}</p>
                    <p className="text-xs text-muted-foreground leading-tight mt-0.5">
                      {t.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 1: PROSES ── */}
        <section id="proses" className="page-container py-20 md:py-28">
          <div className="max-w-2xl mb-14">
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
              Bagaimana prosesnya?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-muted-foreground leading-relaxed"
            >
              Tiga langkah sederhana, dari pengajuan hingga penawaran.
              Transparan, tanpa biaya tersembunyi.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="relative p-8 rounded-2xl border border-border/50 bg-card/40 hover:border-primary/30 hover:bg-card/60 transition-all"
              >
                <span className="text-5xl font-bold text-primary/15 mb-4 block">
                  {step.n}
                </span>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
                {i < processSteps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-3 h-5 w-5 text-muted-foreground/40 -translate-y-1/2" />
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── SECTION 2: INSPEKSI ── */}
        <section id="inspeksi" className="border-y border-border/40 bg-card/20">
          <div className="page-container py-20 md:py-28">
            <div className="max-w-2xl mb-14">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3"
              >
                QC Checklist
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl font-bold tracking-tight"
              >
                Apa yang kami periksa?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-muted-foreground leading-relaxed"
              >
                Setiap laptop melewati 12 titik inspeksi standar. Hasil QC
                di-share ke customer sebagai dasar penawaran harga.
              </motion.p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {inspectionItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                  className="flex items-center gap-3 p-4 rounded-xl border border-border/40 bg-background/60 hover:border-primary/30 hover:bg-background transition-all"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                  <ShieldCheck className="ml-auto h-4 w-4 text-emerald-500/60" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 3: STATUS FLOW ── */}
        <section id="status" className="page-container py-20 md:py-28">
          <div className="max-w-2xl mb-14">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3"
            >
              Tracking
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold tracking-tight"
            >
              Status Proses Laptop
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-muted-foreground leading-relaxed"
            >
              Pantau posisi laptop kamu di setiap tahap. Customer selalu
              mendapat update via WhatsApp.
            </motion.p>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            <div className="grid md:grid-cols-4 gap-6 md:gap-3">
              {statusFlow.map((s, i) => (
                <motion.div
                  key={s.code}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-card border-2 border-primary/30 mb-4">
                    <span className="text-sm font-bold text-primary">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold mb-1">{s.label}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-[180px]">
                    {s.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Branch note */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-12 flex justify-center gap-4 flex-wrap"
            >
              <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span className="text-xs font-medium text-emerald-500">
                  Deal → Laptop masuk Inventory
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2">
                <X className="h-4 w-4 text-red-500" />
                <span className="text-xs font-medium text-red-500">
                  Tidak Deal → Laptop dikembalikan
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── SECTION 4: FAQ ── */}
        <section id="faq" className="border-y border-border/40 bg-card/20">
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
                    className="rounded-xl border border-border/50 bg-background/60 overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="flex items-center justify-between w-full p-5 text-left hover:bg-muted/30 transition-colors"
                    >
                      <span className="text-sm md:text-base font-semibold pr-4">
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

        {/* ── CLOSING CTA ── */}
        <section className="page-container py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-primary/10 via-card to-emerald-500/5 p-10 md:p-16 text-center"
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-[-5%] top-[-20%] h-[60%] w-[40%] rounded-full bg-primary/10 blur-[100px]" />
              <div className="absolute right-[-5%] bottom-[-20%] h-[60%] w-[40%] rounded-full bg-emerald-500/10 blur-[100px]" />
            </div>
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight max-w-3xl mx-auto leading-tight">
                Jangan biarkan laptop lama hanya tersimpan di lemari.
              </h2>
              <p className="mt-6 text-muted-foreground max-w-xl mx-auto">
                Ajukan sekarang, dapatkan penawaran dalam 1×24 jam setelah QC.
              </p>
              <div className="mt-10 flex justify-center">
                <Link href="/ajukan">
                  <Button size="lg" className="min-h-[52px] px-8 gap-2 text-base font-semibold rounded-xl">
                    Ajukan Laptop Sekarang
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── LOKASI ── */}
        {lokasiLoaded && lokasi.alamat && (
          <section id="lokasi" className="border-t border-border/40 bg-card/20">
            <div className="page-container py-16">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">
                    Lokasi Inspeksi
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    Kunjungi Toko
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    Bawa laptop kamu untuk inspeksi fisik & finalisasi harga.
                    Jam operasional: {lokasi.jamWeekday} (weekday), {lokasi.jamWeekend} (weekend).
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <span className="text-muted-foreground">Alamat:</span>
                      <span>{lokasi.alamat}</span>
                    </p>
                    {lokasi.telepon && (
                      <p className="flex items-center gap-2">
                        <span className="text-muted-foreground">Telepon:</span>
                        <span>{lokasi.telepon}</span>
                      </p>
                    )}
                    {lokasi.whatsapp && (
                      <a
                        href={`https://wa.me/${lokasi.whatsapp.replace(/^0/, "62")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:underline mt-3"
                      >
                        Chat WhatsApp →
                      </a>
                    )}
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden border border-border/50 h-64">
                  <StoreMap />
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border/40 bg-background">
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
              <Link href="/ajukan" className="hover:text-foreground transition-colors">
                Ajukan Laptop
              </Link>
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
