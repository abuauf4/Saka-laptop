// ─── Nauka CMS — Roles API Route (List + Create) ───

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/core/lib/db";
import { requireAuth, logActivity } from "@/core/lib/auth";

export async function GET() {
  try {
    await requireAuth();

    const roles = await db.role.findMany({
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
      orderBy: { createdAt: "asc" },
    });

    const formatted = roles.map((role) => ({
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
    }));

    return NextResponse.json({ roles: formatted });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    if (msg === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Roles list error:", error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await requireAuth();

    const body = await request.json();
    const { name, description, permissionIds } = body;

    if (!name) {
      return NextResponse.json({ error: "Role name is required" }, { status: 400 });
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

    // Check for duplicate slug
    const existing = await db.role.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "A role with this name already exists" }, { status: 409 });
    }

    // Create role
    const role = await db.role.create({
      data: {
        name,
        slug,
        description: description || null,
        isDefault: false,
      },
    });

    // Assign permissions
    if (permissionIds && Array.isArray(permissionIds) && permissionIds.length > 0) {
      await db.rolePermission.createMany({
        data: permissionIds.map((permissionId: string) => ({
          roleId: role.id,
          permissionId,
        })),
      });
    }

    // Log activity
    await logActivity(payload.userId, "create_role", `Created role: ${name}`);

    return NextResponse.json({ message: "Role created successfully", roleId: role.id }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    if (msg === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Create role error:", error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
