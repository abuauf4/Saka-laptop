import ZAI from "z-ai-web-dev-sdk";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/estimate
 * AI Estimator for "Terima Laptop Bekas" feature.
 * Customer inputs their laptop specs → AI returns estimated price range.
 *
 * Body: {
 *   namaLaptop, brand, kategori, ram, storage, gpu, processor,
 *   tahun, kondisi, kelengkapan, catatan
 * }
 *
 * Returns: {
 *   estimasiMin, estimasiMax, estimasiTengah, notes, confidence
 * }
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
    } = body;

    if (!namaLaptop) {
      return NextResponse.json(
        { error: "Nama laptop wajib diisi" },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Kamu adalah estimator harga laptop bekas profesional di Indonesia, bekerja untuk toko "Saka Laptop" yang menerima laptop bekas dari customer.

TUGAS: Berikan estimasi harga beli (dalam Rupiah) untuk laptop bekas yang ditawarkan customer ke toko. Harga estimasi adalah harga BELI (sekitar 60-75% dari harga jual pasar, karena toko perlu margin keuntungan).

Pertimbangkan faktor-faktor:
- Spesifikasi (RAM, storage, GPU, processor)
- Tahun produksi (makin lama makin turun)
- Kondisi fisik (Baru > Bagus > Cacat > Rusak)
- Kelengkapan (Lengkap > Tanpa Charger > Tanpa Box)
- Pasar Indonesia (bukan pasar global)

WAJIB respons dalam format JSON persis seperti ini, tanpa teks lain:
{
  "estimasiMin": 5000000,
  "estimasiMax": 7000000,
  "estimasiTengah": 6000000,
  "notes": "Penjelasan singkat tentang estimasi, faktor yang mempengaruhi harga, dan saran untuk customer (1-2 paragraf).",
  "confidence": 80
}

Aturan:
- estimasiMin, estimasiMax, estimasiTengah adalah angka dalam Rupiah (tanpa titik/koma)
- estimasiTengah = (estimasiMin + estimasiMax) / 2 (bulatkan ke kelipatan 50rb)
- confidence adalah persentase keyakinan estimasi (50-95)
- Jika spesifikasi kurang jelas, berikan range yang lebih lebar dan confidence lebih rendah
- Jika laptop rusak berat, estimasi bisa sangat rendah (di bawah 500rb)
- notes ditulis dalam bahasa Indonesia yang ramah dan profesional
- JANGAN tambahkan teks apapun di luar JSON`,
        },
        {
          role: "user",
          content: `Saya mau jual laptop ke toko Anda. Berikut detailnya:

Nama Laptop: ${namaLaptop}
Brand: ${brand || "Tidak disebutkan"}
Kategori: ${kategori || "Ultrabook"}
Processor: ${processor || "Tidak disebutkan"}
RAM: ${ram || "Tidak disebutkan"}
Storage: ${storage || "Tidak disebutkan"}
GPU: ${gpu || "Integrated"}
Tahun Beli: ${tahun || "Tidak diketahui"}
Kondisi: ${kondisi || "Bagus"}
Kelengkapan: ${kelengkapan || "Lengkap"}
Catatan tambahan: ${catatan || "-"}

Berapa estimasi harga belinya?`,
        },
      ],
    });

    const reply = completion.choices[0]?.message?.content || "{}";

    let cleanReply = reply.trim();
    if (cleanReply.startsWith("```")) {
      cleanReply = cleanReply
        .replace(/^```(?:json)?\n?/, "")
        .replace(/\n?```$/, "");
    }

    let estimation;
    try {
      estimation = JSON.parse(cleanReply);
    } catch {
      const match = cleanReply.match(/\{[\s\S]*\}/);
      if (match) {
        estimation = JSON.parse(match[0]);
      } else {
        throw new Error("Invalid AI response");
      }
    }

    // Validate & sanitize
    const estimasiMin = Math.max(0, Number(estimation.estimasiMin) || 0);
    const estimasiMax = Math.max(estimasiMin, Number(estimation.estimasiMax) || estimasiMin);
    const estimasiTengah =
      Number(estimation.estimasiTengah) ||
      Math.round((estimasiMin + estimasiMax) / 2 / 50000) * 50000;
    const confidence = Math.min(95, Math.max(50, Number(estimation.confidence) || 70));
    const notes = String(
      estimation.notes ||
        "Estimasi berdasarkan spesifikasi dan kondisi yang Anda berikan. Harga final akan dikonfirmasi setelah inspeksi fisik laptop."
    );

    return NextResponse.json({
      estimasiMin,
      estimasiMax,
      estimasiTengah,
      notes,
      confidence,
    });
  } catch (error) {
    console.error("Error in /api/estimate:", error);
    return NextResponse.json(
      {
        error:
          "Gagal mengestimasi harga. Silakan coba lagi atau hubungi admin via WhatsApp.",
      },
      { status: 500 }
    );
  }
}
