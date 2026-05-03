import { db } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/transactions - List all transactions with items
export async function GET() {
  try {
    const transactions = await db.transaction.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

// POST /api/transactions - Create transaction with items (auth required)
// Also deletes sold products from inventory
export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const { items, paymentMethod, customerName, customerPhone, customerAddress } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in transaction" }, { status: 400 });
    }

    // Validate products exist and get prices
    const productIds = items.map((item: { productId: string }) => item.productId).filter(Boolean);
    const products = await db.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));
    let total = 0;

    const transactionItems = items.map((item: { productId?: string; productName?: string; price?: number; quantity: number }) => {
      const product = item.productId ? productMap.get(item.productId) : null;
      const productName = product?.nama || item.productName || "Unknown Product";
      const price = product?.harga || item.price || 0;
      const subtotal = price * item.quantity;
      total += subtotal;

      return {
        productId: item.productId || null,
        productName,
        price,
        quantity: item.quantity,
      };
    });

    // Create transaction
    const transaction = await db.transaction.create({
      data: {
        total,
        paymentMethod: paymentMethod || "Cash",
        status: "completed",
        customerName: customerName || "",
        customerPhone: customerPhone || "",
        customerAddress: customerAddress || "",
        items: {
          create: transactionItems,
        },
      },
      include: { items: true },
    });

    // Delete sold products from inventory
    for (const item of items) {
      if (item.productId) {
        try {
          await db.product.delete({ where: { id: item.productId } });
        } catch {
          // Product may already be deleted, ignore
        }
      }
    }

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error creating transaction:", error);
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}
