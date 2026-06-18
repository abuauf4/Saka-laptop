// ─── Laporan Keuangan API ───
// GET /api/laporan-keuangan?from=2026-01-01&to=2026-12-31&merk=ASUS
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const merk = searchParams.get("merk");

    // Build where clause
    const where: Record<string, unknown> = {};
    if (merk) where.merk = { contains: merk, mode: "insensitive" };

    // Date range — apply to createdAt
    if (from || to) {
      where.createdAt = {};
      if (from) (where.createdAt as Record<string, unknown>).gte = new Date(from);
      if (to) (where.createdAt as Record<string, unknown>).lte = new Date(to + "T23:59:59");
    }

    // Get all barang matching filters
    const allBarang = await db.barang.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const available = allBarang.filter((b) => b.status === "available");
    const sold = allBarang.filter((b) => b.status === "sold");

    const totalModal = available.reduce((s, b) => s + b.hargaBeli, 0);
    const totalModalSold = sold.reduce((s, b) => s + b.hargaBeli, 0);
    const totalJual = sold.reduce((s, b) => s + (b.hargaJual || 0), 0);
    const totalProfit = totalJual - totalModalSold;

    // Stok stats
    const stokMasuk = allBarang.length;
    const stokKeluar = sold.length;
    const stokTersisa = available.length;

    // By merk breakdown
    const merkMap: Record<string, { masuk: number; keluar: number; modal: number; jual: number; profit: number }> = {};
    for (const b of allBarang) {
      const m = b.merk || "Lainnya";
      if (!merkMap[m]) merkMap[m] = { masuk: 0, keluar: 0, modal: 0, jual: 0, profit: 0 };
      merkMap[m].masuk++;
      merkMap[m].modal += b.hargaBeli;
      if (b.status === "sold") {
        merkMap[m].keluar++;
        merkMap[m].jual += b.hargaJual || 0;
        merkMap[m].profit += (b.hargaJual || 0) - b.hargaBeli;
      }
    }

    return NextResponse.json({
      summary: {
        totalModal,          // modal barang masih di stok
        totalModalSold,      // modal barang terjual
        totalJual,           // total revenue
        totalProfit,         // profit = jual - modal sold
        stokMasuk,           // total barang masuk
        stokKeluar,          // total barang terjual
        stokTersisa,         // barang masih available
      },
      byMerk: Object.entries(merkMap).map(([merk, v]) => ({ merk, ...v })),
      soldItems: sold.map((b) => ({
        id: b.id,
        kode: b.kode,
        merk: b.merk,
        tipe: b.tipe,
        spesifikasi: b.spesifikasi,
        hargaBeli: b.hargaBeli,
        hargaJual: b.hargaJual || 0,
        profit: (b.hargaJual || 0) - b.hargaBeli,
        namaPembeli: b.namaPembeli || "",
        noWa: b.noWa || "",
        domisili: b.domisili || "",
        soldAt: b.soldAt,
      })),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Laporan keuangan error:", error);
    return NextResponse.json({ error: "Gagal fetch laporan" }, { status: 500 });
  }
}
