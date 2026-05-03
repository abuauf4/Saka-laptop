"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  BookOpen,
  ImagePlus,
  X,
  Eye,
  EyeOff,
  Globe,
  FileText,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { toast } from "sonner";

/* ── TYPES ── */
interface Article {
  id: string;
  slug: string;
  judul: string;
  konten: string;
  excerpt: string;
  gambar: string;
  kategori: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

/* ── CONSTANTS ── */
const categories = ["Tips & Review", "Berita", "Rekomendasi"] as const;

const categoryColors: Record<string, string> = {
  "Tips & Review": "bg-sky-500/15 text-sky-400 border-sky-500/30",
  Berita: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Rekomendasi: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

const emptyForm = {
  judul: "",
  slug: "",
  konten: "",
  excerpt: "",
  gambar: "",
  kategori: "Tips & Review" as string,
  published: false,
};

type FormData = typeof emptyForm;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ── PAGE ── */
export default function AdminArtikelPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [deletingArticle, setDeletingArticle] = useState<Article | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch articles
  const fetchArticles = useCallback(async () => {
    try {
      const res = await fetch("/api/articles");
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      }
    } catch (err) {
      console.error("Failed to fetch articles:", err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Filter
  const filtered = articles.filter(
    (a) =>
      !search ||
      a.judul.toLowerCase().includes(search.toLowerCase()) ||
      a.kategori.toLowerCase().includes(search.toLowerCase())
  );

  // ADD
  const handleAdd = () => {
    setEditingSlug(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  // EDIT
  const handleEdit = (article: Article) => {
    setEditingSlug(article.slug);
    setForm({
      judul: article.judul,
      slug: article.slug,
      konten: article.konten,
      excerpt: article.excerpt,
      gambar: article.gambar,
      kategori: article.kategori,
      published: article.published,
    });
    setFormOpen(true);
  };

  // Upload image
  const uploadImage = async (base64: string): Promise<string> => {
    try {
      setUploading(true);
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, folder: "saka/articles" }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.url;
      }
      return base64;
    } catch {
      return base64;
    } finally {
      setUploading(false);
    }
  };

  // SAVE (add or edit)
  const handleSave = async () => {
    if (!form.judul.trim()) {
      toast.error("Judul artikel wajib diisi");
      return;
    }

    const finalSlug = form.slug || slugify(form.judul);

    // Upload image if base64
    let imageUrl = form.gambar;
    if (imageUrl && imageUrl.startsWith("data:")) {
      toast.loading("Mengupload gambar...", { id: "upload" });
      imageUrl = await uploadImage(imageUrl);
      toast.dismiss("upload");
    }

    setSaving(true);

    try {
      const payload = {
        ...form,
        slug: finalSlug,
        gambar: imageUrl,
      };

      if (editingSlug) {
        const res = await fetch(`/api/articles/${editingSlug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Gagal memperbarui artikel");
        }
        toast.success("Artikel berhasil diperbarui");
      } else {
        const res = await fetch("/api/articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Gagal membuat artikel");
        }
        toast.success("Artikel berhasil ditambahkan");
      }

      setFormOpen(false);
      fetchArticles();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  // DELETE
  const handleDelete = async () => {
    if (!deletingArticle) return;
    try {
      const res = await fetch(`/api/articles/${deletingArticle.slug}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus artikel");
      toast.success("Artikel berhasil dihapus");
      fetchArticles();
    } catch {
      toast.error("Gagal menghapus artikel");
    }
    setDeletingArticle(null);
  };

  // TOGGLE PUBLISH
  const handleTogglePublish = async (article: Article) => {
    try {
      const res = await fetch(`/api/articles/${article.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !article.published }),
      });
      if (!res.ok) throw new Error("Gagal mengubah status");
      toast.success(
        article.published ? "Artikel disembunyikan" : "Artikel dipublikasikan"
      );
      fetchArticles();
    } catch {
      toast.error("Gagal mengubah status publish");
    }
  };

  const publishedCount = articles.filter((a) => a.published).length;
  const draftCount = articles.filter((a) => !a.published).length;

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
          <h1 className="text-xl lg:text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Artikel
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {articles.length} artikel ({publishedCount} publik, {draftCount} draft)
          </p>
        </div>
        <Button
          className="gap-2 min-h-[44px] rounded-xl text-sm font-semibold shadow-soft-sm shadow-primary/15 hover:shadow-soft-md hover:shadow-primary/25 transition-all duration-300"
          onClick={handleAdd}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Tambah Artikel</span>
          <span className="sm:hidden">Tambah</span>
        </Button>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari judul atau kategori..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-12 bg-card border-border/50 rounded-xl text-base"
        />
      </div>

      {/* Article List */}
      {!isLoaded ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-xl bg-muted/20 animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-muted-foreground">Belum ada artikel</p>
          <Button
            variant="link"
            className="mt-2 text-primary"
            onClick={handleAdd}
          >
            Buat artikel pertama
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <AnimatePresence>
            {filtered.map((article) => (
              <motion.div
                key={article.id}
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
                        {article.gambar ? (
                          <img
                            src={article.gambar}
                            alt={article.judul}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <BookOpen className="h-7 w-7 text-muted-foreground/30" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-sm truncate">
                            {article.judul}
                          </h3>
                          <Badge
                            variant="outline"
                            className={`text-xs px-1.5 py-0.5 flex-shrink-0 ${
                              categoryColors[article.kategori] || ""
                            }`}
                          >
                            {article.kategori}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs px-1.5 py-0.5 flex-shrink-0 ${
                              article.published
                                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                : "bg-muted/50 text-muted-foreground border-muted/50"
                            }`}
                          >
                            {article.published ? (
                              <Globe className="h-3 w-3 mr-0.5" />
                            ) : (
                              <EyeOff className="h-3 w-3 mr-0.5" />
                            )}
                            {article.published ? "Publik" : "Draft"}
                          </Badge>
                        </div>

                        {article.excerpt && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            {article.excerpt}
                          </p>
                        )}

                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(article.createdAt)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-lg hover:bg-muted/60"
                          onClick={() => handleTogglePublish(article)}
                          title={article.published ? "Sembunyikan" : "Publikasikan"}
                        >
                          {article.published ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-lg hover:bg-muted/60"
                          onClick={() => handleEdit(article)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setDeletingArticle(article)}
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
              {editingSlug ? "Edit Artikel" : "Tambah Artikel"}
            </SheetTitle>
          </SheetHeader>

          {/* Form */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
            {/* Image */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Gambar Cover</Label>
              <div className="flex gap-3 items-start">
                <div className="relative w-28 h-28 rounded-xl bg-muted/20 overflow-hidden flex-shrink-0 flex items-center justify-center border-2 border-dashed border-border/50">
                  {form.gambar ? (
                    <>
                      <img
                        src={form.gambar}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, gambar: "" })}
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
                    value={form.gambar}
                    onChange={(e) =>
                      setForm({ ...form, gambar: e.target.value })
                    }
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
                        const img = new window.Image();
                        img.onload = () => {
                          const canvas = document.createElement("canvas");
                          const maxW = 800;
                          const ratio = maxW / img.width;
                          canvas.width =
                            img.width > maxW ? maxW : img.width;
                          canvas.height =
                            img.width > maxW
                              ? Math.round(img.height * ratio)
                              : img.height;
                          const ctx = canvas.getContext("2d");
                          if (ctx) {
                            ctx.drawImage(
                              img,
                              0,
                              0,
                              canvas.width,
                              canvas.height
                            );
                            const compressed = canvas.toDataURL(
                              "image/jpeg",
                              0.7
                            );
                            setForm((prev) => ({
                              ...prev,
                              gambar: compressed,
                            }));
                          } else {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              setForm((prev) => ({
                                ...prev,
                                gambar: ev.target?.result as string,
                              }));
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
            </div>

            {/* Judul */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Judul</Label>
              <Input
                value={form.judul}
                onChange={(e) => {
                  const judul = e.target.value;
                  setForm({
                    ...form,
                    judul,
                    slug: editingSlug ? form.slug : slugify(judul),
                  });
                }}
                placeholder="Judul artikel"
                className="h-12 rounded-xl bg-background text-base"
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Slug URL{" "}
                <span className="text-muted-foreground font-normal">
                  (otomatis dari judul)
                </span>
              </Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="judul-artikel"
                className="h-10 rounded-xl bg-background text-sm"
              />
              {form.slug && (
                <p className="text-xs text-muted-foreground">
                  URL: /blog/{form.slug}
                </p>
              )}
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Ringkasan / Excerpt</Label>
              <Textarea
                value={form.excerpt}
                onChange={(e) =>
                  setForm({ ...form, excerpt: e.target.value })
                }
                placeholder="Ringkasan singkat artikel (muncul di listing)"
                className="rounded-xl bg-background text-sm min-h-[80px]"
                rows={3}
              />
            </div>

            {/* Kategori */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Kategori</Label>
              <Select
                value={form.kategori}
                onValueChange={(v) =>
                  setForm({ ...form, kategori: v })
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

            {/* Konten (Markdown) */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Konten{" "}
                <span className="text-muted-foreground font-normal">
                  (Markdown)
                </span>
              </Label>
              <Textarea
                value={form.konten}
                onChange={(e) =>
                  setForm({ ...form, konten: e.target.value })
                }
                placeholder={"# Judul\n\nTulis konten artikel di sini...\n\n## Sub Judul\n\nParagraf berikutnya..."}
                className="rounded-xl bg-background text-sm min-h-[300px] font-mono"
                rows={15}
              />
            </div>

            {/* Publish toggle */}
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
              <div>
                <p className="text-sm font-medium">Publikasikan</p>
                <p className="text-xs text-muted-foreground">
                  {form.published
                    ? "Artikel akan terlihat oleh publik"
                    : "Artikel disimpan sebagai draft"}
                </p>
              </div>
              <Switch
                checked={form.published}
                onCheckedChange={(v) =>
                  setForm({ ...form, published: v })
                }
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
              disabled={!form.judul.trim() || uploading || saving}
            >
              {saving
                ? "Menyimpan..."
                : uploading
                  ? "Mengupload..."
                  : editingSlug
                    ? "Simpan"
                    : "Tambah"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* ── DELETE CONFIRMATION ── */}
      <AlertDialog
        open={!!deletingArticle}
        onOpenChange={() => setDeletingArticle(null)}
      >
        <AlertDialogContent className="bg-card border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Artikel?</AlertDialogTitle>
            <AlertDialogDescription>
              Artikel &quot;{deletingArticle?.judul}&quot; akan dihapus permanen.
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
