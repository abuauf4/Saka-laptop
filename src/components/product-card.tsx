"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { Laptop } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/products";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

const categoryColors: Record<string, string> = {
  Gaming: "bg-red-500/20 text-red-400 border-red-500/30",
  Editing: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Kerja: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Sekolah: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Ultrabook: "bg-sky-500/20 text-sky-400 border-sky-500/30",
};

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Card
        className="card-interactive overflow-hidden cursor-pointer"
        onClick={onClick}
      >
        <div className="relative aspect-[4/3] bg-muted/20 flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.nama}
              className="w-full h-full object-cover"
            />
          ) : (
            <Laptop className="h-16 w-16 text-muted-foreground/30" />
          )}
          <Badge
            variant="outline"
            className={`absolute top-2.5 left-2.5 text-xs px-1.5 py-0.5 ${categoryColors[product.kategori] || "bg-muted text-muted-foreground"}`}
          >
            {product.kategori}
          </Badge>

        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm mt-0 line-clamp-2 leading-snug">{product.nama}</h3>
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <span>{product.ram}</span>
            <span className="text-border">·</span>
            <span>{product.storage}</span>
          </div>
          <p className="text-primary font-bold text-base mt-2">{formatPrice(product.harga)}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
