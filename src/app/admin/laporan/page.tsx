"use client";

import { useState, useMemo, useEffect } from "react";
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
          <p className="text-sm text-muted-foreground">
            Gagal memuat laporan
          </p>
        </CardContent>
      </Card>
    );
  }

  const stages = [
    { label: "Data Diterima", count: data.counts.RECEIVED, color: "bg-sky-500", icon: PackageOpen },
    { label: "QC Berjalan", count: data.counts.QC_PROCESS, color: "bg-amber-500", icon: ClipboardCheck },
    { label: "Penawaran Dikirim", count: data.counts.OFFER_SENT, color: "bg-violet-500", icon: Tag },
    { label: "Deal", count: data.counts.ACCEPTED + data.counts.INVENTORY, color: "bg-emerald-500", icon: TrendingUp },
    { label: "Tidak Deal", count: data.counts.REJECTED, color: "bg-red-500", icon: Tag },
    { label: "Disalurkan", count: data.counts.SOLD, color: "bg-zinc-500", icon: DollarSign },
  ];

  const maxCount = Math.max(...stages.map((s) => s.count), 1);

  return (
    <div className="min-h-full bg-background">
      <div className="border-b border-border/40 bg-card/30">
        <div className="page-container py-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Laporan
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ringkasan operasional & performa inspeksi
          </p>
        </div>
      </div>

      <div className="page-container py-6 space-y-6">
        {/* Top stats */}
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
            color="text-emerald-500"
          />
          <BigStat
            label="Total Modal"
            value={formatPrice(data.inventory.totalModal).replace("Rp", "").trim()}
            icon={DollarSign}
            color="text-amber-500"
          />
          <BigStat
            label="Total Disalurkan"
            value={formatPrice(data.inventory.totalDisalurkan).replace("Rp", "").trim()}
            icon={TrendingUp}
            color="text-emerald-500"
          />
        </div>

        {/* Pipeline chart */}
        <Card className="border-border/50">
          <CardContent className="p-6">
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

        {/* Inventory stats */}
        <Card className="border-border/50">
          <CardContent className="p-6">
            <p className="text-sm font-semibold mb-5 flex items-center gap-2">
              <Warehouse className="h-4 w-4 text-primary" />
              Inventory Summary
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InvStat label="Total Item" value={String(data.inventory.totalItems)} />
              <InvStat label="In Stock" value={String(data.inventory.inStock)} />
              <InvStat label="Disalurkan" value={String(data.inventory.sold)} />
              <InvStat
                label="Potensi Profit"
                value={formatPrice(data.inventory.potensiProfit).replace("Rp", "").trim()}
                highlight
              />
            </div>
          </CardContent>
        </Card>

        {/* Funnel summary */}
        <Card className="border-border/50 bg-muted/30">
          <CardContent className="p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Catatan
            </p>
            <p className="text-sm leading-relaxed">
              Conversion rate dihitung dari total deal (ACCEPTED + INVENTORY +
              SOLD) dibagi total keputusan (deal + rejected). Potensi profit
              dihitung dari selisih harga jual - modal untuk item yang masih
              in stock.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

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
          ? "border-emerald-500/30 bg-emerald-500/5"
          : "border-border/50 bg-background/60"
      }`}
    >
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={`text-lg font-bold mt-1 ${
          highlight ? "text-emerald-500" : "text-foreground"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
