"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  PackageOpen,
  Clock,
  Loader2,
  Trash2,
  Laptop,
  Phone,
  Sparkles,
  ArrowRight,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useSubmissions,
  STATUS_LABELS,
  STATUS_COLORS,
  type SubmissionStatus,
  type Submission,
} from "@/lib/submission-store";
import { formatPrice, formatDateTime } from "@/lib/format";
import { toast } from "sonner";

const STATUS_TABS: { id: SubmissionStatus | "all"; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "RECEIVED", label: "Data Diterima" },
  { id: "QC_PROCESS", label: "QC Berjalan" },
  { id: "OFFER_SENT", label: "Penawaran Dikirim" },
  { id: "ACCEPTED", label: "Deal" },
  { id: "REJECTED", label: "Tidak Deal" },
  { id: "INVENTORY", label: "Inventory" },
  { id: "SOLD", label: "Disalurkan" },
];

export default function LaptopMasukPage() {
  const { submissions, isLoaded, refresh, updateStatus, deleteSubmission } =
    useSubmissions();
  const [filter, setFilter] = useState<SubmissionStatus | "all">("all");
  const [selected, setSelected] = useState<Submission | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Create dialog state
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    namaLaptop: "",
    brand: "",
    kategori: "Ultrabook",
    processor: "",
    ram: "8GB",
    storage: "512GB SSD",
    gpu: "",
    tahun: "",
    kondisi: "Bagus",
    kelengkapan: "Lengkap",
    catatan: "",
    customerName: "",
    customerPhone: "",
    customerAddress: "",
  });

  function updateCreate(k: keyof typeof createForm, v: string) {
    setCreateForm((prev) => ({ ...prev, [k]: v }));
  }

  async function handleCreate() {
    if (!createForm.namaLaptop || !createForm.customerName || !createForm.customerPhone) {
      toast.error("Nama laptop, nama customer, dan nomor HP wajib diisi");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...createForm,
          tahun: createForm.tahun ? parseInt(createForm.tahun) : 0,
          estimasiAI: 0,
          estimasiNotes: "",
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Gagal menambah pengajuan");
      }
      toast.success("Pengajuan ditambahkan");
      setCreateOpen(false);
      setCreateForm({
        namaLaptop: "",
        brand: "",
        kategori: "Ultrabook",
        processor: "",
        ram: "8GB",
        storage: "512GB SSD",
        gpu: "",
        tahun: "",
        kondisi: "Bagus",
        kelengkapan: "Lengkap",
        catatan: "",
        customerName: "",
        customerPhone: "",
        customerAddress: "",
      });
      refresh();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Gagal menambah");
    } finally {
      setCreating(false);
    }
  }

  const filtered = useMemo(() => {
    if (filter === "all") return submissions;
    return submissions.filter((s) => s.status === filter);
  }, [submissions, filter]);

  const stats = useMemo(() => {
    return {
      received: submissions.filter((s) => s.status === "RECEIVED").length,
      qc: submissions.filter((s) => s.status === "QC_PROCESS").length,
      offer: submissions.filter((s) => s.status === "OFFER_SENT").length,
      total: submissions.length,
    };
  }, [submissions]);

  async function handleAction(s: Submission, status: SubmissionStatus) {
    setActionLoading(true);
    try {
      await updateStatus(s.id, status);
      toast.success(`Status diubah ke "${STATUS_LABELS[status]}"`);
      if (selected?.id === s.id) {
        setSelected({ ...s, status });
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengubah status");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete(s: Submission) {
    if (!confirm(`Hapus pengajuan "${s.namaLaptop}"?`)) return;
    setActionLoading(true);
    try {
      await deleteSubmission(s.id);
      toast.success("Pengajuan dihapus");
      setSelected(null);
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus");
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="min-h-full bg-background">
      <div className="border-b border-border/40 bg-card/30">
        <div className="page-container py-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <PackageOpen className="h-6 w-6 text-primary" />
                Laptop Masuk
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Semua pengajuan laptop dari customer
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-1.5">
                <Plus className="h-4 w-4" />
                Tambah Pengajuan
              </Button>
              <Button variant="outline" size="sm" onClick={refresh}>
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total" value={stats.total} color="text-primary" />
          <StatCard label="Data Diterima" value={stats.received} color="text-sky-500" />
          <StatCard label="QC Berjalan" value={stats.qc} color="text-amber-500" />
          <StatCard label="Penawaran Dikirim" value={stats.offer} color="text-violet-500" />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filter === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              {tab.label}
              {tab.id !== "all" && (
                <span className="ml-1.5 opacity-70">
                  ({submissions.filter((s) => s.status === tab.id).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* List */}
        {!isLoaded ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <PackageOpen className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">
                Belum ada pengajuan
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {filtered.map((s, idx) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.04, 0.3) }}
              >
                <Card
                  className="border-border/50 hover:border-primary/30 hover:shadow-soft-sm transition-all cursor-pointer"
                  onClick={() => setSelected(s)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-muted/40 flex items-center justify-center">
                        {s.foto ? (
                          <img
                            src={s.foto}
                            alt={s.namaLaptop}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Laptop className="h-5 w-5 text-muted-foreground/40" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${STATUS_COLORS[s.status]}`}
                          >
                            {STATUS_LABELS[s.status]}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDateTime(s.createdAt)}
                          </span>
                        </div>
                        <h3 className="font-semibold truncate">{s.namaLaptop}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {s.brand} · {s.processor || "Processor?"} · {s.ram}/{s.storage}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1 truncate">
                            <Phone className="h-3 w-3" />
                            {s.customerName} · {s.customerPhone}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        {s.hargaPenawaran > 0 ? (
                          <>
                            <p className="text-[10px] text-muted-foreground">
                              Penawaran
                            </p>
                            <p className="text-base font-bold text-violet-500">
                              {formatPrice(s.hargaPenawaran)}
                            </p>
                          </>
                        ) : s.estimasiAI > 0 ? (
                          <>
                            <p className="text-[10px] text-muted-foreground">
                              Estimasi AI
                            </p>
                            <p className="text-base font-bold text-primary">
                              {formatPrice(s.estimasiAI)}
                            </p>
                          </>
                        ) : (
                          <p className="text-xs text-muted-foreground italic">
                            Belum ada estimasi
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* DETAIL DIALOG */}
      <Dialog
        open={selected !== null}
        onOpenChange={(o) => !o && setSelected(null)}
      >
        <DialogContent className="bg-card border-border sm:max-w-xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 pr-8">
                  <PackageOpen className="h-5 w-5 text-primary" />
                  Detail Pengajuan
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant="outline"
                    className={STATUS_COLORS[selected.status]}
                  >
                    {STATUS_LABELS[selected.status]}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    ID: {selected.id.slice(-8).toUpperCase()}
                  </Badge>
                </div>

                {selected.foto && (
                  <div className="rounded-xl overflow-hidden border border-border/50">
                    <img
                      src={selected.foto}
                      alt={selected.namaLaptop}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <DetailItem label="Nama Laptop" value={selected.namaLaptop} className="col-span-2" />
                  <DetailItem label="Brand" value={selected.brand} />
                  <DetailItem label="Kategori" value={selected.kategori} />
                  <DetailItem label="Processor" value={selected.processor} />
                  <DetailItem label="Tahun" value={selected.tahun ? String(selected.tahun) : "-"} />
                  <DetailItem label="RAM" value={selected.ram} />
                  <DetailItem label="Storage" value={selected.storage} />
                  <DetailItem label="GPU" value={selected.gpu} />
                  <DetailItem label="Kondisi" value={selected.kondisi} />
                  <DetailItem label="Kelengkapan" value={selected.kelengkapan} className="col-span-2" />
                </div>

                {selected.catatan && (
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                      Catatan Customer
                    </p>
                    <p className="text-sm bg-muted/40 rounded-lg p-3">
                      {selected.catatan}
                    </p>
                  </div>
                )}

                {/* Customer */}
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                    Customer
                  </p>
                  <div className="bg-muted/40 rounded-lg p-3 space-y-1 text-sm">
                    <p>{selected.customerName}</p>
                    <a
                      href={`https://wa.me/${selected.customerPhone.replace(/^0/, "62")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1.5"
                    >
                      <Phone className="h-3 w-3" /> {selected.customerPhone}
                    </a>
                    {selected.customerAddress && (
                      <p className="text-muted-foreground text-xs">
                        {selected.customerAddress}
                      </p>
                    )}
                  </div>
                </div>

                {/* AI Estimasi */}
                {selected.estimasiAI > 0 && (
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" /> Estimasi AI
                    </p>
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                      <p className="text-xl font-bold text-primary">
                        {formatPrice(selected.estimasiAI)}
                      </p>
                      {selected.estimasiNotes && (
                        <p className="text-xs text-muted-foreground mt-1.5">
                          {selected.estimasiNotes}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Workflow Actions */}
                {selected.status === "RECEIVED" && (
                  <Button
                    className="w-full"
                    disabled={actionLoading}
                    onClick={() => handleAction(selected, "QC_PROCESS")}
                  >
                    Mulai QC <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
                {selected.status === "QC_PROCESS" && (
                  <Link href={`/admin/qc?id=${selected.id}`} className="block">
                    <Button className="w-full">
                      Lanjut ke QC Checklist <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                )}
                {selected.status === "OFFER_SENT" && (
                  <div className="space-y-2">
                    <Link href={`/admin/penawaran?id=${selected.id}`} className="block">
                      <Button variant="outline" className="w-full">
                        Lihat / Edit Penawaran
                      </Button>
                    </Link>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="default"
                        disabled={actionLoading}
                        onClick={() => handleAction(selected, "INVENTORY")}
                        className="bg-foreground hover:bg-foreground/90"
                      >
                        Deal (Inventory)
                      </Button>
                      <Button
                        variant="destructive"
                        disabled={actionLoading}
                        onClick={() => handleAction(selected, "REJECTED")}
                      >
                        Tidak Deal
                      </Button>
                    </div>
                  </div>
                )}
                {(selected.status === "INVENTORY" || selected.status === "SOLD") && (
                  <Link href="/admin/inventory" className="block">
                    <Button variant="outline" className="w-full">
                      Lihat di Inventory
                    </Button>
                  </Link>
                )}

                {selected.status !== "INVENTORY" &&
                  selected.status !== "SOLD" && (
                    <div className="border-t border-border/50 pt-3 flex justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={actionLoading}
                        onClick={() => handleDelete(selected)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Hapus
                      </Button>
                    </div>
                  )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ══════ CREATE DIALOG ══════ */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="bg-card border-border sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 pr-8">
              <Plus className="h-5 w-5 text-primary" />
              Tambah Pengajuan Manual
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Data Laptop */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Data Laptop
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5 col-span-2">
                  <Label className="text-xs">Nama Laptop *</Label>
                  <Input
                    value={createForm.namaLaptop}
                    onChange={(e) => updateCreate("namaLaptop", e.target.value)}
                    placeholder="cth: Asus ROG Strix G16"
                    className="h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Brand</Label>
                  <select
                    value={createForm.brand}
                    onChange={(e) => updateCreate("brand", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Pilih…</option>
                    {["ASUS", "Acer", "HP", "Dell", "Lenovo", "MSI", "Apple", "LG", "Samsung", "Toshiba", "Lainnya"].map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Tahun</Label>
                  <Input
                    type="number"
                    value={createForm.tahun}
                    onChange={(e) => updateCreate("tahun", e.target.value)}
                    placeholder="2022"
                    className="h-10"
                  />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <Label className="text-xs">Processor</Label>
                  <Input
                    value={createForm.processor}
                    onChange={(e) => updateCreate("processor", e.target.value)}
                    placeholder="cth: Intel Core i7-12700H"
                    className="h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">RAM</Label>
                  <select
                    value={createForm.ram}
                    onChange={(e) => updateCreate("ram", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {["4GB", "8GB", "16GB", "32GB", "64GB"].map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Storage</Label>
                  <select
                    value={createForm.storage}
                    onChange={(e) => updateCreate("storage", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {["128GB SSD", "256GB SSD", "512GB SSD", "1TB SSD", "2TB SSD"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Kategori</Label>
                  <select
                    value={createForm.kategori}
                    onChange={(e) => updateCreate("kategori", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {["Gaming", "Editing", "Kerja", "Sekolah", "Ultrabook"].map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Kondisi</Label>
                  <select
                    value={createForm.kondisi}
                    onChange={(e) => updateCreate("kondisi", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {["Baru", "Bagus", "Cacat", "Rusak"].map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5 col-span-2">
                  <Label className="text-xs">Catatan</Label>
                  <Textarea
                    value={createForm.catatan}
                    onChange={(e) => updateCreate("catatan", e.target.value)}
                    placeholder="cth: baterai drop, ada gores"
                    className="min-h-[60px]"
                  />
                </div>
              </div>
            </div>

            {/* Data Customer */}
            <div className="space-y-3 border-t border-border/50 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Data Customer
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Nama *</Label>
                  <Input
                    value={createForm.customerName}
                    onChange={(e) => updateCreate("customerName", e.target.value)}
                    placeholder="Nama customer"
                    className="h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">No. WhatsApp *</Label>
                  <Input
                    value={createForm.customerPhone}
                    onChange={(e) => updateCreate("customerPhone", e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="h-10"
                  />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <Label className="text-xs">Alamat (opsional)</Label>
                  <Input
                    value={createForm.customerAddress}
                    onChange={(e) => updateCreate("customerAddress", e.target.value)}
                    placeholder="Kota"
                    className="h-10"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setCreateOpen(false)}
                disabled={creating}
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                onClick={handleCreate}
                disabled={creating || !createForm.namaLaptop || !createForm.customerName || !createForm.customerPhone}
                className="flex-1 gap-1.5"
              >
                {creating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Tambah Pengajuan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <Card className="border-border/50">
      <CardContent className="p-3">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`text-xl font-bold ${color}`}>{value}</p>
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
