"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  StoreIcon,
  Save,
  RotateCcw,
  MapPin,
  Phone,
  Clock,
  Image,
  ExternalLink,
  Globe,
  Building2,
  X,
  ImagePlus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLokasi, type LokasiToko } from "@/lib/lokasi-store";
import { StoreMap } from "@/components/store-map";
import { toast } from "sonner";
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

/* ── Compress image to fit within max dimensions ── */
function compressImage(dataUrl: string, maxW = 800, quality = 0.7): Promise<string> {
  return new Promise((resolve) => {
    const img = document.createElement("img");
    img.onload = () => {
      let w = img.width;
      let h = img.height;
      if (w > maxW) {
        h = Math.round((h * maxW) / w);
        w = maxW;
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(dataUrl); return; }
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export default function AdminProfilPage() {
  const { lokasi, updateLokasi, resetLokasi, isLoaded } = useLokasi();
  const [form, setForm] = useState<LokasiToko>(lokasi);
  const [logoPreview, setLogoPreview] = useState<string>("/logo.png");
  const [resetOpen, setResetOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Sync form when store loads or changes externally
  useEffect(() => {
    if (isLoaded) {
      setForm(lokasi);
    }
  }, [isLoaded, lokasi]);

  // Load logo from database on mount
  useEffect(() => {
    async function fetchLogo() {
      try {
        const res = await fetch("/api/lokasi/logo");
        if (res.ok) {
          const data = await res.json();
          if (data.logoData) {
            setLogoPreview(data.logoData);
          }
        }
      } catch {
        // Ignore
      }
    }
    fetchLogo();
  }, []);

  // Track changes
  useEffect(() => {
    if (isLoaded) {
      const changed = JSON.stringify(form) !== JSON.stringify(lokasi);
      setHasChanges(changed);
    }
  }, [form, lokasi, isLoaded]);

  const handleSave = () => {
    if (!form.namaToko.trim()) {
      toast.error("Nama toko wajib diisi");
      return;
    }
    if (!form.alamat.trim()) {
      toast.error("Alamat wajib diisi");
      return;
    }
    updateLokasi(form);
    setHasChanges(false);
    toast.success("Profil toko berhasil diperbarui");
  };

  const handleReset = () => {
    resetLokasi();
    setResetOpen(false);
    toast.success("Profil toko direset ke default");
  };

  const updateField = <K extends keyof LokasiToko>(key: K, value: LokasiToko[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const [uploading, setUploading] = useState(false);

  /* ── Upload image to Cloudinary ── */
  const uploadImage = async (base64: string, folder: string = "nauka"): Promise<string> => {
    try {
      setUploading(true);
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, folder }),
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

  /* ── Logo upload ── */
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 3MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      try {
        const compressed = await compressImage(dataUrl, 400, 0.8);
        // Show preview immediately
        setLogoPreview(compressed);
        // Upload to Cloudinary
        toast.loading("Mengupload logo...", { id: "logo-upload" });
        const cloudUrl = await uploadImage(compressed, "saka/logo");
        toast.dismiss("logo-upload");
        // Save logo URL to database via StoreLogo
        try {
          const res = await fetch("/api/lokasi/logo", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ logoData: cloudUrl }),
          });
          if (res.ok) {
            setLogoPreview(cloudUrl);
            toast.success("Logo toko berhasil diperbarui");
          } else {
            // Fallback to showing compressed preview
            setLogoPreview(compressed);
            toast.error("Gagal menyimpan logo ke database");
          }
        } catch {
          setLogoPreview(compressed);
          toast.error("Gagal menyimpan logo ke database");
        }
      } catch {
        toast.error("Gagal memproses gambar");
      }
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be selected again
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  const removeLogo = () => {
    setLogoPreview("/logo.png");
    // Clear logo from database
    fetch("/api/lokasi/logo", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logoData: "" }),
    }).catch(() => {});
    toast.success("Logo toko direset ke default");
  };

  if (!isLoaded) {
    return (
      <div className="p-4 sm:p-6 page-container max-w-4xl page-animate space-y-5">
        <div className="h-8 w-48 rounded-lg bg-muted/20 animate-pulse" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-muted/20 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 page-container max-w-4xl page-animate">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between gap-3"
      >
        <div>
          <h1 className="text-xl lg:text-2xl font-bold flex items-center gap-2">
            <StoreIcon className="h-6 w-6 text-primary" />
            Profil Toko
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Edit informasi toko yang tampil di halaman pelanggan
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 min-h-[40px] rounded-xl text-sm"
            onClick={() => setResetOpen(true)}
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
          <Button
            size="sm"
            className="gap-2 min-h-[40px] rounded-xl text-sm font-semibold shadow-soft-sm shadow-primary/15 hover:shadow-soft-md hover:shadow-primary/25 transition-all duration-300"
            onClick={handleSave}
            disabled={!hasChanges}
          >
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">Simpan</span>
          </Button>
        </div>
      </motion.div>

      {/* Preview Card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <Card className="border-border/50 overflow-hidden">
          <div className="relative h-40 bg-muted/15 overflow-hidden">
            {form.foto ? (
              <img
                src={form.foto}
                alt="Preview Toko"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Image className="h-10 w-10 text-muted-foreground/20" />
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent" />
            <div className="absolute bottom-3 left-4 right-4">
              <div className="flex items-center gap-2">
                <img src={logoPreview} alt={form.namaToko} className="h-8 w-8 rounded-xl object-cover shadow-lg" />
                <div>
                  <p className="text-sm font-bold text-white drop-shadow-lg">{form.namaToko}</p>
                  <p className="text-xs text-white/80 drop-shadow">{form.tagline}</p>
                </div>
              </div>
            </div>
          </div>
          <CardContent className="p-4 space-y-2.5">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm leading-relaxed">{form.alamat}</p>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-emerald-500 flex-shrink-0" />
              <p className="text-sm">{form.telepon}</p>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm">{form.jamWeekday}</p>
                <p className="text-sm text-muted-foreground">{form.jamWeekend}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── FORM ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="space-y-5"
      >
        {/* Section: Identitas Toko */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Building2 className="h-4 w-4" />
            Identitas Toko
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nama Toko */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Nama Toko</Label>
              <Input
                value={form.namaToko}
                onChange={(e) => updateField("namaToko", e.target.value)}
                placeholder="Nama toko"
                className="h-12 rounded-xl bg-card border-border/50 text-base"
              />
            </div>

            {/* Tagline */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tagline</Label>
              <Input
                value={form.tagline}
                onChange={(e) => updateField("tagline", e.target.value)}
                placeholder="Tagline toko"
                className="h-12 rounded-xl bg-card border-border/50 text-base"
              />
            </div>
          </div>
        </div>

        <Separator className="bg-border/30" />

        {/* Section: Logo Toko */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Image className="h-4 w-4" />
            Logo Toko
          </div>

          <div className="flex gap-4 items-start">
            {/* Logo Preview */}
            <div className="relative w-28 h-28 rounded-2xl bg-muted/15 overflow-hidden flex-shrink-0 flex items-center justify-center border-2 border-dashed border-border/50">
              <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
              {logoPreview !== "/logo.png" && (
                <button
                  type="button"
                  onClick={removeLogo}
                  className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-sm hover:bg-destructive/90 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <p className="text-sm text-muted-foreground">
                Upload logo baru untuk mengganti logo default. Logo akan tampil di header, sidebar, dan halaman toko.
              </p>
              <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 text-primary text-sm font-medium cursor-pointer hover:bg-primary/20 transition-colors min-h-[44px]">
                <ImagePlus className="h-4 w-4" />
                Upload Logo
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
              </label>
              <p className="text-xs text-muted-foreground">
                Format: JPG, PNG, WebP · Maks 3MB · Disarankan gambar persegi (1:1)
              </p>
            </div>
          </div>
        </div>

        <Separator className="bg-border/30" />

        {/* Section: Foto Toko */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Image className="h-4 w-4" />
            Foto Toko
          </div>

          <div className="flex gap-4 items-start">
            {/* Preview */}
            <div className="relative w-28 h-28 rounded-2xl bg-muted/15 overflow-hidden flex-shrink-0 flex items-center justify-center border-2 border-dashed border-border/50">
              {form.foto ? (
                <>
                  <img src={form.foto} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => updateField("foto", "")}
                    className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-sm hover:bg-destructive/90 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </>
              ) : (
                <Image className="h-8 w-8 text-muted-foreground/25" />
              )}
            </div>

            <div className="flex-1 space-y-2">
              <Label className="text-sm font-medium">URL Foto Toko</Label>
              <Input
                value={form.foto}
                onChange={(e) => updateField("foto", e.target.value)}
                placeholder="URL foto atau path (contoh: /store-front.png)"
                className="h-12 rounded-xl bg-card border-border/50 text-base"
              />
              <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 text-primary text-sm font-medium cursor-pointer hover:bg-primary/20 transition-colors min-h-[44px]">
                <ImagePlus className="h-4 w-4" />
                Upload File
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > 2 * 1024 * 1024) {
                      toast.error("Ukuran file maksimal 2MB");
                      return;
                    }
                    const reader = new FileReader();
                    reader.onload = async (ev) => {
                      const dataUrl = ev.target?.result as string;
                      // Show preview immediately
                      updateField("foto", dataUrl);
                      // Upload to Cloudinary
                      toast.loading("Mengupload foto...", { id: "foto-upload" });
                      const cloudUrl = await uploadImage(dataUrl, "saka/store");
                      toast.dismiss("foto-upload");
                      updateField("foto", cloudUrl);
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
              <p className="text-xs text-muted-foreground">
                Masukkan URL foto, path relatif (misal /store-front.png), atau upload file (maks 2MB)
              </p>
            </div>
          </div>
        </div>

        <Separator className="bg-border/30" />

        {/* Section: Alamat & Kontak */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <MapPin className="h-4 w-4" />
            Alamat & Kontak
          </div>

          {/* Alamat */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Alamat Lengkap</Label>
            <Textarea
              value={form.alamat}
              onChange={(e) => updateField("alamat", e.target.value)}
              placeholder="Jl. Raya Kebayoran Lama No. 12, Jakarta Selatan 12210"
              className="min-h-[80px] rounded-xl bg-card border-border/50 text-base resize-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Telepon */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Nomor Telepon (Tampilan)</Label>
              <Input
                value={form.telepon}
                onChange={(e) => updateField("telepon", e.target.value)}
                placeholder="+62 896-6252-4542"
                className="h-12 rounded-xl bg-card border-border/50 text-base"
              />
              <p className="text-xs text-muted-foreground">Format tampilan untuk pelanggan</p>
            </div>

            {/* WhatsApp */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Nomor WhatsApp (tanpa +)</Label>
              <Input
                value={form.whatsapp}
                onChange={(e) => updateField("whatsapp", e.target.value)}
                placeholder="6289662524542"
                className="h-12 rounded-xl bg-card border-border/50 text-base"
              />
              <p className="text-xs text-muted-foreground">Digunakan untuk link wa.me</p>
            </div>
          </div>
        </div>

        <Separator className="bg-border/30" />

        {/* Section: Jam Operasional */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Clock className="h-4 w-4" />
            Jam Operasional
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Jam Weekday */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Senin - Sabtu</Label>
              <Input
                value={form.jamWeekday}
                onChange={(e) => updateField("jamWeekday", e.target.value)}
                placeholder="Senin - Sabtu: 09.00 - 21.00 WIB"
                className="h-12 rounded-xl bg-card border-border/50 text-base"
              />
            </div>

            {/* Jam Weekend */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Minggu</Label>
              <Input
                value={form.jamWeekend}
                onChange={(e) => updateField("jamWeekend", e.target.value)}
                placeholder="Minggu: 10.00 - 18.00 WIB"
                className="h-12 rounded-xl bg-card border-border/50 text-base"
              />
            </div>
          </div>
        </div>

        <Separator className="bg-border/30" />

        {/* Section: Lokasi Peta */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Globe className="h-4 w-4" />
            Lokasi Peta
          </div>

          {/* Lat & Lng */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Latitude</Label>
              <Input
                type="number"
                step="any"
                value={form.lat}
                onChange={(e) => updateField("lat", parseFloat(e.target.value) || 0)}
                placeholder="-6.2445"
                className="h-12 rounded-xl bg-card border-border/50 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Longitude</Label>
              <Input
                type="number"
                step="any"
                value={form.lng}
                onChange={(e) => updateField("lng", parseFloat(e.target.value) || 0)}
                placeholder="106.7813"
                className="h-12 rounded-xl bg-card border-border/50 text-base"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Cari koordinat di Google Maps: klik kanan lokasi → copy latitude & longitude
          </p>

          {/* Maps Link */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Link Google Maps (Buka Maps)</Label>
            <Input
              value={form.mapsLink}
              onChange={(e) => updateField("mapsLink", e.target.value)}
              placeholder="https://maps.google.com/?q=..."
              className="h-12 rounded-xl bg-card border-border/50 text-base"
            />
            <p className="text-xs text-muted-foreground">
              Link untuk tombol &quot;Buka Maps&quot; di halaman utama
            </p>
          </div>

          {/* Maps Preview */}
          {form.lat !== 0 && form.lng !== 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Preview Peta</Label>
              <div className="relative overflow-hidden rounded-2xl border border-border/50 h-[200px] sm:h-[250px]">
                <StoreMapPreview lat={form.lat} lng={form.lng} namaToko={form.namaToko} alamat={form.alamat} />
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Bottom Save Bar */}
      {hasChanges && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="sticky bottom-4 z-30"
        >
          <Card className="border-primary/30 bg-card/95 backdrop-blur-xl shadow-soft-lg">
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Ada perubahan yang belum disimpan
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="min-h-[40px] rounded-xl text-sm"
                  onClick={() => {
                    setForm(lokasi);
                    setHasChanges(false);
                  }}
                >
                  Batal
                </Button>
                <Button
                  size="sm"
                  className="gap-2 min-h-[40px] rounded-xl text-sm font-semibold shadow-soft-sm shadow-primary/15"
                  onClick={handleSave}
                >
                  <Save className="h-4 w-4" />
                  Simpan Perubahan
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ── RESET CONFIRMATION ── */}
      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent className="bg-card border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Profil Toko?</AlertDialogTitle>
            <AlertDialogDescription>
              Semua data profil toko akan dikembalikan ke pengaturan default.
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="min-h-[44px] rounded-xl">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              className="min-h-[44px] rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleReset}
            >
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ── Map Preview for Admin Form ── */
function StoreMapPreview({ lat, lng, namaToko, alamat }: { lat: number; lng: number; namaToko: string; alamat: string }) {
  return (
    <StoreMap
      lat={lat}
      lng={lng}
      namaToko={namaToko}
      alamat={alamat}
      className="h-[200px] sm:h-[250px]"
    />
  );
}
