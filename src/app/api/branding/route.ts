// ─── Nauka CMS — Branding API Route

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/core/lib/db";
import { requireAuth } from "@/core/lib/auth";

export async function GET() {
  try {
    let branding = await db.branding.findUnique({ where: { id: "default" } });
    if (!branding) {
      branding = await db.branding.create({ data: { id: "default" } });
    }
    return NextResponse.json(branding);
  } catch (error) {
    console.error("Get branding error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (auth.role !== "super_admin" && !auth.permissions.includes("branding.update")) {
      return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 });
    }

    const body = await request.json();

    const branding = await db.branding.upsert({
      where: { id: "default" },
      update: body,
      create: { id: "default", ...body },
    });

    return NextResponse.json(branding);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    if (msg === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Update branding error:", error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
