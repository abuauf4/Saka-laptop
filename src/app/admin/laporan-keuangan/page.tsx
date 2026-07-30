"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { BarChart3, Loader2, TrendingUp, DollarSign, Package, ArrowDown, ArrowUp, Download } from "lucide-react";
import { Card, CardContent } from "components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDate } from "@/lib/format";
import { toast } from "sonner";

interface SoldItem {
  id: string;
  kode: string;
  merk: string;
  tipe: string;
  spesifikasi: string;
  hargaBeli: number;
  hargaJual: number;
  profit: number;
  namaPembeli: string;
  noWa: string;
  domisili: string;
  soldAt: string;
}

interface LaporanData {
  summary: {
    totalModal: number;
    totalModalSold: number;
    totalJual: number;
    totalProfit: number;
    stokMasuk: number;
    stokKeluar: number;
    stokTersisa: number;
  };
  byMerk: {
    merk: string;
    masuk: number;
    keluar: number;
    modal: number;
    jual: number;
    profit: number;
  }[];
  soldItems: SoldItem[];
}

function exportSoldCSV(items: SoldItem[]) {
  const header = "Kode,Merk,Tipe,Spesifikasi,Modal,Jual,Profit,Pembeli,WhatsApp,Domisili,Tanggal Terjual";
  const rows = items.map((i) =>
    [
      `"${i.kode}"`,
      `"${i.merk}"`,
      `"${i.tipe}"`,
      `"${(i.spesifikasi || "").replace(/"/g, '"')}"`,
      i.hargaBeli,
      i.hargaJual,
      i.profit,
      `"${i.namaPembeli || ""}"`,
      `"${i.noWa || ""}"`,
      `"${i.domisili || ""}"`,
      `"${i.soldAt ? formatDate(i.soldAt) : ""}"`,
    ].join(",")
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `laporan-keuangan-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success(`Exported ${items.length} barang terjual ke CSV`);
}

export default function LaporanKeuanganPage() {
  const [data, setData] = useState<LaporanData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [merk, setMerk] = useState("");

  const load = useCallback(async () => {
    setIsLoaded(false);
    try {
      const params = new URLSearchParams();
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      if (merk) params.set("merk", merk);
      const res = await fetch(`/api/laporan-keuangan?${params}`, { cache: "no-store" });
      if (res.ok) setData(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoaded(true);
    }
  }, [from, to, merk]);

  useEffect(() => {
    load();
  }, [load]);

  if (!isLoaded) return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  if (!data) return <Card className="border-dashed"><CardContent className="py-12 text-center"><p className="text-sm text-muted-foreground">Gagal load laporan</p></CardContent></Card>;

  const s = data.summary;
  const maxMerk = Math.max(...data.byMerk.map((m) => m.masuk), 1);

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/30">
        <div className="page-container py-4 sm:py-6">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0" />
                <span className="truncate">Laporan Keuangan</span>
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                Modal, penjualan, profit, stok
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportSoldCSV(data.soldItems)}
              disabled={data.soldItems.length === 0}
              className="gap-1.5 shrink-0"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export</span>
              <span className="sm:hidden">CSV</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="page-container py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Filters - responsive grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Dari Tanggal</Label>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="h-10 text-sm" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Sampai</Label>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="h-10 text-sm" />
          </div>
          <div className="space-y-1 col-span-2 sm:col-span-1">
            <Label className="text-xs">Merk</Label>
            <Input value={merk} onChange={(e) => setMerk(e.target.value)} placeholder="Semua" className="h-10 text-sm" />
          </div>
          <div className="flex items-end col-span-2 sm:col-span-1">
            <button onClick={() => { setFrom(""); setTo(""); setMerk(""); }} className="text-xs text-muted-foreground hover:text-foreground">Reset filter</button>
          </div>
        </div>

        {/* Summary cards - 2 col mobile */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <Card className="border-border/50">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-1.5 mb-1.5">
                <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500" />
                <span className="text-[10px] sm:text-xs text-muted-foreground">Total Modal (Stok)</span>
              </div>
              <p className="text-base sm:text-xl font-bold text-amber-500 truncate">
                {formatPrice(s.totalModal).replace("Rp", "").trim()}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-1.5 mb-1.5">
                <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                <span className="text-[10px] sm:text-xs text-muted-foreground">Total Penjualan</span>
              </div>
              <p className="text-base sm:text-xl font-bold text-primary truncate">
                {formatPrice(s.totalJual).replace("Rp", "").trim()}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-1.5 mb-1.5">
                <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500" />
                <span className="text-[10px] sm:text-xs text-muted-foreground">Total Profit</span>
              </div>
              <p className="text-base sm:text-xl font-bold text-emerald-500 truncate">
                {formatPrice(s.totalProfit).replace("Rp", "").trim()}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                <span className="text-[10px] sm:text-xs text-muted-foreground">Stok Tersisa</span>
              </div>
              <p className="text-base sm:text-xl font-bold">{s.stokTersisa} unit</p>
            </CardContent>
          </Card>
        </div>

        {/* Stok masuk/keluar */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <Card className="border-border/50">
            <CardContent className="p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-sky-500/15 shrink-0">
                <ArrowDown className="h-4 w-4 sm:h-5 sm:w-5 text-sky-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs text-muted-foreground">Stok Masuk</p>
                <p className="text-base sm:text-lg font-bold">{s.stokMasuk} unit</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-violet-500/15 shrink-0">
                <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5 text-violet-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs text-muted-foreground">Stok Keluar (Terjual)</p>
                <p className="text-base sm:text-lg font-bold">{s.stokKeluar} unit</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* By Merk */}
        {data.byMerk.length > 0 && (
          <Card className="border-border/50">
            <CardContent className="p-4 sm:p-5">
              <p className="text-sm font-semibold mb-3 sm:mb-4">Breakdown per Merk</p>
              <div className="space-y-2.5 sm:space-y-3">
                {data.byMerk.map((m, i) => (
                  <div key={i} className="flex items-center gap-2 sm:gap-3">
                    <span className="text-[10px] sm:text-xs text-muted-foreground w-16 sm:w-20 truncate shrink-0">{m.merk}</span>
                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="text-[9px] sm:text-[10px] text-muted-foreground w-10 sm:w-12 shrink-0">Masuk</span>
                        <div className="flex-1 h-1.5 sm:h-2 rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-sky-500 rounded-full" style={{ width: `${(m.masuk / maxMerk) * 100}%` }} />
                        </div>
                        <span className="text-[10px] sm:text-xs font-semibold w-6 sm:w-8 text-right">{m.masuk}</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="text-[9px] sm:text-[10px] text-muted-foreground w-10 sm:w-12 shrink-0">Keluar</span>
                        <div className="flex-1 h-1.5 sm:h-2 rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-violet-500 rounded-full" style={{ width: `${(m.keluar / maxMerk) * 100}%` }} />
                        </div>
                        <span className="text-[10px] sm:text-xs font-semibold w-6 sm:w-8 text-right">{m.keluar}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] sm:text-xs font-bold text-emerald-500">{formatPrice(m.profit).replace("Rp", "").trim()}</p>
                      <p className="text-[9px] sm:text-[10px] text-muted-foreground">profit</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sold items - Cards on mobile, Table on desktop */}
        {data.soldItems.length > 0 && (
          <Card className="border-border/50">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <p className="text-sm font-semibold">Barang Terjual ({data.soldItems.length})</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportSoldCSV(data.soldItems)}
                  className="gap-1.5 text-xs"
                >
                  <Download className="h-3 w-3" />
                  Export CSV
                </Button>
              </div>

              {/* Desktop: table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 text-xs text-muted-foreground">
                      <th className="text-left py-2 px-2">Kode</th>
                      <th className="text-left py-2 px-2">Barang</th>
                      <th className="text-right py-2 px-2">Modal</th>
                      <th className="text-right py-2 px-2">Jual</th>
                      <th className="text-right py-2 px-2">Profit</th>
                      <th className="text-left py-2 px-2">Pembeli</th>
                      <th className="text-left py-2 px-2">Tgl</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.soldItems.map((item) => (
                      <tr key={item.id} className="border-b border-border/30 hover:bg-muted/30">
                        <td className="py-2 px-2"><Badge variant="outline" className="text-[10px] font-mono">{item.kode}</Badge></td>
                        <td className="py-2 px-2">
                          <p className="font-medium">{item.merk} {item.tipe}</p>
                          <p className="text-[10px] text-muted-foreground">{item.spesifikasi}</p>
                        </td>
                        <td className="py-2 px-2 text-right text-amber-500">{formatPrice(item.hargaBeli).replace("Rp", "").trim()}</td>
                        <td className="py-2 px-2 text-right text-primary">{formatPrice(item.hargaJual).replace("Rp", "").trim()}</td>
                        <td className="py-2 px-2 text-right text-emerald-500 font-bold">{formatPrice(item.profit).replace("Rp", "").trim()}</td>
                        <td className="py-2 px-2 text-xs">{item.namaPembeli || "-"}{item.domisili ? ` (${item.domisili})` : ""}</td>
                        <td className="py-2 px-2 text-xs text-muted-foreground">{item.soldAt ? formatDate(item.soldAt) : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile: card list */}
              <div className="md:hidden space-y-2">
                {data.soldItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.2) }}
                  >
                    <div className="rounded-lg border border-border/40 p-3 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">{item.merk} {item.tipe}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{item.spesifikasi}</p>
                        </div>
                        <Badge variant="outline" className="text-[9px] font-mono shrink-0 ml-2">{item.kode}</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[11px]">
                        <div>
                          <span className="text-muted-foreground">Modal</span>
                          <p className="font-semibold text-amber-500">{formatPrice(item.hargaBeli).replace("Rp", "").trim()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Jual</span>
                          <p className="font-semibold text-primary">{formatPrice(item.hargaJual).replace("Rp", "").trim()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Profit</span>
                          <p className="font-bold text-emerald-500">+{formatPrice(item.profit).replace("Rp", "").trim()}</p>
                        </div>
                      </div>
                      {(item.namaPembeli || item.domisili) && (
                        <p className="text-[10px] text-muted-foreground">
                          {item.namaPembeli || "-"}{item.domisili ? ` · ${item.domisili}` : ""}
                        </p>
                      )}
                      {item.soldAt && (
                        <p className="text-[10px] text-muted-foreground">{formatDate(item.soldAt)}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
