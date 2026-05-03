"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/format";
import { Laptop, Cpu, MemoryStick, HardDrive, Video } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/products";

interface ProductDetailSheetProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categoryColors: Record<string, string> = {
  Gaming: "bg-red-500/20 text-red-400 border-red-500/30",
  Editing: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Kerja: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Sekolah: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Ultrabook: "bg-sky-500/20 text-sky-400 border-sky-500/30",
};

export function ProductDetailSheet({ product, open, onOpenChange }: ProductDetailSheetProps) {
  if (!product) return null;

  const specs = [
    { icon: MemoryStick, label: "RAM", value: product.ram },
    { icon: HardDrive, label: "Storage", value: product.storage },
    { icon: Video, label: "GPU", value: product.gpu },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg bg-card border-l border-border overflow-y-auto">
        <SheetHeader className="space-y-3 pb-4">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={categoryColors[product.kategori] || ""}
            >
              {product.kategori}
            </Badge>
          </div>
          <SheetTitle className="text-left text-lg leading-tight">
            {product.nama}
          </SheetTitle>
        </SheetHeader>

        {/* Product Image Area */}
        <div className="aspect-[16/10] bg-muted/20 rounded-xl flex items-center justify-center mb-5 overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.nama}
              className="w-full h-full object-cover"
            />
          ) : (
            <Laptop className="h-20 w-20 text-muted-foreground/30" />
          )}
        </div>

        {/* Price */}
        <div className="mb-5">
          <p className="text-2xl font-bold text-primary">{formatPrice(product.harga)}</p>

        </div>

        <Separator className="my-4" />

        {/* Specs */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Spesifikasi</h4>
          {specs.map((spec, i) => (
            <motion.div
              key={spec.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 rounded-xl bg-muted/20 p-3 hover:bg-muted/30 transition-colors duration-200"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
                <spec.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{spec.label}</p>
                <p className="text-sm font-medium">{spec.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-auto pt-6 pb-2">
          <Button
            className="w-full min-h-[52px] text-base font-semibold rounded-xl shadow-soft-sm shadow-primary/15 hover:shadow-soft-md hover:shadow-primary/25 transition-all duration-300"
            size="lg"
          >
            Beli Sekarang
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
