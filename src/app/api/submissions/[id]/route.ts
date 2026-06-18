import { db } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { NextRequest, NextResponse } from "next/server";

/**
 * PATCH /api/submissions/[id]
 * Update a submission. Auth required.
 *
 * Admin actions:
 * - Update status (RECEIVED → QC_PROCESS → OFFER_SENT → ACCEPTED/REJECTED → INVENTORY → SOLD)
 * - Update QC checklist + notes (status auto-set to OFFER_SENT)
 * - Update hargaPenawaran + penawaranNotes (status auto-set to OFFER_SENT)
 *
 * Special transitions:
 * - ACCEPTED → INVENTORY: auto-create InventoryItem
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const {
      status,
      qcChecklist,
      qcNotes,
      hargaPenawaran,
      penawaranNotes,
      customerResponse,
    } = body;

    const existing = await db.submission.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Pengajuan tidak ditemukan" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (qcChecklist !== undefined) updateData.qcChecklist = qcChecklist;
    if (qcNotes !== undefined) updateData.qcNotes = qcNotes;
    if (hargaPenawaran !== undefined)
      updateData.hargaPenawaran = parseInt(String(hargaPenawaran)) || 0;
    if (penawaranNotes !== undefined)
      updateData.penawaranNotes = penawaranNotes;
    if (customerResponse !== undefined)
      updateData.customerResponse = customerResponse;
    if (status === "OFFER_SENT" && !existing.penawaranSentAt) {
      updateData.penawaranSentAt = new Date().toISOString();
    }

    // ACCEPTED → INVENTORY: create InventoryItem & link
    if (status === "INVENTORY" && existing.status !== "INVENTORY") {
      const hargaBeli =
        existing.hargaPenawaran || existing.estimasiAI || 0;
      const hargaJual = Math.round(hargaBeli * 1.25); // 25% markup internal

      const inventoryItem = await db.inventoryItem.create({
        data: {
          nama: existing.namaLaptop,
          brand: existing.brand,
          kategori: existing.kategori,
          ram: existing.ram,
          storage: existing.storage,
          gpu: existing.gpu,
          processor: existing.processor,
          tahun: existing.tahun,
          kondisi: existing.kondisi,
          kelengkapan: existing.kelengkapan,
          foto: existing.foto,
          qcChecklist: existing.qcChecklist,
          qcNotes: existing.qcNotes,
          hargaBeli,
          hargaJual,
          channel: "internal",
          status: "INVENTORY",
          purchaseId: existing.id,
        },
      });

      updateData.inventoryItemId = inventoryItem.id;
      updateData.customerResponse = "accepted";
      if (!existing.customerResponseAt) {
        updateData.customerResponseAt = new Date().toISOString();
      }
    }

    // SOLD: update linked InventoryItem to SOLD
    if (status === "SOLD" && existing.inventoryItemId) {
      await db.inventoryItem.update({
        where: { id: existing.inventoryItemId },
        data: { status: "SOLD" },
      });
    }

    // REJECTED: set customerResponse
    if (status === "REJECTED") {
      updateData.customerResponse = "rejected";
      if (!existing.customerResponseAt) {
        updateData.customerResponseAt = new Date().toISOString();
      }
    }

    const updated = await db.submission.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error updating submission:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate pengajuan" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/submissions/[id]
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    await db.submission.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error deleting submission:", error);
    return NextResponse.json(
      { error: "Gagal menghapus pengajuan" },
      { status: 500 }
    );
  }
}
