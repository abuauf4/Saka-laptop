"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gamepad2,
  Film,
  Briefcase,
  GraduationCap,
  Zap,
  Feather,
  BatteryFull,
  ArrowLeft,
  Laptop,
  MessageCircle,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useProducts } from "@/lib/product-store";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";
import { SkeletonFinderCard } from "@/components/ui/skeleton";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { StoreLogo } from "@/components/store-logo";

/* ── TYPES ── */
type Step = 1 | 2 | 3 | "loading" | "result";

interface Recommendation {
  id: string;
  name: string;
  match: number;
  reason: string;
  ram: string;
  storage: string;
  gpu: string;
  price: number;
  image?: string;
}

/* ── OPTIONS ── */
const kebutuhanOptions = [
  { id: "Gaming", label: "Gaming", icon: Gamepad2, emoji: "🎮" },
  { id: "Editing", label: "Editing", icon: Film, emoji: "🎬" },
  { id: "Kerja", label: "Kerja", icon: Briefcase, emoji: "💼" },
  { id: "Sekolah", label: "Sekolah", icon: GraduationCap, emoji: "🎓" },
];

const prioritasOptions = [
  { id: "Performa", label: "Performa", icon: Zap, emoji: "⚡" },
  { id: "Ringan", label: "Ringan", icon: Feather, emoji: "🪶" },
  { id: "Baterai", label: "Baterai", icon: BatteryFull, emoji: "🔋" },
];

/* ── ANIMATION VARIANTS ── */
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

/* ── FINDER LOGIC ── */
function computeRecommendations(
  allProducts: { id: string; nama: string; harga: number; kategori: string; ram: string; storage: string; gpu: string; performaScore: number; portableScore: number; batteryScore: number; image?: string }[],
  kebutuhan: string,
  budget: number,
  prioritas: string
): Recommendation[] {
  const budgetMax = budget * 1_000_000;

  const inBudget = allProducts.filter(
    (p) => p.harga <= budgetMax
  );

  const categoryMap: Record<string, string[]> = {
    Gaming: ["Gaming"],
    Editing: ["Editing"],
    Kerja: ["Kerja", "Ultrabook"],
    Sekolah: ["Sekolah", "Kerja"],
  };
  const matchingCategories = categoryMap[kebutuhan] || [kebutuhan];

  const scored = inBudget.map((p) => {
    let prioritasScore = 0;
    if (prioritas === "Performa") prioritasScore = p.performaScore * 4;
    else if (prioritas === "Ringan") prioritasScore = p.portableScore * 4;
    else if (prioritas === "Baterai") prioritasScore = p.batteryScore * 4;

    let categoryScore = 0;
    if (p.kategori === kebutuhan) categoryScore = 30;
    else if (matchingCategories.includes(p.kategori)) categoryScore = 20;
    else categoryScore = 5;

    const budgetRatio = p.harga / budgetMax;
    let budgetScore = budgetRatio >= 0.5 ? 30 : budgetRatio >= 0.3 ? 20 : 10;

    const rawScore = prioritasScore + categoryScore + budgetScore;
    const match = Math.min(99, Math.max(65, Math.round(rawScore)));

    let reason = "";
    if (p.kategori === kebutuhan) {
      reason = `Laptop ${p.kategori.toLowerCase()} yang cocok untuk kebutuhanmu`;
    } else if (matchingCategories.includes(p.kategori)) {
      reason = `Kategori ${p.kategori} juga sangat mendukung kebutuhan ${kebutuhan.toLowerCase()}`;
    } else {
      reason = `Performa baik untuk berbagai kebutuhan termasuk ${kebutuhan.toLowerCase()}`;
    }

    if (prioritas === "Performa" && p.performaScore >= 8) reason += ", dengan performa tinggi untuk tugas berat";
    else if (prioritas === "Ringan" && p.portableScore >= 8) reason += ", ringan dan mudah dibawa";
    else if (prioritas === "Baterai" && p.batteryScore >= 8) reason += ", daya tahan baterai lama";

    if (budgetRatio <= 0.6 && p.performaScore >= 6) reason += ", dan sangat worth it di budget ini";

    return { id: p.id, name: p.nama, match, reason, ram: p.ram, storage: p.storage, gpu: p.gpu, price: p.harga, rawScore, image: p.image || "" };
  });

  scored.sort((a, b) => b.rawScore - a.rawScore);

  let results = scored.slice(0, 3);

  if (results.length < 3) {
    const relaxedBudget = budgetMax * 1.2;
    const moreProducts = allProducts.filter(
      (p) => p.harga <= relaxedBudget && !results.find((r) => r.id === p.id)
    );

    for (const p of moreProducts) {
      if (results.length >= 3) break;

      let prioritasScore = 0;
      if (prioritas === "Performa") prioritasScore = p.performaScore * 4;
      else if (prioritas === "Ringan") prioritasScore = p.portableScore * 4;
      else if (prioritas === "Baterai") prioritasScore = p.batteryScore * 4;

      let categoryScore = p.kategori === kebutuhan ? 30 : matchingCategories.includes(p.kategori) ? 20 : 5;
      const budgetRatio = p.harga / budgetMax;
      let budgetScore = budgetRatio >= 0.5 ? 30 : budgetRatio >= 0.3 ? 20 : 10;
      if (p.harga > budgetMax) budgetScore = Math.max(0, budgetScore - 15);

      const rawScore = prioritasScore + categoryScore + budgetScore;
      const match = Math.min(99, Math.max(55, Math.round(rawScore)));

      let reason = p.kategori === kebutuhan
        ? `Laptop ${p.kategori.toLowerCase()} yang cocok untuk kebutuhanmu`
        : `Performa baik untuk kebutuhan ${kebutuhan.toLowerCase()}`;
      if (p.harga > budgetMax) reason += ", sedikit di atas budget tapi sangat worth it";

      results.push({ id: p.id, name: p.nama, match, reason, ram: p.ram, storage: p.storage, gpu: p.gpu, price: p.harga, rawScore, image: p.image || "" });
    }

    results.sort((a, b) => b.rawScore - a.rawScore);
    results = results.slice(0, 3);
  }

  return results.map(({ rawScore: _, ...rest }) => rest);
}

