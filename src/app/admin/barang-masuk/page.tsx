"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Pencil, Loader2, PackagePlus, Search, Cpu, MemoryStick, HardDrive, Monitor, Battery, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatPrice, formatDateTime } from "@/lib/format";
import { toast } from "sonner";

interface Barang {
  id: string; kode: string; merk: string; tipe: string;
  processor: string; ram: string; storage: string; gpu: string; layar: string; tahun: number; kondisi: string; kelengkapan: string; bateraiHealth: string;
  spesifikasi: string; keterangan: string; hargaBeli: number; status: string; createdAt: string;
}

const KONDISI_OPTIONS = ["Bagus", "Cukup Baik", "Rusak Ringan", "Rusak Berat"];
const RAM_OPTIONS = ["2GB", "4GB", "8GB", "16GB", "32GB", "64GB"];
const STORAGE_PRESETS = ["128GB SSD", "256GB SSD", "512GB SSD", "1TB SSD", "256GB HDD", "512GB HDD", "1TB HDD", "1TB SSD + 1TB HDD"];

const defaultForm = {
  merk: "", tipe: "", processor: "", ram: "", storage: "", gpu: "",
  layar: "", tahun: "", kondisi: "Bagus", kelengkapan: "", bateraiHealth: "",
  keterangan: "", hargaBeli: "",
};

type FormType = typeof defaultForm;

export default function BarangMasukPage() {
  const [list, setList] = useState<Barang[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Barang | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<FormType>({ ...defaultForm });

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/barang?status=available", { cache: "no-store" });
      if (res.ok) setList(await res.json());
    } catch (e) { console.error(e); } finally { setIsLoaded(true); }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openCreate() { setEditing(null); setForm({ ...defaultForm }); setDialogOpen(true); }

  function openEdit(b: Barang) {
    setEditing(b);
    setForm({
      merk: b.merk, tipe: b.tipe, processor: b.processor || "", ram: b.ram || "",
      storage: b.storage || "", gpu: b.gpu || "", layar: b.layar || "",
      tahun: b.tahun ? String(b.tahun) : "", kondisi: b.kondisi || "Bagus",
      kelengkapan: b.kelengkapan || "", bateraiHealth: b.bateraiHealth || "",
      keterangan: b.keterangan || "", hargaBeli: String(b.hargaBeli),
    });
    setDialogOpen(true);
  }

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
                      {(b.processor || b.ram || b.storage || b.gpu || b.layar) && (
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-xs text-muted-foreground">
                          {b.processor && <span><Cpu className="inline h-3 w-3 mr-0.5" />{b.processor}</span>}
                          {b.ram && <span><MemoryStick className="inline h-3 w-3 mr-0.5" />{b.ram}</span>}
                          {b.storage && <span><HardDrive className="inline h-3 w-3 mr-0.5" />{b.storage}</span>}
                          {b.gpu && <span className="text-muted-foreground">GPU: {b.gpu}</span>}
                          {b.layar && <span><Monitor className="inline h-3 w-3 mr-0.5" />{b.layar}</span>}
                        </div>
                      )}
                      {b.kondisi && b.kondisi !== "Bagus" && <Badge variant="secondary" className="text-[10px] mt-1">{b.kondisi}</Badge>}
                      {b.bateraiHealth && <span className="text-[10px] text-muted-foreground ml-1"><Battery className="inline h-3 w-3 mr-0.5" />{b.bateraiHealth}</span>}
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

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Barang" : "Tambah Barang Masuk"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            {/* Merk & Tipe */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">Merk *</Label><Input value={form.merk} onChange={(e) => setForm({ ...form, merk: e.target.value })} className="h-10" placeholder="ASUS" /></div>
              <div className="space-y-1.5"><Label className="text-xs">Tipe *</Label><Input value={form.tipe} onChange={(e) => setForm({ ...form, tipe: e.target.value })} className="h-10" placeholder="ROG Strix G16" /></div>
            </div>

            {/* Processor & RAM */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs"><Cpu className="inline h-3 w-3 mr-1" />Processor</Label>
                <Input value={form.processor} onChange={(e) => setForm({ ...form, processor: e.target.value })} className="h-10" placeholder="i7-12700H" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs"><MemoryStick className="inline h-3 w-3 mr-1" />RAM</Label>
                <Select value={form.ram} onValueChange={(v) => setForm({ ...form, ram: v })}>
                  <SelectTrigger className="h-10"><SelectValue placeholder="Pilih RAM" /></SelectTrigger>
                  <SelectContent>
                    {RAM_OPTIONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Storage & GPU */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs"><HardDrive className="inline h-3 w-3 mr-1" />Storage</Label>
                <Select value={form.storage} onValueChange={(v) => setForm({ ...form, storage: v })}>
                  <SelectTrigger className="h-10"><SelectValue placeholder="Pilih Storage" /></SelectTrigger>
                  <SelectContent>
                    {STORAGE_PRESETS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">GPU (VGA)</Label>
                <Input value={form.gpu} onChange={(e) => setForm({ ...form, gpu: e.target.value })} className="h-10" placeholder="RTX 3060 6GB" />
              </div>
            </div>

            {/* Layar & Tahun */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs"><Monitor className="inline h-3 w-3 mr-1" />Ukuran Layar</Label>
                <Input value={form.layar} onChange={(e) => setForm({ ...form, layar: e.target.value })} className="h-10" placeholder='15.6&quot; FHD IPS' />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Tahun</Label>
                <Input type="number" value={form.tahun} onChange={(e) => setForm({ ...form, tahun: e.target.value })} className="h-10" placeholder="2023" min="2000" max="2030" />
              </div>
            </div>

            {/* Kondisi & Baterai */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Kondisi</Label>
                <Select value={form.kondisi} onValueChange={(v) => setForm({ ...form, kondisi: v })}>
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {KONDISI_OPTIONS.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs"><Battery className="inline h-3 w-3 mr-1" />Baterai Health</Label>
                <Input value={form.bateraiHealth} onChange={(e) => setForm({ ...form, bateraiHealth: e.target.value })} className="h-10" placeholder="85%" />
              </div>
            </div>

            {/* Kelengkapan */}
            <div className="space-y-1.5">
              <Label className="text-xs"><Box className="inline h-3 w-3 mr-1" />Kelengkapan</Label>
              <Input value={form.kelengkapan} onChange={(e) => setForm({ ...form, kelengkapan: e.target.value })} className="h-10" placeholder="Laptop + Charger + Tas" />
            </div>

            {/* Keterangan */}
            <div className="space-y-1.5">
              <Label className="text-xs">Keterangan (catatan kondisi)</Label>
              <Textarea value={form.keterangan} onChange={(e) => setForm({ ...form, keterangan: e.target.value })} className="min-h-[60px]" placeholder="Bodi ada gores kecil, layar tidak dead pixel..." />
            </div>

            {/* Harga Beli */}
            <div className="space-y-1.5">
              <Label className="text-xs">Harga Beli (Modal) *</Label>
              <Input type="number" value={form.hargaBeli} onChange={(e) => setForm({ ...form, hargaBeli: e.target.value })} className="h-10" placeholder="5000000" />
              {form.hargaBeli && <p className="text-xs text-amber-500 font-semibold">{formatPrice(parseInt(form.hargaBeli) || 0)}</p>}
            </div>

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
