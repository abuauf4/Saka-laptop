import { getAuthFromRequest } from "@/lib/auth-server";
import { NextResponse } from "next/server";

// GET /api/auth/me
export async function GET() {
  try {
    const result = await getAuthFromRequest();
    if (!result.success || !result.user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }
    return NextResponse.json({ user: result.user });
  } catch (error) {
    console.error("Get me error:", error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
