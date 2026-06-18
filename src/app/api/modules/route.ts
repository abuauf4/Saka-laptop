import { NextResponse } from "next/server";
import { listModules } from "@/core/lib/module-registry";
import { requireSuperAdmin } from "@/core/lib/auth";

export async function GET() {
  try {
    await requireSuperAdmin();
    const modules = await listModules();
    return NextResponse.json({ modules });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    if (msg === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (msg.startsWith("Forbidden:")) return NextResponse.json({ error: msg }, { status: 403 });
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
