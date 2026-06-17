// ─── Nauka CMS — Categories API Route (List + Create) ───

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/core/lib/db";
import { requireAuth, logActivity } from "@/core/lib/auth";
import { requireModuleActive } from "@/core/lib/module-registry";
import { handleApiError } from "@/core/lib/api-error";

// Helper: generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET() {
  try {
    await requireAuth();
    await requireModuleActive("cms");

    const categories = await db.articleCategory.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    const formatted = categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      articleCount: c._count.articles,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    return NextResponse.json({ categories: formatted });
  } catch (error: unknown) {
    return handleApiError(error, "Categories list error");
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await requireAuth();
    await requireModuleActive("cms");

    const body = await request.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const slug = generateSlug(name);

    // Check for duplicate slug
    const existing = await db.articleCategory.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "A category with this name already exists" },
        { status: 409 }
      );
    }

    const category = await db.articleCategory.create({
      data: { name: name.trim(), slug },
    });

    // Log activity
    await logActivity(payload.userId, "create_category", `Created category: ${name}`);

    return NextResponse.json({ category, message: "Category created successfully" }, { status: 201 });
  } catch (error: unknown) {
    return handleApiError(error, "Create category error");
  }
}
