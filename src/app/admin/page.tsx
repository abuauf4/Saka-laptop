"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Package,
  DollarSign,
  ShoppingCart,
  Laptop,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/stats-card";
import { formatPrice, formatDateTime } from "@/lib/format";
import { useProducts } from "@/lib/product-store";
import { useTransactions } from "@/lib/transaction-store";
import { SkeletonStats, SkeletonTransaction } from "@/components/ui/skeleton";
import { useLokasi } from "@/lib/lokasi-store";

const statusColors: Record<string, string> = {
  completed: "bg-green-500/20 text-green-400 border-green-500/30",
  refunded: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

const statusLabels: Record<string, string> = {
  completed: "Selesai",
  refunded: "Refund",
  cancelled: "Dibatalkan",
};

export default function AdminDashboard() {
  const { products, isLoaded: productsLoaded } = useProducts();
  const { transactions, isLoaded: txLoaded } = useTransactions();
  const { lokasi } = useLokasi();

  const isLoaded = productsLoaded && txLoaded;

  // Compute stats from global state
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const completedTransactions = transactions.filter(
      (tx) => tx.status === "completed"
    );
    const totalTransactions = transactions.length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRevenue = completedTransactions
      .filter((tx) => new Date(tx.createdAt) >= today)
      .reduce((sum, tx) => sum + tx.total, 0);

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayRevenue = completedTransactions
        .filter((tx) => {
          const txDate = new Date(tx.createdAt);
          return txDate >= date && txDate < nextDate;
        })
        .reduce((sum, tx) => sum + tx.total, 0);

      return {
        date: date.toLocaleDateString("id-ID", { day: "2-digit", month: "short" }),
        revenue: dayRevenue,
      };
    });

    return {
      totalProducts,
      totalTransactions,
      todayRevenue,
      last7Days,
    };
  }, [products, transactions]);

  const recentTransactions = transactions.slice(0, 10);

  return (
    <div className="page-animate p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-7 page-container max-w-6xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-xl lg:text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Ringkasan toko {lokasi.namaToko}</p>
      </motion.div>

      {/* Stats */}
      {!isLoaded ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonStats key={i} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5"
        >
          <StatsCard
            title="Total Produk"
            value={stats.totalProducts.toString()}
            icon={Package}
            description="Produk terdaftar"
          />
          <StatsCard
            title="Pendapatan Hari Ini"
            value={formatPrice(stats.todayRevenue)}
            icon={DollarSign}
            description="Transaksi selesai"
          />
          <StatsCard
            title="Total Transaksi"
            value={stats.totalTransactions.toString()}
            icon={ShoppingCart}
            description="Semua waktu"
          />
          <StatsCard
            title="Produk Tersedia"
            value={stats.totalProducts.toString()}
            icon={Laptop}
            description="Dalam inventaris"
          />
        </motion.div>
      )}

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <Card className="border-border/50 shadow-soft-sm hover:shadow-soft-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Pendapatan 7 Hari Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-48">
              {stats.last7Days.map((day) => {
                const maxRevenue = Math.max(
                  ...stats.last7Days.map((d) => d.revenue),
                  1
                );
                const height = Math.max(4, (day.revenue / maxRevenue) * 100);
                return (
                  <div
                    key={day.date}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <span className="text-xs text-muted-foreground">
                      {day.revenue > 0 ? `${(day.revenue / 1_000_000).toFixed(1)}jt` : "-"}
                    </span>
                    <div
                      className="w-full rounded-t-xl bg-primary/60 hover:bg-primary/90 transition-all duration-300 min-h-[4px] hover:shadow-soft-md hover:shadow-primary/10 cursor-default"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {day.date}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <Card className="border-border/50 shadow-soft-sm hover:shadow-soft-md transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Transaksi Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              {!txLoaded ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <SkeletonTransaction key={i} />
                  ))}
                </div>
              ) : recentTransactions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Belum ada transaksi
                </p>
              ) : (
                <div className="space-y-1 max-h-80 lg:max-h-[calc(100vh-420px)] overflow-y-auto">
                  {recentTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-muted/30 transition-colors duration-200"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {tx.items.map((i) => i.productName).join(", ")}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDateTime(tx.createdAt)} · {tx.paymentMethod}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                        <Badge
                          variant="outline"
                          className={`text-xs px-1.5 py-0.5 ${statusColors[tx.status] || ""}`}
                        >
                          {statusLabels[tx.status] || tx.status}
                        </Badge>
                        <span className="text-sm font-semibold">
                          {formatPrice(tx.total)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Products */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <Card className="border-border/50 shadow-soft-sm hover:shadow-soft-md transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Laptop className="h-4 w-4 text-primary" />
                Produk Tersedia
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!productsLoaded ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <SkeletonTransaction key={i} />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Belum ada produk
                </p>
              ) : (
                <div className="space-y-1 max-h-80 lg:max-h-[calc(100vh-420px)] overflow-y-auto">
                  {products.slice(0, 10).map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-muted/30 transition-colors duration-200"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{p.nama}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-xs flex-shrink-0 ml-2 px-1.5 py-0.5 bg-primary/10 text-primary border-primary/20"
                      >
                        {formatPrice(p.harga)}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
