// ─── Shared helpers for homepage sections ───
import type { LokasiData } from "@/data/homepage-static";

/** Build wa.me link with prefilled message. */
export function buildWaLink(lokasi: LokasiData): string {
  const waNumber = lokasi.whatsapp ? lokasi.whatsapp.replace(/^0/, "62") : "";
  if (!waNumber) return "#";
  const msg = encodeURIComponent(
    `Halo${lokasi.namaToko ? ` ${lokasi.namaToko}` : ""}, saya mau jual laptop bekas. Bisa dibantu prosesnya?`
  );
  return `https://wa.me/${waNumber}?text=${msg}`;
}

/** Resolve logo src with fallback. */
export function resolveLogo(logo: string): string {
  return logo || "/logo.png";
}

import {
  Eye,
  ShieldCheck,
  Clock,
  MessageCircle,
  Phone,
  MapPin,
  ArrowRight,
  Star,
  type LucideIcon,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  Eye,
  ShieldCheck,
  Clock,
  MessageCircle,
  Phone,
  MapPin,
  ArrowRight,
  Star,
};

export function resolveIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Eye;
}
