import { db } from "@/lib/prisma";
import { requireDeveloper, hashPassword, PERMISSION_KEYS, type PermissionKey, type UserRole } from "@/lib/auth-server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/auth/users - List users (developer only)
export async function GET() {
  try {
    await requireDeveloper();

    const users = await db.user.findMany({
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      users: users.map((u) => ({
        id: u.id,
        username: u.username,
        role: u.role,
        permissions: u.role === "developer" ? [...PERMISSION_KEYS] : (JSON.parse(u.permissions) as PermissionKey[]),
        createdAt: u.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    if (error instanceof Error && (error.message === "Unauthorized" || error.message === "Forbidden: developer only")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("List users error:", error);
    return NextResponse.json({ error: "Failed to list users" }, { status: 500 });
  }
}

// POST /api/auth/users - Create user (developer only)
export async function POST(request: NextRequest) {
  try {
    await requireDeveloper();

    const { username, password, role, permissions } = await request.json();

    if (!username?.trim() || !password?.trim()) {
      return NextResponse.json({ error: "Username dan password wajib diisi" }, { status: 400 });
    }

    if (username.trim().length < 3) {
      return NextResponse.json({ error: "Username minimal 3 karakter" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password minimal 6 karakter" }, { status: 400 });
    }

    const exists = await db.user.findUnique({ where: { username: username.trim() } });
    if (exists) {
      return NextResponse.json({ error: "Username sudah digunakan" }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const userRole = (role || "admin") as UserRole;
    const userPermissions = userRole === "developer" ? [...PERMISSION_KEYS] : (permissions || [...PERMISSION_KEYS]);

    const user = await db.user.create({
      data: {
        username: username.trim(),
        password: hashedPassword,
        role: userRole,
        permissions: JSON.stringify(userPermissions),
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        permissions: userPermissions,
        createdAt: user.createdAt.toISOString(),
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && (error.message === "Unauthorized" || error.message === "Forbidden: developer only")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Create user error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
