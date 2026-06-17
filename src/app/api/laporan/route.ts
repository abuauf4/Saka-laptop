import { db } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { NextResponse } from "next/server";

/**
 * GET /api/laporan
 * Stats & summary for admin dashboard / laporan page.
 *
 * Returns:
 * - counts: submission counts per status
 * - inventory: total items, in stock, sold, modal, potensi profit
 * - conversionRate: deal / (deal + rejected)
 * - sales: laporan penjualan (laptop SOLD/disalurkan)
 *   - totalSold: total unit disalurkan
 *   - totalRevenue: total revenue (sum hargaJual of SOLD items)
 *   - totalModalSold: total modal of SOLD items
 *   - totalProfit: revenue - modalSold
 *   - avgDealValue: rata-rata harga jual per unit
 *   - last7Days: trend { date, count, revenue } per hari last 7 days
 *   - last30Days: trend per hari last 30 days (optional, dipakai di laporan page)
 *   - topCategories: top 5 kategori by sold count
 *   - topBrands: top 5 brand by sold count
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
      db.inventoryItem.findMany({
        orderBy: { createdAt: "desc" },
      }),
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

    // ── SALES / LAPORAN PENJUALAN ──
    const soldItems = inventoryItems.filter((i) => i.status === "SOLD");
    const totalSold = soldItems.length;
    const totalRevenue = soldItems.reduce((s, i) => s + i.hargaJual, 0);
    const totalModalSold = soldItems.reduce((s, i) => s + i.hargaBeli, 0);
    const totalProfit = totalRevenue - totalModalSold;
    const avgDealValue = totalSold > 0 ? Math.round(totalRevenue / totalSold) : 0;

    // Last 7 days trend
    const now = new Date();
    const last7Days: { date: string; label: string; count: number; revenue: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(day.getDate() - i);
      day.setHours(0, 0, 0, 0);
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);

      const dayItems = soldItems.filter((item) => {
        const updatedAt = new Date(item.updatedAt);
        return updatedAt >= day && updatedAt < nextDay;
      });

      last7Days.push({
        date: day.toISOString().slice(0, 10),
        label: day.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
        }),
        count: dayItems.length,
        revenue: dayItems.reduce((s, i) => s + i.hargaJual, 0),
      });
    }

    // Last 30 days trend
    const last30Days: { date: string; label: string; count: number; revenue: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(day.getDate() - i);
      day.setHours(0, 0, 0, 0);
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);

      const dayItems = soldItems.filter((item) => {
        const updatedAt = new Date(item.updatedAt);
        return updatedAt >= day && updatedAt < nextDay;
      });

      last30Days.push({
        date: day.toISOString().slice(0, 10),
        label: day.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
        }),
        count: dayItems.length,
        revenue: dayItems.reduce((s, i) => s + i.hargaJual, 0),
      });
    }

    // Top categories (by sold count)
    const categoryCount: Record<string, { count: number; revenue: number }> = {};
    for (const item of soldItems) {
      const cat = item.kategori || "Lainnya";
      if (!categoryCount[cat]) categoryCount[cat] = { count: 0, revenue: 0 };
      categoryCount[cat].count++;
      categoryCount[cat].revenue += item.hargaJual;
    }
    const topCategories = Object.entries(categoryCount)
      .map(([name, v]) => ({ name, count: v.count, revenue: v.revenue }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top brands (by sold count)
    const brandCount: Record<string, { count: number; revenue: number }> = {};
    for (const item of soldItems) {
      const b = item.brand || "Lainnya";
      if (!brandCount[b]) brandCount[b] = { count: 0, revenue: 0 };
      brandCount[b].count++;
      brandCount[b].revenue += item.hargaJual;
    }
    const topBrands = Object.entries(brandCount)
      .map(([name, v]) => ({ name, count: v.count, revenue: v.revenue }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

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
      sales: {
        totalSold,
        totalRevenue,
        totalModalSold,
        totalProfit,
        avgDealValue,
        last7Days,
        last30Days,
        topCategories,
        topBrands,
      },
      conversionRate,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error fetching laporan:", error);
    // Return detailed error untuk debugging (jangan hide)
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to fetch laporan",
        detail: msg,
        hint: "If error mentions 'max clients reached' or 'pool_size', check DATABASE_URL has ?pgBouncer=true&connection_limit=1",
      },
      { status: 500 }
    );
  }
}

