// ─── Permissions API — auto-sync missing permissions on GET ───

import { NextResponse } from "next/server";
import { db } from "@/core/lib/db";
import { requireAuth } from "@/core/lib/auth";
import { PERMISSION_KEYS } from "@/core/config/core-permissions";

export async function GET() {
  try {
    await requireAuth();

    // Auto-sync: create any missing permissions from PERMISSION_KEYS
    // This ensures new categories (e.g. kasir) are available immediately
    for (const perm of PERMISSION_KEYS) {
      await db.permission.upsert({
        where: { name: perm.key },
        update: { category: perm.category, action: perm.action, label: perm.label },
        create: { name: perm.key, category: perm.category, action: perm.action, label: perm.label },
      });
    }

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
