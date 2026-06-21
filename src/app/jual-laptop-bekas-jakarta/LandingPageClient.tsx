"use client";

// ─── Jakarta Laptops — Landing Page Client Component ───
// /jual-laptop-bekas-jakarta — Supply acquisition focused LP.
// Sections: Hero → 5 Value Pillars → Process → Estimasi Widget → FAQ → Trust → Final CTA
//
// CTA strategy (updated per business brief):
//   ALL CTAs go directly to WhatsApp (no form, no DB involvement).
//   Frontend = pure lead gen to WA. Admin = decoupled operational backend.
//
// WA link pattern: wa.me/{number}?text={prefill}&utm_source={utm}

import { useState } from "react";
import {
  Clock,
  Camera,
  Truck,
  Wallet,
  AlertCircle,
  ArrowRight,
  MessageCircle,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Shield,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { LandingPageData } from "@/lib/landing-page-data";
import { useLokasi } from "@/lib/lokasi-store";

// ─── Icon mapping ───
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Clock,
  Camera,
  Truck,
  Wallet,
  AlertCircle,
  Sparkles,
  Shield,
  MapPin,
};

function getIcon(name: string) {
  return ICON_MAP[name] || Sparkles;
}

// ─── Build WhatsApp link with pre-fill + UTM ───
function buildWaLink(whatsappNumber: string, utmSource = "lp_jual_laptop_bekas") {
  const cleanNumber = (whatsappNumber || "").replace(/[^0-9]/g, "");
  const message = encodeURIComponent(
    "Halo, saya mau jual laptop bekas. Saya lampirkan foto dan spek."
  );
  return `https://wa.me/${cleanNumber}?text=${message}&utm_source=${utmSource}&utm_medium=organic&utm_campaign=supply_acquisition`;
}

interface LandingPageClientProps {
  content: LandingPageData;
}

