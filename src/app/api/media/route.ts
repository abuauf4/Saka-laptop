// ─── Nauka CMS — Media API Route (List + Create) ───

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/core/lib/db";
import { requireAuth } from "@/core/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const folder = searchParams.get("folder") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};
    if (search) {
      where.fileName = { contains: search };
    }
    if (folder && folder !== "all") {
      where.folder = folder;
    }

    const [media, total] = await Promise.all([
      db.media.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.media.count({ where }),
    ]);

    return NextResponse.json({
      media,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    if (msg === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Media list error:", error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const { fileName, fileType, fileSize, folder, altText, filePath } = body;

    if (!fileName || !fileType || !fileSize || !filePath) {
      return NextResponse.json(
        { error: "fileName, fileType, fileSize, and filePath are required" },
        { status: 400 }
      );
    }

    const media = await db.media.create({
      data: {
        fileName,
        fileType,
        fileSize,
        filePath,
        folder: folder || "General",
        altText: altText || null,
      },
    });

    return NextResponse.json({ media }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    if (msg === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Create media error:", error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
