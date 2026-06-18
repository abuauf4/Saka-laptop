// ─── Image Upload API ───
// POST /api/media/upload (auth required)
// Accepts multipart/form-data with file field
// Returns { url: "data:image/...;base64,..." }
// Stores base64 in Media table + returns URL for use in forms

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/core/lib/db";
import { requireAuth } from "@/core/lib/auth";

// Force Node.js runtime (needed for FormData/file upload in Vercel)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "Homepage";
    const altText = (formData.get("altText") as string) || "";

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Max 2MB." },
        { status: 400 }
      );
    }

    // Convert to base64 data URL
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const mimeType = file.type || "image/jpeg";
    const dataUrl = `data:${mimeType};base64,${base64}`;

    // Store in Media table
    const media = await db.media.create({
      data: {
        fileName: file.name,
        fileType: mimeType.split("/")[1] || "jpg",
        fileSize: file.size,
        filePath: dataUrl,
        folder,
        altText,
      },
    });

    return NextResponse.json({
      url: dataUrl,
      mediaId: media.id,
      fileName: file.name,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
