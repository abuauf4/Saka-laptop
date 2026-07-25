// ─── Jakarta Laptops — Server-side Landing Page Data Fetcher ───
// Fetch /jual-laptop-bekas-jakarta content di server saat request.
// Dipakai oleh /jual-laptop-bekas-jakarta/page.tsx (server component).
//
// Strategy: query Prisma langsung (lebih reliable daripada internal fetch).
// Fallback ke DEFAULT_LP_CONTENT kalau DB belum di-seed.

import { db } from "@/lib/prisma";
import { cache } from "react";

// ─── Types ───
export interface ValuePillar {
  icon: string;       // lucide icon name: "Clock", "Camera", "Truck", "Wallet", "AlertCircle"
  headline: string;
  subCopy: string;
}

export interface ProcessStep {
  step: string;       // "1", "2", "3", "4"
  headline: string;
  subCopy: string;
  duration: string;   // "5 menit", "1-2 jam", "30-60 menit", "5 menit"
}

export interface FaqItem {
  q: string;
  a: string;
  keyword: string;    // target SEO keyword
}

export interface TrustStat {
  stat: string;
  label: string;
}

export interface HeroTrustBadge {
  text: string;
}

export interface LandingPageData {
  // Hero
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  heroTrustBadges: HeroTrustBadge[];

  // Value props
  valuePillars: ValuePillar[];

  // Process
  processSteps: ProcessStep[];

  // Estimasi widget
  estimasiTitle: string;
  estimasiSubtitle: string;
  estimasiCtaLabel: string;

  // FAQ
  faqs: FaqItem[];

  // Trust
  trustStats: TrustStat[];
  trustTitle: string;
  trustSubtitle: string;

  // Final CTA
  finalCtaTitle: string;
  finalCtaSubtitle: string;
  finalCtaPrimary: string;
  finalCtaSecondary: string;

  // SEO metadata
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
}

