import { db } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { NextRequest, NextResponse } from "next/server";

// PUT /api/testimoni/[id] - Update testimoni (auth required)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();

    const existing = await db.testimoni.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Testimoni not found" }, { status: 404 });
    }

    const testimoni = await db.testimoni.update({
      where: { id },
      data: {
        ...(body.nama !== undefined && { nama: body.nama }),
        ...(body.role !== undefined && { role: body.role }),
        ...(body.teks !== undefined && { teks: body.teks }),
        ...(body.rating !== undefined && { rating: parseInt(String(body.rating)) }),
        ...(body.laptop !== undefined && { laptop: body.laptop }),
        ...(body.avatar !== undefined && { avatar: body.avatar }),
      },
    });

    return NextResponse.json(testimoni);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error updating testimoni:", error);
    return NextResponse.json({ error: "Failed to update testimoni" }, { status: 500 });
  }
}

// DELETE /api/testimoni/[id] - Delete testimoni (auth required)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;

    const existing = await db.testimoni.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Testimoni not found" }, { status: 404 });
    }

    await db.testimoni.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error deleting testimoni:", error);
    return NextResponse.json({ error: "Failed to delete testimoni" }, { status: 500 });
  }
}
