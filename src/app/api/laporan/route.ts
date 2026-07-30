import { db } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { NextResponse } from "next/server";

/**
 * GET /api/laporan
 * Stats & summary for admin dashboard / laporan page.
 *
 * Sekarang baca dari tabel `barang` (sistem kasir/inventory baru).
 * Submission counts tetap dibaca untuk backward compat.
 */
export async function GET() {
  try {
    await requireAuth();

    const [allBarang, totalSubmissions] = await Promise.all([
      db.barang.findMany({ orderBy: { createdAt: "desc" } }),
      db.submission.count(),
    ]);

    const available = allBarang.filter((b) => b.status === "available");
    const sold = allBarang.filter((b) => b.status === "sold");

    const totalModal = available.reduce((s, b) => s + b.hargaBeli, 0);
    const totalDisalurkan = sold.reduce((s, b) => s + (b.hargaJual || 0), 0);
    const totalModalSold = sold.reduce((s, b) => s + b.hargaBeli, 0);

    // Conversion rate: sold / total barang
    const conversionRate =
      allBarang.length > 0
        ? Math.round((sold.length / allBarang.length) * 100)
        : 0;

    // ── SALES / LAPORAN PENJUALAN ──
    const totalSold = sold.length;
    const totalRevenue = totalDisalurkan;
    const totalProfit = totalRevenue - totalModalSold;
    const avgDealValue =
      totalSold > 0 ? Math.round(totalRevenue / totalSold) : 0;

    // Last 7 days trend (pakai soldAt untuk barang terjual)
    const now = new Date();
    const last7Days: {
      date: string;
      label: string;
      count: number;
      revenue: number;
    }[] = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(day.getDate() - i);
      day.setHours(0, 0, 0, 0);
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);

      const dayItems = sold.filter((item) => {
        const soldAt = item.soldAt ? new Date(item.soldAt) : null;
        return soldAt && soldAt >= day && soldAt < nextDay;
      });

      last7Days.push({
        date: day.toISOString().slice(0, 10),
        label: day.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
        }),
        count: dayItems.length,
        revenue: dayItems.reduce((s, i) => s + (i.hargaJual || 0), 0),
      });
    }

    // Last 30 days trend
    const last30Days: {
      date: string;
      label: string;
      count: number;
      revenue: number;
    }[] = [];
    for (let i = 29; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(day.getDate() - i);
      day.setHours(0, 0, 0, 0);
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);

      const dayItems = sold.filter((item) => {
        const soldAt = item.soldAt ? new Date(item.soldAt) : null;
        return soldAt && soldAt >= day && soldAt < nextDay;
      });

      last30Days.push({
        date: day.toISOString().slice(0, 10),
        label: day.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
        }),
        count: dayItems.length,
        revenue: dayItems.reduce((s, i) => s + (i.hargaJual || 0), 0),
      });
    }

    // Top brands (by sold count)
    const brandCount: Record<string, { count: number; revenue: number }> = {};
    for (const item of sold) {
      const b = item.merk || "Lainnya";
      if (!brandCount[b]) brandCount[b] = { count: 0, revenue: 0 };
      brandCount[b].count++;
      brandCount[b].revenue += item.hargaJual || 0;
    }
    const topBrands = Object.entries(brandCount)
      .map(([name, v]) => ({ name, count: v.count, revenue: v.revenue }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top categories — pakai merk sebagai proxy (barang ga punya field kategori)
    const topCategories = topBrands.map((b) => ({
      name: b.name,
      count: b.count,
      revenue: b.revenue,
    }));

    return NextResponse.json({
      counts: {
        total: totalSubmissions,
        // Submission-based (legacy, bisa 0)
        RECEIVED: 0,
        QC_PROCESS: 0,
        OFFER_SENT: 0,
        ACCEPTED: 0,
        REJECTED: 0,
        INVENTORY: 0,
        SOLD: 0,
        // Barang-based counts
        barangMasuk: allBarang.length,
        barangAvailable: available.length,
        barangSold: sold.length,
      },
      inventory: {
        totalItems: allBarang.length,
        inStock: available.length,
        sold: sold.length,
        totalModal,
        totalDisalurkan,
        potensiProfit: available.reduce(
          (sum, i) =>
            sum +
            ((i.hargaJual || Math.round(i.hargaBeli * 1.3)) - i.hargaBeli),
          0
        ),
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
