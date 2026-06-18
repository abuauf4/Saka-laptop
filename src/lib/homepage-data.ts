// ─── Jakarta Laptops — Server-side Homepage Data Fetcher ───
// Fetch semua homepage content di server saat request.
// Dipakai oleh page.tsx (server component) untuk pass props ke client.
//
// Strategy: call /api/homepage internally (server-to-server) untuk
// konsistensi. API udah tested & return data dengan fallback defaults.

import { db as dbLegacy } from "@/lib/prisma";

// ─── Types ───
export interface HomepageData {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  trustStats: { stat: string; label: string; desc: string }[];
  brandTitle: string;
  brandCopy: string;
  brandPoints: { icon: string; title: string; desc: string }[];
  workflowStages: { n: string; title: string; desc: string }[];
  tokoPhotos: { src: string; alt: string; label: string }[];
  deviceCategories: { label: string; emoji: string }[];
  faqs: { q: string; a: string }[];
  closingTitle: string;
  closingSubtitle: string;
}

export interface LokasiData {
  namaToko: string;
  tagline: string;
  foto: string;
  alamat: string;
  telepon: string;
  whatsapp: string;
  jamWeekday: string;
  jamWeekend: string;
  mapsLink: string;
  lat: number;
  lng: number;
}

export interface LogoData {
  logoData: string;
}

export interface TestimoniData {
  id: string;
  nama: string;
  role: string;
  teks: string;
  rating: number;
  laptop: string;
  avatar: string;
}

function parseJson<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return (Array.isArray(parsed) ? parsed : fallback) as T;
  } catch {
    return fallback;
  }
}

// ─── Fetch Homepage Content (server-side, via internal API) ───
export async function fetchHomepageContent(): Promise<HomepageData> {
  // Fetch from internal API — guaranteed to return data with fallback defaults
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/homepage`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error("fetchHomepageContent via API error, trying DB directly:", error);
  }

  // Fallback: query DB directly
  try {
    const { db } = await import("@/core/lib/db");
    const content = await db.homepageContent.findUnique({
      where: { id: "default" },
    });

    if (content) {
      return {
        heroEyebrow: content.heroEyebrow || "",
        heroTitle: content.heroTitle || "",
        heroSubtitle: content.heroSubtitle || "",
        heroImage: content.heroImage || "",
        trustStats: parseJson(content.trustStats, []),
        brandTitle: content.brandTitle || "",
        brandCopy: content.brandCopy || "",
        brandPoints: parseJson(content.brandPoints, []),
        workflowStages: parseJson(content.workflowStages, []),
        tokoPhotos: parseJson(content.tokoPhotos, []),
        deviceCategories: parseJson(content.deviceCategories, []),
        faqs: parseJson(content.faqs, []),
        closingTitle: content.closingTitle || "",
        closingSubtitle: content.closingSubtitle || "",
      };
    }
  } catch (dbError) {
    console.error("fetchHomepageContent DB fallback error:", dbError);
  }

  // Last resort: empty
  return {
    heroEyebrow: "",
    heroTitle: "",
    heroSubtitle: "",
    heroImage: "",
    trustStats: [],
    brandTitle: "",
    brandCopy: "",
    brandPoints: [],
    workflowStages: [],
    tokoPhotos: [],
    deviceCategories: [],
    faqs: [],
    closingTitle: "",
    closingSubtitle: "",
  };
}

// ─── Fetch Lokasi (server-side) ───
export async function fetchLokasi(): Promise<LokasiData> {
  try {
    const lokasi = await dbLegacy.lokasi.findUnique({
      where: { id: "default" },
    });

    if (lokasi) {
      return {
        namaToko: lokasi.namaToko || "",
        tagline: lokasi.tagline || "",
        foto: lokasi.foto || "",
        alamat: lokasi.alamat || "",
        telepon: lokasi.telepon || "",
        whatsapp: lokasi.whatsapp || "",
        jamWeekday: lokasi.jamWeekday || "",
        jamWeekend: lokasi.jamWeekend || "",
        mapsLink: lokasi.mapsLink || "",
        lat: lokasi.lat || 0,
        lng: lokasi.lng || 0,
      };
    }
  } catch (error) {
    console.error("fetchLokasi error:", error);
  }

  return {
    namaToko: "",
    tagline: "",
    foto: "",
    alamat: "",
    telepon: "",
    whatsapp: "",
    jamWeekday: "",
    jamWeekend: "",
    mapsLink: "",
    lat: 0,
    lng: 0,
  };
}

// ─── Fetch Logo (server-side) ───
export async function fetchLogo(): Promise<LogoData> {
  try {
    const logo = await dbLegacy.storeLogo.findUnique({
      where: { id: "default" },
    });
    return { logoData: logo?.logoData || "" };
  } catch (error) {
    console.error("fetchLogo error:", error);
    return { logoData: "" };
  }
}

// ─── Fetch Testimoni (server-side) ───
export async function fetchTestimoni(): Promise<TestimoniData[]> {
  try {
    const testimoni = await dbLegacy.testimoni.findMany({
      orderBy: { createdAt: "desc" },
    });
    return testimoni.map((t) => ({
      id: t.id,
      nama: t.nama || "",
      role: t.role || "",
      teks: t.teks || "",
      rating: t.rating || 5,
      laptop: t.laptop || "",
      avatar: t.avatar || "",
    }));
  } catch (error) {
    console.error("fetchTestimoni error:", error);
    return [];
  }
}
