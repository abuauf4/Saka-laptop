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

    // Auto-create table if not exists
    try {
      await db.$executeRaw`
        CREATE TABLE IF NOT EXISTS "barang" (
          "id" TEXT NOT NULL,
          "kode" TEXT NOT NULL,
          "merk" TEXT NOT NULL,
          "tipe" TEXT NOT NULL,
          "spesifikasi" TEXT NOT NULL DEFAULT '',
          "keterangan" TEXT NOT NULL DEFAULT '',
          "hargaBeli" INTEGER NOT NULL DEFAULT 0,
          "status" TEXT NOT NULL DEFAULT 'available',
          "hargaJual" INTEGER,
          "namaPembeli" TEXT,
          "noWa" TEXT,
          "domisili" TEXT,
          "soldAt" TIMESTAMP(3),
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "barang_pkey" PRIMARY KEY ("id")
        )
      `;
      await db.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "barang_kode_key" ON "barang"("kode")`;
      await db.$executeRaw`CREATE INDEX IF NOT EXISTS "barang_status_idx" ON "barang"("status")`;
      await db.$executeRaw`CREATE INDEX IF NOT EXISTS "barang_createdAt_idx" ON "barang"("createdAt")`;
      await db.$executeRaw`CREATE INDEX IF NOT EXISTS "barang_merk_idx" ON "barang"("merk")`;
    } catch {
      // Table already exists, ignore
    }

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
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Gagal fetch barang", detail: msg },
      { status: 500 }
    );
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

    // Auto-create table if not exists (idempotent)
    try {
      await db.$executeRaw`
        CREATE TABLE IF NOT EXISTS "barang" (
          "id" TEXT NOT NULL,
          "kode" TEXT NOT NULL,
          "merk" TEXT NOT NULL,
          "tipe" TEXT NOT NULL,
          "spesifikasi" TEXT NOT NULL DEFAULT '',
          "keterangan" TEXT NOT NULL DEFAULT '',
          "hargaBeli" INTEGER NOT NULL DEFAULT 0,
          "status" TEXT NOT NULL DEFAULT 'available',
          "hargaJual" INTEGER,
          "namaPembeli" TEXT,
          "noWa" TEXT,
          "domisili" TEXT,
          "soldAt" TIMESTAMP(3),
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "barang_pkey" PRIMARY KEY ("id")
        )
      `;
      await db.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "barang_kode_key" ON "barang"("kode")`;
      await db.$executeRaw`CREATE INDEX IF NOT EXISTS "barang_status_idx" ON "barang"("status")`;
      await db.$executeRaw`CREATE INDEX IF NOT EXISTS "barang_createdAt_idx" ON "barang"("createdAt")`;
      await db.$executeRaw`CREATE INDEX IF NOT EXISTS "barang_merk_idx" ON "barang"("merk")`;
    } catch {
      // Table already exists, ignore
    }

    // Generate kode: BRG-XXXXXX
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
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Gagal tambah barang", detail: msg },
      { status: 500 }
    );
  }
}
