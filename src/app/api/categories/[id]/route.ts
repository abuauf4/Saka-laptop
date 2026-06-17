// ─── Nauka CMS — Category Detail API Route (GET, PUT, DELETE) ───

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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    await requireModuleActive("cms");
    const { id } = await params;

    const category = await db.articleCategory.findUnique({
      where: { id },
      include: {
        _count: { select: { articles: true } },
      },
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        articleCount: category._count.articles,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      },
    });
  } catch (error: unknown) {
    return handleApiError(error, "Get category error");
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await requireAuth();
    await requireModuleActive("cms");
    const { id } = await params;

    const body = await request.json();
    const { name } = body;

    const category = await db.articleCategory.findUnique({ where: { id } });
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (name !== undefined && name.trim()) {
      updateData.name = name.trim();
      updateData.slug = generateSlug(name);
    }

    // Check for duplicate slug if name changed
    if (updateData.slug && updateData.slug !== category.slug) {
      const existing = await db.articleCategory.findUnique({
        where: { slug: updateData.slug as string },
      });
      if (existing) {
        return NextResponse.json(
          { error: "A category with this name already exists" },
          { status: 409 }
        );
      }
    }

    const updated = await db.articleCategory.update({
      where: { id },
      data: updateData,
    });

    // Log activity
    await logActivity(payload.userId, "update_category", `Updated category: ${category.name}`);

    return NextResponse.json({ category: updated, message: "Category updated successfully" });
  } catch (error: unknown) {
    return handleApiError(error, "Update category error");
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await requireAuth();
    await requireModuleActive("cms");
    const { id } = await params;

    const category = await db.articleCategory.findUnique({
      where: { id },
      include: { _count: { select: { articles: true } } },
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    if (category._count.articles > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with existing articles. Reassign articles first." },
        { status: 400 }
      );
    }

    await db.articleCategory.delete({ where: { id } });

    // Log activity
    await logActivity(payload.userId, "delete_category", `Deleted category: ${category.name}`);

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error: unknown) {
    return handleApiError(error, "Delete category error");
  }
}
