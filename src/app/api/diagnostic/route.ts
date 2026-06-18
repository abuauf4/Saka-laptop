// ─── Diagnostic Endpoint ───
// Cek status koneksi DB, Prisma client, dan env vars.
// Diproteksi SETUP_KEY (same as /api/setup/init).

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/core/lib/db";

export async function GET(request: NextRequest) {
  const setupKey = process.env.SETUP_KEY;
  if (!setupKey) {
    return NextResponse.json(
      { error: "SETUP_KEY env var not set" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const providedKey = searchParams.get("key");
  if (providedKey !== setupKey) {
    return NextResponse.json({ error: "Invalid setup key" }, { status: 401 });
  }

  // Mask DATABASE_URL (show structure tanpa reveal password)
  const dbUrl = process.env.DATABASE_URL || "";
  let maskedUrl = "NOT SET";
  if (dbUrl) {
    try {
      const u = new URL(dbUrl);
      maskedUrl = `${u.protocol}//${u.username}:***@${u.hostname}:${u.port}${u.pathname}${u.search}`;
    } catch {
      maskedUrl = "INVALID URL FORMAT";
    }
  }

  const diagnostics: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env: {
      DATABASE_URL_set: !!dbUrl,
      DATABASE_URL_masked: maskedUrl,
      DATABASE_URL_uses_pgbouncer: dbUrl.includes("pgBouncer=true"),
      DATABASE_URL_connection_limit_1: dbUrl.includes("connection_limit=1"),
      DATABASE_URL_pool_timeout: dbUrl.includes("pool_timeout"),
      DATABASE_URL_port: maskedUrl.match(/:(\d+)/)?.[1] || "unknown",
      DATABASE_URL_is_pooler: dbUrl.includes("pooler.supabase.com"),
      JWT_SECRET_set: !!process.env.JWT_SECRET,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: !!process.env.VERCEL,
      VERCEL_REGION: process.env.VERCEL_REGION || "local",
    },
  };

  // Test DB connection (3 retries)
  const retries = 3;
  let lastError: unknown = null;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const start = Date.now();
      // Simple count query — test pool
      const userCount = await db.user.count();
      const roleCount = await db.role.count();
      const permCount = await db.permission.count();
      const moduleCount = await db.coreModule.count();
      const elapsed = Date.now() - start;

      diagnostics.db = {
        status: "connected",
        attempt,
        elapsedMs: elapsed,
        counts: {
          users: userCount,
          roles: roleCount,
          permissions: permCount,
          coreModules: moduleCount,
        },
      };
      lastError = null;
      break; // success
    } catch (err) {
      lastError = err;
      diagnostics.db = {
        status: "error",
        attempt,
        error: err instanceof Error ? err.message : "Unknown error",
      };
      // Wait 500ms before retry
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 500));
      }
    }
  }

  if (lastError) {
    diagnostics.db = {
      ...(diagnostics.db as object),
      status: "FAILED after 3 retries",
      hint:
        "If error mentions 'max clients' or 'pool_size', update DATABASE_URL to use pgBouncer with connection_limit=1&pool_timeout=60",
    };
  }

  // Diagnosis summary
  const issues: string[] = [];
  if (!diagnostics.env.DATABASE_URL_set) issues.push("DATABASE_URL not set");
  if (!diagnostics.env.DATABASE_URL_uses_pgbouncer)
    issues.push("DATABASE_URL missing ?pgBouncer=true — REQUIRED for Supabase pooler");
  if (!diagnostics.env.DATABASE_URL_connection_limit_1)
    issues.push("DATABASE_URL missing ?connection_limit=1 — REQUIRED for Vercel serverless");
  if (diagnostics.env.DATABASE_URL_port === "5432")
    issues.push("DATABASE_URL uses port 5432 (direct) — should be 6543 (pgBouncer/Supavisor)");
  if (!diagnostics.env.DATABASE_URL_is_pooler)
    issues.push("DATABASE_URL not using pooler hostname (*.pooler.supabase.com)");
  if (!diagnostics.env.JWT_SECRET_set) issues.push("JWT_SECRET not set");
  if (lastError) issues.push("DB connection failed — see db.error");

  diagnostics.issues = issues;
  diagnostics.verdict =
    issues.length === 0
      ? "✅ All checks passed — connection should work"
      : `❌ ${issues.length} issue(s) found — fix them`;

  return NextResponse.json(diagnostics, {
    status: lastError ? 500 : 200,
  });
}
