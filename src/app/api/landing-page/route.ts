// ─── Jakarta Laptops — Landing Page Content API ───
// GET /api/landing-page (public) — return LP content (with defaults fallback)
// PUT /api/landing-page (auth) — update LP content
//
// Cache strategy: no-store (admin bisa edit real-time)

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import {
  DEFAULT_LP_CONTENT,
  type LandingPageData,
} from "@/lib/landing-page-data";

// Force dynamic — disable static + edge caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
  Expires: "0",
};

// ─── Helper: parse JSON field ───
function parseJsonField<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return (parsed.length > 0 ? parsed : fallback) as T;
    }
    return (parsed || fallback) as T;
  } catch {
    return fallback;
  }
}

/** GET /api/landing-page — public, return content dengan fallback ke defaults */
export async function GET() {
  try {
    const content = await db.landingPageContent.findUnique({
      where: { id: "default" },
    });

    if (!content) {
      return NextResponse.json(
        DEFAULT_LP_CONTENT,
        { headers: NO_CACHE_HEADERS }
      );
    }

    const data: LandingPageData = {
      heroEyebrow: content.heroEyebrow || DEFAULT_LP_CONTENT.heroEyebrow,
      heroTitle: content.heroTitle || DEFAULT_LP_CONTENT.heroTitle,
      heroSubtitle: content.heroSubtitle || DEFAULT_LP_CONTENT.heroSubtitle,
      heroPrimaryCta: content.heroPrimaryCta || DEFAULT_LP_CONTENT.heroPrimaryCta,
      heroSecondaryCta: content.heroSecondaryCta || DEFAULT_LP_CONTENT.heroSecondaryCta,
      heroTrustBadges: parseJsonField(content.heroTrustBadges, DEFAULT_LP_CONTENT.heroTrustBadges),

      valuePillars: parseJsonField(content.valuePillars, DEFAULT_LP_CONTENT.valuePillars),
      processSteps: parseJsonField(content.processSteps, DEFAULT_LP_CONTENT.processSteps),

      estimasiTitle: content.estimasiTitle || DEFAULT_LP_CONTENT.estimasiTitle,
      estimasiSubtitle: content.estimasiSubtitle || DEFAULT_LP_CONTENT.estimasiSubtitle,
      estimasiCtaLabel: content.estimasiCtaLabel || DEFAULT_LP_CONTENT.estimasiCtaLabel,

      faqs: parseJsonField(content.faqs, DEFAULT_LP_CONTENT.faqs),

      trustStats: parseJsonField(content.trustStats, DEFAULT_LP_CONTENT.trustStats),
      trustTitle: content.trustTitle || DEFAULT_LP_CONTENT.trustTitle,
      trustSubtitle: content.trustSubtitle || DEFAULT_LP_CONTENT.trustSubtitle,

      finalCtaTitle: content.finalCtaTitle || DEFAULT_LP_CONTENT.finalCtaTitle,
      finalCtaSubtitle: content.finalCtaSubtitle || DEFAULT_LP_CONTENT.finalCtaSubtitle,
      finalCtaPrimary: content.finalCtaPrimary || DEFAULT_LP_CONTENT.finalCtaPrimary,
      finalCtaSecondary: content.finalCtaSecondary || DEFAULT_LP_CONTENT.finalCtaSecondary,

      metaTitle: content.metaTitle || DEFAULT_LP_CONTENT.metaTitle,
      metaDescription: content.metaDescription || DEFAULT_LP_CONTENT.metaDescription,
      ogTitle: content.ogTitle || DEFAULT_LP_CONTENT.ogTitle,
      ogDescription: content.ogDescription || DEFAULT_LP_CONTENT.ogDescription,
    };

    return NextResponse.json(data, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error("[/api/landing-page] GET error:", error);
    return NextResponse.json(
      DEFAULT_LP_CONTENT,
      { status: 200, headers: NO_CACHE_HEADERS }
    );
  }
}

/** PUT /api/landing-page — auth required, update content */
export async function PUT(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();

    // Validate required fields
    if (!body.heroTitle) {
      return NextResponse.json(
        { error: "heroTitle wajib diisi" },
        { status: 400 }
      );
    }

    // Serialize JSON array fields
    const data = {
      id: "default",
      heroEyebrow: body.heroEyebrow || DEFAULT_LP_CONTENT.heroEyebrow,
      heroTitle: body.heroTitle,
      heroSubtitle: body.heroSubtitle || DEFAULT_LP_CONTENT.heroSubtitle,
      heroPrimaryCta: body.heroPrimaryCta || DEFAULT_LP_CONTENT.heroPrimaryCta,
      heroSecondaryCta: body.heroSecondaryCta || DEFAULT_LP_CONTENT.heroSecondaryCta,
      heroTrustBadges: JSON.stringify(body.heroTrustBadges || []),

      valuePillars: JSON.stringify(body.valuePillars || []),
      processSteps: JSON.stringify(body.processSteps || []),

      estimasiTitle: body.estimasiTitle || DEFAULT_LP_CONTENT.estimasiTitle,
      estimasiSubtitle: body.estimasiSubtitle || DEFAULT_LP_CONTENT.estimasiSubtitle,
      estimasiCtaLabel: body.estimasiCtaLabel || DEFAULT_LP_CONTENT.estimasiCtaLabel,

      faqs: JSON.stringify(body.faqs || []),

      trustStats: JSON.stringify(body.trustStats || []),
      trustTitle: body.trustTitle || DEFAULT_LP_CONTENT.trustTitle,
      trustSubtitle: body.trustSubtitle || DEFAULT_LP_CONTENT.trustSubtitle,

      finalCtaTitle: body.finalCtaTitle || DEFAULT_LP_CONTENT.finalCtaTitle,
      finalCtaSubtitle: body.finalCtaSubtitle || DEFAULT_LP_CONTENT.finalCtaSubtitle,
      finalCtaPrimary: body.finalCtaPrimary || DEFAULT_LP_CONTENT.finalCtaPrimary,
      finalCtaSecondary: body.finalCtaSecondary || DEFAULT_LP_CONTENT.finalCtaSecondary,

      metaTitle: body.metaTitle || DEFAULT_LP_CONTENT.metaTitle,
      metaDescription: body.metaDescription || DEFAULT_LP_CONTENT.metaDescription,
      ogTitle: body.ogTitle || DEFAULT_LP_CONTENT.ogTitle,
      ogDescription: body.ogDescription || DEFAULT_LP_CONTENT.ogDescription,
    };

    // Upsert (create or update singleton)
    const updated = await db.landingPageContent.upsert({
      where: { id: "default" },
      update: data,
      create: data,
    });

    // Invalidate parent landing page ISR cache
    revalidatePath("/jual-laptop-bekas-jakarta");

    return NextResponse.json({
      message: "Landing page content updated",
      content: {
        ...updated,
        heroTrustBadges: parseJsonField(updated.heroTrustBadges, []),
        valuePillars: parseJsonField(updated.valuePillars, []),
        processSteps: parseJsonField(updated.processSteps, []),
        faqs: parseJsonField(updated.faqs, []),
        trustStats: parseJsonField(updated.trustStats, []),
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[/api/landing-page] PUT error:", error);
    return NextResponse.json(
      { error: "Gagal update landing page content" },
      { status: 500 }
    );
  }
}
