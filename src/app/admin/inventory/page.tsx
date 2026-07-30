"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Warehouse,
  Loader2,
  Trash2,
  Laptop,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Package,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatPrice, formatDateTime } from "@/lib/format";
import { toast } from "sonner";

interface BarangItem {
  id: string;
  kode: string;
  merk: string;
  tipe: string;
  spesifikasi: string;
  keterangan: string;
  hargaBeli: number;
  hargaJual: number | null;
  status: string;
  namaPembeli: string | null;
  noWa: string | null;
  domisili: string | null;
  soldAt: string | null;
  createdAt: string;
  updatedAt: string;
}

function exportCSV(items: BarangItem[], label: string) {
  const header = "Kode,Merk,Tipe,Spesifikasi,Keterangan,Harga Beli,Harga Jual,Status,Pembeli,WhatsApp,Domisili,Tanggal Masuk,Tanggal Terjual";
  const rows = items.map((i) => {
    const jual = i.hargaJual || Math.round(i.hargaBeli * 1.3);
    return [
      `"${i.kode}"`,
      `"${i.merk}"`,
      `"${i.tipe}"`,
      `"${(i.spesifikasi || "").replace(/"/g, '""')}"`,
      `"${(i.keterangan || "").replace(/"/g, '""')}"`,
      i.hargaBeli,
      jual,
      i.status === "sold" ? "Terjual" : "Available",
      `"${i.namaPembeli || ""}"`,
      `"${i.noWa || ""}"`,
      `"${i.domisili || ""}"`,
      `"${formatDateTime(i.createdAt)}"`,
      `"${i.soldAt ? formatDateTime(i.soldAt) : ""}"`,
    ].join(",");
  });
  const csv = [header, ...rows].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `inventory-${label}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success(`Exported ${items.length} barang ke CSV`);
}

export default function InventoryPage() {
  const [items, setItems] = useState<BarangItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<BarangItem | null>(null);
  const [newHargaJual, setNewHargaJual] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadItems() {
    try {
      const res = await fetch("/api/inventory");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoaded(true);
    }
  }

  useMemo(() => {
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((i) => i.status === filter);
  }, [items, filter]);

  const stats = useMemo(() => {
    const inStock = items.filter((i) => i.status === "available");
    const sold = items.filter((i) => i.status === "sold");
    return {
      total: items.length,
      inStock: inStock.length,
      sold: sold.length,
      totalModal: inStock.reduce((s, i) => s + i.hargaBeli, 0),
      totalDisalurkan: sold.reduce((s, i) => s + (i.hargaJual || 0), 0),
      potensiProfit: inStock.reduce(
        (s, i) =>
          s + ((i.hargaJual || Math.round(i.hargaBeli * 1.3)) - i.hargaBeli),
        0
      ),
    };
  }, [items]);

  function openDetail(item: BarangItem) {
    setSelected(item);
    setNewHargaJual(String(item.hargaJual || Math.round(item.hargaBeli * 1.3)));
  }

  async function markAsSold() {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/inventory/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "sold",
          hargaJual: parseInt(newHargaJual) || selected.hargaJual || 0,
        }),
      });
      if (res.ok) {
        toast.success("Barang ditandai terjual!");
        loadItems();
        setSelected(null);
      } else {
        throw new Error("Failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal update");
    } finally {
      setSaving(false);
    }
  }

  async function updateHarga() {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/inventory/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hargaJual: parseInt(newHargaJual) }),
      });
      if (res.ok) {
        toast.success("Harga jual diupdate");
        loadItems();
        setSelected({
          ...selected,
          hargaJual: parseInt(newHargaJual),
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal update");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: BarangItem) {
    if (!confirm(`Hapus ${item.merk} ${item.tipe}?`)) return;
    setSaving(true);
    try {
      await fetch(`/api/inventory/${item.id}`, { method: "DELETE" });
      toast.success("Item dihapus");
      loadItems();
      setSelected(null);
    } catch (err) {
      console.error(err);
      toast.error("Gagal hapus");
    } finally {
      setSaving(false);
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const filterLabel = filter === "all" ? "semua" : filter;

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/30">
        <div className="page-container py-4 sm:py-6">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold flex items-center gap-2">
                <Warehouse className="h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0" />
                <span className="truncate">Inventory</span>
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                Semua barang yang masuk ke gudang
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportCSV(filtered, filterLabel)}
                disabled={filtered.length === 0}
                className="gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Export</span>
              </Button>
              <Button variant="outline" size="sm" onClick={loadItems}>
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Stats - 2 col on mobile, 5 on md */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
          <StatCard label="Total" value={String(stats.total)} color="text-primary" icon={Package} />
          <StatCard label="Available" value={String(stats.inStock)} color="text-foreground" icon={CheckCircle2} />
          <StatCard label="Terjual" value={String(stats.sold)} color="text-zinc-400" icon={DollarSign} />
          <StatCard label="Total Modal" value={formatPrice(stats.totalModal).replace("Rp", "").trim()} color="text-amber-500" icon={TrendingUp} />
          <StatCard label="Potensi Profit" value={formatPrice(stats.potensiProfit).replace("Rp", "").trim()} color="text-foreground" icon={TrendingUp} />
        </div>

        {/* Filter tabs + export mobile */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {[
              { id: "all", label: "Semua" },
              { id: "available", label: "Available" },
              { id: "sold", label: "Terjual" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  filter === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* Mobile-only export button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportCSV(filtered, filterLabel)}
            disabled={filtered.length === 0}
            className="sm:hidden gap-1.5 shrink-0"
          >
            <Download className="h-3.5 w-3.5" />
            CSV
          </Button>
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-10 sm:py-12 text-center">
              <Warehouse className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">
                {filter === "all"
                  ? "Inventory kosong"
                  : `Tidak ada barang ${filter === "available" ? "available" : "terjual"}`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-2 sm:gap-3">
            {filtered.map((item, idx) => {
              const suggestedPrice = Math.round(item.hargaBeli * 1.3);
              const displayJual = item.hargaJual || suggestedPrice;
              const profit = displayJual - item.hargaBeli;
              const isSold = item.status === "sold";

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.04, 0.3) }}
                >
                  <Card
                    className={`border-border/50 hover:border-primary/30 hover:shadow-soft-sm transition-all cursor-pointer ${
                      isSold ? "opacity-60" : ""
                    }`}
                    onClick={() => openDetail(item)}
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-start gap-2.5 sm:gap-3">
                        <div className="h-11 w-11 sm:h-14 sm:w-14 shrink-0 rounded-lg sm:rounded-xl overflow-hidden bg-muted/40 flex items-center justify-center">
                          <Laptop className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground/40" />
                        </div>
                        <div className="flex-1 min-w-0">
                          {/* Badges row */}
                          <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                            <Badge variant="outline" className="text-[9px] sm:text-[10px] font-mono">
                              {item.kode}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-[9px] sm:text-[10px] ${
                                isSold
                                  ? "bg-zinc-500/10 text-zinc-400 border-zinc-500/30"
                                  : "bg-foreground/10 text-foreground border-foreground/30"
                              }`}
                            >
                              {isSold ? "Terjual" : "Available"}
                            </Badge>
                            <span className="text-[10px] sm:text-xs text-muted-foreground">
                              {formatDateTime(item.createdAt)}
                            </span>
                          </div>
                          <h3 className="text-sm sm:text-base font-semibold truncate">
                            {item.merk} {item.tipe}
                          </h3>
                          {item.spesifikasi && (
                            <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 truncate">
                              {item.spesifikasi}
                            </p>
                          )}
                          {item.keterangan && (
                            <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 truncate italic">
                              {item.keterangan}
                            </p>
                          )}
                          {/* Price row - wraps on mobile */}
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[11px] sm:text-xs">
                            <span className="text-muted-foreground">
                              Modal: <strong className="text-amber-500">{formatPrice(item.hargaBeli)}</strong>
                            </span>
                            <span className="text-muted-foreground">
                              Jual: <strong className="text-foreground">{formatPrice(displayJual)}</strong>
                            </span>
                            <Badge variant="outline" className="text-[8px] sm:text-[9px]">
                              +{formatPrice(profit).replace("Rp", "").trim()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* DETAIL DIALOG */}
      <Dialog
        open={selected !== null}
        onOpenChange={(o) => !o && setSelected(null)}
      >
        <DialogContent className="bg-card border-border sm:max-w-lg max-w-[calc(100vw-2rem)] max-h-[90vh] overflow-y-auto mx-2">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 pr-8">
                  <Warehouse className="h-5 w-5 text-primary" />
                  Detail Barang
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <DetailItem label="Kode" value={selected.kode} />
                  <DetailItem
                    label="Status"
                    value={selected.status === "sold" ? "Terjual" : "Available"}
                    className={selected.status === "sold" ? "text-zinc-400" : "text-emerald-500"}
                  />
                  <DetailItem label="Merk" value={selected.merk} className="col-span-2" />
                  <DetailItem label="Tipe" value={selected.tipe} className="col-span-2" />
                  <DetailItem label="Spesifikasi" value={selected.spesifikasi || "-"} className="col-span-2" />
                  <DetailItem label="Keterangan" value={selected.keterangan || "-"} className="col-span-2" />
                </div>

                {selected.status === "sold" && (
                  <div className="space-y-2">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      Info Pembeli
                    </p>
                    <div className="rounded-lg bg-muted/40 p-3 text-sm space-y-1">
                      {selected.namaPembeli && <p>Pembeli: {selected.namaPembeli}</p>}
                      {selected.noWa && <p>WhatsApp: {selected.noWa}</p>}
                      {selected.domisili && <p>Domisili: {selected.domisili}</p>}
                      {selected.soldAt && (
                        <p className="text-xs text-muted-foreground">
                          Terjual: {formatDateTime(selected.soldAt)}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-3">
                    <p className="text-[10px] text-muted-foreground uppercase">Modal (Beli)</p>
                    <p className="text-lg font-bold text-amber-500">{formatPrice(selected.hargaBeli)}</p>
                  </div>
                  <div className="rounded-lg bg-foreground/5 border border-foreground/20 p-3">
                    <p className="text-[10px] text-muted-foreground uppercase">Harga Jual</p>
                    <p className="text-lg font-bold text-foreground">
                      {formatPrice(selected.hargaJual || Math.round(selected.hargaBeli * 1.3))}
                    </p>
                  </div>
                </div>

                {selected.status === "available" && (
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs font-medium mb-1.5 block">Update Harga Jual (Rp)</label>
                      <Input
                        type="number"
                        value={newHargaJual}
                        onChange={(e) => setNewHargaJual(e.target.value)}
                        className="h-11"
                      />
                      {newHargaJual && (
                        <p className="text-xs text-emerald-500 font-semibold mt-1">
                          Profit: {formatPrice(parseInt(newHargaJual || "0") - selected.hargaBeli)}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" onClick={updateHarga} disabled={saving}>
                        Update Harga
                      </Button>
                      <Button onClick={markAsSold} disabled={saving} className="bg-zinc-700 hover:bg-zinc-800">
                        <CheckCircle2 className="h-4 w-4 mr-1.5" />
                        Tandai Terjual
                      </Button>
                    </div>
                  </div>
                )}

                <div className="border-t border-border/50 pt-3 flex justify-end">
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={saving}
                    onClick={() => handleDelete(selected)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Hapus Barang
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({ label, value, color, icon: Icon }: {
  label: string; value: string; color: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="border-border/50">
      <CardContent className="p-2.5 sm:p-3">
        <div className="flex items-center gap-1.5 mb-1">
          <Icon className={`h-3 w-3 ${color}`} />
          <span className="text-[10px] sm:text-xs text-muted-foreground">{label}</span>
        </div>
        <p className={`text-sm sm:text-base font-bold ${color}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

function DetailItem({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-sm font-medium">{value || "-"}</p>
    </div>
  );
}