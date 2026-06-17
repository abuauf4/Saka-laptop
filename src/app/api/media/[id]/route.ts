// ─── Nauka CMS — Media Detail API Route (GET, PUT, DELETE) ───

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/core/lib/db";
import { requireAuth, logActivity } from "@/core/lib/auth";
import { unlink } from "fs/promises";
import path from "path";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;

    const media = await db.media.findUnique({ where: { id } });

    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    return NextResponse.json({ media });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    if (msg === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get media error:", error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await requireAuth();
    const { id } = await params;

    const body = await request.json();
    const { fileName, altText, folder } = body;

    const media = await db.media.findUnique({ where: { id } });
    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (fileName !== undefined) updateData.fileName = fileName;
    if (altText !== undefined) updateData.altText = altText;
    if (folder !== undefined) updateData.folder = folder;

    const updated = await db.media.update({
      where: { id },
      data: updateData,
    });

    await logActivity(payload.userId, "update_media", `Updated media: ${media.fileName}`);

    return NextResponse.json({ media: updated });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    if (msg === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Update media error:", error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await requireAuth();
    const { id } = await params;

    const media = await db.media.findUnique({ where: { id } });
    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    // Delete file from filesystem
    try {
      const fullPath = path.join(process.cwd(), "public", media.filePath);
      await unlink(fullPath);
    } catch (fsError) {
      console.warn("Failed to delete file from filesystem:", fsError);
      // Continue with DB deletion even if file delete fails
    }

    // Delete DB record
    await db.media.delete({ where: { id } });

    await logActivity(payload.userId, "delete_media", `Deleted media: ${media.fileName}`);

    return NextResponse.json({ message: "Media deleted successfully" });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    if (msg === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Delete media error:", error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
