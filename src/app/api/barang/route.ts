// ─── Barang API (CRUD) ───
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET — list barang (optional filter: ?status=available|sold&merk=ASUS)
export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "";
    const merk = searchParams.get("merk") || "";

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (merk) where.merk = { contains: merk, mode: "insensitive" };

    const barang = await db.barang.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(barang);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Barang GET error:", error);
    return NextResponse.json({ error: "Gagal fetch barang" }, { status: 500 });
  }
}

// POST — create barang (barang masuk)
export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const { merk, tipe, spesifikasi, keterangan, hargaBeli } = body;

    if (!merk || !tipe) {
      return NextResponse.json({ error: "Merk dan tipe wajib diisi" }, { status: 400 });
    }

    // Generate kode: BRG-XXXXXX (6 random alphanumeric)
    const kode = `BRG-${Date.now().toString(36).toUpperCase().slice(-6)}${Math.random().toString(36).toUpperCase().slice(2, 5)}`;

    const barang = await db.barang.create({
      data: {
        kode,
        merk,
        tipe,
        spesifikasi: spesifikasi || "",
        keterangan: keterangan || "",
        hargaBeli: parseInt(String(hargaBeli)) || 0,
        status: "available",
      },
    });

    return NextResponse.json(barang, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Barang POST error:", error);
    return NextResponse.json({ error: "Gagal tambah barang" }, { status: 500 });
  }
}
