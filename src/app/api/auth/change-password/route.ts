// ─── Nauka CMS — Change Password API Route ───

import { NextRequest, NextResponse } from "next/server";
import { requireAuth, verifyPassword, hashPassword, logActivity } from "@/core/lib/auth";
import { db } from "@/core/lib/db";

export async function POST(request: NextRequest) {
  try {
    const payload = await requireAuth();
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current password and new password are required" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 });
    }

    // Get current user
    const user = await db.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify current password
    const isValid = await verifyPassword(currentPassword, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }

    // Hash and update
    const hashedPassword = await hashPassword(newPassword);
    await db.user.update({
      where: { id: payload.userId },
      data: { password: hashedPassword },
    });

    // Log activity
    await logActivity(payload.userId, "change_password", "Password changed");

    return NextResponse.json({ message: "Password changed successfully" });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    if (msg === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Change password error:", error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
