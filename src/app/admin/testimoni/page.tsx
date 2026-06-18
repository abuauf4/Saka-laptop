"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Pencil, Star, Loader2, MessageSquareHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageUpload } from "@/components/image-upload";
import { toast } from "sonner";

interface Testimoni {
  id: string;
  nama: string;
  role: string;
  teks: string;
  rating: number;
  laptop: string;
  avatar: string;
}

export default function TestimoniPage() {
  const [list, setList] = useState<Testimoni[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Testimoni | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nama: "",
    role: "Customer",
    teks: "",
    rating: 5,
    laptop: "",
    avatar: "",
  });

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/testimoni", { cache: "no-store" });
      if (res.ok) setList(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    setForm({ nama: "", role: "Customer", teks: "", rating: 5, laptop: "", avatar: "" });
    setDialogOpen(true);
  }

  function openEdit(t: Testimoni) {
    setEditing(t);
    setForm({ nama: t.nama, role: t.role, teks: t.teks, rating: t.rating, laptop: t.laptop, avatar: t.avatar });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.nama || !form.teks) {
      toast.error("Nama dan teks wajib diisi");
      return;
    }
    setSaving(true);
    try {
      const url = editing ? `/api/testimoni/${editing.id}` : "/api/testimoni";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Gagal simpan");
      toast.success(editing ? "Testimoni diupdate" : "Testimoni ditambahkan");
      setDialogOpen(false);
      load();
    } catch (err) {
      console.error(err);
      toast.error("Gagal simpan");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(t: Testimoni) {
    if (!confirm(`Hapus testimoni dari "${t.nama}"?`)) return;
    try {
      await fetch(`/api/testimoni/${t.id}`, { method: "DELETE" });
      toast.success("Testimoni dihapus");
      load();
    } catch (err) {
      console.error(err);
      toast.error("Gagal hapus");
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background">
      <div className="border-b border-border/40 bg-card/30">
        <div className="page-container py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MessageSquareHeart className="h-6 w-6 text-primary" />
              Testimoni
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Kelola testimoni customer</p>
          </div>
          <Button size="sm" onClick={openCreate} className="gap-1.5">
            <Plus className="h-4 w-4" /> Tambah
          </Button>
        </div>
      </div>

      <div className="page-container py-6">
        {list.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <MessageSquareHeart className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">Belum ada testimoni</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {list.map((t, i) => (
              <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className="border-border/50">
                  <CardContent className="p-4 flex items-start gap-3">
                    {t.avatar ? (
                      <img src={t.avatar} alt={t.nama} className="h-10 w-10 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                        {t.nama.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold">{t.nama}</p>
                        <Badge variant="outline" className="text-[9px]">{t.role}</Badge>
                      </div>
                      <div className="flex items-center gap-0.5 mb-1">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star key={idx} className={`h-3 w-3 ${idx < t.rating ? "fill-amber-500 text-amber-500" : "text-muted-foreground/30"}`} />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{t.teks}</p>
                      {t.laptop && <p className="text-xs text-muted-foreground mt-1">Laptop: {t.laptop}</p>}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(t)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(t)} className="text-red-400 hover:text-red-300">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Testimoni" : "Tambah Testimoni"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Nama *</Label>
              <Input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className="h-10" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Role</Label>
                <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="h-10" placeholder="cth: Customer" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Rating</Label>
                <select
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>{r} bintang</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Laptop (opsional)</Label>
              <Input value={form.laptop} onChange={(e) => setForm({ ...form, laptop: e.target.value })} className="h-10" placeholder="cth: MacBook Pro M3" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Testimoni *</Label>
              <Textarea value={form.teks} onChange={(e) => setForm({ ...form, teks: e.target.value })} className="min-h-[80px]" placeholder="Isi testimoni..." />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Avatar (opsional)</Label>
              <ImageUpload value={form.avatar} onChange={(url) => setForm({ ...form, avatar: url })} label="Avatar" folder="Testimoni" />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving} className="flex-1">Batal</Button>
              <Button onClick={handleSave} disabled={saving || !form.nama || !form.teks} className="flex-1 gap-1.5">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                {editing ? "Update" : "Tambah"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
