"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  PackagePlus,
  Warehouse,
  DollarSign,
  TrendingUp,
  ArrowRight,
  ShoppingBag,
  BarChart3,
  Laptop,
  Tag,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDateTime } from "@/lib/format";

interface LaporanData {
  counts: {
    total: number;
    barangMasuk: number;
    barangAvailable: number;
    barangSold: number;
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
  createdAt: string;
}

export default function AdminDashboard() {
  const [laporan, setLaporan] = useState<LaporanData | null>(null);
  const [recentBarang, setRecentBarang] = useState<BarangItem[]>([]);

  useEffect(() => {
    fetch("/api/laporan")
      .then((r) => r.json())
      .then(setLaporan)
      .catch(console.error);

    fetch("/api/barang?status=available", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setRecentBarang(data.slice(0, 5)))
      .catch(console.error);
  }, []);

  // Max revenue for bar chart scaling
  const maxRevenue = laporan?.sales?.last7Days?.length
    ? Math.max(...laporan.sales.last7Days.map((d) => d.revenue), 1)
    : 1;

  return (
    <div className="min-h-full bg-background">
      <div className="border-b border-border/40 bg-card/30">
        <div className="page-container py-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ringkasan operasional inventory & penjualan
          </p>
        </div>
      </div>

      <div className="page-container py-6 space-y-6">
        {/* ─── TOP STAT BAR (6 cards) ─── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard
            label="Barang Masuk"
            value={laporan?.counts.barangMasuk ?? 0}
            color="text-sky-500"
            icon={PackagePlus}
            href="/admin/barang-masuk"
          />
          <StatCard
            label="In Stock"
            value={laporan?.inventory.inStock ?? 0}
            color="text-foreground"
            icon={Warehouse}
            href="/admin/inventory"
          />
          <StatCard
            label="Terjual"
            value={laporan?.inventory.sold ?? 0}
            color="text-zinc-500"
            icon={ShoppingBag}
            href="/admin/inventory"
          />
          <StatCard
            label="Total Modal"
            value={formatPrice(laporan?.inventory.totalModal ?? 0).replace("Rp", "").trim()}
            color="text-amber-500"
            icon={Tag}
            href="/admin/barang-masuk"
          />
          <StatCard
            label="Revenue"
            value={
              laporan?.sales?.totalRevenue
                ? formatPrice(laporan.sales.totalRevenue).replace("Rp", "").trim()
                : "0"
            }
            color="text-primary"
            icon={DollarSign}
            href="/admin/laporan-keuangan"
          />
          <StatCard
            label="Profit"
            value={formatPrice(laporan?.sales?.totalProfit ?? 0).replace("Rp", "").trim()}
            color="text-emerald-500"
            icon={TrendingUp}
            href="/admin/laporan-keuangan"
          />
        </div>

        {/* ─── INVENTORY + LAPORAN PENJUALAN (2-col) ─── */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* ── INVENTORY WIDGET ── */}
          <Card className="border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/10">
                    <Warehouse className="h-4 w-4 text-foreground" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold">Inventory</h2>
                    <p className="text-[10px] text-muted-foreground">
                      Stok barang yang siap dijual
                    </p>
                  </div>
                </div>
                <Link
                  href="/admin/inventory"
                  className="text-xs text-primary hover:underline"
                >
                  Lihat semua
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <InvStat
                  label="Available"
                  value={String(laporan?.inventory.inStock ?? 0)}
                  color="text-foreground"
                />
                <InvStat
                  label="Terjual"
                  value={String(laporan?.inventory.sold ?? 0)}
                  color="text-zinc-500"
                />
                <InvStat
                  label="Total Item"
                  value={String(laporan?.inventory.totalItems ?? 0)}
                  color="text-foreground"
                />
              </div>

              <div className="space-y-2 border-t border-border/40 pt-3">
                <InvRow
                  label="Modal Terikat (In Stock)"
                  value={formatPrice(
                    (laporan?.inventory.totalModal ?? 0) -
                      (laporan?.sales?.totalModalSold ?? 0)
                  ).replace("Rp", "").trim()}
                  color="text-amber-500"
                />
                <InvRow
                  label="Potensi Profit (In Stock)"
                  value={formatPrice(laporan?.inventory.potensiProfit ?? 0).replace("Rp", "").trim()}
                  color="text-foreground"
                />
              </div>
            </CardContent>
          </Card>

          {/* ── LAPORAN PENJUALAN WIDGET ── */}
          <Card className="border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15">
                    <BarChart3 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold">Laporan Penjualan</h2>
                    <p className="text-[10px] text-muted-foreground">
                      Revenue & profit penjualan
                    </p>
                  </div>
                </div>
                <Link
                  href="/admin/laporan-keuangan"
                  className="text-xs text-primary hover:underline"
                >
                  Detail
                </Link>
              </div>

              {/* Sales stats grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <SalesStat
                  label="Total Revenue"
                  value={formatPrice(laporan?.sales?.totalRevenue ?? 0).replace("Rp", "").trim()}
                  color="text-primary"
                />
                <SalesStat
                  label="Total Profit"
                  value={formatPrice(laporan?.sales?.totalProfit ?? 0).replace("Rp", "").trim()}
                  color="text-emerald-500"
                />
                <SalesStat
                  label="Unit Terjual"
                  value={String(laporan?.sales?.totalSold ?? 0)}
                  color="text-foreground"
                />
                <SalesStat
                  label="Avg Deal Value"
                  value={formatPrice(laporan?.sales?.avgDealValue ?? 0).replace("Rp", "").trim()}
                  color="text-violet-500"
                />
              </div>

              {/* Mini bar chart - 7 days trend */}
              <div className="border-t border-border/40 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                    Revenue 7 Hari Terakhir
                  </p>
                  <span className="text-[10px] text-muted-foreground">
                    {(laporan?.sales?.last7Days ?? [])
                      .reduce((s, d) => s + d.revenue, 0) > 0
                      ? formatPrice(
                          (laporan?.sales?.last7Days ?? []).reduce(
                            (s, d) => s + d.revenue,
                            0
                          )
                        ).replace("Rp", "").trim()
                      : "Belum ada penjualan"}
                  </span>
                </div>
                <div className="flex items-end gap-1 h-20">
                  {(laporan?.sales?.last7Days ?? Array(7).fill({ label: "", revenue: 0, count: 0, date: "" })).map(
                    (d, i) => {
                      const heightPct = maxRevenue > 0 ? (d.revenue / maxRevenue) * 100 : 0;
                      return (
                        <div
                          key={i}
                          className="flex-1 flex flex-col items-center gap-1 group relative"
                        >
                          <div className="w-full flex-1 flex items-end">
                            <div
                              className={`w-full rounded-t transition-all duration-300 ${
                                d.revenue > 0
                                  ? "bg-primary/70 group-hover:bg-primary"
                                  : "bg-muted"
                              }`}
                              style={{ height: `${Math.max(heightPct, 3)}%` }}
                              title={`${d.label}: ${formatPrice(d.revenue)}`}
                            />
                          </div>
                          <span className="text-[9px] text-muted-foreground">
                            {d.label}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ─── RECENT BARANG + SUMMARY (3-col) ─── */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Recent barang */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Barang Terbaru</h2>
              <Link
                href="/admin/barang-masuk"
                className="text-xs text-primary hover:underline"
              >
                Lihat semua
              </Link>
            </div>
            {recentBarang.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center">
                  <Laptop className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="text-xs text-muted-foreground">
                    Belum ada barang. Tambah lewat <Link href="/admin/barang-masuk" className="text-primary hover:underline">Barang Masuk</Link>
                  </p>
                </CardContent>
              </Card>
            ) : (
              recentBarang.map((b, i) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href="/admin/inventory">
                    <Card className="border-border/50 hover:border-primary/30 hover:shadow-soft-sm transition-all cursor-pointer">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <Badge variant="outline" className="text-[10px] font-mono">{b.kode}</Badge>
                              <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/30">Available</Badge>
                            </div>
                            <p className="text-sm font-semibold truncate">
                              {b.merk} {b.tipe}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {b.spesifikasi || b.keterangan || "-"}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xs text-muted-foreground">Modal</p>
                            <p className="text-sm font-bold text-amber-500">{formatPrice(b.hargaBeli)}</p>
                            <p className="text-[10px] text-muted-foreground">{formatDateTime(b.createdAt)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))
            )}
          </div>

          {/* Right: Summary + Quick actions */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold">Ringkasan Operasional</h2>
            <Card className="border-border/50">
              <CardContent className="p-4 space-y-3">
                <SummaryRow
                  icon={PackagePlus}
                  label="Total Barang Masuk"
                  value={String(laporan?.counts.barangMasuk ?? 0)}
                  color="text-primary"
                />
                <SummaryRow
                  icon={TrendingUp}
                  label="Sell-through Rate"
                  value={`${laporan?.conversionRate ?? 0}%`}
                  color="text-foreground"
                />
                <SummaryRow
                  icon={ShoppingBag}
                  label="Total Terjual"
                  value={String(laporan?.inventory.sold ?? 0)}
                  color="text-zinc-500"
                />
                <SummaryRow
                  icon={DollarSign}
                  label="Total Revenue"
                  value={formatPrice(laporan?.sales?.totalRevenue ?? 0).replace("Rp", "").trim()}
                  color="text-primary"
                />
                <SummaryRow
                  icon={TrendingUp}
                  label="Total Profit"
                  value={formatPrice(laporan?.sales?.totalProfit ?? 0).replace("Rp", "").trim()}
                  color="text-emerald-500"
                />
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-3">
                  Quick Actions
                </p>
                <div className="space-y-1.5">
                  <QuickLink href="/admin/barang-masuk" label="Barang Masuk" />
                  <QuickLink href="/admin/kasir" label="Kasir (Jual)" />
                  <QuickLink href="/admin/inventory" label="Inventory" />
                  <QuickLink href="/admin/laporan-keuangan" label="Laporan Keuangan" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── HELPERS ─── */

function StatCard({
  label,
  value,
  color,
  icon: Icon,
  href,
}: {
  label: string;
  value: number | string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="border-border/50 hover:border-primary/30 hover:shadow-soft-sm transition-all cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Icon className={`h-4 w-4 ${color}`} />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
          <p className={`text-xl font-bold ${color}`}>{value}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

function InvStat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-border/40 bg-card/60 p-2.5 text-center">
      <p className={`text-lg font-bold ${color}`}>{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

function InvRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-sm font-bold ${color}`}>{value}</span>
    </div>
  );
}

function SalesStat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-border/40 bg-card/60 p-3">
      <p className="text-[10px] text-muted-foreground mb-1">{label}</p>
      <p className={`text-base font-bold ${color}`}>{value}</p>
    </div>
  );
}

function SummaryRow({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className={`h-3.5 w-3.5 ${color}`} />
      <span className="text-xs text-muted-foreground flex-1">{label}</span>
      <span className={`text-sm font-bold ${color}`}>{value}</span>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-muted/60 transition-colors"
    >
      <span>{label}</span>
      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
    </Link>
  );
}