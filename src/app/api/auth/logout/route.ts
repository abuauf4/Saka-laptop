import { clearAuthCookie } from "@/lib/auth-server";
import { NextResponse } from "next/server";

// POST /api/auth/logout
export async function POST() {
  try {
    await clearAuthCookie();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Logout gagal" }, { status: 500 });
  }
}
