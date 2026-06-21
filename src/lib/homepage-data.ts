// ─── Jakarta Laptops — Server-side Homepage Data Fetcher ───
// Fetch semua homepage content di server saat request.
// Dipakai oleh page.tsx (server component) untuk pass props ke client.
//
// Strategy: direct Prisma query (DB) dengan fallback ke empty values.
// Hindari pakai headers() atau no-store fetch karena memaksa dynamic
// rendering, konflik dengan ISR revalidate=300 di homepage.

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

// ─── Fetch Homepage Content (server-side, direct Prisma query) ───
// Direct DB query dengan fallback ke empty values.
// Pattern ini cocok untuk ISR (revalidate=300) karena gak pakai headers()
// atau no-store fetch yang memaksa dynamic rendering.
export async function fetchHomepageContent(): Promise<HomepageData> {
  try {
    const content = await dbLegacy.homepageContent.findUnique({
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
  } catch (error) {
    console.error("fetchHomepageContent DB error:", error);
  }

  // Fallback: empty values (homepage akan render dengan empty state)
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
    // Note: Testimoni model has no `createdAt` field, so we don't orderBy it.
    // Sort in-memory by rating desc (highest rating first) for a nicer display.
    const testimoni = await dbLegacy.testimoni.findMany();
    return testimoni
      .map((t) => ({
        id: t.id,
        nama: t.nama || "",
        role: t.role || "",
        teks: t.teks || "",
        rating: t.rating || 5,
        laptop: t.laptop || "",
        avatar: t.avatar || "",
      }))
      .sort((a, b) => b.rating - a.rating);
  } catch (error) {
    console.error("fetchTestimoni error:", error);
    return [];
  }
}
