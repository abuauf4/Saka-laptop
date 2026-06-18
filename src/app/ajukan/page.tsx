"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Loader2,
  CheckCircle2,
  User,
  Phone,
  MapPin,
  Upload,
  X,
  ShieldCheck,
  Clock,
  TrendingUp,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { StoreLogo } from "@/components/store-logo";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";

interface EstimasiResult {
  estimasiMin: number;
  estimasiMax: number;
  estimasiTengah: number;
  notes: string;
  confidence: number;
}

interface FormData {
  namaLaptop: string;
  brand: string;
  kategori: string;
  processor: string;
  ram: string;
  storage: string;
  gpu: string;
  tahun: string;
  kondisi: string;
  kelengkapan: string;
  catatan: string;
  foto: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
}

const brandOptions = [
  "ASUS", "Acer", "HP", "Dell", "Lenovo", "MSI",
  "Apple", "LG", "Samsung", "Toshiba", "Fujitsu", "Lainnya",
];

const kategoriOptions = [
  "Gaming", "Editing", "Kerja", "Sekolah", "Ultrabook",
];

const ramOptions = ["4GB", "8GB", "16GB", "32GB", "64GB"];
const storageOptions = [
  "128GB SSD", "256GB SSD", "512GB SSD", "1TB SSD", "2TB SSD",
  "256GB HDD", "500GB HDD", "1TB HDD",
];
const kondisiOptions = ["Baru", "Bagus", "Cacat", "Rusak"];
const kelengkapanOptions = [
  "Lengkap (Charger + Box + Garansi)",
  "Charger saja",
  "Tanpa Charger",
  "Lainnya (sebutkan di catatan)",
];

