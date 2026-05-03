import { db } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/articles - List articles
// Public: only published articles. Admin: all.
// Query params: ?published=true&kategori=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const kategori = searchParams.get("kategori") || "";
    const publishedParam = searchParams.get("published");
    const search = searchParams.get("search") || "";

    // Check if user is authenticated (admin)
    let isAdmin = false;
    try {
      await requireAuth();
      isAdmin = true;
    } catch {
      // Not authenticated — public access
    }

    const where: Record<string, unknown> = {};

    // Public users can only see published articles
    if (!isAdmin) {
      where.published = true;
    } else if (publishedParam === "true") {
      where.published = true;
    } else if (publishedParam === "false") {
      where.published = false;
    }

    if (kategori) {
      where.kategori = kategori;
    }

    if (search) {
      where.OR = [
        { judul: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }

    const articles = await db.article.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

// POST /api/articles - Create article (auth required)
export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();

    const { slug, judul, konten, excerpt, gambar, kategori, published } = body;

    if (!judul || !slug) {
      return NextResponse.json(
        { error: "Judul dan slug wajib diisi" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await db.article.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "Slug sudah digunakan" },
        { status: 400 }
      );
    }

    const article = await db.article.create({
      data: {
        slug,
        judul,
        konten: konten || "",
        excerpt: excerpt || "",
        gambar: gambar || "",
        kategori: kategori || "Tips & Review",
        published: published ?? false,
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}
