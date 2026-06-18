// ─── Jakarta Laptops — Homepage Content API ───
// GET /api/homepage (public) — return homepage content (with defaults fallback)
// PUT /api/homepage (auth) — update homepage content
//
// Cache strategy: no-store (always fetch fresh from DB)
// Karena content editable dari admin, gak boleh di-cache di edge.

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/core/lib/db";
import { requireAuth } from "@/core/lib/auth";

// Force dynamic — disable static + edge caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

/** Helper: set no-cache headers supaya response selalu fresh */
const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
  Expires: "0",
};

// ─── Default values (synced dengan yang hardcoded di page.tsx sebelumnya) ───
const DEFAULT_CONTENT = {
  heroEyebrow: "Pusat Inspeksi & Trade-in Laptop Bekas",
  heroTitle: "Jual Laptop Bekas Tanpa Ribet.",
  heroSubtitle:
    "Kirim foto dan spesifikasi laptop melalui WhatsApp. Tim kami akan membantu proses pengecekan dan penawaran.",
  heroImage:
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1920&q=90",
  trustStats: [
    {
      stat: "12",
      label: "Titik QC",
      desc: "Setiap laptop diperiksa di 12 titik: layar, keyboard, touchpad, baterai, charger, storage, RAM, kamera, speaker, port, WiFi, fisik.",
    },
    {
      stat: "1–2",
      label: "Hari Proses",
      desc: "Dari pengajuan via WhatsApp sampai penawaran final. Review awal 1×24 jam, inspeksi fisik 30–60 menit di toko.",
    },
    {
      stat: "100%",
      label: "Penawaran Transparan",
      desc: "Harga berdasarkan hasil QC aktual, bukan tebakan. Kamu lihat sendiri apa yang diperiksa dan kenapa harganya segitu.",
    },
  ],
  brandTitle: "Bukan Sekadar Membeli Laptop.",
  brandCopy:
    "Kami membantu proses penilaian perangkat secara transparan sebelum memberikan penawaran.",
  brandPoints: [
    {
      icon: "Eye",
      title: "Transparan",
      desc: "Setiap pengecekan dilakukan terbuka. Kamu tahu persis apa yang diperiksa dan kenapa harganya segitu.",
    },
    {
      icon: "ShieldCheck",
      title: "Profesional",
      desc: "Tim teknisi berpengalaman menilai perangkat secara objektif, bukan asal tebak harga.",
    },
    {
      icon: "Clock",
      title: "Cepat",
      desc: "Dari pengajuan ke penawaran, prosesnya gak berhari-hari. Tim kami responsif.",
    },
  ],
  workflowStages: [
    { n: "01", title: "Ajukan Laptop", desc: "Kirim foto dan spesifikasi laptop via WhatsApp. Sebut kondisi sejujurnya." },
    { n: "02", title: "Review Awal", desc: "Tim kami cek data awal dan kembali ke kamu dengan pertanyaan klarifikasi kalau perlu." },
    { n: "03", title: "Pengecekan", desc: "Bawa laptop ke toko. Teknisi inspeksi 12 titik: layar, keyboard, baterai, port, fisik, dll." },
    { n: "04", title: "Penawaran", desc: "Harga diberikan berdasarkan hasil inspeksi. Bukan tebakan, bukan asal — ada dasarnya." },
    { n: "05", title: "Deal", desc: "Kamu bebas terima atau tolak. Kalau deal, pembayaran dilakukan langsung." },
  ],
  tokoPhotos: [
    { src: "https://images.unsplash.com/photo-1604754742629-3e0498a8a4bd?w=800&q=80", alt: "Teknisi membongkar laptop untuk inspeksi", label: "Pembongkaran" },
    { src: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80", alt: "Pengecekan komponen dengan multimeter", label: "QC Detail" },
    { src: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80", alt: "Tes layar dan keyboard", label: "Tes Fungsi" },
    { src: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80", alt: "Meja kerja teknisi dengan tools lengkap", label: "Meja Kerja" },
  ],
  deviceCategories: [
    { label: "Laptop Kantor", emoji: "💼" },
    { label: "Laptop Gaming", emoji: "🎮" },
    { label: "MacBook", emoji: "🍎" },
    { label: "Workstation", emoji: "🖥️" },
  ],
  faqs: [
    { q: "Laptop rusak diterima?", a: "Ya, kami tetap nerima. Hasil QC yang menentukan harga — kalau banyak komponen yang gagal, penawaran menyesuaikan. Tapi selama masih ada nilai (komponen masih bisa dipakai atau dijual parts), kami tetap kasih penawaran jujur." },
    { q: "Laptop mati total diterima?", a: "Ya, diterima. Laptop mati total biasanya masih ada nilai dari komponen yang masih berfungsi (RAM, SSD, layar, keyboard, charger). Tim teknisi akan cek komponen per komponen, kasih penawaran berdasarkan apa yang masih bisa diselamatkan. Jangan dibuang dulu — chat kami." },
    { q: "LCD shadow / ghosting diterima?", a: "Diterima, tapi penawaran menyesuaikan. LCD shadow (bayangan bekas gambar) atau ghosting biasanya berarti panel layar udah wear. Kami tetap beli, tapi harga jual ulang juga bakal turun, jadi penawaran ke kamu juga menyesuaikan. Selama layar masih bisa dipakai normal, masih ada nilai." },
    { q: "Baterai soak / health rendah diterima?", a: "Ya, diterima. Baterai soak (cepat habis) atau health rendah itu masalah umum di laptop bekas. Kami cek health baterai di QC, dan penawaran menyesuaikan. Kalau baterai masih 70%+ masih lumayan. Kalau udah di bawah 50%, harga turun dikit — tapi gak drastis, karena baterai bisa diganti." },
    { q: "Keyboard rusak / ada tombol mati diterima?", a: "Diterima. Keyboard rusak (tombol mati, sticky, atau rapuh) bisa diganti, jadi masih ada nilai. Di QC kami tes semua tombol satu-satu. Penawaran menyesuaikan berapa banyak tombol yang bermasalah — kalau cuma 1-2 tombol, gak terlalu ngaruh. Kalau banyak, harga turun dikit." },
    { q: "Data pribadi di laptop lama gimana?", a: "Sangat aman. Sebelum laptop masuk inventory, tim kami lakukan secure wipe (DoD 3-pass wipe — standard militer) supaya data gak bisa direcovery. Tapi kami sarankan kamu backup data penting & sign out dari akun (iCloud, Google, Microsoft) sebelum dibawa ke toko. Kalau lupa, kami bantu wipe di depan kamu kalau mau." },
    { q: "Harus datang langsung?", a: "Pengajuan awal bisa online via WhatsApp. Tapi untuk inspeksi fisik & finalisasi harga, laptop harus dibawa ke toko. Kalau kamu di luar kota, hubungi kami dulu — mungkin bisa diatur via kurir." },
    { q: "Berapa lama proses?", a: "Dari kamu ajukan via WA sampai dapat penawaran awal: biasanya 1×24 jam. Kalau lanjut inspeksi fisik di toko: 30-60 menit. Jadi total 1-2 hari kerja dari awal sampai deal." },
    { q: "Bagaimana pembayaran?", a: "Setelah deal, pembayaran langsung. Bisa transfer bank (BCA/Mandiri/BRI) atau tunai di toko. Untuk trade-in, nilai laptop dipakai sebagai potongan kalau kamu mau tukar dengan unit lain di inventory." },
    { q: "Jika harga tidak cocok?", a: "Gak masalah. Kamu bebas tolak tanpa biaya. Laptop dikembalikan dalam kondisi sama persis seperti saat dibawa. Kami gak maksa — penawaran cuma referensi, keputusan tetap di kamu." },
  ],
  closingTitle: "Laptop Lama Masih Bernilai.",
  closingSubtitle: "Chat kami sekarang via WhatsApp. Gratis, tanpa komitmen.",
};

function parseJsonField<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) ? parsed.length === 0 : !parsed) return fallback;
    return parsed as T;
  } catch {
    return fallback;
  }
}