export default function AjukanPage() {
  const [estimasi, setEstimasi] = useState<EstimasiResult | null>(null);
  const [loadingEstimasi, setLoadingEstimasi] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const [form, setForm] = useState<FormData>({
    namaLaptop: "",
    brand: "",
    kategori: "Ultrabook",
    processor: "",
    ram: "8GB",
    storage: "512GB SSD",
    gpu: "",
    tahun: "",
    kondisi: "Bagus",
    kelengkapan: kelengkapanOptions[0],
    catatan: "",
    foto: "",
    customerName: "",
    customerPhone: "",
    customerAddress: "",
  });

  const update = (k: keyof FormData, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  async function getEstimasi() {
    if (!form.namaLaptop || !form.brand || !form.processor) {
      toast.error("Isi nama laptop, brand, dan processor dulu");
      return;
    }
    setLoadingEstimasi(true);
    setEstimasi(null);
    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          namaLaptop: form.namaLaptop,
          brand: form.brand,
          kategori: form.kategori,
          ram: form.ram,
          storage: form.storage,
          gpu: form.gpu,
          processor: form.processor,
          tahun: form.tahun ? parseInt(form.tahun) : 0,
          kondisi: form.kondisi,
          kelengkapan: form.kelengkapan,
          catatan: form.catatan,
        }),
      });
      if (!res.ok) throw new Error("Estimasi gagal");
      const data = await res.json();
      setEstimasi(data);
      toast.success("Estimasi AI siap!");
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengestimasi. Coba lagi atau langsung submit.");
    } finally {
      setLoadingEstimasi(false);
    }
  }

  async function submitForm() {
    if (!form.namaLaptop || !form.customerName || !form.customerPhone) {
      toast.error("Lengkapi nama laptop, nama, dan nomor HP");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tahun: form.tahun ? parseInt(form.tahun) : 0,
          estimasiAI: estimasi?.estimasiTengah || 0,
          estimasiNotes: estimasi?.notes || "",
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Submit gagal");
      }
      const data = await res.json();
      setSubmissionId(data.id);
      setSubmitted(true);
      toast.success("Pengajuan terkirim!");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Gagal mengirim");
    } finally {
      setSubmitting(false);
    }
  }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Foto maksimal 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => update("foto", reader.result as string);
    reader.readAsDataURL(file);
  }

  /* ── SUCCESS SCREEN ── */
  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="max-w-lg w-full"
          >
            <Card className="border-border/50">
              <CardContent className="p-10 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12, delay: 0.2 }}
                  className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-foreground/10 mb-5"
                >
                  <CheckCircle2 className="h-9 w-9 text-foreground" />
                </motion.div>
                <h1 className="text-2xl font-bold mb-2">
                  Pengajuan Diterima
                </h1>
                <p className="text-sm text-muted-foreground mb-1">
                  Terima kasih sudah mengajukan laptop Anda.
                </p>
                <p className="text-xs text-muted-foreground mb-6">
                  ID:{" "}
                  <span className="font-mono font-semibold text-foreground">
                    {submissionId?.slice(-8).toUpperCase()}
                  </span>
                </p>

                <div className="bg-muted/40 rounded-xl p-4 mb-6 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">
                      Status saat ini
                    </span>
                    <Badge variant="outline" className="bg-sky-500/10 text-sky-500 border-sky-500/30">
                      Data Diterima
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Tim akan menghubungi Anda via WhatsApp dalam 1×24 jam untuk
                    konfirmasi jadwal inspeksi.
                  </p>
                </div>

                <div className="bg-muted/30 rounded-xl p-4 text-left mb-6">
                  <h3 className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                    <Clock className="h-3 w-3" /> Langkah Selanjutnya
                  </h3>
                  <ol className="text-xs text-muted-foreground space-y-1.5 list-decimal list-inside">
                    <li>Admin menghubungi via WhatsApp (1×24 jam).</li>
                    <li>Bawa laptop ke toko untuk QC fisik (30-60 menit).</li>
                    <li>Penawaran harga dikirim setelah QC.</li>
                    <li>Deal? Pembayaran langsung dilakukan.</li>
                  </ol>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button asChild className="flex-1">
                    <Link href="/">Kembali ke Beranda</Link>
                  </Button>
                  <Button variant="outline" asChild className="flex-1">
                    <Link href="/#proses">Lihat Proses</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    );
  }

  /* ── MAIN FORM ── */
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 page-container py-10 md:py-16">
        <div className="max-w-3xl mx-auto">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Kembali
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Ajukan Laptop Kamu
            </h1>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl">
              Isi data seakurat mungkin. Kamu bisa pakai AI Estimator untuk
              estimasi awal — harga final tetap berdasarkan hasil QC fisik.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* ── FORM (col-span 2) ── */}
            <div className="lg:col-span-2 space-y-6">
              {/* Section: Data Laptop */}
              <FormSection
                title="Data Laptop"
                desc="Spek & tipe laptop yang kamu ajukan"
              >
                <div className="space-y-4">
                  <Field label="Nama Laptop" required>
                    <Input
                      value={form.namaLaptop}
                      onChange={(e) => update("namaLaptop", e.target.value)}
                      placeholder="cth: Asus ROG Strix G16"
                      className="h-11"
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Brand" required>
                      <SelectInput
                        value={form.brand}
                        onChange={(v) => update("brand", v)}
                        options={brandOptions}
                        placeholder="Pilih…"
                      />
                    </Field>
                    <Field label="Tahun Beli">
                      <Input
                        type="number"
                        value={form.tahun}
                        onChange={(e) => update("tahun", e.target.value)}
                        placeholder="2022"
                        className="h-11"
                      />
                    </Field>
                  </div>

                  <Field label="Processor" required>
                    <Input
                      value={form.processor}
                      onChange={(e) => update("processor", e.target.value)}
                      placeholder="cth: Intel Core i7-12700H"
                      className="h-11"
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-3">
                    <Field label="RAM">
                      <SelectInput
                        value={form.ram}
                        onChange={(v) => update("ram", v)}
                        options={ramOptions}
                      />
                    </Field>
                    <Field label="Storage">
                      <SelectInput
                        value={form.storage}
                        onChange={(v) => update("storage", v)}
                        options={storageOptions}
                      />
                    </Field>
                  </div>

                  <Field label="GPU (opsional)">
                    <Input
                      value={form.gpu}
                      onChange={(e) => update("gpu", e.target.value)}
                      placeholder="cth: RTX 4060 / Intel Iris Xe"
                      className="h-11"
                    />
                  </Field>

                  <Field label="Kategori">
                    <div className="flex flex-wrap gap-2">
                      {kategoriOptions.map((k) => (
                        <button
                          key={k}
                          type="button"
                          onClick={() => update("kategori", k)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            form.kategori === k
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border/50 text-muted-foreground hover:border-primary/30"
                          }`}
                        >
                          {k}
                        </button>
                      ))}
                    </div>
                  </Field>
                </div>
              </FormSection>

              {/* Section: Kondisi & Foto */}
              <FormSection
                title="Kondisi & Foto"
                desc="Jujur soal kondisi = estimasi lebih akurat"
              >
                <div className="space-y-4">
                  <Field label="Kondisi Fisik">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {kondisiOptions.map((k) => (
                        <button
                          key={k}
                          type="button"
                          onClick={() => update("kondisi", k)}
                          className={`rounded-lg border-2 py-2 text-xs font-medium transition-all ${
                            form.kondisi === k
                              ? "border-primary bg-primary/10"
                              : "border-border/50 hover:border-primary/30"
                          }`}
                        >
                          {k}
                        </button>
                      ))}
                    </div>
                  </Field>

                  <Field label="Kelengkapan">
                    <div className="space-y-2">
                      {kelengkapanOptions.map((k) => (
                        <button
                          key={k}
                          type="button"
                          onClick={() => update("kelengkapan", k)}
                          className={`flex items-center gap-2 w-full rounded-lg border-2 p-3 text-left text-sm transition-all ${
                            form.kelengkapan === k
                              ? "border-primary bg-primary/5"
                              : "border-border/50 hover:border-primary/30"
                          }`}
                        >
                          <div
                            className={`h-4 w-4 rounded-full border-2 ${
                              form.kelengkapan === k
                                ? "border-primary bg-primary"
                                : "border-muted-foreground/40"
                            }`}
                          />
                          {k}
                        </button>
                      ))}
                    </div>
                  </Field>

                  <Field label="Foto Laptop (opsional)">
                    {form.foto ? (
                      <div className="relative rounded-xl overflow-hidden border border-border/50">
                        <img
                          src={form.foto}
                          alt="Foto laptop"
                          className="w-full h-48 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => update("foto", "")}
                          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center gap-2 h-32 rounded-xl border-2 border-dashed border-border/50 hover:border-primary/50 cursor-pointer transition-colors">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Klik untuk upload (maks 2MB)
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhoto}
                          className="hidden"
                        />
                      </label>
                    )}
                  </Field>

                  <Field label="Catatan Tambahan">
                    <Textarea
                      value={form.catatan}
                      onChange={(e) => update("catatan", e.target.value)}
                      placeholder="cth: baterai drop, ada gores di sudut, masih garansi"
                      className="min-h-[80px]"
                    />
                  </Field>
                </div>
              </FormSection>

              {/* Section: Data Customer */}
              <FormSection
                title="Data Kamu"
                desc="Untuk kontak & koordinasi inspeksi"
              >
                <div className="space-y-4">
                  <Field label="Nama Lengkap" required>
                    <div className="relative">
                      <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={form.customerName}
                        onChange={(e) => update("customerName", e.target.value)}
                        placeholder="cth: Budi Santoso"
                        className="h-11 pl-9"
                      />
                    </div>
                  </Field>

                  <Field label="No. WhatsApp" required>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={form.customerPhone}
                        onChange={(e) => update("customerPhone", e.target.value)}
                        placeholder="08xxxxxxxxxx"
                        className="h-11 pl-9"
                        type="tel"
                      />
                    </div>
                  </Field>

                  <Field label="Domisili (opsional)">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={form.customerAddress}
                        onChange={(e) => update("customerAddress", e.target.value)}
                        placeholder="Kota"
                        className="h-11 pl-9"
                      />
                    </div>
                  </Field>
                </div>
              </FormSection>

              {/* Submit */}
              <div className="pt-2">
                <Button
                  onClick={submitForm}
                  disabled={submitting || !form.namaLaptop || !form.customerName || !form.customerPhone}
                  size="lg"
                  className="w-full min-h-[52px] gap-2 text-base font-semibold rounded-xl"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Mengirim…
                    </>
                  ) : (
                    <>
                      Kirim Pengajuan
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-3 flex items-center justify-center gap-1.5">
                  <Lock className="h-3 w-3" />
                  Data kamu aman & tidak dibagikan ke pihak ketiga
                </p>
              </div>
            </div>

            {/* ── STICKY SIDEBAR: AI Estimator ── */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-20 space-y-4">
                <Card className="border-border/50 bg-card/60">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <h3 className="text-sm font-semibold">
                        AI Estimator
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                      Dapatkan estimasi harga awal sebelum submit. Harga final
                      tetap berdasarkan QC fisik.
                    </p>

                    {loadingEstimasi ? (
                      <div className="flex flex-col items-center py-8">
                        <Loader2 className="h-7 w-7 animate-spin text-primary" />
                        <p className="text-xs text-muted-foreground mt-3">
                          AI sedang analisa…
                        </p>
                      </div>
                    ) : estimasi ? (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center mb-3">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                            Estimasi
                          </p>
                          <p className="text-2xl font-bold text-primary">
                            {formatPrice(estimasi.estimasiTengah)}
                          </p>
                          <div className="flex items-center justify-center gap-2 mt-2">
                            <Badge variant="outline" className="text-[10px] bg-background/60">
                              {formatPrice(estimasi.estimasiMin)}
                            </Badge>
                            <span className="text-muted-foreground text-[10px]">—</span>
                            <Badge variant="outline" className="text-[10px] bg-background/60">
                              {formatPrice(estimasi.estimasiMax)}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-center gap-1 mt-2">
                            <TrendingUp className="h-3 w-3 text-foreground" />
                            <span className="text-[10px] text-muted-foreground">
                              Confidence {estimasi.confidence}%
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={getEstimasi}
                          className="w-full"
                        >
                          <Sparkles className="h-3 w-3 mr-1.5" /> Hitung Ulang
                        </Button>
                      </motion.div>
                    ) : (
                      <Button
                        onClick={getEstimasi}
                        size="sm"
                        className="w-full"
                        disabled={!form.namaLaptop || !form.brand || !form.processor}
                      >
                        <Sparkles className="h-3 w-3 mr-1.5" />
                        Hitung Estimasi
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Trust mini-badges */}
                <div className="grid grid-cols-3 gap-2">
                  <MiniBadge icon={ShieldCheck} label="QC Transparan" />
                  <MiniBadge icon={Clock} label="Proses Cepat" />
                  <MiniBadge icon={Lock} label="Data Aman" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ── HEADER ── */
function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="page-container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <StoreLogo />
          <span className="text-base font-semibold tracking-tight">
            Jakarta Laptops
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
            <Link href="/">
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Beranda
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

/* ── HELPERS ── */
function FormSection({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-border/50">
      <CardContent className="p-6">
        <div className="mb-5">
          <h2 className="text-base font-semibold">{title}</h2>
          {desc && (
            <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
          )}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      {children}
    </div>
  );
}

function SelectInput({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function MiniBadge({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-1 p-3 rounded-xl border border-border/40 bg-card/40">
      <Icon className="h-4 w-4 text-primary" />
      <span className="text-[10px] font-medium leading-tight">{label}</span>
    </div>
  );
}
