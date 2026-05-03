"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Star,
  MessageSquareHeart,
  X,
  ImagePlus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { useTestimoni } from "@/lib/testimoni-store";
import { type Testimoni } from "@/lib/testimoni-store";
import { toast } from "sonner";

/* ── CONSTANTS ── */
const roles = [
  "Gamer",
  "Content Creator",
  "Mahasiswa",
  "Freelancer",
  "Designer",
  "Karyawan",
  "Pelajar",
] as const;

const roleColors: Record<string, string> = {
  Gamer: "bg-red-500/15 text-red-400 border-red-500/30",
  "Content Creator": "bg-purple-500/15 text-purple-400 border-purple-500/30",
  Mahasiswa: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Freelancer: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  Designer: "bg-pink-500/15 text-pink-400 border-pink-500/30",
  Karyawan: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Pelajar: "bg-teal-500/15 text-teal-400 border-teal-500/30",
};

const emptyForm = {
  nama: "",
  role: "Gamer" as Testimoni["role"],
  teks: "",
  rating: 5,
  laptop: "",
  avatar: "",
};

type FormData = typeof emptyForm;

/* ── PAGE ── */
export default function AdminTestimoniPage() {
  const { testimoni, addTestimoni, updateTestimoni, deleteTestimoni, isLoaded } = useTestimoni();
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [deletingItem, setDeletingItem] = useState<Testimoni | null>(null);

  // Filter
  const filtered = testimoni.filter(
    (t) =>
      !search ||
      t.nama.toLowerCase().includes(search.toLowerCase()) ||
      t.role.toLowerCase().includes(search.toLowerCase()) ||
      t.laptop.toLowerCase().includes(search.toLowerCase()) ||
      t.teks.toLowerCase().includes(search.toLowerCase())
  );

  // ADD
  const handleAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  // EDIT
  const handleEdit = (item: Testimoni) => {
    setEditingId(item.id);
    setForm({
      nama: item.nama,
      role: item.role,
      teks: item.teks,
      rating: item.rating,
      laptop: item.laptop,
      avatar: item.avatar,
    });
    setFormOpen(true);
  };

  // SAVE
  const handleSave = () => {
    if (!form.nama.trim()) {
      toast.error("Nama pelanggan wajib diisi");
      return;
    }
    if (!form.teks.trim()) {
      toast.error("Teks testimoni wajib diisi");
      return;
    }

    if (editingId) {
      updateTestimoni(editingId, { ...form });
      toast.success("Testimoni berhasil diperbarui");
    } else {
      addTestimoni({ ...form });
      toast.success("Testimoni berhasil ditambahkan");
    }
    setFormOpen(false);
  };

  // DELETE
  const handleDelete = () => {
    if (!deletingItem) return;
    deleteTestimoni(deletingItem.id);
    toast.success("Testimoni berhasil dihapus");
    setDeletingItem(null);
  };

  // Average rating
  const avgRating = testimoni.length > 0
    ? (testimoni.reduce((a, t) => a + t.rating, 0) / testimoni.length).toFixed(1)
    : "0";

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 page-container max-w-6xl page-animate">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between gap-3"
      >
        <div>
          <h1 className="text-xl lg:text-2xl font-bold">Testimoni</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {testimoni.length} testimoni · Rata-rata ⭐ {avgRating}
          </p>
        </div>
        <Button className="gap-2 min-h-[44px] rounded-xl text-sm font-semibold shadow-soft-sm shadow-primary/15 hover:shadow-soft-md hover:shadow-primary/25 transition-all duration-300" onClick={handleAdd}>
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Tambah Testimoni</span>
          <span className="sm:hidden">Tambah</span>
        </Button>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari nama, role, laptop..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-12 bg-card border-border/50 rounded-xl text-base"
        />
      </div>

      {/* Testimoni List */}
      {!isLoaded ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-muted/20 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <MessageSquareHeart className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-muted-foreground">Tidak ada testimoni ditemukan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <AnimatePresence>
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
              >
                <Card className="border-border/50 card-glow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center overflow-hidden">
                        {item.avatar ? (
                          <img src={item.avatar} alt={item.nama} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-sm font-bold text-primary">
                            {item.nama.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-sm truncate">{item.nama}</h3>
                          <Badge
                            variant="outline"
                            className={`text-xs px-1.5 py-0.5 flex-shrink-0 ${roleColors[item.role] || "bg-muted/50 text-muted-foreground border-muted/50"}`}
                          >
                            {item.role}
                          </Badge>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < item.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-muted/30 text-muted/30"
                              }`}
                            />
                          ))}
                        </div>

                        {/* Review text */}
                        <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                          &ldquo;{item.teks}&rdquo;
                        </p>

                        {/* Laptop */}
                        {item.laptop && (
                          <p className="text-xs text-primary/80 mt-1.5 font-medium">
                            📦 {item.laptop}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-lg hover:bg-muted/60"
                          onClick={() => handleEdit(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setDeletingItem(item)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ── ADD/EDIT FORM SHEET ── */}
      <Sheet open={formOpen} onOpenChange={setFormOpen}>
        <SheetContent className="w-full sm:max-w-md bg-card p-0 flex flex-col">
          <SheetHeader className="px-5 pt-5 pb-3 border-b border-border/50 flex-shrink-0">
            <SheetTitle>{editingId ? "Edit Testimoni" : "Tambah Testimoni"}</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
            {/* Avatar */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Foto Pelanggan</Label>
              <div className="flex gap-3 items-start">
                <div className="relative w-20 h-20 rounded-full bg-muted/20 overflow-hidden flex-shrink-0 flex items-center justify-center border-2 border-dashed border-border/50">
                  {form.avatar ? (
                    <>
                      <img src={form.avatar} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, avatar: "" })}
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-sm hover:bg-destructive/90 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-primary">
                      {form.nama ? form.nama.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "?"}
                    </span>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <Input
                    value={form.avatar}
                    onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                    placeholder="URL foto (https://...)"
                    className="h-10 rounded-xl bg-background text-sm"
                  />
                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium cursor-pointer hover:bg-primary/20 transition-colors min-h-[40px]">
                    <ImagePlus className="h-4 w-4" />
                    Upload File
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.size > 2 * 1024 * 1024) {
                          toast.error("Ukuran file maksimal 2MB");
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          setForm({ ...form, avatar: ev.target?.result as string });
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Masukkan URL foto atau upload file (maks 2MB)</p>
            </div>

            {/* Nama */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Nama Pelanggan</Label>
              <Input
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                placeholder="Nama lengkap"
                className="h-12 rounded-xl bg-background text-base"
              />
            </div>

            {/* Role + Rating */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Role</Label>
                <Select
                  value={form.role}
                  onValueChange={(v) => setForm({ ...form, role: v as Testimoni["role"] })}
                >
                  <SelectTrigger className="h-12 rounded-xl bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Rating</Label>
                <RatingInput value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
              </div>
            </div>

            {/* Laptop */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Laptop yang Dibeli</Label>
              <Input
                value={form.laptop}
                onChange={(e) => setForm({ ...form, laptop: e.target.value })}
                placeholder="Contoh: ASUS ROG Strix G16"
                className="h-12 rounded-xl bg-background text-base"
              />
            </div>

            {/* Teks Testimoni */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Teks Testimoni</Label>
              <Textarea
                value={form.teks}
                onChange={(e) => setForm({ ...form, teks: e.target.value })}
                placeholder="Tulis testimoni pelanggan..."
                className="min-h-[120px] rounded-xl bg-background text-base resize-none"
                rows={4}
              />
            </div>
          </div>

          {/* Bottom buttons */}
          <div className="flex gap-3 px-5 py-4 border-t border-border/50 flex-shrink-0">
            <Button
              variant="outline"
              className="flex-1 min-h-[48px] rounded-xl"
              onClick={() => setFormOpen(false)}
            >
              Batal
            </Button>
            <Button
              className="flex-1 min-h-[48px] rounded-xl shadow-soft-sm shadow-primary/15 hover:shadow-soft-md hover:shadow-primary/25 transition-all duration-300"
              onClick={handleSave}
              disabled={!form.nama.trim() || !form.teks.trim()}
            >
              {editingId ? "Simpan" : "Tambah"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* ── DELETE CONFIRMATION ── */}
      <AlertDialog
        open={!!deletingItem}
        onOpenChange={() => setDeletingItem(null)}
      >
        <AlertDialogContent className="bg-card border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Testimoni?</AlertDialogTitle>
            <AlertDialogDescription>
              Testimoni dari &quot;{deletingItem?.nama}&quot; akan dihapus permanen.
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="min-h-[44px] rounded-xl">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              className="min-h-[44px] rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ── RATING INPUT ── */
function RatingInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1 h-12 px-1">
      {Array.from({ length: 5 }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="flex-1 flex items-center justify-center min-h-[44px] rounded-lg transition-all duration-200 hover:bg-muted/30"
        >
          <Star
            className={`h-6 w-6 transition-all duration-200 ${
              n <= value
                ? "fill-amber-400 text-amber-400 scale-110"
                : "fill-muted/30 text-muted/30 scale-100"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