/** GET /api/homepage — public, return content dengan fallback ke defaults */
export async function GET() {
  try {
    const content = await db.homepageContent.findUnique({
      where: { id: "default" },
    });

    if (!content) {
      // Return defaults (kalau belum ada record di DB)
      return NextResponse.json(DEFAULT_CONTENT, {
        headers: NO_CACHE_HEADERS,
      });
    }

    // Merge DB values + parse JSON fields
    return NextResponse.json({
      heroEyebrow: content.heroEyebrow || DEFAULT_CONTENT.heroEyebrow,
      heroTitle: content.heroTitle || DEFAULT_CONTENT.heroTitle,
      heroSubtitle: content.heroSubtitle || DEFAULT_CONTENT.heroSubtitle,
      heroImage: content.heroImage || DEFAULT_CONTENT.heroImage,
      trustStats: parseJsonField(content.trustStats, DEFAULT_CONTENT.trustStats),
      brandTitle: content.brandTitle || DEFAULT_CONTENT.brandTitle,
      brandCopy: content.brandCopy || DEFAULT_CONTENT.brandCopy,
      brandPoints: parseJsonField(content.brandPoints, DEFAULT_CONTENT.brandPoints),
      workflowStages: parseJsonField(content.workflowStages, DEFAULT_CONTENT.workflowStages),
      tokoPhotos: parseJsonField(content.tokoPhotos, DEFAULT_CONTENT.tokoPhotos),
      deviceCategories: parseJsonField(content.deviceCategories, DEFAULT_CONTENT.deviceCategories),
      faqs: parseJsonField(content.faqs, DEFAULT_CONTENT.faqs),
      closingTitle: content.closingTitle || DEFAULT_CONTENT.closingTitle,
      closingSubtitle: content.closingSubtitle || DEFAULT_CONTENT.closingSubtitle,
    }, {
      headers: NO_CACHE_HEADERS,
    });
  } catch (error) {
    console.error("Homepage GET error:", error);
    // Fallback ke defaults kalau DB error
    return NextResponse.json(DEFAULT_CONTENT, {
      headers: NO_CACHE_HEADERS,
    });
  }
}

