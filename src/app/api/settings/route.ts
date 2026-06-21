// ─── Jakarta Laptops — Settings API Route (with auto-migrate) ───

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/core/lib/db";
import { requireAuth } from "@/core/lib/auth";

// Force dynamic — disable caching (editable dari admin)
export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
  Expires: "0",
};

// Auto-add new columns if they don't exist (googleAdsId, gtmContainerId)
async function autoMigrateColumns() {
  try {
    await db.$executeRaw`ALTER TABLE "core_settings" ADD COLUMN IF NOT EXISTS "googleAdsId" TEXT`;
    await db.$executeRaw`ALTER TABLE "core_settings" ADD COLUMN IF NOT EXISTS "gtmContainerId" TEXT`;
  } catch {
    // Columns already exist or table not found, ignore
  }
}

export async function GET() {
  try {
    await autoMigrateColumns();
    let settings = await db.settings.findUnique({ where: { id: "default" } });
    if (!settings) {
      settings = await db.settings.create({ data: { id: "default" } });
    }
    return NextResponse.json(settings, { headers: NO_CACHE });
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: NO_CACHE });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAuth();
    await autoMigrateColumns();
    const body = await request.json();

    // Whitelist fields yang boleh di-update
    const allowedFields = [
      "phone", "whatsapp", "email", "address", "googleMapsUrl",
      "googleAnalyticsId", "metaPixelId", "googleAdsId", "gtmContainerId",
      "smtpHost", "smtpPort", "smtpUsername", "smtpPassword", "maintenanceMode",
    ];
    const cleanBody: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) cleanBody[key] = body[key];
    }

    const settings = await db.settings.upsert({
      where: { id: "default" },
      update: cleanBody,
      create: { id: "default", ...cleanBody },
    });

    return NextResponse.json(settings, { headers: NO_CACHE });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    if (msg === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_CACHE });
    }
    console.error("Update settings error:", error);
    return NextResponse.json({ error: msg }, { status: 500, headers: NO_CACHE });
  }
}
