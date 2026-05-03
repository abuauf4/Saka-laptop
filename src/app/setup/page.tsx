"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  User,
  Package,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
  AlertCircle,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeSwitcher } from "@/components/theme-switcher";

/* ── Types ── */
interface StoreData {
  namaToko: string;
  tagline: string;
  alamat: string;
  telepon: string;
  whatsapp: string;
  jamWeekday: string;
  jamWeekend: string;
  lat: string;
  lng: string;
  mapsLink: string;
}

interface AdminData {
  username: string;
  password: string;
  confirmPassword: string;
}

interface ProductData {
  nama: string;
  harga: string;
  kategori: string;
  ram: string;
  storage: string;
  gpu: string;
  performaScore: string;
  portableScore: string;
  batteryScore: string;
}

const KATEGORI_OPTIONS = ["Gaming", "Editing", "Kerja", "Sekolah", "Ultrabook"];

const emptyProduct: ProductData = {
  nama: "",
  harga: "",
  kategori: "Gaming",
  ram: "",
  storage: "",
  gpu: "",
  performaScore: "5",
  portableScore: "5",
  batteryScore: "5",
};

const STEPS = [
  { id: 1, label: "Info Toko", icon: Store },
  { id: 2, label: "Akun Admin", icon: User },
  { id: 3, label: "Produk", icon: Package },
  { id: 4, label: "Selesai", icon: Rocket },
];

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [alreadySetup, setAlreadySetup] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [successResults, setSuccessResults] = useState<string[]>([]);

  const [store, setStore] = useState<StoreData>({
    namaToko: "",
    tagline: "Toko Laptop Terpercaya",
    alamat: "",
    telepon: "",
    whatsapp: "",
    jamWeekday: "Senin - Sabtu: 09.00 - 21.00 WIB",
    jamWeekend: "Minggu: 10.00 - 18.00 WIB",
    lat: "-6.2",
    lng: "106.8",
    mapsLink: "",
  });

  const [admin, setAdmin] = useState<AdminData>({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [products, setProducts] = useState<ProductData[]>([]);

  /* ── Check if setup needed ── */
  useEffect(() => {
    async function checkSetup() {
      try {
        const res = await fetch("/api/setup");
        const data = await res.json();
        if (!data.needsSetup) {
          setAlreadySetup(true);
        }
      } catch {
        // If error, allow setup attempt
      } finally {
        setChecking(false);
      }
    }
    checkSetup();
  }, []);

  /* ── Handle submit ── */
  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          store: {
            ...store,
            lat: parseFloat(store.lat) || -6.2,
            lng: parseFloat(store.lng) || 106.8,
          },
          admin: {
            username: admin.username,
            password: admin.password,
          },
          products: products.filter((p) => p.nama.trim() !== ""),
          testimoni: [],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Setup gagal");
        return;
      }

      setSuccess(true);
      setSuccessResults(data.results || []);
    } catch {
      setError("Terjadi kesalahan jaringan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Validation ── */
  const canGoNext = () => {
    if (step === 1) return store.namaToko.trim() !== "";
    if (step === 2) return admin.username.trim() !== "" && admin.password.length >= 4 && admin.password === admin.confirmPassword;
    return true;
  };

  /* ── Checking state ── */
  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* ── Already setup ── */
  if (alreadySetup) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="h-16 w-16 rounded-2xl bg-green-500/15 flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="text-xl font-bold mb-2">Sudah Di-setup</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Toko ini sudah pernah di-setup. Gunakan admin panel untuk mengubah data.
          </p>
          <Button onClick={() => router.push("/admin/login")} className="w-full rounded-2xl">
            Ke Admin Login
          </Button>
        </div>
      </div>
    );
  }

  /* ── Success state ── */
  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="h-20 w-20 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-6"
          >
            <Check className="h-10 w-10 text-green-500" />
          </motion.div>
          <h1 className="text-2xl font-extrabold mb-2">Setup Berhasil!</h1>
          <p className="text-sm text-muted-foreground mb-4">Toko kamu sudah siap digunakan.</p>

          <div className="bg-card rounded-2xl border border-border/50 p-4 mb-6 text-left space-y-2">
            {successResults.map((r, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>{r}</span>
              </div>
            ))}
          </div>

          <Button
            onClick={() => router.push("/admin/login")}
            className="w-full min-h-[52px] text-base font-semibold rounded-2xl"
          >
            Login ke Admin Panel
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="px-4 flex h-14 items-center justify-between">
          <span className="font-bold text-lg">Setup Toko</span>
          <ThemeSwitcher />
        </div>
      </header>

      {/* Progress */}
      <div className="px-4 pt-6 pb-2">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = step === s.id;
            const isDone = step > s.id;
            return (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-soft-md shadow-primary/20"
                        : isDone
                        ? "bg-green-500/15 text-green-500"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isDone ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <span className={`text-[10px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-8 h-0.5 mx-1 mb-4 ${step > s.id ? "bg-green-500" : "bg-muted"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="max-w-md mx-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Store Info */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <h2 className="text-lg font-bold mb-1">Info Toko</h2>
                  <p className="text-xs text-muted-foreground">Masukkan informasi dasar toko laptop</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Nama Toko *</label>
                    <Input
                      placeholder="contoh: Jaya Laptop"
                      value={store.namaToko}
                      onChange={(e) => setStore({ ...store, namaToko: e.target.value })}
                      className="h-12 rounded-xl bg-card"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Tagline</label>
                    <Input
                      placeholder="contoh: Toko Laptop Terpercaya"
                      value={store.tagline}
                      onChange={(e) => setStore({ ...store, tagline: e.target.value })}
                      className="h-12 rounded-xl bg-card"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Alamat</label>
                    <Input
                      placeholder="contoh: Jl. Raya Mangga Dua No. 45"
                      value={store.alamat}
                      onChange={(e) => setStore({ ...store, alamat: e.target.value })}
                      className="h-12 rounded-xl bg-card"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">No. WhatsApp</label>
                      <Input
                        placeholder="6281234567890"
                        value={store.whatsapp}
                        onChange={(e) => setStore({ ...store, whatsapp: e.target.value })}
                        className="h-12 rounded-xl bg-card"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">No. Telepon</label>
                      <Input
                        placeholder="+62 812-3456-7890"
                        value={store.telepon}
                        onChange={(e) => setStore({ ...store, telepon: e.target.value })}
                        className="h-12 rounded-xl bg-card"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Jam Weekday</label>
                    <Input
                      placeholder="Senin - Sabtu: 09.00 - 21.00 WIB"
                      value={store.jamWeekday}
                      onChange={(e) => setStore({ ...store, jamWeekday: e.target.value })}
                      className="h-12 rounded-xl bg-card"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Jam Weekend</label>
                    <Input
                      placeholder="Minggu: 10.00 - 18.00 WIB"
                      value={store.jamWeekend}
                      onChange={(e) => setStore({ ...store, jamWeekend: e.target.value })}
                      className="h-12 rounded-xl bg-card"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Google Maps Link</label>
                    <Input
                      placeholder="https://maps.google.com/?q=..."
                      value={store.mapsLink}
                      onChange={(e) => setStore({ ...store, mapsLink: e.target.value })}
                      className="h-12 rounded-xl bg-card"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Admin Account */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <h2 className="text-lg font-bold mb-1">Akun Admin</h2>
                  <p className="text-xs text-muted-foreground">Buat akun untuk mengakses admin panel</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Username *</label>
                    <Input
                      placeholder="contoh: Admin"
                      value={admin.username}
                      onChange={(e) => setAdmin({ ...admin, username: e.target.value })}
                      className="h-12 rounded-xl bg-card"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Password *</label>
                    <Input
                      type="password"
                      placeholder="Minimal 4 karakter"
                      value={admin.password}
                      onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
                      className="h-12 rounded-xl bg-card"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Konfirmasi Password *</label>
                    <Input
                      type="password"
                      placeholder="Ulangi password"
                      value={admin.confirmPassword}
                      onChange={(e) => setAdmin({ ...admin, confirmPassword: e.target.value })}
                      className="h-12 rounded-xl bg-card"
                    />
                    {admin.confirmPassword && admin.password !== admin.confirmPassword && (
                      <p className="text-xs text-red-400 mt-1">Password tidak cocok</p>
                    )}
                  </div>
                </div>

                <div className="bg-card rounded-2xl border border-border/50 p-4 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Info Penting:</p>
                  <p className="text-xs text-muted-foreground">
                    Akun ini adalah <span className="font-semibold text-foreground">Developer</span> — memiliki akses penuh ke semua fitur admin.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Nanti kamu bisa tambah akun <span className="font-semibold text-foreground">Admin</span> biasa dengan akses terbatas dari halaman Users.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 3: Products */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <h2 className="text-lg font-bold mb-1">Produk Laptop</h2>
                  <p className="text-xs text-muted-foreground">
                    Tambahkan produk laptop (opsional, bisa ditambah nanti via admin)
                  </p>
                </div>

                <div className="space-y-3">
                  {products.map((p, idx) => (
                    <div
                      key={idx}
                      className="bg-card rounded-2xl border border-border/50 p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Produk {idx + 1}</span>
                        <button
                          onClick={() => setProducts(products.filter((_, i) => i !== idx))}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          Hapus
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="col-span-2">
                          <Input
                            placeholder="Nama laptop *"
                            value={p.nama}
                            onChange={(e) => {
                              const newProducts = [...products];
                              newProducts[idx] = { ...p, nama: e.target.value };
                              setProducts(newProducts);
                            }}
                            className="h-10 rounded-xl text-sm"
                          />
                        </div>
                        <div>
                          <Input
                            placeholder="Harga (angka) *"
                            type="number"
                            value={p.harga}
                            onChange={(e) => {
                              const newProducts = [...products];
                              newProducts[idx] = { ...p, harga: e.target.value };
                              setProducts(newProducts);
                            }}
                            className="h-10 rounded-xl text-sm"
                          />
                        </div>
                        <div>
                          <select
                            value={p.kategori}
                            onChange={(e) => {
                              const newProducts = [...products];
                              newProducts[idx] = { ...p, kategori: e.target.value };
                              setProducts(newProducts);
                            }}
                            className="w-full h-10 rounded-xl bg-card border border-border/50 text-sm px-3"
                          >
                            {KATEGORI_OPTIONS.map((k) => (
                              <option key={k} value={k}>{k}</option>
                            ))}
                          </select>
                        </div>
                        <Input
                          placeholder="RAM"
                          value={p.ram}
                          onChange={(e) => {
                            const newProducts = [...products];
                            newProducts[idx] = { ...p, ram: e.target.value };
                            setProducts(newProducts);
                          }}
                          className="h-10 rounded-xl text-sm"
                        />
                        <Input
                          placeholder="Storage"
                          value={p.storage}
                          onChange={(e) => {
                            const newProducts = [...products];
                            newProducts[idx] = { ...p, storage: e.target.value };
                            setProducts(newProducts);
                          }}
                          className="h-10 rounded-xl text-sm"
                        />
                        <div className="col-span-2">
                          <Input
                            placeholder="GPU / VGA"
                            value={p.gpu}
                            onChange={(e) => {
                              const newProducts = [...products];
                              newProducts[idx] = { ...p, gpu: e.target.value };
                              setProducts(newProducts);
                            }}
                            className="h-10 rounded-xl text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    onClick={() => setProducts([...products, { ...emptyProduct }])}
                    className="w-full rounded-2xl border-dashed min-h-[48px]"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Tambah Produk
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Review & Submit */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <h2 className="text-lg font-bold mb-1">Konfirmasi Setup</h2>
                  <p className="text-xs text-muted-foreground">Cek kembali data sebelum menyimpan</p>
                </div>

                {/* Store Review */}
                <div className="bg-card rounded-2xl border border-border/50 p-4 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Store className="h-4 w-4 text-primary" />
                    <span className="text-sm font-bold">Info Toko</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <span className="text-muted-foreground">Nama</span>
                    <span className="font-medium">{store.namaToko}</span>
                    <span className="text-muted-foreground">Tagline</span>
                    <span>{store.tagline}</span>
                    <span className="text-muted-foreground">Alamat</span>
                    <span>{store.alamat || "-"}</span>
                    <span className="text-muted-foreground">WhatsApp</span>
                    <span>{store.whatsapp || "-"}</span>
                    <span className="text-muted-foreground">Jam Weekday</span>
                    <span>{store.jamWeekday || "-"}</span>
                  </div>
                </div>

                {/* Admin Review */}
                <div className="bg-card rounded-2xl border border-border/50 p-4 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-primary" />
                    <span className="text-sm font-bold">Akun Admin</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <span className="text-muted-foreground">Username</span>
                    <span className="font-medium">{admin.username}</span>
                    <span className="text-muted-foreground">Role</span>
                    <span className="font-medium text-green-400">Developer (Full Access)</span>
                  </div>
                </div>

                {/* Products Review */}
                <div className="bg-card rounded-2xl border border-border/50 p-4 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-4 w-4 text-primary" />
                    <span className="text-sm font-bold">Produk ({products.filter(p => p.nama.trim()).length})</span>
                  </div>
                  {products.filter(p => p.nama.trim()).length === 0 ? (
                    <p className="text-xs text-muted-foreground">Belum ada produk. Bisa ditambah nanti via admin panel.</p>
                  ) : (
                    <div className="space-y-1">
                      {products.filter(p => p.nama.trim()).map((p, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <span>{p.nama}</span>
                          <span className="text-muted-foreground">{p.kategori}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400"
                  >
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="border-t border-border/50 bg-background/80 backdrop-blur-xl px-4 py-4">
        <div className="max-w-md mx-auto flex items-center gap-3">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="rounded-2xl min-h-[48px] flex-1 gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Kembali
            </Button>
          )}

          {step < 4 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canGoNext()}
              className="rounded-2xl min-h-[48px] flex-1 gap-1"
            >
              Lanjut
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-2xl min-h-[48px] flex-1 gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Rocket className="h-4 w-4" />
              )}
              {loading ? "Menyimpan..." : "Setup Sekarang!"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
