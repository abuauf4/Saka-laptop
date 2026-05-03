import ZAI from "z-ai-web-dev-sdk";
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// POST /api/finder - AI laptop recommendation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { kebutuhan, budget, prioritas, message } = body;

    const isStructured = kebutuhan && budget && prioritas;

    // Get all available products
    const products = await db.product.findMany({
      select: {
        nama: true,
        kategori: true,
        ram: true,
        storage: true,
        gpu: true,
        harga: true,
        performaScore: true,
        portableScore: true,
        batteryScore: true,
      },
    });

    const productList = products.map((p) => ({
      nama: p.nama,
      kategori: p.kategori,
      ram: p.ram,
      penyimpanan: p.storage,
      gpu: p.gpu,
      harga: p.harga,
      performa: p.performaScore,
      portabel: p.portableScore,
      baterai: p.batteryScore,
    }));

    const zai = await ZAI.create();

    if (isStructured) {
      const budgetMax = budget * 1000000;

      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `Kamu adalah asisten rekomendasi laptop di toko Saka Laptop. User sudah memberikan preferensi melalui langkah-langkah:
- Kebutuhan: ${kebutuhan}
- Budget: maksimal Rp ${budget}.000.000
- Prioritas: ${prioritas}

Berikut katalog laptop yang tersedia:
${JSON.stringify(productList)}

TUGAS: Pilih 3 laptop terbaik yang paling cocok dari katalog di atas berdasarkan preferensi user. Laptop harus dalam budget (harga <= ${budgetMax}).

WAJIB respons dalam format JSON array persis seperti ini, tanpa teks lain:
[
  {
    "name": "Nama Laptop dari Katalog",
    "match": 92,
    "reason": "Alasan singkat mengapa laptop ini cocok (1-2 kalimat)",
    "ram": "16GB",
    "storage": "512GB SSD",
    "gpu": "RTX 3060",
    "price": 15000000
  }
]

Aturan:
- match adalah persentase kecocokan (70-99), semakin tinggi semakin cocok
- name HARUS persis sama dengan nama di katalog
- price HARUS sama dengan harga di katalog
- reason ditulis dalam bahasa Indonesia yang ramah dan singkat
- Urutkan dari match tertinggi ke terendah
- Jika tidak ada 3 laptop yang cocok, berikan sebanyak yang tersedia
- JANGAN tambahkan teks apapun di luar JSON array`,
          },
          {
            role: "user",
            content: `Saya butuh laptop untuk ${kebutuhan}, budget maksimal Rp ${budget}.000.000, prioritas ${prioritas}.`,
          },
        ],
      });

      const reply = completion.choices[0]?.message?.content || "[]";

      let cleanReply = reply.trim();
      if (cleanReply.startsWith("```")) {
        cleanReply = cleanReply.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      }

      let recommendations;
      try {
        recommendations = JSON.parse(cleanReply);
      } catch {
        const match = cleanReply.match(/\[[\s\S]*\]/);
        if (match) {
          recommendations = JSON.parse(match[0]);
        } else {
          recommendations = [];
        }
      }

      const validated = recommendations
        .slice(0, 3)
        .map((rec: Record<string, unknown>) => ({
          name: String(rec.name || "Laptop"),
          match: Math.min(99, Math.max(70, Number(rec.match) || 80)),
          reason: String(rec.reason || "Laptop ini sesuai dengan kebutuhan dan budget kamu."),
          ram: String(rec.ram || "-"),
          storage: String(rec.storage || "-"),
          gpu: String(rec.gpu || "-"),
          price: Number(rec.price) || 0,
        }));

      return NextResponse.json({ recommendations: validated });
    } else {
      const userMessage = message || "Rekomendasikan laptop untuk saya";
      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `Kamu adalah asisten rekomendasi laptop di toko Saka Laptop. Berikan rekomendasi laptop dari katalog yang tersedia. Gunakan bahasa Indonesia yang ramah dan profesional. Format respons dengan nama laptop, spesifikasi singkat, dan alasan rekomendasi. Jika user bertanya di luar konteks laptop, tetap arahkan ke rekomendasi laptop. Berikut katalog laptop tersedia: ${JSON.stringify(productList)}`,
          },
          { role: "user", content: userMessage },
        ],
      });

      const reply =
        completion.choices[0]?.message?.content ||
        "Maaf, saya tidak dapat memberikan rekomendasi saat ini.";

      return NextResponse.json({ reply });
    }
  } catch (error) {
    console.error("Error in finder:", error);
    return NextResponse.json(
      { error: "Failed to get recommendation" },
      { status: 500 }
    );
  }
}
