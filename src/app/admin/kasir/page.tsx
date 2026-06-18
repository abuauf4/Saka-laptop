"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Search, Loader2, CheckCircle2, Phone, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";

interface Barang { id: string; kode: string; merk: string; tipe: string; spesifikasi: string; keterangan: string; hargaBeli: number; }

export default function KasirPage() {
  const [list, setList] = useState<Barang[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Barang | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selling, setSelling] = useState(false);
  const [form, setForm] = useState({ hargaJual: "", namaPembeli: "", noWa: "", domisili: "" });
  const [success, setSuccess] = useState(false);

  const load = useCallback(async () => {
    try { const res = await fetch("/api/barang?status=available", { cache: "no-store" }); if (res.ok) setList(await res.json()); }
    catch (e) { console.error(e); } finally { setIsLoaded(true); }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openSell(b: Barang) {
    setSelected(b);
    setForm({ hargaJual: String(Math.round(b.hargaBeli * 1.3)), namaPembeli: "", noWa: "", domisili: "" });
    setDialogOpen(true); setSuccess(false);
  }

  async function handleSell() {
    if (!selected || !form.hargaJual) { toast.error("Harga jual wajib diisi"); return; }
    setSelling(true);
    try {
      const res = await fetch("/api/kasir", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ barangId: selected.id, ...form, hargaJual: parseInt(form.hargaJual) }) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const data = await res.json();
      setSuccess(true);
      toast.success(`Terjual! Profit: ${formatPrice(data.profit)}`);
      load();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Gagal"); } finally { setSelling(false); }
  }

  const filtered = list.filter(b => !search || b.merk.toLowerCase().includes(search.toLowerCase()) || b.tipe.toLowerCase().includes(search.toLowerCase()) || b.kode.toLowerCase().includes(search.toLowerCase()));

  if (!isLoaded) return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="min-h-full bg-background">
      <div className="border-b border-border/40 bg-card/30">
        <div className="page-container py-6">
          <h1 className="text-2xl font-bold flex items-center gap-2"><ShoppingCart className="h-6 w-6 text-primary" />Kasir</h1>
          <p className="text-sm text-muted-foreground mt-1">Jual barang dari inventory — {list.length} barang available</p>
        </div>
      </div>
      <div className="page-container py-6 space-y-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari barang..." className="pl-9 h-10" />
        </div>
        {filtered.length === 0 ? (
          <Card className="border-dashed"><CardContent className="py-12 text-center"><ShoppingCart className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" /><p className="text-sm text-muted-foreground">Tidak ada barang available</p></CardContent></Card>
        ) : (
          <div className="grid gap-3">
            {filtered.map((b, i) => (
              <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
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
                    <Button size="sm" className="shrink-0 gap-1.5"><ShoppingCart className="h-3.5 w-3.5" />Jual</Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader><DialogTitle>{success ? "Transaksi Selesai" : "Jual Barang"}</DialogTitle></DialogHeader>
          {success ? (
            <div className="text-center py-6">
              <CheckCircle2 className="h-14 w-14 text-emerald-500 mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">Barang Terjual!</p>
              {selected && form.hargaJual && (
                <p className="text-sm text-muted-foreground">Profit: <strong className="text-emerald-500">{formatPrice(parseInt(form.hargaJual) - selected.hargaBeli)}</strong></p>
              )}
              <Button className="mt-6 w-full" onClick={() => { setDialogOpen(false); setSelected(null); }}>Selesai</Button>
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
                <Button variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">Batal</Button>
                <Button onClick={handleSell} disabled={selling || !form.hargaJual} className="flex-1 gap-1.5">{selling ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}Jual</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
