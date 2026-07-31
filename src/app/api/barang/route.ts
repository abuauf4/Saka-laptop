// ─── Barang API (CRUD) ───
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Helper: build spesifikasi string from structured fields
function buildSpesifikasi(data: Record<string, unknown>): string {
  const parts: string[] = [];
  if (data.processor) parts.push(String(data.processor));
  if (data.ram) parts.push(String(data.ram));
  if (data.storage) parts.push(String(data.storage));
  if (data.gpu) parts.push(String(data.gpu));
  if (data.layar) parts.push(String(data.layar));
  if (data.tahun && Number(data.tahun) > 0) parts.push(String(data.tahun));
  return parts.join(" | ");
}

// Ensure new columns exist (safe ALTER TABLE)
async function ensureColumns() {
  const columns = [
    { name: '"processor"', type: "TEXT NOT NULL DEFAULT ''" },
    { name: '"ram"', type: "TEXT NOT NULL DEFAULT ''" },
    { name: '"storage"', type: "TEXT NOT NULL DEFAULT ''" },
    { name: '"gpu"', type: "TEXT NOT NULL DEFAULT ''" },
    { name: '"layar"', type: "TEXT NOT NULL DEFAULT ''" },
    { name: '"tahun"', type: "INTEGER NOT NULL DEFAULT 0" },
    { name: '"kondisi"', type: "TEXT NOT NULL DEFAULT 'Bagus'" },
    { name: '"kelengkapan"', type: "TEXT NOT NULL DEFAULT ''" },
    { name: '"bateraiHealth"', type: "TEXT NOT NULL DEFAULT ''" },
  ];
  for (const col of columns) {
    try {
      await db.$executeRawUnsafe(`ALTER TABLE "barang" ADD COLUMN IF NOT EXISTS ${col.name} ${col.type}`);
    } catch {
      // Column may already exist, ignore
    }
  }
}

// GET — list barang (optional filter: ?status=available|sold&merk=ASUS)
export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "";
    const merk = searchParams.get("merk") || "";

    // Ensure columns exist on first load
    await ensureColumns();

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
    const { merk, tipe, processor, ram, storage, gpu, layar, tahun, kondisi, kelengkapan, bateraiHealth, keterangan, hargaBeli } = body;

    if (!merk || !tipe) {
      return NextResponse.json({ error: "Merk dan tipe wajib diisi" }, { status: 400 });
    }

    // Ensure columns exist
    await ensureColumns();

    // Generate kode: BRG-XXXXXX
    const kode = `BRG-${Date.now().toString(36).toUpperCase().slice(-6)}${Math.random().toString(36).toUpperCase().slice(2, 5)}`;

    // Auto-build spesifikasi from structured fields
    const spesifikasi = buildSpesifikasi({ processor, ram, storage, gpu, layar, tahun });

    const barang = await db.barang.create({
      data: {
        kode,
        merk,
        tipe,
        processor: processor || "",
        ram: ram || "",
        storage: storage || "",
        gpu: gpu || "",
        layar: layar || "",
        tahun: parseInt(String(tahun)) || 0,
        kondisi: kondisi || "Bagus",
        kelengkapan: kelengkapan || "",
        bateraiHealth: bateraiHealth || "",
        spesifikasi,
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
