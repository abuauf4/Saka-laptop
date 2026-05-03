import { db } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/products - List all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const kategori = searchParams.get("kategori") || "";
    const search = searchParams.get("search") || "";

    const where: Record<string, unknown> = {};

    if (kategori) {
      where.kategori = kategori;
    }

    if (search) {
      where.OR = [
        { nama: { contains: search, mode: "insensitive" } },
        { gpu: { contains: search, mode: "insensitive" } },
        { ram: { contains: search, mode: "insensitive" } },
      ];
    }

    const products = await db.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST /api/products - Create product (auth required)
export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();

    const { nama, harga, kategori, ram, storage, gpu, performaScore, portableScore, batteryScore, image } = body;

    if (!nama || !harga || !kategori || !ram || !storage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const product = await db.product.create({
      data: {
        nama,
        harga: parseInt(String(harga)),
        kategori,
        ram,
        storage,
        gpu: gpu || "",
        performaScore: parseInt(String(performaScore)) || 5,
        portableScore: parseInt(String(portableScore)) || 5,
        batteryScore: parseInt(String(batteryScore)) || 5,
        image: image || "",
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
