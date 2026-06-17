// ─── Nauka CMS — Current User API Route ───

import { NextResponse } from "next/server";
import { getAuthFromRequest, getUserWithPermissions } from "@/core/lib/auth";

export async function GET() {
  try {
    const payload = await getAuthFromRequest();
    if (!payload) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await getUserWithPermissions(payload.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.status === "inactive") {
      return NextResponse.json({ error: "Account deactivated" }, { status: 403 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Me error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
