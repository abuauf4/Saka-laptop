"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  X,
  MessageCircle,
  Trophy,
  BadgePercent,
  Laptop,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useProducts } from "@/lib/product-store";
import { type Product } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { SkeletonCard } from "@/components/ui/skeleton";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { StoreLogo } from "@/components/store-logo";

/* ── CONSTANTS ── */
const categories = ["Semua", "Gaming", "Editing", "Kerja", "Sekolah", "Ultrabook"];

const priceRanges = [
  { label: "Semua Harga", min: 0, max: Infinity },
  { label: "< 8 Juta", min: 0, max: 8_000_000 },
  { label: "8 – 15 Juta", min: 8_000_000, max: 15_000_000 },
  { label: "15 – 20 Juta", min: 15_000_000, max: 20_000_000 },
  { label: "> 20 Juta", min: 20_000_000, max: Infinity },
];

const categoryColors: Record<string, string> = {
  Gaming: "bg-red-500/15 text-red-400 border-red-500/30",
  Editing: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  Kerja: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  Sekolah: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Ultrabook: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

/* ── LABEL LOGIC ── */
function getLabels(product: Product): string[] {
  const labels: string[] = [];
  if (product.performaScore >= 9) labels.push("Best Performance");
  if (product.harga <= 10_000_000 && product.performaScore >= 5) labels.push("Value");
  return labels;
}

const labelStyles: Record<string, string> = {
  "Best Performance": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Value: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

const labelIcons: Record<string, typeof Trophy> = {
  "Best Performance": Trophy,
  Value: BadgePercent,
};

/* ── PAGE ── */
export default function ProdukPage() {
  const { products, isLoaded } = useProducts();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");
  const [priceIdx, setPriceIdx] = useState("0");
  const [filterOpen, setFilterOpen] = useState(false);

  // Filter logic
  const filtered = useMemo(() => {
    const range = priceRanges[parseInt(priceIdx)] || priceRanges[0];
    return products.filter((p) => {
      const matchSearch =
        !search ||
        p.nama.toLowerCase().includes(search.toLowerCase()) ||
        p.kategori.toLowerCase().includes(search.toLowerCase()) ||
        p.gpu.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "Semua" || p.kategori === category;
      const matchPrice = p.harga >= range.min && p.harga < range.max;
      return matchSearch && matchCategory && matchPrice;
    });
  }, [search, category, priceIdx, products]);

  const activeFilters = [
    category !== "Semua" ? category : null,
    parseInt(priceIdx) !== 0 ? priceRanges[parseInt(priceIdx)]?.label : null,
  ].filter(Boolean) as string[];

  const clearFilters = () => {
    setSearch("");
    setCategory("Semua");
    setPriceIdx("0");
  };

  return (
    <div className="min-h-screen bg-background page-animate">
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl shadow-soft-sm">
        <div className="page-container py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="/" className="flex items-center gap-2">
                <StoreLogo className="h-8 w-8 rounded-xl object-cover" />
                <h1 className="text-lg font-bold">Katalog Laptop</h1>
              </a>
              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center gap-1 ml-4">
                <a href="/" className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-lg transition-colors">Home</a>
                <a href="/finder" className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-lg transition-colors">AI Finder</a>
                <a href="/#lokasi" className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-lg transition-colors">Lokasi</a>
                <a href="/admin" className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-lg transition-colors">Admin</a>
              </nav>
            </div>
            <ThemeSwitcher />
          </div>

          {/* Search + Filter button */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama, kategori, GPU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-12 bg-card border-border/50 text-base rounded-xl"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-xl flex-shrink-0 relative"
              onClick={() => setFilterOpen(true)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              {activeFilters.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-[11px] flex items-center justify-center text-primary-foreground">
                  {activeFilters.length}
                </span>
              )}
            </Button>
          </div>

          {/* Active filter chips */}
          {activeFilters.length > 0 && (
            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
              {activeFilters.map((f) => (
                <Badge key={f} variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                  {f}
                </Badge>
              ))}
              <Button variant="ghost" size="sm" className="text-xs h-7 px-2 text-muted-foreground" onClick={clearFilters}>
                <X className="h-3 w-3 mr-1" /> Hapus
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* ── CATEGORY CHIPS ── */}
      <div className="border-b border-border/50">
        <div className="page-container py-3 flex gap-2 overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? "default" : "outline"}
              size="sm"
              className="text-sm rounded-full whitespace-nowrap min-h-[44px] px-5"
              onClick={() => setCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* ── PRODUCT LIST ── */}
      <div className="page-container py-5 pb-24 md:pb-8">
        {!isLoaded ? (
          <>
            <div className="h-5 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {filtered.length} laptop ditemukan
            </p>

            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <Laptop className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-muted-foreground">Tidak ada laptop ditemukan</p>
                <Button variant="link" className="mt-2 text-primary" onClick={clearFilters}>
                  Hapus semua filter
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                <AnimatePresence mode="popLayout">
                  {filtered.map((product, index) => (
                    <ProductListItem key={product.id} product={product} index={index} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── FILTER SHEET ── */}
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent className="w-full sm:max-w-sm bg-card">
          <SheetHeader>
            <SheetTitle>Filter</SheetTitle>
          </SheetHeader>
          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Kategori</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Rentang Harga</label>
              <Select value={priceIdx} onValueChange={setPriceIdx}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priceRanges.map((range, i) => (
                    <SelectItem key={i} value={i.toString()}>{range.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1 min-h-[48px] rounded-xl" onClick={clearFilters}>
                Reset
              </Button>
              <Button className="flex-1 min-h-[48px] rounded-xl" onClick={() => setFilterOpen(false)}>
                Terapkan
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

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

/* ── PRODUCT CARD COMPONENT ── */
function ProductListItem({ product, index }: { product: Product; index: number }) {
  const labels = getLabels(product);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.03, duration: 0.25 }}
    >
      <div className="card-interactive overflow-hidden rounded-xl">
        {/* Top: Image + Badges */}
        <div className="relative flex items-center justify-center bg-muted/10 overflow-hidden" style={{ minHeight: product.image ? '180px' : undefined }}>
          {product.image ? (
            <img
              src={product.image}
              alt={product.nama}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="py-6">
              <Laptop className="h-14 w-14 text-muted-foreground/20" />
            </div>
          )}

          <Badge
            variant="outline"
            className={`absolute top-3 left-3 text-xs px-1.5 py-0.5 ${categoryColors[product.kategori] || "bg-muted text-muted-foreground"}`}
          >
            {product.kategori}
          </Badge>

          {labels.length > 0 && (
            <div className="absolute top-3 right-3 flex flex-col gap-1">
              {labels.map((label) => {
                const Icon = labelIcons[label] || Trophy;
                return (
                  <Badge
                    key={label}
                    variant="outline"
                    className={`text-xs px-1.5 py-0.5 gap-0.5 ${labelStyles[label] || ""}`}
                  >
                    <Icon className="h-2.5 w-2.5" />
                    {label}
                  </Badge>
                );
              })}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-bold text-base leading-snug">{product.nama}</h3>
            <p className="text-primary font-extrabold text-lg mt-1">
              {formatPrice(product.harga)}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <SpecChip label="RAM" value={product.ram} />
            <SpecChip label="SSD" value={product.storage} />
            <SpecChip label="GPU" value={product.gpu} />
          </div>

          <div className="space-y-2">
            <ScoreBar label="Performa" score={product.performaScore} />
            <ScoreBar label="Portabel" score={product.portableScore} />
            <ScoreBar label="Baterai" score={product.batteryScore} />
          </div>

          <a
            href={`https://wa.me/6289662524542?text=${encodeURIComponent(
              `Halo, saya tertarik ${product.nama}.\nKebutuhan: ${product.kategori}\nBudget: ${formatPrice(product.harga)}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button className="w-full min-h-[48px] font-semibold gap-2 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-soft-md shadow-[#25D366]/15 hover:shadow-soft-lg hover:shadow-[#25D366]/25 transition-all duration-300" >
              <MessageCircle className="h-4 w-4" />
              Chat WhatsApp
            </Button>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

/* ── SPEC CHIP ── */
function SpecChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-muted/30 px-2.5 py-1">
      <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}

/* ── SCORE BAR ── */
function ScoreBar({ label, score }: { label: string; score: number }) {
  const width = `${score * 10}%`;
  const color =
    score >= 8
      ? "bg-emerald-500"
      : score >= 6
        ? "bg-sky-500"
        : score >= 4
          ? "bg-amber-500"
          : "bg-red-500";

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground w-[52px] flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-muted/30 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <span className="text-xs font-bold w-4 text-right">{score}</span>
    </div>
  );
}
