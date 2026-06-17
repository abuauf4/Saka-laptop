// ─── Nauka CMS — User Detail API Route (GET, PUT, DELETE) ───

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/core/lib/db";
import { requireAuth, hashPassword, logActivity } from "@/core/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;

    const user = await db.user.findUnique({
      where: { id },
      include: {
        userRoles: {
          include: {
            role: {
              select: { id: true, name: true, slug: true },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const formatted = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
      status: user.status,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roles: user.userRoles.map((ur) => ur.role),
      roleIds: user.userRoles.map((ur) => ur.roleId),
      primaryRole: user.userRoles[0]?.role.slug || "viewer",
    };

    return NextResponse.json({ user: formatted });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    if (msg === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get user error:", error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await requireAuth();
    const { id } = await params;

    const body = await request.json();
    const { fullName, email, password, roleId, status } = body;

    const user = await db.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Build update data
    const updateData: Record<string, unknown> = {};
    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email.toLowerCase().trim();
    if (status) updateData.status = status;
    if (password) {
      if (password.length < 6) {
        return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
      }
      updateData.password = await hashPassword(password);
    }

    // Update user
    await db.user.update({ where: { id }, data: updateData });

    // Update role if provided
    if (roleId !== undefined) {
      // Delete existing roles
      await db.userRole.deleteMany({ where: { userId: id } });
      // Assign new role
      if (roleId) {
        await db.userRole.create({
          data: { userId: id, roleId },
        });
      }
    }

    // Log activity
    await logActivity(payload.userId, "update_user", `Updated user: ${user.email}`);

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    if (msg === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Update user error:", error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await requireAuth();
    const { id } = await params;

    const user = await db.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent self-deletion
    if (id === payload.userId) {
      return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
    }

    await db.user.delete({ where: { id } });

    // Log activity
    await logActivity(payload.userId, "delete_user", `Deleted user: ${user.email}`);

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    if (msg === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Delete user error:", error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
