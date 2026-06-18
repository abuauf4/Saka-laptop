// ─── Nauka CMS — Login API Route (with retry logic) ───

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/core/lib/db";
import { verifyPassword, signToken, getUserWithPermissions, logActivity, COOKIE_NAME } from "@/core/lib/auth";

// Retry helper untuk handle pool exhaustion
async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delayMs = 300
): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const msg = err instanceof Error ? err.message : "";
      // Retry kalau pool exhausted atau connection error
      if (
        msg.includes("max clients") ||
        msg.includes("pool_size") ||
        msg.includes("EMAXCONNSESSION") ||
        msg.includes("Connection terminated") ||
        msg.includes("Can't reach database server")
      ) {
        if (i < retries - 1) {
          await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
          continue;
        }
      }
      throw err;
    }
  }
  throw lastError;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Find user by email (with retry)
    const user = await withRetry(() =>
      db.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      })
    );

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Check status
    if (user.status === "inactive") {
      return NextResponse.json({ error: "Your account has been deactivated. Contact an administrator." }, { status: 403 });
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Get user with permissions (with retry)
    const userWithPerms = await withRetry(() => getUserWithPermissions(user.id));
    if (!userWithPerms) {
      return NextResponse.json({ error: "User data not found" }, { status: 500 });
    }

    // Sign JWT
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: userWithPerms.primaryRole,
      permissions: userWithPerms.isSuperAdmin ? [] : userWithPerms.permissions,
    });

    // Update last login (with retry, non-blocking kalau gagal)
    try {
      await withRetry(() =>
        db.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        })
      );
    } catch (err) {
      console.warn("Failed to update lastLogin (non-critical):", err);
    }

    // Log activity (with retry, non-blocking kalau gagal)
    try {
      await withRetry(() => logActivity(user.id, "login", "User logged in"));
    } catch (err) {
      console.warn("Failed to log activity (non-critical):", err);
    }

    // Build response
    const response = NextResponse.json({
      message: "Login successful",
      user: userWithPerms,
    });

    // Set cookie
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    // Return detail buat debugging
    return NextResponse.json(
      {
        error: "Internal server error",
        detail: msg,
        hint:
          msg.includes("max clients") || msg.includes("pool_size")
            ? "Database pool exhausted. Check DATABASE_URL uses ?pgBouncer=true&connection_limit=1&pool_timeout=60. Visit /api/diagnostic?key=SETUP_KEY for full diagnostic."
            : undefined,
      },
      { status: 500 }
    );
  }
}