// ─── Default content (synced dengan LP Conversion Audit PDF) ───
// Dipakai kalau admin belum edit content dari /admin/landing-page.
export const DEFAULT_LP_CONTENT: LandingPageData = {
  heroEyebrow: "JUAL LAPTOP BEKAS JAKARTA",
  heroTitle: "Jual Laptop Bekas Anda Hari Ini.",
  heroSubtitle:
    "Estimasi harga cepat, proses transparan, pembayaran langsung di jam kerja. Pickup gratis Jabodetabek. Terima ThinkPad, Latitude, EliteBook, MacBook, dan brand lainnya.",
  heroPrimaryCta: "Kirim Foto Laptop",
  heroSecondaryCta: "Chat WhatsApp",
  heroTrustBadges: [
    { text: "Respons cepat" },
    { text: "Pembayaran cepat di jam kerja" },
    { text: "Terima kondisi minus" },
  ],

  valuePillars: [
    {
      icon: "Clock",
      headline: "Respons Cepat",
      subCopy: "Tim kami responsif di jam kerja (08:00-21:00) setiap hari.",
    },
    {
      icon: "Camera",
      headline: "Estimasi Harga Instan",
      subCopy: "Kirim foto, dapatkan estimasi dalam 1-2 jam.",
    },
    {
      icon: "Truck",
      headline: "Pickup Gratis Jabodetabek",
      subCopy: "Penjemputan gratis untuk laptop di atas Rp 2 juta.",
    },
    {
      icon: "Wallet",
      headline: "Pembayaran Cepat",
      subCopy: "Cash atau transfer langsung setelah inspeksi selesai (selama jam kerja 08:00-21:00).",
    },
    {
      icon: "AlertCircle",
      headline: "Terima Kondisi Minus",
      subCopy: "Laptop ret, ngedrop, atau rusak tetap diterima, harga disesuaikan.",
    },
  ],

  processSteps: [
    {
      step: "1",
      headline: "Kirim Foto",
      subCopy: "WA atau form upload foto laptop + spek.",
      duration: "5 menit",
    },
    {
      step: "2",
      headline: "Dapat Estimasi",
      subCopy: "Tim berikan estimasi harga berdasarkan foto.",
      duration: "1-2 jam",
    },
    {
      step: "3",
      headline: "QC & Inspeksi",
      subCopy: "Inspeksi fisik 12 titik di lokasi atau video call.",
      duration: "30-60 menit",
    },
    {
      step: "4",
      headline: "Bayar",
      subCopy: "Cash atau transfer langsung, selesai.",
      duration: "5 menit",
    },
  ],

  estimasiTitle: "Cek Estimasi Harga Laptop Anda",
  estimasiSubtitle: "Interactive widget, no commit, hasil instan",
  estimasiCtaLabel: "Lanjut Chat WhatsApp untuk Penawaran Akurat",

  faqs: [
    {
      q: "Berapa harga laptop bekas saya?",
      a: "Harga tergantung brand, model, tahun, dan kondisi. Kirim foto via WA atau form, dapatkan estimasi dalam 1-2 jam. Harga final setelah inspeksi fisik 12 titik QC.",
      keyword: "harga laptop bekas",
    },
    {
      q: "Laptop rusak bisa dijual?",
      a: "Ya, kami menerima laptop dalam kondisi rusak (mati, layar pecah, keyboard rusak, baterai ngedrop). Harga disesuaikan dengan kondisi setelah inspeksi.",
      keyword: "jual laptop rusak",
    },
    {
      q: "MacBook bisa dijual?",
      a: "Ya, kami spesialis MacBook. Menerima MacBook Air/Pro M1, M2, M3, Intel. Penawaran di atas pasar untuk unit kondisi mulus dengan kelengkapan box/charger.",
      keyword: "jual macbook bekas jakarta",
    },
    {
      q: "Laptop kantor bisa dijual?",
      a: "Ya, kami menerima bulk acquisition laptop kantor 10+ unit. Pickup gratis Jabodetabek, data wipe bersertifikat, pembayaran corporate via invoice + transfer.",
      keyword: "jual laptop kantor bekas",
    },
    {
      q: "Berapa lama proses inspeksi?",
      a: "Inspeksi fisik 30-60 menit di lokasi Jakarta. Untuk online, kirim foto via WA dan dapatkan estimasi dalam 1-2 jam. Setelah deal, pembayaran spot selama jam kerja (08:00-21:00).",
      keyword: "lama proses jual laptop",
    },
    {
      q: "Apakah pickup gratis?",
      a: "Ya, pickup gratis area Jabodetabek untuk laptop dengan estimasi harga di atas Rp 2 juta. Untuk di bawah Rp 2 juta, bisa diantar ke lokasi atau pickup dengan biaya transport.",
      keyword: "pickup laptop bekas jakarta",
    },
    {
      q: "Pembayaran cash atau transfer?",
      a: "Keduanya. Cash untuk deal B2C langsung setelah inspeksi (selama jam kerja 08:00-21:00). Transfer bank untuk deal corporate atau atas request. QRIS juga tersedia untuk nominal di bawah Rp 5 juta.",
      keyword: "jual laptop cash jakarta",
    },
    {
      q: "Area layanan Jakarta mana saja?",
      a: "Seluruh Jakarta (Pusat, Selatan, Barat, Timur, Utara), plus Bodetabek (Bogor, Depok, Tangerang, Bekasi). Pickup gratis untuk estimasi di atas Rp 2 juta.",
      keyword: "jual laptop bekas jakarta",
    },
  ],

  trustStats: [
    { stat: "12 titik", label: "QC inspection per unit" },
    { stat: "1-2 jam", label: "Estimasi harga setelah foto" },
    { stat: "Jabodetabek", label: "Area pickup gratis" },
  ],
  trustTitle: "Proses Transparan, Penawaran Jujur",
  trustSubtitle: "Inspeksi menyeluruh sebelum deal",

  finalCtaTitle: "Siap Jual Laptop Bekas Anda?",
  finalCtaSubtitle:
    "Estimasi harga dalam 1-2 jam. Pickup gratis Jabodetabek. Pembayaran cepat di jam kerja.",
  finalCtaPrimary: "Kirim Foto Laptop",
  finalCtaSecondary: "Chat WhatsApp",

  metaTitle:
    "Jual Laptop Bekas Jakarta — Estimasi Cepat, Pickup Gratis | Jakarta Laptops",
  metaDescription:
    "Jual laptop bekas Jakarta dengan estimasi harga cepat, proses transparan, pembayaran langsung. Pickup gratis Jabodetabek. Terima kondisi minus. Chat WA sekarang!",
  ogTitle: "Jual Laptop Bekas Anda Hari Ini — Jakarta Laptops",
  ogDescription:
    "Estimasi harga cepat, proses transparan, pembayaran langsung. Pickup gratis Jabodetabek.",
};

