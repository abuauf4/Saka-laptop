import { db } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { NextRequest, NextResponse } from "next/server";


// Force dynamic — disable caching (editable dari admin)
export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
  Expires: "0",
};
// GET /api/lokasi/logo - Get store logo
export async function GET() {
  try {
    let logo = await db.storeLogo.findUnique({ where: { id: "default" } });

    if (!logo) {
      // Create default if not exists
      logo = await db.storeLogo.create({
        data: { id: "default", logoData: "" },
      });
    }

    return NextResponse.json({ logoData: logo.logoData }, { headers: NO_CACHE });
  } catch (error) {
    console.error("Error fetching logo:", error);
    return NextResponse.json({ logoData: "" }, { status: 500 }, { headers: NO_CACHE });
  }
}

// PUT /api/lokasi/logo - Update store logo (auth required)
export async function PUT(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();

    const logo = await db.storeLogo.upsert({
      where: { id: "default" },
      update: { logoData: body.logoData ?? "" },
      create: { id: "default", logoData: body.logoData ?? "" },
    });

    return NextResponse.json({ logoData: logo.logoData }, { headers: NO_CACHE });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 }, { headers: NO_CACHE });
    }
    console.error("Error updating logo:", error);
    return NextResponse.json({ error: "Failed to update logo" }, { status: 500 }, { headers: NO_CACHE });
  }
}
