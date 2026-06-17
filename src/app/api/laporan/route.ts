import { db } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { NextResponse } from "next/server";

/**
 * GET /api/laporan
 * Stats & summary for admin dashboard / laporan page.
 */
export async function GET() {
  try {
    await requireAuth();

    const [
      totalSubmissions,
      receivedCount,
      qcCount,
      offerCount,
      acceptedCount,
      rejectedCount,
      inventoryCount,
      soldCount,
      inventoryItems,
    ] = await Promise.all([
      db.submission.count(),
      db.submission.count({ where: { status: "RECEIVED" } }),
      db.submission.count({ where: { status: "QC_PROCESS" } }),
      db.submission.count({ where: { status: "OFFER_SENT" } }),
      db.submission.count({ where: { status: "ACCEPTED" } }),
      db.submission.count({ where: { status: "REJECTED" } }),
      db.submission.count({ where: { status: "INVENTORY" } }),
      db.submission.count({ where: { status: "SOLD" } }),
      db.inventoryItem.findMany(),
    ]);

    const totalModal = inventoryItems
      .filter((i) => i.hargaBeli > 0)
      .reduce((sum, i) => sum + i.hargaBeli, 0);

    const totalDisalurkan = inventoryItems
      .filter((i) => i.status === "SOLD")
      .reduce((sum, i) => sum + i.hargaJual, 0);

    // Conversion rate
    const conversionRate =
      acceptedCount + inventoryCount + soldCount > 0
        ? Math.round(
            ((acceptedCount + inventoryCount + soldCount) /
              (acceptedCount +
                inventoryCount +
                soldCount +
                rejectedCount)) *
              100
          )
        : 0;

    return NextResponse.json({
      counts: {
        total: totalSubmissions,
        RECEIVED: receivedCount,
        QC_PROCESS: qcCount,
        OFFER_SENT: offerCount,
        ACCEPTED: acceptedCount,
        REJECTED: rejectedCount,
        INVENTORY: inventoryCount,
        SOLD: soldCount,
      },
      inventory: {
        totalItems: inventoryItems.length,
        inStock: inventoryItems.filter((i) => i.status === "INVENTORY").length,
        sold: inventoryItems.filter((i) => i.status === "SOLD").length,
        totalModal,
        totalDisalurkan,
        potensiProfit: inventoryItems
          .filter((i) => i.status === "INVENTORY")
          .reduce((sum, i) => sum + (i.hargaJual - i.hargaBeli), 0),
      },
      conversionRate,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error fetching laporan:", error);
    return NextResponse.json(
      { error: "Failed to fetch laporan" },
      { status: 500 }
    );
  }
}
