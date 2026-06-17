// ─── Nauka CMS — Role Detail API Route (GET, PUT, DELETE) ───

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/core/lib/db";
import { requireAuth, logActivity } from "@/core/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;

    const role = await db.role.findUnique({
      where: { id },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
        _count: {
          select: { userRoles: true },
        },
      },
    });

    if (!role) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    const formatted = {
      id: role.id,
      name: role.name,
      slug: role.slug,
      description: role.description,
      isDefault: role.isDefault,
      userCount: role._count.userRoles,
      permissions: role.rolePermissions.map((rp) => ({
        id: rp.permission.id,
        name: rp.permission.name,
        category: rp.permission.category,
        action: rp.permission.action,
        label: rp.permission.label,
      })),
      permissionIds: role.rolePermissions.map((rp) => rp.permissionId),
    };

    return NextResponse.json({ role: formatted });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    if (msg === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get role error:", error);
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
    const { name, description, permissionIds } = body;

    const role = await db.role.findUnique({ where: { id } });
    if (!role) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    // Update role info
    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    await db.role.update({ where: { id }, data: updateData });

    // Update permissions if provided
    if (permissionIds !== undefined) {
      // Delete existing permissions
      await db.rolePermission.deleteMany({ where: { roleId: id } });

      // Assign new permissions
      if (Array.isArray(permissionIds) && permissionIds.length > 0) {
        await db.rolePermission.createMany({
          data: permissionIds.map((permissionId: string) => ({
            roleId: id,
            permissionId,
          })),
        });
      }
    }

    // Log activity
    await logActivity(payload.userId, "update_role", `Updated role: ${role.name}`);

    return NextResponse.json({ message: "Role updated successfully" });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    if (msg === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Update role error:", error);
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

    const role = await db.role.findUnique({ where: { id } });
    if (!role) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    // Prevent deletion of default roles
    if (role.isDefault) {
      return NextResponse.json({ error: "Cannot delete default roles" }, { status: 400 });
    }

    await db.role.delete({ where: { id } });

    // Log activity
    await logActivity(payload.userId, "delete_role", `Deleted role: ${role.name}`);

    return NextResponse.json({ message: "Role deleted successfully" });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    if (msg === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Delete role error:", error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
