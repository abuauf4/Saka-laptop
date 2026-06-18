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
  // Strategy: use headers() to get the actual request URL (works in Vercel + local)
  // Then fetch /api/homepage internally — API has DEFAULT_CONTENT fallback
  try {
    const { headers } = await import("next/headers");
    const headersList = await headers();
    const host = headersList.get("host") || "";
    const protocol = headersList.get("x-forwarded-proto") || "https";
    const baseUrl = host ? `${protocol}://${host}` : "";

    if (baseUrl) {
      const res = await fetch(`${baseUrl}/api/homepage`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });

      if (res.ok) {
        const data = await res.json();
        // Validate: ensure arrays are actually arrays
        return {
          heroEyebrow: data.heroEyebrow || "",
          heroTitle: data.heroTitle || "",
          heroSubtitle: data.heroSubtitle || "",
          heroImage: data.heroImage || "",
          trustStats: Array.isArray(data.trustStats) ? data.trustStats : [],
          brandTitle: data.brandTitle || "",
          brandCopy: data.brandCopy || "",
          brandPoints: Array.isArray(data.brandPoints) ? data.brandPoints : [],
          workflowStages: Array.isArray(data.workflowStages) ? data.workflowStages : [],
          tokoPhotos: Array.isArray(data.tokoPhotos) ? data.tokoPhotos : [],
          deviceCategories: Array.isArray(data.deviceCategories) ? data.deviceCategories : [],
          faqs: Array.isArray(data.faqs) ? data.faqs : [],
          closingTitle: data.closingTitle || "",
          closingSubtitle: data.closingSubtitle || "",
        };
      }
    }
  } catch (error) {
    console.error("fetchHomepageContent via headers API error:", error);
  }

  // Fallback: try VERCEL_URL env var
  try {
    const vercelUrl = process.env.VERCEL_URL;
    if (vercelUrl) {
      const res = await fetch(`https://${vercelUrl}/api/homepage`, {
        cache: "no-store",
      });
      if (res.ok) {
        return await res.json();
      }
    }
  } catch (error) {
    console.error("fetchHomepageContent via VERCEL_URL error:", error);
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