// ─── Helper: parse JSON field dengan fallback ───
function parseJsonField<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.length > 0 ? (parsed as T) : fallback;
    }
    return parsed || fallback;
  } catch {
    return fallback;
  }
}

// ─── Fetch Landing Page Content (server-side, direct Prisma) ───
// Wrapped in React.cache() to deduplicate when called by both
// generateMetadata() and Page component in the same render pass.
export const fetchLandingPageContent = cache(async function fetchLandingPageContent(): Promise<LandingPageData> {
  try {
    const content = await db.landingPageContent.findUnique({
      where: { id: "default" },
    });

    if (!content) {
      return DEFAULT_LP_CONTENT;
    }

    return {
      heroEyebrow: content.heroEyebrow || DEFAULT_LP_CONTENT.heroEyebrow,
      heroTitle: content.heroTitle || DEFAULT_LP_CONTENT.heroTitle,
      heroSubtitle: content.heroSubtitle || DEFAULT_LP_CONTENT.heroSubtitle,
      heroPrimaryCta: content.heroPrimaryCta || DEFAULT_LP_CONTENT.heroPrimaryCta,
      heroSecondaryCta: content.heroSecondaryCta || DEFAULT_LP_CONTENT.heroSecondaryCta,
      heroTrustBadges: parseJsonField(content.heroTrustBadges, DEFAULT_LP_CONTENT.heroTrustBadges),

      valuePillars: parseJsonField(content.valuePillars, DEFAULT_LP_CONTENT.valuePillars),
      processSteps: parseJsonField(content.processSteps, DEFAULT_LP_CONTENT.processSteps),

      estimasiTitle: content.estimasiTitle || DEFAULT_LP_CONTENT.estimasiTitle,
      estimasiSubtitle: content.estimasiSubtitle || DEFAULT_LP_CONTENT.estimasiSubtitle,
      estimasiCtaLabel: content.estimasiCtaLabel || DEFAULT_LP_CONTENT.estimasiCtaLabel,

      faqs: parseJsonField(content.faqs, DEFAULT_LP_CONTENT.faqs),

      trustStats: parseJsonField(content.trustStats, DEFAULT_LP_CONTENT.trustStats),
      trustTitle: content.trustTitle || DEFAULT_LP_CONTENT.trustTitle,
      trustSubtitle: content.trustSubtitle || DEFAULT_LP_CONTENT.trustSubtitle,

      finalCtaTitle: content.finalCtaTitle || DEFAULT_LP_CONTENT.finalCtaTitle,
      finalCtaSubtitle: content.finalCtaSubtitle || DEFAULT_LP_CONTENT.finalCtaSubtitle,
      finalCtaPrimary: content.finalCtaPrimary || DEFAULT_LP_CONTENT.finalCtaPrimary,
      finalCtaSecondary: content.finalCtaSecondary || DEFAULT_LP_CONTENT.finalCtaSecondary,

      metaTitle: content.metaTitle || DEFAULT_LP_CONTENT.metaTitle,
      metaDescription: content.metaDescription || DEFAULT_LP_CONTENT.metaDescription,
      ogTitle: content.ogTitle || DEFAULT_LP_CONTENT.ogTitle,
      ogDescription: content.ogDescription || DEFAULT_LP_CONTENT.ogDescription,
    };
  } catch (error) {
    // DB belum di-migrate atau connection error — fallback ke defaults
    console.error("[landing-page-data] fetch error, using defaults:", error);
    return DEFAULT_LP_CONTENT;
  }
});
