import { NextRequest, NextResponse } from "next/server";
import { activateModule } from "@/core/lib/module-registry";
import { requireSuperAdmin } from "@/core/lib/auth";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await requireSuperAdmin();
    const { slug } = await params;
    const mod = await activateModule(slug);
    return NextResponse.json({ module: mod });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    if (msg === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (msg.startsWith("Forbidden:")) return NextResponse.json({ error: msg }, { status: 403 });
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
