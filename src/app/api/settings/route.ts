// ─── Nauka CMS — Settings API Route ───

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/core/lib/db";
import { requireAuth } from "@/core/lib/auth";

export async function GET() {
  try {
    let settings = await db.settings.findUnique({ where: { id: "default" } });
    if (!settings) {
      settings = await db.settings.create({ data: { id: "default" } });
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();

    const settings = await db.settings.upsert({
      where: { id: "default" },
      update: body,
      create: { id: "default", ...body },
    });

    return NextResponse.json(settings);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    if (msg === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Update settings error:", error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
