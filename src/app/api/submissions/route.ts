import { db } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/submissions
 * List all submissions (auth required).
 * Query: ?status=RECEIVED|QC_PROCESS|OFFER_SENT|ACCEPTED|REJECTED|INVENTORY|SOLD
 */
export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "";

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const submissions = await db.submission.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(submissions);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/submissions
 * Create a new submission (PUBLIC — customer ajukan via /ajukan form).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      namaLaptop,
      brand,
      kategori,
      ram,
      storage,
      gpu,
      processor,
      tahun,
      kondisi,
      kelengkapan,
      catatan,
      foto,
      customerName,
      customerPhone,
      customerAddress,
      estimasiAI,
      estimasiNotes,
    } = body;

    if (!namaLaptop || !customerName || !customerPhone) {
      return NextResponse.json(
        {
          error: "Nama laptop, nama, dan nomor HP wajib diisi",
        },
        { status: 400 }
      );
    }

    const submission = await db.submission.create({
      data: {
        namaLaptop,
        brand: brand || "",
        kategori: kategori || "Ultrabook",
        ram: ram || "",
        storage: storage || "",
        gpu: gpu || "",
        processor: processor || "",
        tahun: parseInt(String(tahun)) || 0,
        kondisi: kondisi || "Bagus",
        kelengkapan: kelengkapan || "Lengkap",
        catatan: catatan || "",
        foto: foto || "",
        customerName,
        customerPhone,
        customerAddress: customerAddress || "",
        estimasiAI: parseInt(String(estimasiAI)) || 0,
        estimasiNotes: estimasiNotes || "",
        status: "RECEIVED",
      },
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error("Error creating submission:", error);
    return NextResponse.json(
      { error: "Gagal mengirim pengajuan. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
