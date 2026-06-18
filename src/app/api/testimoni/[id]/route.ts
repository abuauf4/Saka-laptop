// ─── Testimoni [id] API (auth PUT + DELETE) ───
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const updated = await db.testimoni.update({
      where: { id },
      data: {
        ...(body.nama !== undefined && { nama: body.nama }),
        ...(body.role !== undefined && { role: body.role }),
        ...(body.teks !== undefined && { teks: body.teks }),
        ...(body.rating !== undefined && { rating: body.rating }),
        ...(body.laptop !== undefined && { laptop: body.laptop }),
        ...(body.avatar !== undefined && { avatar: body.avatar }),
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error updating testimoni:", error);
    return NextResponse.json({ error: "Gagal update" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    await db.testimoni.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error deleting testimoni:", error);
    return NextResponse.json({ error: "Gagal hapus" }, { status: 500 });
  }
}
