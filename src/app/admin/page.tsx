"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  PackageOpen,
  ClipboardCheck,
  Tag,
  Warehouse,
  DollarSign,
  TrendingUp,
  ArrowRight,
  AlertCircle,
  ShoppingBag,
  Award,
  Package,
  BarChart3,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { useLokasi } from "@/lib/lokasi-store";
import { useSubmissions, STATUS_LABELS } from "@/lib/submission-store";

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

export default function AdminDashboard() {
  const { lokasi } = useLokasi();
  const { submissions, refresh } = useSubmissions();
  const [laporan, setLaporan] = useState<LaporanData | null>(null);

  useEffect(() => {
    refresh();
    fetch("/api/laporan")
      .then((r) => r.json())
      .then(setLaporan)
      .catch(console.error);
  }, [refresh]);

  const recentSubmissions = submissions.slice(0, 5);
  const needsAttention = submissions.filter(
    (s) => s.status === "RECEIVED" || s.status === "QC_PROCESS" || s.status === "OFFER_SENT"
  );

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
            Ringkasan operasional inspeksi & trade-in
          </p>
        </div>
      </div>

      <div className="page-container py-6 space-y-6">
        {/* ─── TOP STAT BAR (6 cards) ─── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard
            label="Pengajuan Baru"
            value={laporan?.counts.RECEIVED ?? 0}
            color="text-sky-500"
            icon={PackageOpen}
            href="/admin/laptop-masuk"
          />
          <StatCard
            label="Sedang QC"
            value={laporan?.counts.QC_PROCESS ?? 0}
            color="text-amber-500"
            icon={ClipboardCheck}
            href="/admin/qc"
          />
          <StatCard
            label="Menunggu Response"
            value={laporan?.counts.OFFER_SENT ?? 0}
            color="text-violet-500"
            icon={Tag}
            href="/admin/penawaran"
          />
          <StatCard
            label="In Stock"
            value={laporan?.inventory.inStock ?? 0}
            color="text-foreground"
            icon={Warehouse}
            href="/admin/inventory"
          />
          <StatCard
            label="Disalurkan"
            value={laporan?.inventory.sold ?? 0}
            color="text-zinc-500"
            icon={ShoppingBag}
            href="/admin/inventory"
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
            href="/admin/laporan"
          />
        </div>

        {/* ─── NEEDS ATTENTION ─── */}
        {needsAttention.length > 0 && (
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-500">
                    {needsAttention.length} pengajuan butuh tindakan
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Cek halaman Laptop Masuk untuk proses lanjut
                  </p>
                </div>
                <Link href="/admin/laptop-masuk">
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/30 cursor-pointer">
                    Lihat <ArrowRight className="h-3 w-3 ml-1" />
                  </Badge>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

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
                      Stok laptop bekas yang siap disalurkan
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
                  label="In Stock"
                  value={String(laporan?.inventory.inStock ?? 0)}
                  color="text-foreground"
                />
                <InvStat
                  label="Disalurkan"
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
                      Laptop disalurkan & revenue 7 hari terakhir
                    </p>
                  </div>
                </div>
                <Link
                  href="/admin/laporan"
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
                  color="text-foreground"
                />
                <SalesStat
                  label="Unit Disalurkan"
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

        {/* ─── RECENT SUBMISSIONS + SUMMARY (3-col) ─── */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Recent submissions */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Pengajuan Terbaru</h2>
              <Link
                href="/admin/laptop-masuk"
                className="text-xs text-primary hover:underline"
              >
                Lihat semua
              </Link>
            </div>
            {recentSubmissions.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center">
                  <PackageOpen className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="text-xs text-muted-foreground">
                    Belum ada pengajuan
                  </p>
                </CardContent>
              </Card>
            ) : (
              recentSubmissions.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href="/admin/laptop-masuk">
                    <Card className="border-border/50 hover:border-primary/30 hover:shadow-soft-sm transition-all cursor-pointer">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">
                              {s.namaLaptop}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {s.customerName} · {s.brand} · {s.ram}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className={`text-[10px] shrink-0 ${
                              s.status === "RECEIVED"
                                ? "bg-sky-500/10 text-sky-500 border-sky-500/30"
                                : s.status === "QC_PROCESS"
                                  ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                                  : s.status === "OFFER_SENT"
                                    ? "bg-violet-500/10 text-violet-500 border-violet-500/30"
                                    : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {STATUS_LABELS[s.status as keyof typeof STATUS_LABELS] || s.status}
                          </Badge>
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
                  icon={PackageOpen}
                  label="Total Pengajuan"
                  value={String(laporan?.counts.total ?? 0)}
                  color="text-primary"
                />
                <SummaryRow
                  icon={TrendingUp}
                  label="Conversion Rate"
                  value={`${laporan?.conversionRate ?? 0}%`}
                  color="text-foreground"
                />
                <SummaryRow
                  icon={Award}
                  label="Total Disalurkan"
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
                  color="text-foreground"
                />
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-3">
                  Quick Actions
                </p>
                <div className="space-y-1.5">
                  <QuickLink href="/admin/laptop-masuk" label="Laptop Masuk" />
                  <QuickLink href="/admin/qc" label="QC Inspeksi" />
                  <QuickLink href="/admin/penawaran" label="Penawaran" />
                  <QuickLink href="/admin/inventory" label="Inventory" />
                  <QuickLink href="/admin/laporan" label="Laporan" />
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
