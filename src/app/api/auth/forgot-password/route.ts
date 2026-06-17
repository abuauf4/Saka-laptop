// ─── Nauka CMS — Forgot Password API Route ───

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/core/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user exists
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // V1: Simple implementation — always return success to prevent email enumeration
    // In a production system, you would send a reset email with a token
    if (user) {
      // Generate a simple reset token (V1: just log it)
      const crypto = await import("crypto");
      const resetToken = crypto.randomUUID();
      console.log(`[Nauka CMS] Password reset requested for ${email}. Token: ${resetToken}`);
    }

    return NextResponse.json({
      message: "If an account with that email exists, we've sent a password reset link.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
