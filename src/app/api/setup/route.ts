import { db } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth-server";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/setup — Initial store setup wizard
 * Called from /setup page to seed the store data
 *
 * This is a ONE-TIME setup endpoint.
 * It only works if no users exist in the database yet (prevents re-seeding).
 */
export async function POST(request: NextRequest) {
  try {
    // Safety check: only allow setup if no users exist yet
    const existingUserCount = await db.user.count();
    if (existingUserCount > 0) {
      return NextResponse.json(
        { error: "Setup sudah pernah dilakukan. Gunakan admin panel untuk mengubah data." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { store, admin, products, testimoni } = body;

    // ── Validate required fields ──
    if (!store?.namaToko || !admin?.username || !admin?.password) {
      return NextResponse.json(
        { error: "Nama toko, username admin, dan password wajib diisi" },
        { status: 400 }
      );
    }

    const results: string[] = [];

    // ── 1. Create Store Profile (Lokasi) ──
    await db.lokasi.upsert({
      where: { id: "default" },
      update: {
        namaToko: store.namaToko || "Toko Laptop",
        tagline: store.tagline || "Toko Laptop Terpercaya",
        foto: store.foto || "/store-front.png",
        alamat: store.alamat || "",
        telepon: store.telepon || "",
        whatsapp: store.whatsapp || "",
        jamWeekday: store.jamWeekday || "",
        jamWeekend: store.jamWeekend || "",
        lat: store.lat ?? -6.2,
        lng: store.lng ?? 106.8,
        mapsLink: store.mapsLink || "",
      },
      create: {
        id: "default",
        namaToko: store.namaToko || "Toko Laptop",
        tagline: store.tagline || "Toko Laptop Terpercaya",
        foto: store.foto || "/store-front.png",
        alamat: store.alamat || "",
        telepon: store.telepon || "",
        whatsapp: store.whatsapp || "",
        jamWeekday: store.jamWeekday || "",
        jamWeekend: store.jamWeekend || "",
        lat: store.lat ?? -6.2,
        lng: store.lng ?? 106.8,
        mapsLink: store.mapsLink || "",
      },
    });
    results.push("Profil toko dibuat");

    // ── 2. Create Store Logo ──
    await db.storeLogo.upsert({
      where: { id: "default" },
      update: {},
      create: { id: "default", logoData: "" },
    });
    results.push("Logo store dibuat");

    // ── 3. Create Admin User ──
    const hashedPassword = await hashPassword(admin.password);
    await db.user.create({
      data: {
        username: admin.username,
        password: hashedPassword,
        role: "developer",
        permissions: JSON.stringify(["dashboard", "produk", "testimoni", "kasir", "transaksi", "profil"]),
      },
    });
    results.push(`User admin "${admin.username}" dibuat`);

    // ── 4. Create Products (if provided) ──
    if (products && Array.isArray(products) && products.length > 0) {
      let productCount = 0;
      for (const p of products) {
        if (!p.nama || !p.harga) continue;
        await db.product.create({
          data: {
            nama: p.nama,
            harga: parseInt(String(p.harga)),
            kategori: p.kategori || "Gaming",
            ram: p.ram || "",
            storage: p.storage || "",
            gpu: p.gpu || "",
            performaScore: parseInt(String(p.performaScore)) || 5,
            portableScore: parseInt(String(p.portableScore)) || 5,
            batteryScore: parseInt(String(p.batteryScore)) || 5,
            image: p.image || "",
          },
        });
        productCount++;
      }
      results.push(`${productCount} produk ditambahkan`);
    } else {
      results.push("Tidak ada produk ditambahkan (bisa ditambah nanti via admin)");
    }

    // ── 5. Create Testimoni (if provided) ──
    if (testimoni && Array.isArray(testimoni) && testimoni.length > 0) {
      let testiCount = 0;
      for (const t of testimoni) {
        if (!t.nama || !t.teks) continue;
        await db.testimoni.create({
          data: {
            nama: t.nama,
            role: t.role || "Customer",
            teks: t.teks,
            rating: parseInt(String(t.rating)) || 5,
            laptop: t.laptop || "",
            avatar: t.avatar || "",
          },
        });
        testiCount++;
      }
      results.push(`${testiCount} testimoni ditambahkan`);
    }

    return NextResponse.json({
      success: true,
      message: "Setup berhasil!",
      results,
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Setup gagal" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/setup — Check if setup is needed
 */
export async function GET() {
  try {
    const userCount = await db.user.count();
    const productCount = await db.product.count();
    const lokasi = await db.lokasi.findUnique({ where: { id: "default" } });

    return NextResponse.json({
      needsSetup: userCount === 0,
      userCount,
      productCount,
      storeName: lokasi?.namaToko || null,
    });
  } catch (error) {
    console.error("Setup check error:", error);
    return NextResponse.json({
      needsSetup: true,
      error: "Could not check database",
    });
  }
}
