import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Dynamic Apple Touch Icon — reads store logo from DB (same source as navbar).
// Next.js auto-serves this at /apple-icon.
// Cache 1 hour so browser doesn't refetch on every navigation.

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET() {
  try {
    const logo = await db.storeLogo.findUnique({ where: { id: "default" } });
    const data = logo?.logoData || "";

    if (!data) {
      return new NextResponse(null, { status: 204 });
    }

    let base64 = data;
    let contentType = "image/png";

    if (data.startsWith("data:")) {
      const match = data.match(/^data:(image\/\w+);base64,(.+)$/);
      if (match) {
        contentType = match[1];
        base64 = match[2];
      }
    }

    const buffer = Buffer.from(base64, "base64");

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
        "Content-Length": String(buffer.length),
      },
    });
  } catch {
    return new NextResponse(null, { status: 204 });
  }
}
