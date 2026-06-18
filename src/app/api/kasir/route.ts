// ─── Kasir API (jual barang) ───
// POST /api/kasir — sell item: set status=sold, hargaJual, buyer info
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const { barangId, hargaJual, namaPembeli, noWa, domisili } = body;

    if (!barangId || !hargaJual) {
      return NextResponse.json({ error: "Barang dan harga jual wajib diisi" }, { status: 400 });
    }

    // Check barang exists & available
    const barang = await db.barang.findUnique({ where: { id: barangId } });
    if (!barang) {
      return NextResponse.json({ error: "Barang tidak ditemukan" }, { status: 404 });
    }
    if (barang.status === "sold") {
      return NextResponse.json({ error: "Barang sudah terjual" }, { status: 400 });
    }

    // Mark as sold
    const updated = await db.barang.update({
      where: { id: barangId },
      data: {
        status: "sold",
        hargaJual: parseInt(String(hargaJual)),
        namaPembeli: namaPembeli || null,
        noWa: noWa || null,
        domisili: domisili || null,
        soldAt: new Date(),
      },
    });

    return NextResponse.json({
      message: "Barang terjual",
      barang: updated,
      profit: (parseInt(String(hargaJual)) - barang.hargaBeli),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Kasir POST error:", error);
    return NextResponse.json({ error: "Gagal jual barang" }, { status: 500 });
  }
}
