// ─── Barang [id] API (PUT, DELETE) ───
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// PUT — update barang
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const { merk, tipe, spesifikasi, keterangan, hargaBeli } = body;

    const updated = await db.barang.update({
      where: { id },
      data: {
        ...(merk !== undefined && { merk }),
        ...(tipe !== undefined && { tipe }),
        ...(spesifikasi !== undefined && { spesifikasi }),
        ...(keterangan !== undefined && { keterangan }),
        ...(hargaBeli !== undefined && { hargaBeli: parseInt(String(hargaBeli)) || 0 }),
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Barang PUT error:", error);
    return NextResponse.json({ error: "Gagal update barang" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    await db.barang.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Barang DELETE error:", error);
    return NextResponse.json({ error: "Gagal hapus barang" }, { status: 500 });
  }
}