/** PUT /api/homepage — auth required, update content */
export async function PUT(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();

    // Validate required fields
    if (!body.heroTitle) {
      return NextResponse.json(
        { error: "heroTitle wajib diisi" },
        { status: 400 }
      );
    }

    // Serialize JSON array fields
    const data = {
      id: "default",
      heroEyebrow: body.heroEyebrow || DEFAULT_CONTENT.heroEyebrow,
      heroTitle: body.heroTitle,
      heroSubtitle: body.heroSubtitle || DEFAULT_CONTENT.heroSubtitle,
      heroImage: body.heroImage || DEFAULT_CONTENT.heroImage,
      trustStats: JSON.stringify(body.trustStats || []),
      brandTitle: body.brandTitle || DEFAULT_CONTENT.brandTitle,
      brandCopy: body.brandCopy || DEFAULT_CONTENT.brandCopy,
      brandPoints: JSON.stringify(body.brandPoints || []),
      workflowStages: JSON.stringify(body.workflowStages || []),
      tokoPhotos: JSON.stringify(body.tokoPhotos || []),
      deviceCategories: JSON.stringify(body.deviceCategories || []),
      faqs: JSON.stringify(body.faqs || []),
      closingTitle: body.closingTitle || DEFAULT_CONTENT.closingTitle,
      closingSubtitle: body.closingSubtitle || DEFAULT_CONTENT.closingSubtitle,
    };

    // Upsert (create or update singleton)
    const updated = await db.homepageContent.upsert({
      where: { id: "default" },
      update: data,
      create: data,
    });

    return NextResponse.json({
      message: "Homepage content updated",
      content: {
        ...updated,
        trustStats: parseJsonField(updated.trustStats, []),
        brandPoints: parseJsonField(updated.brandPoints, []),
        workflowStages: parseJsonField(updated.workflowStages, []),
        tokoPhotos: parseJsonField(updated.tokoPhotos, []),
        deviceCategories: parseJsonField(updated.deviceCategories, []),
        faqs: parseJsonField(updated.faqs, []),
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Homepage PUT error:", error);
    return NextResponse.json(
      { error: "Gagal update homepage content" },
      { status: 500 }
    );
  }
}
