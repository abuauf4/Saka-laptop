import { db } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/testimoni - List all testimoni
export async function GET() {
  try {
    const testimoni = await db.testimoni.findMany({
      orderBy: { id: "desc" },
    });

    return NextResponse.json(testimoni);
  } catch (error) {
    console.error("Error fetching testimoni:", error);
    return NextResponse.json({ error: "Failed to fetch testimoni" }, { status: 500 });
  }
}

// POST /api/testimoni - Create testimoni (auth required)
export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();

    const { nama, role, teks, rating, laptop, avatar } = body;

    if (!nama || !teks) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const testimoni = await db.testimoni.create({
      data: {
        nama,
        role: role || "",
        teks,
        rating: parseInt(String(rating)) || 5,
        laptop: laptop || "",
        avatar: avatar || "",
      },
    });

    return NextResponse.json(testimoni, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error creating testimoni:", error);
    return NextResponse.json({ error: "Failed to create testimoni" }, { status: 500 });
  }
}
