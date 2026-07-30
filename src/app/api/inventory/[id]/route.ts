import { db } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { NextRequest, NextResponse } from "next/server";

/**
 * PATCH /api/inventory/[id]
 * Update barang dari inventory page.
 * - update hargaJual
 * - update keterangan
 * - mark as sold (status: "sold")
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const { hargaJual, keterangan, status } = body;

    const updateData: Record<string, unknown> = {};
    if (hargaJual !== undefined)
      updateData.hargaJual = parseInt(String(hargaJual)) || 0;
    if (keterangan !== undefined) updateData.keterangan = keterangan;

    // Mark as sold
    if (status === "sold") {
      updateData.status = "sold";
      updateData.soldAt = new Date();
    }

    const updated = await db.barang.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error updating inventory item:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate inventory" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/inventory/[id]
 */
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
    console.error("Error deleting inventory item:", error);
    return NextResponse.json(
      { error: "Gagal menghapus inventory" },
      { status: 500 }
    );
  }
}
