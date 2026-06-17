// ─── Nauka CMS — Permissions API Route ───

import { NextResponse } from "next/server";
import { db } from "@/core/lib/db";
import { requireAuth } from "@/core/lib/auth";

export async function GET() {
  try {
    await requireAuth();

    const permissions = await db.permission.findMany({
      orderBy: [{ category: "asc" }, { action: "asc" }],
    });

    return NextResponse.json({ permissions });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    if (msg === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Permissions list error:", error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
