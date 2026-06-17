// ─── Nauka CMS — Articles API Route (List + Create) ───

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

// Seed default categories if they don't exist
async function seedDefaultCategories() {
  const defaults = [
    { name: "News", slug: "news" },
    { name: "Tips", slug: "tips" },
    { name: "Promo", slug: "promo" },
    { name: "Articles", slug: "articles" },
  ];
  for (const cat of defaults) {
    await db.articleCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    await requireModuleActive("cms");

    // Seed default categories on first access
    await seedDefaultCategories();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const categoryId = searchParams.get("categoryId") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { slug: { contains: search } },
      ];
    }
    if (status && status !== "all") {
      where.status = status;
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [articles, total] = await Promise.all([
      db.article.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.article.count({ where }),
    ]);

    // Get author info for articles that have authorId
    const authorIds = articles.map((a) => a.authorId).filter(Boolean) as string[];
    const authors = authorIds.length > 0
      ? await db.user.findMany({
          where: { id: { in: authorIds } },
          select: { id: true, fullName: true },
        })
      : [];

    const authorMap = new Map(authors.map((a) => [a.id, a.fullName]));

    const formatted = articles.map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt,
      coverImage: a.coverImage,
      status: a.status,
      metaTitle: a.metaTitle,
      metaDesc: a.metaDesc,
      ogImage: a.ogImage,
      authorId: a.authorId,
      authorName: a.authorId ? authorMap.get(a.authorId) || "Unknown" : null,
      categoryId: a.categoryId,
      category: a.category,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
    }));

    return NextResponse.json({
      articles: formatted,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: unknown) {
    return handleApiError(error, "Articles list error");
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await requireAuth();
    await requireModuleActive("cms");

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

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Generate slug
    const baseSlug = slug && slug.trim() ? generateSlug(slug) : generateSlug(title);
    const uniqueSlug = await ensureUniqueSlug(baseSlug);

    const article = await db.article.create({
      data: {
        title,
        slug: uniqueSlug,
        excerpt: excerpt || null,
        content: content || null,
        coverImage: coverImage || null,
        status: status || "draft",
        metaTitle: metaTitle || null,
        metaDesc: metaDesc || null,
        ogImage: ogImage || null,
        authorId: authorId || payload.userId,
        categoryId: categoryId || null,
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    });

    // Log activity
    await logActivity(payload.userId, "create_article", `Created article: ${title}`);

    return NextResponse.json({ article, message: "Article created successfully" }, { status: 201 });
  } catch (error: unknown) {
    return handleApiError(error, "Create article error");
  }
}
