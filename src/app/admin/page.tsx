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
        {/* Top stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
            label="Inventory"
            value={laporan?.inventory.inStock ?? 0}
            color="text-emerald-500"
            icon={Warehouse}
            href="/admin/inventory"
          />
        </div>

        {/* Needs attention */}
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

          {/* Right: Summary */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold">Ringkasan</h2>
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
                  color="text-emerald-500"
                />
                <SummaryRow
                  icon={DollarSign}
                  label="Total Modal"
                  value={formatPrice(laporan?.inventory.totalModal ?? 0).replace("Rp", "").trim()}
                  color="text-amber-500"
                />
                <SummaryRow
                  icon={TrendingUp}
                  label="Potensi Profit"
                  value={formatPrice(laporan?.inventory.potensiProfit ?? 0).replace("Rp", "").trim()}
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

function StatCard({
  label,
  value,
  color,
  icon: Icon,
  href,
}: {
  label: string;
  value: number;
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
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </CardContent>
      </Card>
    </Link>
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
