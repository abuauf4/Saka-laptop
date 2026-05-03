"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Receipt,
  ChevronDown,
  ChevronUp,
  RefreshCcw,
  XCircle,
  Banknote,
  CreditCard,
  QrCode,
  ArrowLeftRight,
  CalendarDays,
  User,
  Phone,
  MapPin,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatPrice, formatDateTime } from "@/lib/format";
import { useTransactions } from "@/lib/transaction-store";
import { useLokasi } from "@/lib/lokasi-store";
import { toast } from "sonner";
import { downloadInvoice } from "@/lib/generate-invoice";
import { SkeletonTransaction } from "@/components/ui/skeleton";

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

const paymentIcons: Record<string, typeof Banknote> = {
  Cash: Banknote,
  Card: CreditCard,
  QRIS: QrCode,
  Transfer: ArrowLeftRight,
};

export default function TransaksiPage() {
  const { transactions, updateStatus, isLoaded } = useTransactions();
  const { lokasi } = useLokasi();
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updateDialog, setUpdateDialog] = useState<{
    transactionId: string;
    newStatus: "completed" | "refunded" | "cancelled";
  } | null>(null);

  // Filter transactions from global store
  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (statusFilter !== "all" && tx.status !== statusFilter) return false;
      if (dateFrom) {
        const from = new Date(dateFrom);
        from.setHours(0, 0, 0, 0);
        if (new Date(tx.createdAt) < from) return false;
      }
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        if (new Date(tx.createdAt) > to) return false;
      }
      return true;
    });
  }, [transactions, statusFilter, dateFrom, dateTo]);

  const handleUpdateStatus = () => {
    if (!updateDialog) return;

    const { transactionId, newStatus } = updateDialog;

    // No stock restore — sold items are deleted from inventory
    updateStatus(transactionId, newStatus);

    toast.success(
      `Transaksi #${transactionId.slice(-6).toUpperCase()} ${statusLabels[newStatus]}`
    );
    setUpdateDialog(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 page-container max-w-6xl page-animate">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-xl lg:text-2xl font-bold">Transaksi</h1>
        <p className="text-sm text-muted-foreground">
          {transactions.length} transaksi tercatat
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-11 w-36 rounded-xl text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="completed">Selesai</SelectItem>
            <SelectItem value="refunded">Refund</SelectItem>
            <SelectItem value="cancelled">Dibatalkan</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="h-11 w-36 rounded-xl text-sm bg-card border border-border/50 px-3 text-foreground"
          />
          <span className="text-sm text-muted-foreground">s/d</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="h-11 w-36 rounded-xl text-sm bg-card border border-border/50 px-3 text-foreground"
          />
        </div>

        {(statusFilter !== "all" || dateFrom || dateTo) && (
          <Button
            variant="ghost"
            size="sm"
            className="text-sm h-11 min-h-[44px]"
            onClick={() => {
              setStatusFilter("all");
              setDateFrom("");
              setDateTo("");
            }}
          >
            Reset Filter
          </Button>
        )}
      </div>

      {/* Transaction List */}
      {!isLoaded ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonTransaction key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Receipt className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-muted-foreground">Belum ada transaksi</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[calc(100vh-260px)] lg:max-h-[calc(100vh-220px)] overflow-y-auto">
          <AnimatePresence>
            {filtered.map((tx) => {
              const isExpanded = expandedId === tx.id;
              const PaymentIcon = paymentIcons[tx.paymentMethod] || Banknote;

              return (
                <motion.div
                  key={tx.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="border-border/50 card-glow">
                    <CardContent className="p-4">
                      <button
                        className="w-full text-left"
                        onClick={() =>
                          setExpandedId(isExpanded ? null : tx.id)
                        }
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-muted-foreground">
                              #{tx.id.slice(-6).toUpperCase()}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-xs px-1.5 py-0.5 ${
                                statusColors[tx.status] || ""
                              }`}
                            >
                              {statusLabels[tx.status] || tx.status}
                            </Badge>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {formatDateTime(tx.createdAt)}
                            </p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <PaymentIcon className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {tx.paymentMethod}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                · {tx.items.length} item
                              </span>
                              {tx.customerName && (
                                <>
                                  <span className="text-sm text-muted-foreground">·</span>
                                  <User className="h-3 w-3 text-primary/60" />
                                  <span className="text-sm font-medium text-foreground/80 truncate max-w-[120px]">
                                    {tx.customerName}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <span className="text-base font-bold text-primary">
                            {formatPrice(tx.total)}
                          </span>
                        </div>
                      </button>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 pt-3 border-t border-border/50 space-y-3">
                              {/* Customer Info */}
                              {(tx.customerName || tx.customerPhone || tx.customerAddress) && (
                                <div className="bg-muted/20 rounded-xl p-3 space-y-1.5">
                                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Data Pelanggan</p>
                                  {tx.customerName && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <User className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                                      <span className="font-medium">{tx.customerName}</span>
                                    </div>
                                  )}
                                  {tx.customerPhone && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <Phone className="h-3.5 w-3.5 text-primary/60 flex-shrink-0" />
                                      <span>{tx.customerPhone}</span>
                                    </div>
                                  )}
                                  {tx.customerAddress && (
                                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                      <MapPin className="h-3.5 w-3.5 text-primary/60 flex-shrink-0 mt-0.5" />
                                      <span className="leading-relaxed">{tx.customerAddress}</span>
                                    </div>
                                  )}
                                </div>
                              )}
                              {tx.items.map((item) => (
                                <div
                                  key={item.productId}
                                  className="flex items-center justify-between text-sm px-1"
                                >
                                  <div className="flex-1 min-w-0">
                                    <p className="truncate">{item.productName}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {formatPrice(item.price)} × {item.quantity}
                                    </p>
                                  </div>
                                  <span className="font-medium ml-2">
                                    {formatPrice(item.price * item.quantity)}
                                  </span>
                                </div>
                              ))}

                              {/* Status Actions */}
                              {tx.status === "completed" && (
                                <div className="flex gap-2 pt-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-sm gap-1 flex-1 rounded-xl min-h-[44px] border-primary/30 text-primary hover:bg-primary/10"
                                    onClick={() => {
                                      downloadInvoice(tx, {
                                        namaToko: lokasi.namaToko,
                                        tagline: lokasi.tagline,
                                        alamat: lokasi.alamat,
                                        telepon: lokasi.telepon,
                                        whatsapp: lokasi.whatsapp,
                                      });
                                      toast.success("Invoice berhasil diunduh!");
                                    }}
                                  >
                                    <FileText className="h-3 w-3" />
                                    Cetak Invoice
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-sm gap-1 flex-1 rounded-xl min-h-[44px]"
                                    onClick={() =>
                                      setUpdateDialog({
                                        transactionId: tx.id,
                                        newStatus: "refunded",
                                      })
                                    }
                                  >
                                    <RefreshCcw className="h-3 w-3" />
                                    Refund
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-sm gap-1 flex-1 rounded-xl min-h-[44px] text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                                    onClick={() =>
                                      setUpdateDialog({
                                        transactionId: tx.id,
                                        newStatus: "cancelled",
                                      })
                                    }
                                  >
                                    <XCircle className="h-3 w-3" />
                                    Batalkan
                                  </Button>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Update Status Confirmation */}
      <AlertDialog
        open={!!updateDialog}
        onOpenChange={() => setUpdateDialog(null)}
      >
        <AlertDialogContent className="bg-card border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {updateDialog?.newStatus === "refunded"
                ? "Refund Transaksi?"
                : "Batalkan Transaksi?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Transaksi #{updateDialog?.transactionId?.slice(-6).toUpperCase()} akan
              diubah menjadi{" "}
              {statusLabels[updateDialog?.newStatus || ""]}.{" "}
              {updateDialog?.newStatus === "refunded" &&
                "Status transaksi akan diubah menjadi refund."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="min-h-[44px] rounded-xl">Batal</AlertDialogCancel>
            <AlertDialogAction
              className="min-h-[44px] rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleUpdateStatus}
            >
              Konfirmasi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
