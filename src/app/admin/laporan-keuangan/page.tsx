"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { BarChart3, Loader2, TrendingUp, DollarSign, Package, ArrowDown, ArrowUp, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/format";

interface LaporanData {
  summary: { totalModal: number; totalModalSold: number; totalJual: number; totalProfit: number; stokMasuk: number; stokKeluar: number; stokTersisa: number; };
  byMerk: { merk: string; masuk: number; keluar: number; modal: number; jual: number; profit: number; }[];
  soldItems: { id: string; kode: string; merk: string; tipe: string; spesifikasi: string; hargaBeli: number; hargaJual: number; profit: number; namaPembeli: string; noWa: string; domisili: string; soldAt: string; }[];
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
    } catch (e) { console.error(e); } finally { setIsLoaded(true); }
  }, [from, to, merk]);

  useEffect(() => { load(); }, [load]);

  if (!isLoaded) return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  if (!data) return <Card className="border-dashed"><CardContent className="py-12 text-center"><p className="text-sm text-muted-foreground">Gagal load laporan</p></CardContent></Card>;

  const s = data.summary;
  const maxMerk = Math.max(...data.byMerk.map(m => m.masuk), 1);

  return (
    <div className="min-h-full bg-background">
      <div className="border-b border-border/40 bg-card/30">
        <div className="page-container py-6">
          <h1 className="text-2xl font-bold flex items-center gap-2"><BarChart3 className="h-6 w-6 text-primary" />Laporan Keuangan</h1>
          <p className="text-sm text-muted-foreground mt-1">Modal, penjualan, profit, stok</p>
        </div>
      </div>
      <div className="page-container py-6 space-y-6">
        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="space-y-1"><Label className="text-xs">Dari Tanggal</Label><Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="h-10" /></div>
          <div className="space-y-1"><Label className="text-xs">Sampai</Label><Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="h-10" /></div>
          <div className="space-y-1"><Label className="text-xs">Merk</Label><Input value={merk} onChange={(e) => setMerk(e.target.value)} placeholder="Semua" className="h-10" /></div>
          <div className="flex items-end"><button onClick={() => { setFrom(""); setTo(""); setMerk(""); }} className="text-xs text-muted-foreground hover:text-foreground">Reset filter</button></div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="border-border/50"><CardContent className="p-4"><div className="flex items-center gap-1.5 mb-2"><DollarSign className="h-4 w-4 text-amber-500" /><span className="text-xs text-muted-foreground">Total Modal (Stok)</span></div><p className="text-xl font-bold text-amber-500">{formatPrice(s.totalModal).replace("Rp","").trim()}</p></CardContent></Card>
          <Card className="border-border/50"><CardContent className="p-4"><div className="flex items-center gap-1.5 mb-2"><TrendingUp className="h-4 w-4 text-primary" /><span className="text-xs text-muted-foreground">Total Penjualan</span></div><p className="text-xl font-bold text-primary">{formatPrice(s.totalJual).replace("Rp","").trim()}</p></CardContent></Card>
          <Card className="border-border/50"><CardContent className="p-4"><div className="flex items-center gap-1.5 mb-2"><TrendingUp className="h-4 w-4 text-emerald-500" /><span className="text-xs text-muted-foreground">Total Profit</span></div><p className="text-xl font-bold text-emerald-500">{formatPrice(s.totalProfit).replace("Rp","").trim()}</p></CardContent></Card>
          <Card className="border-border/50"><CardContent className="p-4"><div className="flex items-center gap-1.5 mb-2"><Package className="h-4 w-4 text-muted-foreground" /><span className="text-xs text-muted-foreground">Stok Tersisa</span></div><p className="text-xl font-bold">{s.stokTersisa} unit</p></CardContent></Card>
        </div>

        {/* Stok masuk/keluar */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-border/50"><CardContent className="p-4 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/15"><ArrowDown className="h-5 w-5 text-sky-500" /></div><div><p className="text-xs text-muted-foreground">Stok Masuk</p><p className="text-lg font-bold">{s.stokMasuk} unit</p></div></CardContent></Card>
          <Card className="border-border/50"><CardContent className="p-4 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/15"><ArrowUp className="h-5 w-5 text-violet-500" /></div><div><p className="text-xs text-muted-foreground">Stok Keluar (Terjual)</p><p className="text-lg font-bold">{s.stokKeluar} unit</p></div></CardContent></Card>
        </div>

        {/* By Merk */}
        {data.byMerk.length > 0 && (
          <Card className="border-border/50"><CardContent className="p-5">
            <p className="text-sm font-semibold mb-4">Breakdown per Merk</p>
            <div className="space-y-3">
              {data.byMerk.map((m, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-20 truncate">{m.merk}</span>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2"><span className="text-[10px] text-muted-foreground w-12">Masuk</span><div className="flex-1 h-2 rounded-full bg-muted overflow-hidden"><div className="h-full bg-sky-500 rounded-full" style={{ width: `${(m.masuk / maxMerk) * 100}%` }} /></div><span className="text-xs font-semibold w-8">{m.masuk}</span></div>
                    <div className="flex items-center gap-2"><span className="text-[10px] text-muted-foreground w-12">Keluar</span><div className="flex-1 h-2 rounded-full bg-muted overflow-hidden"><div className="h-full bg-violet-500 rounded-full" style={{ width: `${(m.keluar / maxMerk) * 100}%` }} /></div><span className="text-xs font-semibold w-8">{m.keluar}</span></div>
                  </div>
                  <div className="text-right shrink-0"><p className="text-xs font-bold text-emerald-500">{formatPrice(m.profit).replace("Rp","").trim()}</p><p className="text-[10px] text-muted-foreground">profit</p></div>
                </div>
              ))}
            </div>
          </CardContent></Card>
        )}

        {/* Sold items table */}
        {data.soldItems.length > 0 && (
          <Card className="border-border/50"><CardContent className="p-5">
            <p className="text-sm font-semibold mb-4">Barang Terjual ({data.soldItems.length})</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border/50 text-xs text-muted-foreground"><th className="text-left py-2 px-2">Kode</th><th className="text-left py-2 px-2">Barang</th><th className="text-right py-2 px-2">Modal</th><th className="text-right py-2 px-2">Jual</th><th className="text-right py-2 px-2">Profit</th><th className="text-left py-2 px-2">Pembeli</th><th className="text-left py-2 px-2">Tgl</th></tr></thead>
                <tbody>
                  {data.soldItems.map((item) => (
                    <tr key={item.id} className="border-b border-border/30 hover:bg-muted/30">
                      <td className="py-2 px-2"><Badge variant="outline" className="text-[10px] font-mono">{item.kode}</Badge></td>
                      <td className="py-2 px-2"><p className="font-medium">{item.merk} {item.tipe}</p><p className="text-[10px] text-muted-foreground">{item.spesifikasi}</p></td>
                      <td className="py-2 px-2 text-right text-amber-500">{formatPrice(item.hargaBeli).replace("Rp","").trim()}</td>
                      <td className="py-2 px-2 text-right text-primary">{formatPrice(item.hargaJual).replace("Rp","").trim()}</td>
                      <td className="py-2 px-2 text-right text-emerald-500 font-bold">{formatPrice(item.profit).replace("Rp","").trim()}</td>
                      <td className="py-2 px-2 text-xs">{item.namaPembeli || "-"}{item.domisili ? ` (${item.domisili})` : ""}</td>
                      <td className="py-2 px-2 text-xs text-muted-foreground">{item.soldAt ? formatDate(item.soldAt) : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent></Card>
        )}
      </div>
    </div>
  );
}
