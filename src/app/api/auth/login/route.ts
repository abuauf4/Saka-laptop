// ─── Nauka CMS — Login API Route ───

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/core/lib/db";
import { verifyPassword, signToken, getUserWithPermissions, logActivity, COOKIE_NAME } from "@/core/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Find user by email
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

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

    // Get user with permissions
    const userWithPerms = await getUserWithPermissions(user.id);
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

    // Update last login
    await db.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Log activity
    await logActivity(user.id, "login", "User logged in");

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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
