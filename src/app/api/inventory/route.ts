import { db } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/inventory
 * List all inventory items (auth required).
 * Query: ?status=INVENTORY|SOLD
 */
export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "";

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const items = await db.inventoryItem.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(items);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error fetching inventory:", error);
    return NextResponse.json(
      { error: "Failed to fetch inventory" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/inventory/[id] — handled in [id]/route.ts
 * Update inventory item status (INVENTORY → SOLD) or other fields.
 */
