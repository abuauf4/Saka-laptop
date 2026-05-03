"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Laptop,
  ImagePlus,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
import { useProducts } from "@/lib/product-store";
import { type Product } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";
import { SkeletonProductRow } from "@/components/ui/skeleton";

/* ── CONSTANTS ── */
const categories = ["Gaming", "Editing", "Kerja", "Sekolah", "Ultrabook"] as const;

const categoryColors: Record<string, string> = {
  Gaming: "bg-red-500/15 text-red-400 border-red-500/30",
  Editing: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  Kerja: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  Sekolah: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Ultrabook: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

const emptyForm = {
  nama: "",
  harga: 0,
  kategori: "Gaming" as Product["kategori"],
  ram: "",
  storage: "",
  gpu: "",
  performaScore: 5,
  portableScore: 5,
  batteryScore: 5,
  image: "",
};

type FormData = typeof emptyForm;

/* ── PAGE ── */
export default function AdminProdukPage() {
  const { products, addProduct, updateProduct, deleteProduct, isLoaded } = useProducts();
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Filter
  const filtered = products.filter(
    (p) =>
      !search ||
      p.nama.toLowerCase().includes(search.toLowerCase()) ||
      p.kategori.toLowerCase().includes(search.toLowerCase()) ||
      p.gpu.toLowerCase().includes(search.toLowerCase())
  );

  // ADD
  const handleAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  // EDIT
  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      nama: product.nama,
      harga: product.harga,
      kategori: product.kategori,
      ram: product.ram,
      storage: product.storage,
      gpu: product.gpu,
      performaScore: product.performaScore,
      portableScore: product.portableScore,
      batteryScore: product.batteryScore,
      image: product.image || "",
    });
    setFormOpen(true);
  };

  const [uploading, setUploading] = useState(false);

  // Upload image to Cloudinary via API
  const uploadImage = async (base64: string): Promise<string> => {
    try {
      setUploading(true);
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, folder: "saka/products" }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.url;
      }
      // Fallback: return base64 if Cloudinary fails
      console.error("Cloudinary upload failed, keeping base64");
      return base64;
    } catch {
      return base64;
    } finally {
      setUploading(false);
    }
  };

  // SAVE (add or edit)
  const handleSave = async () => {
    if (!form.nama.trim()) {
      toast.error("Nama produk wajib diisi");
      return;
    }

    // Upload image to Cloudinary if it's base64
    let imageUrl = form.image;
    if (imageUrl && imageUrl.startsWith("data:")) {
      toast.loading("Mengupload gambar...", { id: "upload" });
      imageUrl = await uploadImage(imageUrl);
      toast.dismiss("upload");
    }

    const productData = { ...form, image: imageUrl };

    if (editingId) {
      updateProduct(editingId, productData);
      toast.success("Produk berhasil diperbarui");
    } else {
      addProduct(productData);
      toast.success("Produk berhasil ditambahkan");
    }
    setFormOpen(false);
  };

  // DELETE
  const handleDelete = () => {
    if (!deletingProduct) return;
    deleteProduct(deletingProduct.id);
    toast.success("Produk berhasil dihapus");
    setDeletingProduct(null);
  };

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
          <h1 className="text-xl lg:text-2xl font-bold">Produk</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {products.length} produk terdaftar
          </p>
        </div>
        <Button className="gap-2 min-h-[44px] rounded-xl text-sm font-semibold shadow-soft-sm shadow-primary/15 hover:shadow-soft-md hover:shadow-primary/25 transition-all duration-300" onClick={handleAdd}>
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Tambah Produk</span>
          <span className="sm:hidden">Tambah</span>
        </Button>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari nama, kategori, GPU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-12 bg-card border-border/50 rounded-xl text-base"
        />
      </div>

      {/* Product List */}
      {!isLoaded ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonProductRow key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Laptop className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-muted-foreground">Tidak ada produk ditemukan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <AnimatePresence>
            {filtered.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
              >
                <Card className="border-border/50 card-glow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Image */}
                      <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-muted/20 overflow-hidden flex items-center justify-center">
                        {product.image ? (
                          <img src={product.image} alt={product.nama} className="w-full h-full object-cover" />
                        ) : (
                          <Laptop className="h-7 w-7 text-muted-foreground/30" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-sm truncate">
                            {product.nama}
                          </h3>
                          <Badge
                            variant="outline"
                            className={`text-xs px-1.5 py-0.5 flex-shrink-0 ${
                              categoryColors[product.kategori] || ""
                            }`}
                          >
                            {product.kategori}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span>{product.ram}</span>
                          <span className="text-border">·</span>
                          <span>{product.storage}</span>
                          <span className="text-border">·</span>
                          <span>{product.gpu}</span>
                        </div>

                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-sm font-bold text-primary">
                            {formatPrice(product.harga)}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-lg hover:bg-muted/60"
                          onClick={() => handleEdit(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setDeletingProduct(product)}
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
            <SheetTitle className="flex items-center justify-between">
              {editingId ? "Edit Produk" : "Tambah Produk"}
            </SheetTitle>
          </SheetHeader>

          {/* Form - vertical mobile-friendly */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
            {/* Image */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Foto Laptop</Label>
              <div className="flex gap-3 items-start">
                <div className="relative w-28 h-28 rounded-xl bg-muted/20 overflow-hidden flex-shrink-0 flex items-center justify-center border-2 border-dashed border-border/50">
                  {form.image ? (
                    <>
                      <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, image: "" })}
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-sm hover:bg-destructive/90 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </>
                  ) : (
                    <ImagePlus className="h-8 w-8 text-muted-foreground/40" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <Input
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="URL gambar (https://...)"
                    className="h-10 rounded-xl bg-background text-sm"
                  />
                  <label className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium cursor-pointer hover:bg-primary/20 transition-colors min-h-[40px]">
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
                          // Compress uploaded image before storing
                          const img = new window.Image();
                          img.onload = () => {
                            const canvas = document.createElement("canvas");
                            const maxW = 600;
                            const ratio = maxW / img.width;
                            canvas.width = img.width > maxW ? maxW : img.width;
                            canvas.height = img.width > maxW ? Math.round(img.height * ratio) : img.height;
                            const ctx = canvas.getContext("2d");
                            if (ctx) {
                              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                              const compressed = canvas.toDataURL("image/jpeg", 0.6);
                              setForm((prev) => ({ ...prev, image: compressed }));
                            } else {
                              // Fallback: no compression
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                setForm((prev) => ({ ...prev, image: ev.target?.result as string }));
                              };
                              reader.readAsDataURL(file);
                            }
                          };
                          img.src = URL.createObjectURL(file);
                        }}
                      />
                    </label>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Masukkan URL atau upload file gambar (maks 2MB)</p>
            </div>

            {/* Nama */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Nama</Label>
              <Input
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                placeholder="Nama laptop"
                className="h-12 rounded-xl bg-background text-base"
              />
            </div>

            {/* Harga */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Harga (Rp)</Label>
              <Input
                type="number"
                value={form.harga || ""}
                onChange={(e) =>
                  setForm({ ...form, harga: parseInt(e.target.value) || 0 })
                }
                placeholder="15000000"
                className="h-12 rounded-xl bg-background text-base"
              />
            </div>

            {/* Kategori */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Kategori</Label>
              <Select
                value={form.kategori}
                onValueChange={(v) =>
                  setForm({ ...form, kategori: v as Product["kategori"] })
                }
              >
                <SelectTrigger className="h-12 rounded-xl bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* RAM */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">RAM</Label>
              <Input
                value={form.ram}
                onChange={(e) => setForm({ ...form, ram: e.target.value })}
                placeholder="16GB DDR5"
                className="h-12 rounded-xl bg-background text-base"
              />
            </div>

            {/* Storage */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Storage</Label>
              <Input
                value={form.storage}
                onChange={(e) => setForm({ ...form, storage: e.target.value })}
                placeholder="512GB NVMe"
                className="h-12 rounded-xl bg-background text-base"
              />
            </div>

            {/* GPU */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">GPU</Label>
              <Input
                value={form.gpu}
                onChange={(e) => setForm({ ...form, gpu: e.target.value })}
                placeholder="RTX 4060"
                className="h-12 rounded-xl bg-background text-base"
              />
            </div>

            {/* Score sliders */}
            <div className="space-y-4 pt-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                Skor (1–10)
              </p>

              <ScoreInput
                label="Performa"
                value={form.performaScore}
                onChange={(v) => setForm({ ...form, performaScore: v })}
              />
              <ScoreInput
                label="Portabel"
                value={form.portableScore}
                onChange={(v) => setForm({ ...form, portableScore: v })}
              />
              <ScoreInput
                label="Baterai"
                value={form.batteryScore}
                onChange={(v) => setForm({ ...form, batteryScore: v })}
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
              disabled={!form.nama.trim() || uploading}
            >
              {uploading ? "Mengupload..." : editingId ? "Simpan" : "Tambah"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* ── DELETE CONFIRMATION ── */}
      <AlertDialog
        open={!!deletingProduct}
        onOpenChange={() => setDeletingProduct(null)}
      >
        <AlertDialogContent className="bg-card border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Produk?</AlertDialogTitle>
            <AlertDialogDescription>
              Produk &quot;{deletingProduct?.nama}&quot; akan dihapus permanen.
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

/* ── SCORE INPUT ── */
function ScoreInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm">{label}</span>
        <span className="text-sm font-bold text-primary">{value}</span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`flex-1 h-9 rounded-lg text-sm font-medium transition-all duration-200 min-w-[32px] ${
              n <= value
                ? "bg-primary text-primary-foreground"
                : "bg-muted/30 text-muted-foreground hover:bg-muted/60"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
