import { db } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { NextRequest, NextResponse } from "next/server";

/**
 * PATCH /api/inventory/[id]
 * Update an inventory item. Auth required.
 * Mainly used to mark item as SOLD.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const { status, hargaJual, channel, qcNotes } = body;

    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (hargaJual !== undefined)
      updateData.hargaJual = parseInt(String(hargaJual)) || 0;
    if (channel) updateData.channel = channel;
    if (qcNotes !== undefined) updateData.qcNotes = qcNotes;

    const updated = await db.inventoryItem.update({
      where: { id },
      data: updateData,
    });

    // If marking as SOLD, also update linked Submission to SOLD
    if (status === "SOLD" && updated.purchaseId) {
      await db.submission.update({
        where: { id: updated.purchaseId },
        data: { status: "SOLD" },
      });
    }

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
    await db.inventoryItem.delete({ where: { id } });
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
