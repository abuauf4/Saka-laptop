import { db } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/lokasi - Get store info (single row)
export async function GET() {
  try {
    let lokasi = await db.lokasi.findUnique({ where: { id: "default" } });

    if (!lokasi) {
      // Create default if not exists
      lokasi = await db.lokasi.create({
        data: {
          id: "default",
          namaToko: "Saka Laptop",
          tagline: "Toko Laptop Terpercaya",
          foto: "/store-front.png",
          alamat: "Jl. Raya Kebayoran Lama No. 12, Kel. Kebayoran Lama, Kec. Kebayoran Lama, Jakarta Selatan 12210",
          telepon: "+62 896-6252-4542",
          whatsapp: "6289662524542",
          jamWeekday: "Senin - Sabtu: 09.00 - 21.00 WIB",
          jamWeekend: "Minggu: 10.00 - 18.00 WIB",
          lat: -6.2445,
          lng: 106.7813,
          mapsLink: "https://maps.google.com/?q=Saka+Laptop+Jl.+Raya+Kebayoran+Lama+Jakarta+Selatan",
        },
      });
    }

    return NextResponse.json(lokasi);
  } catch (error) {
    console.error("Error fetching lokasi:", error);
    return NextResponse.json({ error: "Failed to fetch lokasi" }, { status: 500 });
  }
}

// PUT /api/lokasi - Update store info (auth required)
export async function PUT(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();

    const lokasi = await db.lokasi.upsert({
      where: { id: "default" },
      update: {
        ...(body.namaToko !== undefined && { namaToko: body.namaToko }),
        ...(body.tagline !== undefined && { tagline: body.tagline }),
        ...(body.foto !== undefined && { foto: body.foto }),
        ...(body.alamat !== undefined && { alamat: body.alamat }),
        ...(body.telepon !== undefined && { telepon: body.telepon }),
        ...(body.whatsapp !== undefined && { whatsapp: body.whatsapp }),
        ...(body.jamWeekday !== undefined && { jamWeekday: body.jamWeekday }),
        ...(body.jamWeekend !== undefined && { jamWeekend: body.jamWeekend }),
        ...(body.lat !== undefined && { lat: parseFloat(String(body.lat)) }),
        ...(body.lng !== undefined && { lng: parseFloat(String(body.lng)) }),
        ...(body.mapsLink !== undefined && { mapsLink: body.mapsLink }),
      },
      create: {
        id: "default",
        namaToko: body.namaToko || "Saka Laptop",
        tagline: body.tagline || "Toko Laptop Terpercaya",
        foto: body.foto || "/store-front.png",
        alamat: body.alamat || "",
        telepon: body.telepon || "",
        whatsapp: body.whatsapp || "",
        jamWeekday: body.jamWeekday || "",
        jamWeekend: body.jamWeekend || "",
        lat: parseFloat(String(body.lat || -6.2445)),
        lng: parseFloat(String(body.lng || 106.7813)),
        mapsLink: body.mapsLink || "",
      },
    });

    return NextResponse.json(lokasi);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error updating lokasi:", error);
    return NextResponse.json({ error: "Failed to update lokasi" }, { status: 500 });
  }
}
