// ─── Nauka CMS — SEO API Route

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/core/lib/db";
import { requireAuth } from "@/core/lib/auth";

export async function GET() {
  try {
    let seo = await db.seo.findUnique({ where: { id: "default" } });
    if (!seo) {
      seo = await db.seo.create({ data: { id: "default" } });
    }
    return NextResponse.json(seo);
  } catch (error) {
    console.error("Get SEO error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (auth.role !== "super_admin" && !auth.permissions.includes("seo.update")) {
      return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 });
    }

    const body = await request.json();

    const seo = await db.seo.upsert({
      where: { id: "default" },
      update: body,
      create: { id: "default", ...body },
    });

    return NextResponse.json(seo);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    if (msg === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Update SEO error:", error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
