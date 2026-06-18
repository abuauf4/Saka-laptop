// ─── Testimoni API (public GET, auth CRUD) ───
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

// GET — public, list all testimoni
export async function GET() {
  try {
    const testimoni = await db.testimoni.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(testimoni, {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" },
    });
  } catch (error) {
    console.error("Error fetching testimoni:", error);
    return NextResponse.json([], { status: 200 });
  }
}

// POST — auth, create testimoni
export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const { nama, role, teks, rating, laptop, avatar } = body;
    if (!nama || !teks) {
      return NextResponse.json({ error: "Nama dan teks wajib diisi" }, { status: 400 });
    }
    const created = await db.testimoni.create({
      data: { nama, role: role || "Customer", teks, rating: rating || 5, laptop: laptop || "", avatar: avatar || "" },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error creating testimoni:", error);
    return NextResponse.json({ error: "Gagal membuat testimoni" }, { status: 500 });
  }
}
