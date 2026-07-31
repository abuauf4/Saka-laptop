// ─── Kasir [id] API (edit & batalkan transaksi) ───
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// PUT — edit transaksi (ubah hargaJual / info pembeli)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const { hargaJual, namaPembeli, noWa, domisili } = body;

    const barang = await db.barang.findUnique({ where: { id } });
    if (!barang) {
      return NextResponse.json({ error: "Barang tidak ditemukan" }, { status: 404 });
    }
    if (barang.status !== "sold") {
      return NextResponse.json({ error: "Hanya bisa edit transaksi yang sudah terjual" }, { status: 400 });
    }

    const updated = await db.barang.update({
      where: { id },
      data: {
        ...(hargaJual !== undefined && { hargaJual: parseInt(String(hargaJual)) }),
        ...(namaPembeli !== undefined && { namaPembeli: namaPembeli || null }),
        ...(noWa !== undefined && { noWa: noWa || null }),
        ...(domisili !== undefined && { domisili: domisili || null }),
      },
    });

    return NextResponse.json({
      message: "Transaksi diupdate",
      barang: updated,
      profit: (updated.hargaJual || 0) - barang.hargaBeli,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Kasir PUT error:", error);
    return NextResponse.json({ error: "Gagal update transaksi" }, { status: 500 });
  }
}

// DELETE — batalkan transaksi (revert ke available)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;

    const barang = await db.barang.findUnique({ where: { id } });
    if (!barang) {
      return NextResponse.json({ error: "Barang tidak ditemukan" }, { status: 404 });
    }
    if (barang.status !== "sold") {
      return NextResponse.json({ error: "Hanya bisa membatalkan transaksi yang sudah terjual" }, { status: 400 });
    }

    const updated = await db.barang.update({
      where: { id },
      data: {
        status: "available",
        hargaJual: null,
        namaPembeli: null,
        noWa: null,
        domisili: null,
        soldAt: null,
      },
    });

    return NextResponse.json({ message: "Transaksi dibatalkan", barang: updated });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Kasir DELETE error:", error);
    return NextResponse.json({ error: "Gagal batalkan transaksi" }, { status: 500 });
  }
}