/* ── PAGE ── */
export default function FinderPage() {
  const { products } = useProducts();
  const [step, setStep] = useState<Step>(1);
  const [direction, setDirection] = useState(1);
  const [kebutuhan, setKebutuhan] = useState("");
  const [budget, setBudget] = useState(10);
  const [prioritas, setPrioritas] = useState("");
  const [results, setResults] = useState<Recommendation[]>([]);

  const recommendations = useMemo(() => {
    if (!kebutuhan || !prioritas) return [];
    return computeRecommendations(products, kebutuhan, budget, prioritas);
  }, [products, kebutuhan, budget, prioritas]);

  const goNext = (nextStep: Step) => {
    setDirection(1);
    setStep(nextStep);
  };

  const goBack = () => {
    setDirection(-1);
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
    else if (step === "result") setStep(3);
  };

  const handleSubmit = async () => {
    goNext("loading");
    toast("Mencari rekomendasi laptop terbaik...");
    await new Promise((r) => setTimeout(r, 1500));
    setResults(recommendations);
    setDirection(1);
    setStep("result");
  };

  const handleReset = () => {
    setKebutuhan("");
    setBudget(10);
    setPrioritas("");
    setResults([]);
    setDirection(-1);
    setStep(1);
  };

  const budgetLabel = `Rp ${budget}.000.000`;
  const currentStepNum = step === "loading" ? 3 : step === "result" ? 3 : step;

  return (
    <div className="min-h-screen flex flex-col bg-background page-animate">
      {/* ── TOP BAR ── */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl shadow-soft-sm">
        <div className="page-container flex h-14 items-center justify-between">
          {step !== 1 ? (
            <button
              onClick={goBack}
              className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-muted/60 transition-colors touch-target"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          ) : (
            <a href="/" className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-muted/60 transition-colors">
              <StoreLogo className="h-8 w-8 rounded-lg object-cover" />
            </a>
          )}

          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s <= currentStepNum ? "w-8 bg-primary" : "w-4 bg-muted/60"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1">
            {step === "result" ? (
              <button
                onClick={handleReset}
                className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-muted/60 transition-colors touch-target"
                title="Ulangi"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
            ) : null}
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* ── CONTENT ── */}
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait" custom={direction}>
          {/* ━━━ STEP 1: KEBUTUHAN ━━━ */}
          {step === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex-1 flex flex-col justify-center page-container py-10"
            >
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <p className="text-sm font-medium text-primary mb-2">Langkah 1 dari 3</p>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">
                  Apa kebutuhan kamu?
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Pilih yang paling sesuai
                </p>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4 mt-8 max-w-3xl">
                {kebutuhanOptions.map((opt, i) => {
                  const selected = kebutuhan === opt.id;
                  return (
                    <motion.button
                      key={opt.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.06 }}
                      onClick={() => {
                        setKebutuhan(opt.id);
                        setTimeout(() => goNext(2), 300);
                      }}
                      className={`relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 p-6 lg:p-8 transition-all duration-300 min-h-[120px] lg:min-h-[140px] ${
                        selected
                          ? "border-primary bg-primary/10 shadow-soft-md shadow-primary/10"
                          : "border-border/50 bg-card hover:border-primary/40 hover:shadow-soft-md hover:shadow-black/5"
                      }`}
                    >
                      <span className="text-3xl lg:text-4xl">{opt.emoji}</span>
                      <span className={`text-sm lg:text-base font-semibold ${selected ? "text-primary" : ""}`}>
                        {opt.label}
                      </span>
                      {selected && (
                        <motion.div
                          layoutId="check"
                          className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center"
                        >
                          <ChevronRight className="h-3 w-3 text-primary-foreground" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ━━━ STEP 2: BUDGET ━━━ */}
          {step === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex-1 flex flex-col justify-center page-container py-10"
            >
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="max-w-md w-full"
              >
                <p className="text-sm font-medium text-primary mb-2">Langkah 2 dari 3</p>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">
                  Budget kamu?
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Geser sesuai budgetmu
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-12 max-w-md w-full"
              >
                {/* Big budget display */}
                <div className="text-center mb-8">
                  <span className="text-5xl font-extrabold text-primary">
                    {budgetLabel}
                  </span>
                </div>

                {/* Slider */}
                <div className="px-2">
                  <Slider
                    value={[budget]}
                    min={3}
                    max={20}
                    step={1}
                    onValueChange={(v) => setBudget(v[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-3 text-sm text-muted-foreground">
                    <span>Rp 3 jt</span>
                    <span>Rp 20 jt</span>
                  </div>
                </div>

                {/* Quick pick chips */}
                <div className="flex flex-wrap justify-center gap-2 mt-6">
                  {[5, 8, 10, 12, 15].map((val) => (
                    <button
                      key={val}
                      onClick={() => setBudget(val)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 min-h-[44px] ${
                        budget === val
                          ? "border-primary bg-primary/15 text-primary"
                          : "border-border/50 bg-card text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      {val} jt
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Next button */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mt-10 max-w-md w-full"
              >
                <Button
                  className="w-full min-h-[52px] text-base font-semibold rounded-2xl gap-2 shadow-soft-md shadow-primary/15 hover:shadow-soft-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                  onClick={() => goNext(3)}
                >
                  Lanjut
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* ━━━ STEP 3: PRIORITAS ━━━ */}
          {step === 3 && (
            <motion.div
              key="step3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex-1 flex flex-col justify-center page-container py-10"
            >
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="max-w-md w-full"
              >
                <p className="text-sm font-medium text-primary mb-2">Langkah 3 dari 3</p>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">
                  Prioritas?
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Apa yang paling penting buat kamu?
                </p>
              </motion.div>

              <div className="flex flex-col gap-3 mt-8 max-w-md w-full">
                {prioritasOptions.map((opt, i) => {
                  const selected = prioritas === opt.id;
                  return (
                    <motion.button
                      key={opt.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.08 }}
                      onClick={() => setPrioritas(opt.id)}
                      className={`flex items-center gap-4 rounded-2xl border-2 px-5 py-5 transition-all duration-300 min-h-[72px] ${
                        selected
                          ? "border-primary bg-primary/10 shadow-soft-md shadow-primary/10"
                          : "border-border/50 bg-card hover:border-primary/40 hover:shadow-soft-md hover:shadow-black/5"
                      }`}
                    >
                      <span className="text-2xl">{opt.emoji}</span>
                      <div className="text-left">
                        <p className={`font-semibold text-base ${selected ? "text-primary" : ""}`}>
                          {opt.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {opt.id === "Performa" && "Performa tinggi untuk tugas berat"}
                          {opt.id === "Ringan" && "Portabel & mudah dibawa"}
                          {opt.id === "Baterai" && "Daya tahan baterai lama"}
                        </p>
                      </div>
                      {selected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto h-6 w-6 rounded-full bg-primary flex items-center justify-center"
                        >
                          <ChevronRight className="h-3.5 w-3.5 text-primary-foreground" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Submit button */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-10 max-w-md w-full"
              >
                <Button
                  className="w-full min-h-[52px] text-base font-semibold rounded-2xl gap-2 shadow-soft-md shadow-primary/15 hover:shadow-soft-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                  disabled={!prioritas}
                  onClick={handleSubmit}
                >
                  <Laptop className="h-5 w-5" />
                  Lihat Rekomendasi
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* ━━━ LOADING ━━━ */}
          {step === "loading" && (
            <motion.div
              key="loading"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex-1 flex flex-col items-center justify-center page-container"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="text-6xl mb-6"
              >
                🤖
              </motion.div>
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold text-center"
              >
                Mencari laptop terbaik...
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-muted-foreground mt-2 text-center"
              >
                Sesuai kebutuhan & budget kamu
              </motion.p>

              {/* Skeleton cards preview */}
              <div className="w-full max-w-2xl mt-8 space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <SkeletonFinderCard key={i} />
                ))}
              </div>
            </motion.div>
          )}

          {/* ━━━ RESULT ━━━ */}
          {step === "result" && (
            <motion.div
              key="result"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="flex-1 page-container py-6 pb-28 md:pb-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <h2 className="text-xl lg:text-2xl font-extrabold">Rekomendasi Untukmu</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {kebutuhan} · {budgetLabel} · {prioritas}
                </p>
              </motion.div>

              {results.length === 0 ? (
                <div className="text-center py-16">
                  <Laptop className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    Tidak ada laptop yang cocok dengan kriteria kamu.
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Coba naikkan budget atau ubah kebutuhan.
                  </p>
                  <Button onClick={handleReset} className="mt-4 gap-2 min-h-[48px] rounded-xl" variant="outline">
                    <RotateCcw className="h-4 w-4" /> Coba Lagi
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 max-w-5xl">
                  {results.map((rec, i) => (
                    <motion.div
                      key={rec.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.12, duration: 0.4 }}
                    >
                      <Card className="border-border/50 bg-card overflow-hidden card-interactive h-full flex flex-col">
                        <CardContent className="p-0 flex flex-col flex-1">
                          {/* Product Image */}
                          {rec.image && (
                            <div className="relative w-full h-48 overflow-hidden">
                              <img
                                src={rec.image}
                                alt={rec.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent" />
                            </div>
                          )}
                          {/* Top: match bar */}
                          <div className="relative bg-gradient-to-r from-primary/15 via-primary/5 to-transparent px-5 py-4">
                            <div className="flex items-center justify-between">
                              <h3 className="font-bold text-base leading-snug pr-2">
                                {rec.name}
                              </h3>
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                <span className="text-lg font-extrabold text-primary">
                                  {rec.match}%
                                </span>
                                <span className="text-xs text-muted-foreground">cocok</span>
                              </div>
                            </div>
                            {/* Match bar */}
                            <div className="mt-2 h-1 w-full rounded-full bg-muted/50 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${rec.match}%` }}
                                transition={{ duration: 0.8, delay: i * 0.12 + 0.3 }}
                                className="h-full rounded-full bg-primary"
                              />
                            </div>
                          </div>

                          {/* Reason */}
                          <div className="px-5 pt-3">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {rec.reason}
                            </p>
                          </div>

                          {/* Specs */}
                          <div className="flex flex-wrap gap-2 px-5 py-3">
                            <SpecBadge label="RAM" value={rec.ram} />
                            <SpecBadge label="SSD" value={rec.storage} />
                            <SpecBadge label="GPU" value={rec.gpu} />
                          </div>

                          {/* Price */}
                          <div className="px-5 pb-2">
                            <span className="text-base font-bold text-primary">
                              {formatPrice(rec.price)}
                            </span>
                          </div>

                          {/* WhatsApp button */}
                          <div className="px-5 pb-4 pt-1 mt-auto">
                            <a
                              href={`https://wa.me/6289662524542?text=${encodeURIComponent(
                                `Halo, saya tertarik ${rec.name}.\nKebutuhan: ${kebutuhan}\nBudget: ${budgetLabel}`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block"
                            >
                              <Button className="w-full min-h-[48px] font-semibold gap-2 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-soft-md shadow-[#25D366]/15 hover:shadow-soft-lg hover:shadow-[#25D366]/25 transition-all duration-300">
                                <MessageCircle className="h-4 w-4" />
                                Chat WhatsApp
                              </Button>
                            </a>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Bottom buttons */}
              {results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md"
                >
                  <Link href="/produk" className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full min-h-[48px] font-semibold gap-2 rounded-xl"
                    >
                      <Laptop className="h-4 w-4" />
                      Lihat Semua Laptop
                    </Button>
                  </Link>

                  <a
                    href={`https://wa.me/6289662524542?text=${encodeURIComponent(
                      "Halo, saya ingin konsultasi custom rekomendasi laptop."
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      className="w-full min-h-[48px] font-semibold gap-2 rounded-xl border-primary/40 text-primary hover:bg-primary/10"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Konsultasi Custom
                    </Button>
                  </a>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border/50 bg-card/50">
        <div className="page-container py-6">
          <p className="text-xs text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} Saka Creative Digital. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ── SPEC BADGE ── */
function SpecBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg bg-muted/30 px-2.5 py-1.5">
      <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}
