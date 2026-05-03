"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Banknote,
  ArrowLeftRight,
  CheckCircle2,
  User,
  Phone,
  MapPin,
  FileText,
  Download,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useProducts } from "@/lib/product-store";
import { useTransactions, type Transaction } from "@/lib/transaction-store";
import { useLokasi } from "@/lib/lokasi-store";
import { type Product } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { SkeletonProductRow } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { downloadInvoice } from "@/lib/generate-invoice";

/* ── Types ── */
interface CartItem {
  product: Product;
  quantity: number;
}

/* ── Customer Info Component ── */
function CustomerInfoSection({
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  customerAddress,
  setCustomerAddress,
}: {
  customerName: string;
  setCustomerName: (v: string) => void;
  customerPhone: string;
  setCustomerPhone: (v: string) => void;
  customerAddress: string;
  setCustomerAddress: (v: string) => void;
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Data Pelanggan
      </h2>
      <div className="bg-card border border-border/50 rounded-xl p-4 shadow-soft-sm space-y-3">
        {/* Nama */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <User className="h-3 w-3" />
            Nama Customer
          </label>
          <Input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Nama lengkap pelanggan"
            className="h-11 rounded-xl bg-background text-sm"
          />
        </div>

        {/* No HP */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Phone className="h-3 w-3" />
            Nomor HP
          </label>
          <Input
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="08xxxxxxxxxx"
            type="tel"
            className="h-11 rounded-xl bg-background text-sm"
          />
        </div>

        {/* Alamat */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <MapPin className="h-3 w-3" />
            Alamat
          </label>
          <Input
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
            placeholder="Alamat lengkap pengiriman"
            className="h-11 rounded-xl bg-background text-sm"
          />
        </div>
      </div>
    </div>
  );
}

/* ── Desktop Customer Info (compact) ── */
function CustomerInfoCompact({
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  customerAddress,
  setCustomerAddress,
}: {
  customerName: string;
  setCustomerName: (v: string) => void;
  customerPhone: string;
  setCustomerPhone: (v: string) => void;
  customerAddress: string;
  setCustomerAddress: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        <User className="h-3 w-3" />
        Data Pelanggan (Invoice)
      </label>
      <div className="space-y-2">
        <Input
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Nama customer"
          className="h-9 rounded-lg bg-muted/30 text-sm"
        />
        <Input
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          placeholder="Nomor HP"
          type="tel"
          className="h-9 rounded-lg bg-muted/30 text-sm"
        />
        <Input
          value={customerAddress}
          onChange={(e) => setCustomerAddress(e.target.value)}
          placeholder="Alamat pengiriman"
          className="h-9 rounded-lg bg-muted/30 text-sm"
        />
      </div>
    </div>
  );
}

/* ── Success Popup ── */
function SuccessPopup({
  onClose,
  txId,
  customerName,
  transaction,
  storeInfo,
}: {
  onClose: () => void;
  txId: string;
  customerName: string;
  transaction: Transaction | null;
  storeInfo: { namaToko: string; tagline: string; alamat: string; telepon: string; whatsapp: string };
}) {
  const handlePrint = () => {
    if (!transaction) return;
    downloadInvoice(transaction, storeInfo);
    toast.success("Invoice berhasil diunduh!");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-card border border-border/50 rounded-2xl p-8 max-w-sm w-full text-center shadow-soft-xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", damping: 15 }}
        >
          <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
        </motion.div>
        <h2 className="text-xl font-bold mb-2">Transaksi Berhasil!</h2>
        <p className="text-sm text-muted-foreground mb-1">
          ID: #{txId.slice(-6).toUpperCase()}
        </p>
        {customerName && (
          <p className="text-sm font-medium mb-1">
            {customerName}
          </p>
        )}
        <p className="text-sm text-muted-foreground mb-6">
          Invoice telah dicatat dan barang dihapus dari inventaris.
        </p>

        {/* Cetak Invoice Button */}
        <Button
          onClick={handlePrint}
          variant="outline"
          className="w-full min-h-[48px] rounded-xl text-base font-semibold gap-2 border-primary/30 text-primary hover:bg-primary/10 transition-all duration-300 mb-3"
        >
          <FileText className="h-5 w-5" />
          Cetak Invoice (PDF)
        </Button>

        <Button
          onClick={onClose}
          className="w-full min-h-[48px] rounded-xl text-base font-semibold shadow-soft-sm shadow-primary/15 hover:shadow-soft-md hover:shadow-primary/25 transition-all duration-300"
        >
          OK
        </Button>
      </motion.div>
    </div>
  );
}

/* ── Page ── */
export default function KasirPage() {
  const { products, deleteProduct, isLoaded } = useProducts();
  const { addTransaction, transactions } = useTransactions();
  const { lokasi } = useLokasi();
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "Transfer">("Cash");
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastTxId, setLastTxId] = useState("");
  const [lastCustomerName, setLastCustomerName] = useState("");
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);

  // Customer info
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  /* Filtered products — uses global products */
  const filtered = useMemo(() => {
    if (!search) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.nama.toLowerCase().includes(q) ||
        p.kategori.toLowerCase().includes(q) ||
        p.gpu.toLowerCase().includes(q)
    );
  }, [search, products]);

  /* Cart total */
  const total = cart.reduce((sum, item) => sum + item.product.harga * item.quantity, 0);

  /* Add to cart */
  const addToCart = (product: Product) => {
    const currentProduct = products.find((p) => p.id === product.id);
    if (!currentProduct) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) return prev; // Each product can only be added once
      return [...prev, { product: currentProduct, quantity: 1 }];
    });
    toast.success(`${product.nama} ditambahkan`);
  };

  /* Update quantity — only allow 1 item per product (no stock) */
  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  /* Remove from cart */
  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  /* Checkout — delete sold products + record transaction */
  const handleCheckout = async () => {
    if (cart.length === 0) return;

    if (!customerName.trim()) {
      toast.error("Nama customer wajib diisi");
      return;
    }

    setCheckingOut(true);
    await new Promise((r) => setTimeout(r, 800));

    // Delete all sold products from inventory
    for (const item of cart) {
      deleteProduct(item.product.id);
    }

    const tx = addTransaction({
      items: cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.nama,
        price: item.product.harga,
        quantity: item.quantity,
      })),
      total,
      paymentMethod,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerAddress: customerAddress.trim(),
    });

    const savedCustomerName = customerName.trim();
    setCart([]);
    setCustomerName("");
    setCustomerPhone("");
    setCustomerAddress("");
    setCheckingOut(false);
    setLastTxId(tx.id);
    setLastCustomerName(savedCustomerName);
    setLastTransaction(tx);
    setShowSuccess(true);
    toast.success("Transaksi berhasil dicatat!");
  };

  return (
    <div className="min-h-screen page-animate">
      {/* Success Popup */}
      <AnimatePresence>
        {showSuccess && (
          <SuccessPopup
            txId={lastTxId}
            customerName={lastCustomerName}
            transaction={lastTransaction}
            storeInfo={{
              namaToko: lokasi.namaToko,
              tagline: lokasi.tagline,
              alamat: lokasi.alamat,
              telepon: lokasi.telepon,
              whatsapp: lokasi.whatsapp,
            }}
            onClose={() => setShowSuccess(false)}
          />
        )}
      </AnimatePresence>

      {/* ── MOBILE LAYOUT (vertical stack) ── */}
      <div className="lg:hidden p-4 space-y-5">
        {/* 1. Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-12 bg-card border-border/50 rounded-xl text-base"
          />
        </div>

        {/* 2. Product List */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
            Daftar Produk
          </h2>
          {!isLoaded ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonProductRow key={i} />
              ))}
            </div>
          ) : (
          <div className="space-y-2">
            {filtered.map((product) => {
              const liveProduct = products.find((p) => p.id === product.id);
              const stillAvailable = !!liveProduct;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center justify-between gap-3 bg-card border border-border/50 rounded-xl px-4 py-3 shadow-soft-sm transition-all duration-300 ${
                    !stillAvailable ? "opacity-40" : "hover:border-primary/20 hover:shadow-soft-md hover:-translate-y-0.5"
                  }`}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted/20 overflow-hidden flex items-center justify-center">
                    {product.image ? (
                      <img src={product.image} alt={product.nama} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted/20">
                        <ShoppingCart className="h-4 w-4 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{product.nama}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {product.kategori} · {product.ram}
                    </p>
                    <span className="text-sm font-bold text-primary">
                      {formatPrice(product.harga)}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="flex-shrink-0 min-h-[44px] min-w-[44px] rounded-xl gap-1 shadow-soft-sm shadow-primary/15 hover:shadow-soft-md hover:shadow-primary/25 transition-all duration-300"
                    disabled={!stillAvailable}
                    onClick={() => addToCart(product)}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="text-xs">Tambah</span>
                  </Button>
                </motion.div>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center py-8 text-sm text-muted-foreground">
                Produk tidak ditemukan
              </div>
            )}
          </div>
          )}
        </div>

        {/* 3. Keranjang */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
            Keranjang
          </h2>
          {cart.length === 0 ? (
            <div className="text-center py-8 bg-card border border-border/50 rounded-xl shadow-soft-sm">
              <ShoppingCart className="h-10 w-10 text-muted-foreground/15 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Keranjang kosong</p>
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="bg-card border border-border/50 rounded-xl px-4 py-3 shadow-soft-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-sm truncate flex-1">
                        {item.product.nama}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="flex-shrink-0 text-muted-foreground hover:text-destructive transition-colors p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 rounded-lg"
                          onClick={() => updateQuantity(item.product.id, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-bold w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 rounded-lg"
                          onClick={() => updateQuantity(item.product.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="text-sm font-semibold text-primary">
                        {formatPrice(item.product.harga * item.quantity)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* 4. Customer Info (only when cart has items) */}
        {cart.length > 0 && (
          <CustomerInfoSection
            customerName={customerName}
            setCustomerName={setCustomerName}
            customerPhone={customerPhone}
            setCustomerPhone={setCustomerPhone}
            customerAddress={customerAddress}
            setCustomerAddress={setCustomerAddress}
          />
        )}

        {/* 5. Total */}
        {cart.length > 0 && (
          <div className="bg-card border border-border/50 rounded-xl p-4 shadow-soft-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="text-lg font-bold text-primary">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        )}

        {/* 6. Metode Bayar */}
        {cart.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
              Metode Pembayaran
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod("Cash")}
                className={`flex items-center justify-center gap-2 h-14 rounded-xl border-2 transition-all duration-300 font-medium text-sm min-h-[48px] ${
                  paymentMethod === "Cash"
                    ? "border-primary bg-primary/10 text-primary shadow-soft-sm shadow-primary/10"
                    : "border-border/50 bg-card text-muted-foreground hover:border-primary/30"
                }`}
              >
                <Banknote className="h-5 w-5" />
                Cash
              </button>
              <button
                onClick={() => setPaymentMethod("Transfer")}
                className={`flex items-center justify-center gap-2 h-14 rounded-xl border-2 transition-all duration-300 font-medium text-sm min-h-[48px] ${
                  paymentMethod === "Transfer"
                    ? "border-primary bg-primary/10 text-primary shadow-soft-sm shadow-primary/10"
                    : "border-border/50 bg-card text-muted-foreground hover:border-primary/30"
                }`}
              >
                <ArrowLeftRight className="h-5 w-5" />
                Transfer
              </button>
            </div>
          </div>
        )}

        {/* 7. Tombol Besar - Selesaikan Transaksi */}
        {cart.length > 0 && (
          <Button
            onClick={handleCheckout}
            disabled={checkingOut || !customerName.trim()}
            className="w-full min-h-[56px] rounded-xl text-lg font-bold gap-2 shadow-soft-md shadow-primary/15 hover:shadow-soft-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
          >
            {checkingOut ? (
              "Memproses..."
            ) : (
              <>
                <ShoppingCart className="h-5 w-5" />
                Selesaikan Transaksi
              </>
            )}
          </Button>
        )}
      </div>

      {/* ── DESKTOP LAYOUT (2 columns) ── */}
      <div className="hidden lg:flex lg:gap-6 p-6 lg:p-8 h-screen page-container max-w-6xl">
        {/* LEFT: Products */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Kasir</h1>
              <p className="text-sm text-muted-foreground">Point of Sale</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 bg-card border-border/50 rounded-xl text-base"
            />
          </div>

          {/* Product List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {!isLoaded ? (
              Array.from({ length: 5 }).map((_, i) => (
                <SkeletonProductRow key={i} />
              ))
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-sm text-muted-foreground">
                Produk tidak ditemukan
              </div>
            ) : (
              filtered.map((product) => {
                const liveProduct = products.find((p) => p.id === product.id);
                const stillAvailable = !!liveProduct;

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center justify-between gap-4 bg-card border border-border/50 rounded-xl px-4 py-3 shadow-soft-sm hover:border-primary/20 hover:shadow-soft-md hover:-translate-y-0.5 transition-all duration-300 ${
                      !stillAvailable ? "opacity-40" : ""
                    }`}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-muted/20 overflow-hidden flex items-center justify-center">
                      {product.image ? (
                        <img src={product.image} alt={product.nama} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted/20">
                          <ShoppingCart className="h-5 w-5 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{product.nama}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {product.kategori} · {product.ram} · {product.gpu}
                      </p>
                      <span className="font-bold text-primary">
                        {formatPrice(product.harga)}
                      </span>
                    </div>
                    <Button
                      className="flex-shrink-0 min-h-[44px] rounded-xl gap-1.5 shadow-soft-sm shadow-primary/15 hover:shadow-soft-md hover:shadow-primary/25 transition-all duration-300"
                      disabled={!stillAvailable}
                      onClick={() => addToCart(product)}
                    >
                      <Plus className="h-4 w-4" />
                      Tambah
                    </Button>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT: Cart */}
        <div className="w-[340px] lg:w-[380px] flex-shrink-0 bg-card border border-border/50 rounded-2xl flex flex-col overflow-hidden shadow-soft-md">
          {/* Cart Header */}
          <div className="px-5 py-4 border-b border-border/50">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              <h2 className="font-bold text-lg">Keranjang</h2>
              {cart.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {cart.reduce((s, i) => s + i.quantity, 0)} item
                </Badge>
              )}
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-12 w-12 text-muted-foreground/15 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Keranjang kosong</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Klik &quot;+ Tambah&quot; untuk menambahkan produk
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="bg-muted/20 rounded-xl p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium truncate flex-1">
                        {item.product.nama}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="flex-shrink-0 text-muted-foreground hover:text-destructive transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-lg"
                          onClick={() => updateQuantity(item.product.id, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-bold w-6 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-lg"
                          onClick={() => updateQuantity(item.product.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="text-sm font-semibold text-primary">
                        {formatPrice(item.product.harga * item.quantity)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Cart Footer: Customer + Total + Payment + Checkout */}
          {cart.length > 0 && (
            <div className="border-t border-border/50 p-5 space-y-4">
              {/* Customer Info */}
              <CustomerInfoCompact
                customerName={customerName}
                setCustomerName={setCustomerName}
                customerPhone={customerPhone}
                setCustomerPhone={setCustomerPhone}
                customerAddress={customerAddress}
                setCustomerAddress={setCustomerAddress}
              />

              <Separator />

              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(total)}
                </span>
              </div>

              <Separator />

              {/* Payment Method */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider">
                  Metode Pembayaran
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPaymentMethod("Cash")}
                    className={`flex items-center justify-center gap-2 h-11 rounded-xl border-2 transition-all duration-300 font-medium text-sm ${
                      paymentMethod === "Cash"
                        ? "border-primary bg-primary/10 text-primary shadow-soft-sm shadow-primary/10"
                        : "border-border/50 text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    <Banknote className="h-4 w-4" />
                    Cash
                  </button>
                  <button
                    onClick={() => setPaymentMethod("Transfer")}
                    className={`flex items-center justify-center gap-2 h-11 rounded-xl border-2 transition-all duration-300 font-medium text-sm ${
                      paymentMethod === "Transfer"
                        ? "border-primary bg-primary/10 text-primary shadow-soft-sm shadow-primary/10"
                        : "border-border/50 text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                    Transfer
                  </button>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                disabled={checkingOut || !customerName.trim()}
                className="w-full min-h-[52px] rounded-xl text-base font-bold gap-2 shadow-soft-md shadow-primary/15 hover:shadow-soft-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
              >
                {checkingOut ? (
                  "Memproses..."
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    Selesaikan Transaksi
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