export function LandingPageClient({ content }: LandingPageClientProps) {
  const { lokasi } = useLokasi();
  const waLink = buildWaLink(lokasi.whatsapp);

  return (
    <main className="min-h-screen bg-white">
      {/* ─────────────────────────────────────────────────────── */}
      {/* HERO SECTION */}
      {/* ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white border-b">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
            {/* Left: Copy + CTAs */}
            <div className="space-y-6">
              <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-bold tracking-wider uppercase">
                {content.heroEyebrow}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-slate-900 tracking-tight">
                {content.heroTitle}
              </h1>
              <p className="text-lg text-slate-600 max-w-lg">
                {content.heroSubtitle}
              </p>

              {/* CTAs — both go to WA direct */}
              <div className="flex flex-wrap gap-3">
                <a href={waLink} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 text-base h-auto">
                    {content.heroPrimaryCta}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
                <a href={waLink} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="border-blue-600 text-blue-700 hover:bg-blue-50 font-bold px-6 py-3 text-base h-auto">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    {content.heroSecondaryCta}
                  </Button>
                </a>
              </div>

              {/* Trust micro-badges */}
              {content.heroTrustBadges.length > 0 && (
                <div className="flex flex-wrap gap-4 text-sm text-slate-600 pt-2">
                  {content.heroTrustBadges.map((badge, idx) => (
                    <span key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      {badge.text}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Quick Estimasi Mini Form */}
            <QuickEstimasiWidget waLink={waLink} />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────── */}
      {/* 5 VALUE PROPOSITION PILLARS */}
      {/* ─────────────────────────────────────────────────────── */}
      {content.valuePillars.length > 0 && (
        <section className="py-16 md:py-20 bg-white border-b">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                Kenapa Jual ke Jakarta Laptops?
              </h2>
              <p className="text-slate-600 max-w-xl mx-auto">
                5 alasan kenapa supplier memilih kami daripada kompetitor
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {content.valuePillars.map((pillar, idx) => {
                const Icon = getIcon(pillar.icon);
                return (
                  <Card
                    key={idx}
                    className="border-t-4 border-t-blue-600 shadow-sm hover:shadow-md transition-shadow bg-blue-50/40"
                  >
                    <CardContent className="p-5 text-center">
                      <div className="flex justify-center mb-3">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-blue-700" />
                        </div>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm md:text-base mb-2">
                        {pillar.headline}
                      </h4>
                      <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                        {pillar.subCopy}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────── */}
      {/* 4-STEP PROCESS */}
      {/* ─────────────────────────────────────────────────────── */}
      {content.processSteps.length > 0 && (
        <section className="py-16 md:py-20 bg-blue-50/40 border-b">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                Proses Jual Laptop ke Jakarta Laptops
              </h2>
              <p className="text-slate-600">4 langkah simpel, selesai dalam 1 hari</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {content.processSteps.map((step, idx) => (
                <div key={idx} className="text-center relative">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                    {step.step}
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">{step.headline}</h4>
                  <p className="text-sm text-slate-600 mb-3">{step.subCopy}</p>
                  <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                    {step.duration}
                  </span>
                  {idx < content.processSteps.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute top-7 -right-3 h-5 w-5 text-blue-300" />
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <a href={waLink} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 h-auto">
                  {content.heroPrimaryCta}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────── */}
      {/* ESTIMASI WIDGET (interactive) */}
      {/* ─────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-white border-b">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              {content.estimasiTitle}
            </h2>
            <p className="text-slate-600">{content.estimasiSubtitle}</p>
          </div>

          <EstimasiWidget waLink={waLink} ctaLabel={content.estimasiCtaLabel} />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────── */}
      {/* FAQ SEO */}
      {/* ─────────────────────────────────────────────────────── */}
      {content.faqs.length > 0 && (
        <section className="py-16 md:py-20 bg-blue-50/40 border-b">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                Pertanyaan Umum Supplier
              </h2>
              <p className="text-slate-600">
                8 FAQ dengan keyword SEO long-tail supplier-intent
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-3">
              {content.faqs.map((faq, idx) => (
                <AccordionItem
                  key={idx}
                  value={`faq-${idx}`}
                  className="bg-white rounded-lg border border-slate-200 px-4 shadow-sm"
                >
                  <AccordionTrigger className="text-left font-semibold text-slate-900 hover:no-underline py-4">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 pb-4 pt-0">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────── */}
      {/* TRUST SIGNALS */}
      {/* ─────────────────────────────────────────────────────── */}
      {content.trustStats.length > 0 && (
        <section className="py-16 md:py-20 bg-white border-b">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                {content.trustTitle}
              </h2>
              <p className="text-slate-600">{content.trustSubtitle}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {content.trustStats.map((stat, idx) => (
                <Card key={idx} className="border border-slate-200 shadow-sm">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {stat.stat}
                    </div>
                    <div className="text-sm text-slate-600">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────── */}
      {/* FINAL CTA */}
      {/* ─────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {content.finalCtaTitle}
          </h2>
          <p className="text-blue-300 mb-8 text-lg">{content.finalCtaSubtitle}</p>

          <div className="flex flex-wrap gap-3 justify-center">
            <a href={waLink} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 h-auto">
                {content.finalCtaPrimary}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
            <a href={waLink} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-blue-400 text-white hover:bg-blue-950 font-bold px-6 py-3 h-auto bg-transparent">
                <MessageCircle className="mr-2 h-5 w-5" />
                {content.finalCtaSecondary}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────── */}
      {/* STICKY MOBILE CTA (always visible bottom) */}
      {/* ─────────────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-blue-500 p-3 md:hidden flex gap-2 shadow-lg">
        <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 h-auto text-sm">
            {content.heroPrimaryCta}
          </Button>
        </a>
        <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button variant="outline" className="w-full border-blue-400 text-white hover:bg-blue-950 font-bold py-2 h-auto text-sm bg-transparent">
            <MessageCircle className="mr-1 h-4 w-4" />
            WA
          </Button>
        </a>
      </div>

      {/* Spacer biar sticky CTA gak nutupin content bawah */}
      <div className="h-20 md:hidden" />
    </main>
  );
}

// ───────────────────────────────────────────────────────────────
// Quick Estimasi Mini Form (di hero section)
// ───────────────────────────────────────────────────────────────
function QuickEstimasiWidget({ waLink }: { waLink: string }) {
  return (
    <Card className="shadow-lg border-blue-200">
      <CardContent className="p-6">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">
          Estimasi Cepat via Foto
        </h3>

        <div className="space-y-3">
          <div>
            <Label htmlFor="qe-brand" className="text-xs text-slate-600">
              Brand &amp; Model
            </Label>
            <Input
              id="qe-brand"
              type="text"
              placeholder="MacBook Pro M1 2021"
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-xs text-slate-600">Kondisi</Label>
            <Select defaultValue="mulus">
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mulus">Mulus</SelectItem>
                <SelectItem value="minus">Minus (ret/ngezdrop)</SelectItem>
                <SelectItem value="rusak">Rusak</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="qe-foto" className="text-xs text-slate-600">
              Upload Foto (1-3 foto)
            </Label>
            <div className="mt-1 border-2 border-dashed border-blue-400 rounded-md p-4 text-center bg-blue-50 text-blue-700 text-xs font-medium">
              <Camera className="mx-auto h-6 w-6 mb-1" />
              Klik untuk pilih foto
              <br />
              <span className="opacity-70">atau drag &amp; drop</span>
            </div>
          </div>

          <a href={waLink} target="_blank" rel="noopener noreferrer">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold mt-2">
              Dapatkan Estimasi via WhatsApp
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

// ───────────────────────────────────────────────────────────────
// Full Estimasi Widget (interactive, calls /api/estimate)
// ───────────────────────────────────────────────────────────────
function EstimasiWidget({ waLink, ctaLabel }: { waLink: string; ctaLabel: string }) {
  const [namaLaptop, setNamaLaptop] = useState("");
  const [brand, setBrand] = useState("");
  const [kondisi, setKondisi] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    estimasiMin: number;
    estimasiMax: number;
    notes: string;
  } | null>(null);

  async function handleEstimasi() {
    if (!namaLaptop) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          namaLaptop,
          brand,
          kategori: "laptop",
          processor: "",
          ram: "",
          storage: "",
          gpu: "",
          tahun: "",
          kondisi: kondisi || "Bagus",
          kelengkapan: "Lengkap",
          catatan: "",
        }),
      });
      const data = await res.json();
      if (data.estimasiMin !== undefined) {
        setResult({
          estimasiMin: data.estimasiMin,
          estimasiMax: data.estimasiMax,
          notes: data.notes || "",
        });
      }
    } catch {
      // silent fail — user tetap dapat default CTA
    } finally {
      setLoading(false);
    }
  }

  const formatRp = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <Card className="border-blue-200 shadow-md bg-blue-50/40">
      <CardContent className="p-6 space-y-4">
        <div>
          <Label htmlFor="full-brand" className="text-xs text-slate-600">
            Pilih Brand
          </Label>
          <Select value={brand} onValueChange={setBrand}>
            <SelectTrigger id="full-brand" className="mt-1 bg-white">
              <SelectValue placeholder="Pilih brand laptop" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Apple">Apple MacBook</SelectItem>
              <SelectItem value="Lenovo">Lenovo ThinkPad</SelectItem>
              <SelectItem value="Dell">Dell Latitude</SelectItem>
              <SelectItem value="Asus">Asus ROG / TUF</SelectItem>
              <SelectItem value="Acer">Acer Predator</SelectItem>
              <SelectItem value="HP">HP EliteBook</SelectItem>
              <SelectItem value="MSI">MSI Gaming</SelectItem>
              <SelectItem value="Lainnya">Lainnya</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="full-nama" className="text-xs text-slate-600">
            Model Laptop
          </Label>
          <Input
            id="full-nama"
            type="text"
            placeholder="Misal: MacBook Pro M1 2021, ThinkPad X1 Carbon"
            value={namaLaptop}
            onChange={(e) => setNamaLaptop(e.target.value)}
            className="mt-1 bg-white"
          />
        </div>

        <div>
          <Label className="text-xs text-slate-600">Kondisi</Label>
          <Select value={kondisi} onValueChange={setKondisi}>
            <SelectTrigger className="mt-1 bg-white">
              <SelectValue placeholder="Pilih kondisi laptop" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Baru">Mulus / Seperti Baru</SelectItem>
              <SelectItem value="Bagus">Bagus (pakai normal)</SelectItem>
              <SelectItem value="Cacat">Minus (ret/ngezdrop)</SelectItem>
              <SelectItem value="Rusak">Rusak (mati/sebagian)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleEstimasi}
          disabled={!namaLaptop || loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
        >
          {loading ? "Memproses..." : "Dapatkan Estimasi"}
        </Button>

        {result && (
          <div className="bg-white border-2 border-blue-500 rounded-lg p-4 text-center">
            <div className="text-xs text-slate-500 uppercase tracking-wide">
              Estimasi Harga
            </div>
            <div className="text-2xl font-bold text-blue-600 my-1">
              {formatRp(result.estimasiMin)} - {formatRp(result.estimasiMax)}
            </div>
            {result.notes && (
              <div className="text-xs text-slate-600 mt-2">{result.notes}</div>
            )}
            <a href={waLink} target="_blank" rel="noopener noreferrer">
              <Button
                size="sm"
                className="mt-3 bg-green-600 hover:bg-green-700 text-white font-bold w-full"
              >
                <MessageCircle className="mr-1 h-4 w-4" />
                {ctaLabel}
              </Button>
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
