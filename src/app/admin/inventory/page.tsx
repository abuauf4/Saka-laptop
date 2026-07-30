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

  return (
    <div className="min-h-full bg-background">
      <div className="border-b border-border/40 bg-card/30">
        <div className="page-container py-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Warehouse className="h-6 w-6 text-primary" />
                Inventory
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Semua barang yang masuk ke gudang
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={loadItems}>
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="page-container py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatCard
            label="Total"
            value={String(stats.total)}
            color="text-primary"
            icon={Package}
          />
          <StatCard
            label="Available"
            value={String(stats.inStock)}
            color="text-foreground"
            icon={CheckCircle2}
          />
          <StatCard
            label="Terjual"
            value={String(stats.sold)}
            color="text-zinc-400"
            icon={DollarSign}
          />
          <StatCard
            label="Total Modal"
            value={formatPrice(stats.totalModal).replace("Rp", "").trim()}
            color="text-amber-500"
            icon={TrendingUp}
          />
          <StatCard
            label="Potensi Profit"
            value={formatPrice(stats.potensiProfit).replace("Rp", "").trim()}
            color="text-foreground"
            icon={TrendingUp}
          />
        </div>

        {/* Filter */}
        <div className="flex gap-1">
          {[
            { id: "all", label: "Semua" },
            { id: "available", label: "Available" },
            { id: "sold", label: "Terjual" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <Warehouse className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">
                {filter === "all"
                  ? "Inventory kosong"
                  : `Tidak ada barang ${filter === "available" ? "available" : "terjual"}`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
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
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-muted/40 flex items-center justify-center">
                          <Laptop className="h-5 w-5 text-muted-foreground/40" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant="outline"
                              className="text-[10px] font-mono"
                            >
                              {item.kode}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${
                                isSold
                                  ? "bg-zinc-500/10 text-zinc-400 border-zinc-500/30"
                                  : "bg-foreground/10 text-foreground border-foreground/30"
                              }`}
                            >
                              {isSold ? "Terjual" : "Available"}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatDateTime(item.createdAt)}
                            </span>
                          </div>
                          <h3 className="font-semibold truncate">
                            {item.merk} {item.tipe}
                          </h3>
                          {item.spesifikasi && (
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">
                              {item.spesifikasi}
                            </p>
                          )}
                          {item.keterangan && (
                            <p className="text-xs text-muted-foreground mt-0.5 truncate italic">
                              {item.keterangan}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-1.5 text-xs">
                            <span className="text-muted-foreground">
                              Modal:{" "}
                              <strong className="text-amber-500">
                                {formatPrice(item.hargaBeli)}
                              </strong>
                            </span>
                            <span className="text-muted-foreground">
                              Jual:{" "}
                              <strong className="text-foreground">
                                {formatPrice(displayJual)}
                              </strong>
                            </span>
                            <Badge
                              variant="outline"
                              className="text-[9px]"
                            >
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
        <DialogContent className="bg-card border-border sm:max-w-lg max-h-[90vh] overflow-y-auto">
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
                    value={
                      selected.status === "sold" ? "Terjual" : "Available"
                    }
                    className={
                      selected.status === "sold"
                        ? "text-zinc-400"
                        : "text-emerald-500"
                    }
                  />
                  <DetailItem label="Merk" value={selected.merk} className="col-span-2" />
                  <DetailItem label="Tipe" value={selected.tipe} className="col-span-2" />
                  <DetailItem
                    label="Spesifikasi"
                    value={selected.spesifikasi || "-"}
                    className="col-span-2"
                  />
                  <DetailItem
                    label="Keterangan"
                    value={selected.keterangan || "-"}
                    className="col-span-2"
                  />
                </div>

                {selected.status === "sold" && (
                  <div className="space-y-2">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      Info Pembeli
                    </p>
                    <div className="rounded-lg bg-muted/40 p-3 text-sm space-y-1">
                      {selected.namaPembeli && (
                        <p>Pembeli: {selected.namaPembeli}</p>
                      )}
                      {selected.noWa && <p>WhatsApp: {selected.noWa}</p>}
                      {selected.domisili && (
                        <p>Domisili: {selected.domisili}</p>
                      )}
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
                    <p className="text-[10px] text-muted-foreground uppercase">
                      Modal (Beli)
                    </p>
                    <p className="text-lg font-bold text-amber-500">
                      {formatPrice(selected.hargaBeli)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-foreground/5 border border-foreground/20 p-3">
                    <p className="text-[10px] text-muted-foreground uppercase">
                      Harga Jual
                    </p>
                    <p className="text-lg font-bold text-foreground">
                      {formatPrice(
                        selected.hargaJual ||
                          Math.round(selected.hargaBeli * 1.3)
                      )}
                    </p>
                  </div>
                </div>

                {selected.status === "available" && (
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs font-medium mb-1.5 block">
                        Update Harga Jual (Rp)
                      </label>
                      <Input
                        type="number"
                        value={newHargaJual}
                        onChange={(e) => setNewHargaJual(e.target.value)}
                        className="h-11"
                      />
                      {newHargaJual && (
                        <p className="text-xs text-emerald-500 font-semibold mt-1">
                          Profit: {" "}
                          {formatPrice(
                            parseInt(newHargaJual || "0") - selected.hargaBeli
                          )}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={updateHarga}
                        disabled={saving}
                      >
                        Update Harga
                      </Button>
                      <Button
                        onClick={markAsSold}
                        disabled={saving}
                        className="bg-zinc-700 hover:bg-zinc-800"
                      >
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

function StatCard({
  label,
  value,
  color,
  icon: Icon,
}: {
  label: string;
  value: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="border-border/50">
      <CardContent className="p-3">
        <div className="flex items-center gap-1.5 mb-1">
          <Icon className={`h-3 w-3 ${color}`} />
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
        <p className={`text-base font-bold ${color}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

function DetailItem({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      <p className="text-sm font-medium">{value || "-"}</p>
    </div>
  );
}
