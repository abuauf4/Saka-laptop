"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Pencil, Loader2, PackagePlus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatPrice, formatDateTime } from "@/lib/format";
import { toast } from "sonner";

interface Barang {
  id: string; kode: string; merk: string; tipe: string; spesifikasi: string;
  keterangan: string; hargaBeli: number; status: string; createdAt: string;
}

export default function BarangMasukPage() {
  const [list, setList] = useState<Barang[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Barang | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ merk: "", tipe: "", spesifikasi: "", keterangan: "", hargaBeli: "" });

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/barang?status=available", { cache: "no-store" });
      if (res.ok) setList(await res.json());
    } catch (e) { console.error(e); } finally { setIsLoaded(true); }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openCreate() { setEditing(null); setForm({ merk: "", tipe: "", spesifikasi: "", keterangan: "", hargaBeli: "" }); setDialogOpen(true); }
  function openEdit(b: Barang) { setEditing(b); setForm({ merk: b.merk, tipe: b.tipe, spesifikasi: b.spesifikasi, keterangan: b.keterangan, hargaBeli: String(b.hargaBeli) }); setDialogOpen(true); }

  async function handleSave() {
    if (!form.merk || !form.tipe) { toast.error("Merk dan tipe wajib diisi"); return; }
    setSaving(true);
    try {
      const url = editing ? `/api/barang/${editing.id}` : "/api/barang";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error("Gagal");
      toast.success(editing ? "Barang diupdate" : "Barang ditambahkan");
      setDialogOpen(false); load();
    } catch { toast.error("Gagal simpan"); } finally { setSaving(false); }
  }

  async function handleDelete(b: Barang) {
    if (!confirm(`Hapus ${b.merk} ${b.tipe}?`)) return;
    try { await fetch(`/api/barang/${b.id}`, { method: "DELETE" }); toast.success("Dihapus"); load(); }
    catch { toast.error("Gagal hapus"); }
  }

  const filtered = list.filter(b => !search || b.merk.toLowerCase().includes(search.toLowerCase()) || b.tipe.toLowerCase().includes(search.toLowerCase()) || b.kode.toLowerCase().includes(search.toLowerCase()));

  if (!isLoaded) return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="min-h-full bg-background">
      <div className="border-b border-border/40 bg-card/30">
        <div className="page-container py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><PackagePlus className="h-6 w-6 text-primary" />Barang Masuk</h1>
            <p className="text-sm text-muted-foreground mt-1">Input barang masuk ke gudang</p>
          </div>
          <Button size="sm" onClick={openCreate} className="gap-1.5"><Plus className="h-4 w-4" />Tambah Barang</Button>
        </div>
      </div>
      <div className="page-container py-6 space-y-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari kode, merk, tipe..." className="pl-9 h-10" />
        </div>
        {filtered.length === 0 ? (
          <Card className="border-dashed"><CardContent className="py-12 text-center"><PackagePlus className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" /><p className="text-sm text-muted-foreground">Belum ada barang</p></CardContent></Card>
        ) : (
          <div className="grid gap-3">
            {filtered.map((b, i) => (
              <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className="border-border/50 hover:border-primary/30 transition-all">
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-[10px] font-mono">{b.kode}</Badge>
                        <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/30">Available</Badge>
                      </div>
                      <p className="font-semibold">{b.merk} {b.tipe}</p>
                      {b.spesifikasi && <p className="text-xs text-muted-foreground mt-0.5">{b.spesifikasi}</p>}
                      {b.keterangan && <p className="text-xs text-muted-foreground mt-0.5 italic">{b.keterangan}</p>}
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <span className="text-muted-foreground">Modal: <strong className="text-amber-500">{formatPrice(b.hargaBeli)}</strong></span>
                        <span className="text-muted-foreground">{formatDateTime(b.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(b)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(b)} className="text-red-400 hover:text-red-300"><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Edit Barang" : "Tambah Barang Masuk"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">Merk *</Label><Input value={form.merk} onChange={(e) => setForm({ ...form, merk: e.target.value })} className="h-10" placeholder="ASUS" /></div>
              <div className="space-y-1.5"><Label className="text-xs">Tipe *</Label><Input value={form.tipe} onChange={(e) => setForm({ ...form, tipe: e.target.value })} className="h-10" placeholder="ROG Strix G16" /></div>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">Spesifikasi</Label><Input value={form.spesifikasi} onChange={(e) => setForm({ ...form, spesifikasi: e.target.value })} className="h-10" placeholder="i7-12700H, 16GB, 512GB SSD" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Keterangan (kondisi)</Label><Textarea value={form.keterangan} onChange={(e) => setForm({ ...form, keterangan: e.target.value })} className="min-h-[60px]" placeholder="Baterai health 85%, ada gores..." /></div>
            <div className="space-y-1.5"><Label className="text-xs">Harga Beli (Modal) *</Label><Input type="number" value={form.hargaBeli} onChange={(e) => setForm({ ...form, hargaBeli: e.target.value })} className="h-10" placeholder="5000000" /></div>
            {form.hargaBeli && <p className="text-xs text-amber-500 font-semibold">{formatPrice(parseInt(form.hargaBeli) || 0)}</p>}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving} className="flex-1">Batal</Button>
              <Button onClick={handleSave} disabled={saving || !form.merk || !form.tipe} className="flex-1 gap-1.5">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}{editing ? "Update" : "Tambah"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
