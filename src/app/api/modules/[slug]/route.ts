import { NextRequest, NextResponse } from "next/server";
import { getModule, updateModuleConfig } from "@/core/lib/module-registry";
import { requireSuperAdmin } from "@/core/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await requireSuperAdmin();
    const { slug } = await params;
    const mod = await getModule(slug);
    if (!mod) return NextResponse.json({ error: "Module not found" }, { status: 404 });
    return NextResponse.json({ module: mod });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    if (msg === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (msg.startsWith("Forbidden:")) return NextResponse.json({ error: msg }, { status: 403 });
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await requireSuperAdmin();
    const { slug } = await params;
    const { config } = await request.json();
    const mod = await updateModuleConfig(slug, config);
    return NextResponse.json({ module: mod });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    if (msg === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (msg.startsWith("Forbidden:")) return NextResponse.json({ error: msg }, { status: 403 });
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
