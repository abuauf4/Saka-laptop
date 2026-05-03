import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/dashboard - Dashboard stats
export async function GET() {
  try {
    // Total products
    const totalProducts = await db.product.count();

    // Total transactions
    const totalTransactions = await db.transaction.count();

    // Today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Today's revenue
    const todayTransactions = await db.transaction.findMany({
      where: {
        status: "completed",
        createdAt: { gte: today, lt: tomorrow },
      },
    });
    const todayRevenue = todayTransactions.reduce((sum, t) => sum + t.total, 0);

    // Total revenue
    const allCompleted = await db.transaction.findMany({
      where: { status: "completed" },
    });
    const totalRevenue = allCompleted.reduce((sum, t) => sum + t.total, 0);

    // Last 7 days revenue
    const last7Days: { date: string; revenue: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - i);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayTransactions = await db.transaction.findMany({
        where: {
          status: "completed",
          createdAt: { gte: date, lt: nextDate },
        },
      });

      const dayRevenue = dayTransactions.reduce((sum, t) => sum + t.total, 0);
      last7Days.push({
        date: date.toLocaleDateString("id-ID", { day: "2-digit", month: "short" }),
        revenue: dayRevenue,
      });
    }

    // Recent transactions
    const recentTransactions = await db.transaction.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // Products by category
    const productsByCategory = await db.product.groupBy({
      by: ["kategori"],
      _count: { id: true },
    });

    return NextResponse.json({
      totalProducts,
      totalTransactions,
      todayRevenue,
      totalRevenue,
      last7Days,
      recentTransactions,
      productsByCategory: productsByCategory.map((p) => ({
        kategori: p.kategori,
        count: p._count.id,
      })),
    });
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard" }, { status: 500 });
  }
}
