import { db } from "@/lib/prisma";
import { requireDeveloper } from "@/lib/auth-server";
import { NextRequest, NextResponse } from "next/server";

// DELETE /api/auth/users/[id] - Delete user (developer only)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await requireDeveloper();
    const { id } = await params;

    const target = await db.user.findUnique({ where: { id } });
    if (!target) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    if (target.role === "developer") {
      return NextResponse.json({ error: "Developer tidak bisa dihapus" }, { status: 400 });
    }

    if (target.id === currentUser.id) {
      return NextResponse.json({ error: "Tidak bisa menghapus akun sendiri" }, { status: 400 });
    }

    await db.user.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && (error.message === "Unauthorized" || error.message === "Forbidden: developer only")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
