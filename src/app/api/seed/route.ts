import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/seed - Removed, use prisma seed script instead
export async function GET() {
  return NextResponse.json({ message: "Use bun run db:seed instead" });
}
