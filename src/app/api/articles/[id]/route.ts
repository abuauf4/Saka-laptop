// ─── Nauka CMS — Article Detail API Route (GET, PUT, DELETE) ───

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/core/lib/db";
import { requireAuth, logActivity } from "@/core/lib/auth";
import { requireModuleActive } from "@/core/lib/module-registry";
import { handleApiError } from "@/core/lib/api-error";

// Helper: generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Helper: ensure unique slug
async function ensureUniqueSlug(slug: string, excludeId?: string): Promise<string> {
  let candidate = slug;
  let suffix = 1;
  while (true) {
    const existing = await db.article.findUnique({
      where: { slug: candidate },
    });
    if (!existing || existing.id === excludeId) break;
    suffix++;
    candidate = `${slug}-${suffix}`;
  }
  return candidate;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    await requireModuleActive("cms");
    const { id } = await params;

    const article = await db.article.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Get author info
    let authorName: string | null = null;
    if (article.authorId) {
      const author = await db.user.findUnique({
        where: { id: article.authorId },
        select: { fullName: true },
      });
      authorName = author?.fullName || null;
    }

    const formatted = {
      ...article,
      authorName,
    };

    return NextResponse.json({ article: formatted });
  } catch (error: unknown) {
    return handleApiError(error, "Get article error");
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
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      status,
      metaTitle,
      metaDesc,
      ogImage,
      authorId,
      categoryId,
    } = body;

    const article = await db.article.findUnique({ where: { id } });
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Build update data
    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (excerpt !== undefined) updateData.excerpt = excerpt || null;
    if (content !== undefined) updateData.content = content || null;
    if (coverImage !== undefined) updateData.coverImage = coverImage || null;
    if (status !== undefined) updateData.status = status;
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle || null;
    if (metaDesc !== undefined) updateData.metaDesc = metaDesc || null;
    if (ogImage !== undefined) updateData.ogImage = ogImage || null;
    if (authorId !== undefined) updateData.authorId = authorId || null;
    if (categoryId !== undefined) updateData.categoryId = categoryId || null;

    // Handle slug update
    if (slug !== undefined) {
      const baseSlug = slug.trim() ? generateSlug(slug) : generateSlug(title || article.title);
      updateData.slug = await ensureUniqueSlug(baseSlug, id);
    } else if (title !== undefined && title !== article.title) {
      // Auto-update slug when title changes (if slug wasn't explicitly provided)
      const baseSlug = generateSlug(title);
      updateData.slug = await ensureUniqueSlug(baseSlug, id);
    }

    const updated = await db.article.update({
      where: { id },
      data: updateData,
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    });

    // Log activity
    await logActivity(payload.userId, "update_article", `Updated article: ${article.title}`);

    return NextResponse.json({ article: updated, message: "Article updated successfully" });
  } catch (error: unknown) {
    return handleApiError(error, "Update article error");
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

    const article = await db.article.findUnique({ where: { id } });
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    await db.article.delete({ where: { id } });

    // Log activity
    await logActivity(payload.userId, "delete_article", `Deleted article: ${article.title}`);

    return NextResponse.json({ message: "Article deleted successfully" });
  } catch (error: unknown) {
    return handleApiError(error, "Delete article error");
  }
}
