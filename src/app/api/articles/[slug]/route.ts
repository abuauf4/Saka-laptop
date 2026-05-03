import { db } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/articles/[slug] - Get single article by slug
// Public: only if published. Admin: all.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const article = await db.article.findUnique({ where: { slug } });

    if (!article) {
      return NextResponse.json(
        { error: "Artikel tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check if admin or published
    let isAdmin = false;
    try {
      await requireAuth();
      isAdmin = true;
    } catch {
      // Not authenticated
    }

    if (!article.published && !isAdmin) {
      return NextResponse.json(
        { error: "Artikel tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}

// PUT /api/articles/[slug] - Update article (auth required)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await requireAuth();
    const { slug } = await params;
    const body = await request.json();

    const existing = await db.article.findUnique({ where: { slug } });
    if (!existing) {
      return NextResponse.json(
        { error: "Artikel tidak ditemukan" },
        { status: 404 }
      );
    }

    // If slug is being changed, check for conflicts
    if (body.slug && body.slug !== slug) {
      const slugConflict = await db.article.findUnique({
        where: { slug: body.slug },
      });
      if (slugConflict) {
        return NextResponse.json(
          { error: "Slug sudah digunakan" },
          { status: 400 }
        );
      }
    }

    const article = await db.article.update({
      where: { slug },
      data: {
        ...(body.judul !== undefined && { judul: body.judul }),
        ...(body.slug !== undefined && { slug: body.slug }),
        ...(body.konten !== undefined && { konten: body.konten }),
        ...(body.excerpt !== undefined && { excerpt: body.excerpt }),
        ...(body.gambar !== undefined && { gambar: body.gambar }),
        ...(body.kategori !== undefined && { kategori: body.kategori }),
        ...(body.published !== undefined && { published: body.published }),
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error updating article:", error);
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    );
  }
}

// DELETE /api/articles/[slug] - Delete article (auth required)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await requireAuth();
    const { slug } = await params;

    const existing = await db.article.findUnique({ where: { slug } });
    if (!existing) {
      return NextResponse.json(
        { error: "Artikel tidak ditemukan" },
        { status: 404 }
      );
    }

    await db.article.delete({ where: { slug } });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    );
  }
}
