"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Search, Loader2, CheckCircle2, Phone, MapPin, User, Pencil, XCircle, History, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { formatPrice, formatDateTime } from "@/lib/format";
import { toast } from "sonner";

interface Barang { id: string; kode: string; merk: string; tipe: string; spesifikasi: string; keterangan: string; hargaBeli: number; status: string; hargaJual: number | null; namaPembeli: string | null; noWa: string | null; domisili: string | null; soldAt: string | null; createdAt: string; }

export default function KasirPage() {
  const [list, setList] = useState<Barang[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"available" | "sold">("available");

  // Sell dialog
  const [selected, setSelected] = useState<Barang | null>(null);
  const [sellDialogOpen, setSellDialogOpen] = useState(false);
  const [selling, setSelling] = useState(false);
  const [sellSuccess, setSellSuccess] = useState(false);
  const [form, setForm] = useState({ hargaJual: "", namaPembeli: "", noWa: "", domisili: "" });

  // Edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({ hargaJual: "", namaPembeli: "", noWa: "", domisili: "" });
  const [editing, setEditing] = useState(false);

  // Cancel dialog
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<Barang | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/barang", { cache: "no-store" });
      if (res.ok) setList(await res.json());
    } catch (e) { console.error(e); } finally { setIsLoaded(true); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const availableList = list.filter(b => b.status === "available");
  const soldList = list.filter(b => b.status === "sold");
  const activeList = tab === "available" ? availableList : soldList;
  const filtered = activeList.filter(b => !search || b.merk.toLowerCase().includes(search.toLowerCase()) || b.tipe.toLowerCase().includes(search.toLowerCase()) || b.kode.toLowerCase().includes(search.toLowerCase()));

  function openSell(b: Barang) {
    setSelected(b);
    setForm({ hargaJual: String(Math.round(b.hargaBeli * 1.3)), namaPembeli: "", noWa: "", domisili: "" });
    setSellDialogOpen(true); setSellSuccess(false);
  }

  function openEdit(b: Barang) {
    setSelected(b);
    setEditForm({
      hargaJual: String(b.hargaJual || ""),
      namaPembeli: b.namaPembeli || "",
      noWa: b.noWa || "",
      domisili: b.domisili || "",
    });
    setEditDialogOpen(true);
  }

  function openCancel(b: Barang) {
    setCancelTarget(b);
    setCancelDialogOpen(true);
  }

  async function handleSell() {
    if (!selected || !form.hargaJual) { toast.error("Harga jual wajib diisi"); return; }
    setSelling(true);
    try {
      const res = await fetch("/api/kasir", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ barangId: selected.id, ...form, hargaJual: parseInt(form.hargaJual) }) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const data = await res.json();
      setSellSuccess(true);
      toast.success(`Terjual! Profit: ${formatPrice(data.profit)}`);
      load();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Gagal"); } finally { setSelling(false); }
  }

  async function handleEdit() {
    if (!selected) return;
    if (!editForm.hargaJual) { toast.error("Harga jual wajib diisi"); return; }
    setEditing(true);
    try {
      const res = await fetch(`/api/kasir/${selected.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hargaJual: parseInt(editForm.hargaJual), namaPembeli: editForm.namaPembeli, noWa: editForm.noWa, domisili: editForm.domisili }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      toast.success("Transaksi diupdate");
      setEditDialogOpen(false);
      load();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Gagal update"); } finally { setEditing(false); }
  }

  async function handleCancel() {
    if (!cancelTarget) return;
    setCanceling(true);
    try {
      const res = await fetch(`/api/kasir/${cancelTarget.id}`, { method: "DELETE" });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      toast.success("Transaksi dibatalkan, barang kembali ke inventory");
      setCancelDialogOpen(false);
      setCancelTarget(null);
      load();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Gagal batalkan"); } finally { setCanceling(false); }
  }

  if (!isLoaded) return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="min-h-full bg-background">
      <div className="border-b border-border/40 bg-card/30">
        <div className="page-container py-6">
          <h1 className="text-2xl font-bold flex items-center gap-2"><ShoppingCart className="h-6 w-6 text-primary" />Kasir</h1>
          <p className="text-sm text-muted-foreground mt-1">Jual barang dari inventory — {availableList.length} available, {soldList.length} terjual</p>
        </div>
      </div>
      <div className="page-container py-6 space-y-4">
        {/* Tabs */}
        <div className="flex gap-2">
          <Button variant={tab === "available" ? "default" : "outline"} size="sm" onClick={() => setTab("available")} className="gap-1.5">
            <Package className="h-4 w-4" />Available ({availableList.length})
          </Button>
          <Button variant={tab === "sold" ? "default" : "outline"} size="sm" onClick={() => setTab("sold")} className="gap-1.5">
            <History className="h-4 w-4" />Riwayat Transaksi ({soldList.length})
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari barang..." className="pl-9 h-10" />
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <Card className="border-dashed"><CardContent className="py-12 text-center">{tab === "available" ? <><Package className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" /><p className="text-sm text-muted-foreground">Tidak ada barang available</p></> : <><History className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" /><p className="text-sm text-muted-foreground">Belum ada riwayat transaksi</p></>}</CardContent></Card>
        ) : (
          <div className="grid gap-3">
            {filtered.map((b, i) => (
              <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                {tab === "available" ? (
                  <Card className="border-border/50 hover:border-primary/30 transition-all cursor-pointer" onClick={() => openSell(b)}>
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1"><Badge variant="outline" className="text-[10px] font-mono">{b.kode}</Badge></div>
                        <p className="font-semibold">{b.merk} {b.tipe}</p>
                        {b.spesifikasi && <p className="text-xs text-muted-foreground mt-0.5">{b.spesifikasi}</p>}
                        <div className="flex items-center gap-4 mt-2 text-xs">
                          <span className="text-muted-foreground">Modal: <strong className="text-amber-500">{formatPrice(b.hargaBeli)}</strong></span>
                          <span className="text-muted-foreground">Saran jual: <strong className="text-emerald-500">{formatPrice(Math.round(b.hargaBeli * 1.3))}</strong></span>
                        </div>
                      </div>
                      <Button size="sm" className="shrink-0 gap-1.5" onClick={(e) => { e.stopPropagation(); openSell(b); }}><ShoppingCart className="h-3.5 w-3.5" />Jual</Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-border/50">
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-[10px] font-mono">{b.kode}</Badge>
                          <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/30">Terjual</Badge>
                        </div>
                        <p className="font-semibold">{b.merk} {b.tipe}</p>
                        {b.spesifikasi && <p className="text-xs text-muted-foreground mt-0.5">{b.spesifikasi}</p>}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 mt-2 text-xs">
                          <span>Modal: <strong className="text-amber-500">{formatPrice(b.hargaBeli)}</strong></span>
                          <span>Jual: <strong className="text-emerald-500">{formatPrice(b.hargaJual || 0)}</strong></span>
                          <span>Profit: <strong className={((b.hargaJual || 0) - b.hargaBeli) >= 0 ? "text-emerald-500" : "text-red-500"}>{formatPrice((b.hargaJual || 0) - b.hargaBeli)}</strong></span>
                          {b.namaPembeli && <span>Pembeli: <strong>{b.namaPembeli}</strong></span>}
                          {b.noWa && <span>WA: <strong>{b.noWa}</strong></span>}
                          {b.domisili && <span>Domisili: <strong>{b.domisili}</strong></span>}
                        </div>
                        {b.soldAt && <p className="text-[10px] text-muted-foreground mt-1.5">Terjual: {formatDateTime(b.soldAt)}</p>}
                      </div>
                      <div className="flex flex-col gap-1 shrink-0">
                        <Button size="sm" variant="ghost" onClick={() => openEdit(b)}><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300" onClick={() => openCancel(b)}><XCircle className="h-3.5 w-3.5" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Sell Dialog */}
      <Dialog open={sellDialogOpen} onOpenChange={setSellDialogOpen}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader><DialogTitle>{sellSuccess ? "Transaksi Selesai" : "Jual Barang"}</DialogTitle></DialogHeader>
          {sellSuccess ? (
            <div className="text-center py-6">
              <CheckCircle2 className="h-14 w-14 text-emerald-500 mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">Barang Terjual!</p>
              {selected && form.hargaJual && (
                <p className="text-sm text-muted-foreground">Profit: <strong className="text-emerald-500">{formatPrice(parseInt(form.hargaJual) - selected.hargaBeli)}</strong></p>
              )}
              <Button className="mt-6 w-full" onClick={() => { setSellDialogOpen(false); setSelected(null); }}>Selesai</Button>
            </div>
          ) : selected && (
            <div className="space-y-4">
              <div className="rounded-lg border border-border/50 p-3 bg-muted/30">
                <div className="flex items-center gap-2 mb-1"><Badge variant="outline" className="text-[10px] font-mono">{selected.kode}</Badge></div>
                <p className="font-semibold">{selected.merk} {selected.tipe}</p>
                {selected.spesifikasi && <p className="text-xs text-muted-foreground mt-0.5">{selected.spesifikasi}</p>}
                <p className="text-xs text-muted-foreground mt-2">Modal: <strong className="text-amber-500">{formatPrice(selected.hargaBeli)}</strong></p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Harga Jual *</Label>
                <Input type="number" value={form.hargaJual} onChange={(e) => setForm({ ...form, hargaJual: e.target.value })} className="h-10" />
                {form.hargaJual && <p className="text-xs text-emerald-500 font-semibold">Profit: {formatPrice((parseInt(form.hargaJual) || 0) - selected.hargaBeli)}</p>}
              </div>
              <div className="space-y-1.5"><Label className="text-xs">Nama Pembeli (opsional)</Label><div className="relative"><User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" /><Input value={form.namaPembeli} onChange={(e) => setForm({ ...form, namaPembeli: e.target.value })} className="pl-9 h-10" placeholder="Budi" /></div></div>
              <div className="space-y-1.5"><Label className="text-xs">No. WhatsApp (opsional)</Label><div className="relative"><Phone className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" /><Input value={form.noWa} onChange={(e) => setForm({ ...form, noWa: e.target.value })} className="pl-9 h-10" placeholder="08xxx" /></div></div>
              <div className="space-y-1.5"><Label className="text-xs">Domisili (opsional)</Label><div className="relative"><MapPin className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" /><Input value={form.domisili} onChange={(e) => setForm({ ...form, domisili: e.target.value })} className="pl-9 h-10" placeholder="Jakarta" /></div></div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => setSellDialogOpen(false)} className="flex-1">Batal</Button>
                <Button onClick={handleSell} disabled={selling || !form.hargaJual} className="flex-1 gap-1.5">{selling ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}Jual</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Transaction Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Transaksi</DialogTitle>
            <DialogDescription>Ubah detail transaksi yang sudah terjual</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="rounded-lg border border-border/50 p-3 bg-muted/30">
                <div className="flex items-center gap-2 mb-1"><Badge variant="outline" className="text-[10px] font-mono">{selected.kode}</Badge></div>
                <p className="font-semibold">{selected.merk} {selected.tipe}</p>
                <p className="text-xs text-muted-foreground mt-1">Modal: <strong className="text-amber-500">{formatPrice(selected.hargaBeli)}</strong></p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Harga Jual *</Label>
                <Input type="number" value={editForm.hargaJual} onChange={(e) => setEditForm({ ...editForm, hargaJual: e.target.value })} className="h-10" />
                {editForm.hargaJual && <p className="text-xs text-emerald-500 font-semibold">Profit: {formatPrice((parseInt(editForm.hargaJual) || 0) - selected.hargaBeli)}</p>}
              </div>
              <div className="space-y-1.5"><Label className="text-xs">Nama Pembeli</Label><div className="relative"><User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" /><Input value={editForm.namaPembeli} onChange={(e) => setEditForm({ ...editForm, namaPembeli: e.target.value })} className="pl-9 h-10" /></div></div>
              <div className="space-y-1.5"><Label className="text-xs">No. WhatsApp</Label><div className="relative"><Phone className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" /><Input value={editForm.noWa} onChange={(e) => setEditForm({ ...editForm, noWa: e.target.value })} className="pl-9 h-10" /></div></div>
              <div className="space-y-1.5"><Label className="text-xs">Domisili</Label><div className="relative"><MapPin className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" /><Input value={editForm.domisili} onChange={(e) => setEditForm({ ...editForm, domisili: e.target.value })} className="pl-9 h-10" /></div></div>
              <DialogFooter className="gap-2 pt-2">
                <Button variant="outline" onClick={() => setEditDialogOpen(false)} disabled={editing}>Batal</Button>
                <Button onClick={handleEdit} disabled={editing || !editForm.hargaJual} className="gap-1.5">{editing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pencil className="h-4 w-4" />}Update</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Transaction Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent className="border-border bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Batalkan Transaksi</AlertDialogTitle>
            <AlertDialogDescription>
              Yakin ingin membatalkan transaksi <strong>{cancelTarget?.merk} {cancelTarget?.tipe}</strong>? Barang akan kembali status <strong>available</strong> di inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={canceling}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel} disabled={canceling} className="bg-destructive text-white hover:bg-destructive/90">
              {canceling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
              Batalkan Transaksi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
