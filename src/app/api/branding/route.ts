// ─── Jakarta Laptops — Branding API Route (no-cache)

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/core/lib/db";
import { requireAuth } from "@/core/lib/auth";

// Force dynamic — disable caching (branding editable dari admin)
export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET() {
  try {
    let branding = await db.branding.findUnique({ where: { id: "default" } });
    if (!branding) {
      branding = await db.branding.create({ data: { id: "default" } });
    }
    return NextResponse.json(branding, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error("Get branding error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (auth.role !== "super_admin" && !auth.permissions.includes("branding.update")) {
      return NextResponse.json(
        { error: "Forbidden: Insufficient permissions" },
        { status: 403, headers: NO_CACHE_HEADERS }
      );
    }

    const body = await request.json();

    const branding = await db.branding.upsert({
      where: { id: "default" },
      update: body,
      create: { id: "default", ...body },
    });

    return NextResponse.json(branding, { headers: NO_CACHE_HEADERS });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    if (msg === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers: NO_CACHE_HEADERS }
      );
    }
    console.error("Update branding error:", error);
    return NextResponse.json(
      { error: msg },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
