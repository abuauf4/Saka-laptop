import { db } from "@/lib/prisma";
import { verifyPassword, signToken, setAuthCookie, PERMISSION_KEYS, type UserRole, type PermissionKey } from "@/lib/auth-server";
import { NextRequest, NextResponse } from "next/server";

// POST /api/auth/login
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username dan password wajib diisi" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({ error: "Username tidak ditemukan" }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Password salah" }, { status: 401 });
    }

    const permissions = user.role === "developer"
      ? [...PERMISSION_KEYS]
      : (JSON.parse(user.permissions) as PermissionKey[]);

    const token = signToken({
      userId: user.id,
      username: user.username,
      role: user.role as UserRole,
      permissions,
    });

    await setAuthCookie(token);

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        permissions,
        createdAt: user.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login gagal" }, { status: 500 });
  }
}
