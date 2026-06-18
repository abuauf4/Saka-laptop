"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Loader2,
  PackageOpen,
  ClipboardCheck,
  Tag,
  Warehouse,
  DollarSign,
  TrendingUp,
  Percent,
  ShoppingBag,
  Award,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";

interface LaporanData {
  counts: {
    total: number;
    RECEIVED: number;
    QC_PROCESS: number;
    OFFER_SENT: number;
    ACCEPTED: number;
    REJECTED: number;
    INVENTORY: number;
    SOLD: number;
  };
  inventory: {
    totalItems: number;
    inStock: number;
    sold: number;
    totalModal: number;
    totalDisalurkan: number;
    potensiProfit: number;
  };
  sales: {
    totalSold: number;
    totalRevenue: number;
    totalModalSold: number;
    totalProfit: number;
    avgDealValue: number;
    last7Days: { date: string; label: string; count: number; revenue: number }[];
    last30Days: { date: string; label: string; count: number; revenue: number }[];
    topCategories: { name: string; count: number; revenue: number }[];
    topBrands: { name: string; count: number; revenue: number }[];
  };
  conversionRate: number;
}

export default function LaporanPage() {
  const [data, setData] = useState<LaporanData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/laporan")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch((err) => console.error(err))
      .finally(() => setIsLoaded(true));
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12 text-center">
          <BarChart3 className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground">Gagal memuat laporan</p>
        </CardContent>
      </Card>
    );
  }

  const stages = [
    { label: "Data Diterima", count: data.counts.RECEIVED, color: "bg-sky-500", icon: PackageOpen },
    { label: "QC Berjalan", count: data.counts.QC_PROCESS, color: "bg-amber-500", icon: ClipboardCheck },
    { label: "Penawaran Dikirim", count: data.counts.OFFER_SENT, color: "bg-violet-500", icon: Tag },
    { label: "Deal (Inventory)", count: data.counts.INVENTORY, color: "bg-foreground", icon: TrendingUp },
    { label: "Tidak Deal", count: data.counts.REJECTED, color: "bg-red-500", icon: Tag },
    { label: "Disalurkan", count: data.counts.SOLD, color: "bg-zinc-500", icon: DollarSign },
  ];

  const maxCount = Math.max(...stages.map((s) => s.count), 1);

  // Max revenue for 30-day chart
  const maxRevenue30 = data.sales?.last30Days?.length
    ? Math.max(...data.sales.last30Days.map((d) => d.revenue), 1)
    : 1;

  return (
    <div className="min-h-full bg-background">
      <div className="border-b border-border/40 bg-card/30">
        <div className="page-container py-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Laporan
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ringkasan operasional & laporan penjualan
          </p>
        </div>
      </div>

      <div className="page-container py-6 space-y-6">
        {/* ─── TOP STATS ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <BigStat
            label="Total Pengajuan"
            value={String(data.counts.total)}
            icon={PackageOpen}
            color="text-primary"
          />
          <BigStat
            label="Conversion Rate"
            value={`${data.conversionRate}%`}
            icon={Percent}
            color="text-foreground"
          />
          <BigStat
            label="Total Modal (In Stock)"
            value={formatPrice(
              data.inventory.totalModal - (data.sales?.totalModalSold ?? 0)
            ).replace("Rp", "").trim()}
            icon={DollarSign}
            color="text-amber-500"
          />
          <BigStat
            label="Total Revenue"
            value={formatPrice(data.sales?.totalRevenue ?? 0).replace("Rp", "").trim()}
            icon={TrendingUp}
            color="text-foreground"
          />
        </div>

        {/* ─── LAPORAN PENJUALAN (NEW SECTION) ─── */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <div>
                <h2 className="text-base font-semibold">Laporan Penjualan</h2>
                <p className="text-xs text-muted-foreground">
                  Laptop yang sudah disalurkan & revenue generated
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              <SalesBig
                label="Unit Disalurkan"
                value={String(data.sales?.totalSold ?? 0)}
                sub="total unit SOLD"
                color="text-zinc-500"
              />
              <SalesBig
                label="Total Revenue"
                value={formatPrice(data.sales?.totalRevenue ?? 0).replace("Rp", "").trim()}
                sub="sum harga jual"
                color="text-primary"
              />
              <SalesBig
                label="Total Profit"
                value={formatPrice(data.sales?.totalProfit ?? 0).replace("Rp", "").trim()}
                sub="revenue - modal"
                color="text-foreground"
              />
              <SalesBig
                label="Avg Deal Value"
                value={formatPrice(data.sales?.avgDealValue ?? 0).replace("Rp", "").trim()}
                sub="per unit"
                color="text-violet-500"
              />
            </div>

            {/* 30-day trend */}
            <div className="border-t border-border/40 pt-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Revenue 30 Hari Terakhir
                </p>
                <span className="text-xs text-muted-foreground">
                  Total: {formatPrice(
                    (data.sales?.last30Days ?? []).reduce((s, d) => s + d.revenue, 0)
                  ).replace("Rp", "").trim()}
                </span>
              </div>
              <div className="flex items-end gap-0.5 h-32">
                {(data.sales?.last30Days ?? Array(30).fill({ label: "", revenue: 0, count: 0, date: "" })).map(
                  (d, i) => {
                    const heightPct = maxRevenue30 > 0 ? (d.revenue / maxRevenue30) * 100 : 0;
                    return (
                      <div
                        key={i}
                        className="flex-1 group relative"
                        title={`${d.label}: ${formatPrice(d.revenue)}`}
                      >
                        <div
                          className={`w-full rounded-t transition-all ${
                            d.revenue > 0
                              ? "bg-primary/60 group-hover:bg-primary"
                              : "bg-muted/60"
                          }`}
                          style={{ height: `${Math.max(heightPct, 2)}%`, minHeight: "2px" }}
                        />
                      </div>
                    );
                  }
                )}
              </div>
              <div className="flex justify-between mt-1.5 text-[9px] text-muted-foreground">
                <span>30 hari lalu</span>
                <span>Hari ini</span>
              </div>
            </div>

            {/* Top Categories + Brands */}
            <div className="grid md:grid-cols-2 gap-4 mt-5 border-t border-border/40 pt-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Top Kategori (berdasarkan unit terjual)
                </p>
                {data.sales?.topCategories?.length ? (
                  <div className="space-y-2">
                    {data.sales.topCategories.map((cat, i) => {
                      const maxCat = data.sales.topCategories[0]?.count || 1;
                      return (
                        <div key={cat.name} className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground w-20 truncate">
                            {cat.name}
                          </span>
                          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${(cat.count / maxCat) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold w-12 text-right">
                            {cat.count}u
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    Belum ada data penjualan
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Top Brand (berdasarkan unit terjual)
                </p>
                {data.sales?.topBrands?.length ? (
                  <div className="space-y-2">
                    {data.sales.topBrands.map((b) => {
                      const maxBrand = data.sales.topBrands[0]?.count || 1;
                      return (
                        <div key={b.name} className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground w-20 truncate">
                            {b.name}
                          </span>
                          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full bg-violet-500 rounded-full"
                              style={{ width: `${(b.count / maxBrand) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold w-12 text-right">
                            {b.count}u
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    Belum ada data penjualan
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ─── INVENTORY SUMMARY ─── */}
        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Warehouse className="h-5 w-5 text-primary" />
              <div>
                <h2 className="text-base font-semibold">Inventory Summary</h2>
                <p className="text-xs text-muted-foreground">
                  Stok & modal laptop bekas
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InvStat label="Total Item" value={String(data.inventory.totalItems)} />
              <InvStat label="In Stock" value={String(data.inventory.inStock)} highlight />
              <InvStat label="Disalurkan" value={String(data.inventory.sold)} />
              <InvStat
                label="Potensi Profit"
                value={formatPrice(data.inventory.potensiProfit).replace("Rp", "").trim()}
                highlight
              />
            </div>
          </CardContent>
        </Card>

        {/* ─── PIPELINE PENGAJUAN ─── */}
        <Card className="border-border/50">
          <CardContent className="p-5">
            <p className="text-sm font-semibold mb-5">Pipeline Pengajuan</p>
            <div className="space-y-3">
              {stages.map((stage, i) => (
                <motion.div
                  key={stage.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-32 shrink-0 flex items-center gap-2">
                    <stage.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium">{stage.label}</span>
                  </div>
                  <div className="flex-1 h-7 bg-muted/40 rounded-lg overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stage.count / maxCount) * 100}%` }}
                      transition={{ delay: i * 0.08 + 0.2, duration: 0.5 }}
                      className={`h-full ${stage.color} flex items-center justify-end pr-2`}
                    >
                      {stage.count > 0 && (
                        <span className="text-[10px] font-bold text-white">
                          {stage.count}
                        </span>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ─── CATATAN ─── */}
        <Card className="border-border/50 bg-muted/30">
          <CardContent className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Metodologi
            </p>
            <ul className="text-xs leading-relaxed text-muted-foreground space-y-1">
              <li>
                • <strong>Conversion Rate</strong> = deal (INVENTORY + SOLD) / total keputusan (deal + rejected).
              </li>
              <li>
                • <strong>Revenue</strong> = total harga jual InventoryItem berstatus SOLD.
              </li>
              <li>
                • <strong>Profit</strong> = Revenue − Modal SOLD (harga beli dari customer).
              </li>
              <li>
                • <strong>Potensi Profit</strong> = harga jual − modal untuk item yang masih IN STOCK.
              </li>
              <li>
                • <strong>Avg Deal Value</strong> = Revenue / jumlah unit SOLD.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ─── HELPERS ─── */

function BigStat({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  return (
    <Card className="border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-1.5 mb-2">
          <Icon className={`h-4 w-4 ${color}`} />
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
        <p className={`text-xl font-bold ${color}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

function SalesBig({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-border/40 bg-background/60 p-3">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className={`text-lg font-bold ${color} mt-1`}>{value}</p>
      <p className="text-[9px] text-muted-foreground mt-0.5">{sub}</p>
    </div>
  );
}

function InvStat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-3 ${
        highlight
          ? "border-foreground/30 bg-foreground/5"
          : "border-border/50 bg-background/60"
      }`}
    >
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={`text-lg font-bold mt-1 ${
          highlight ? "text-foreground" : "text-foreground"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
