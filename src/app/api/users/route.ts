// ─── Nauka CMS — Users API Route (List + Create) ───

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/core/lib/db";
import { requireAuth, hashPassword, logActivity } from "@/core/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const sortField = searchParams.get("sortField") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { email: { contains: search } },
      ];
    }
    if (status && status !== "all") {
      where.status = status;
    }

    // Build order by
    const orderBy: Record<string, string> = {};
    orderBy[sortField] = sortOrder;

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        select: {
          id: true,
          fullName: true,
          email: true,
          avatar: true,
          status: true,
          lastLogin: true,
          createdAt: true,
          userRoles: {
            include: {
              role: {
                select: { id: true, name: true, slug: true },
              },
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      db.user.count({ where }),
    ]);

    // Format users
    const formatted = users.map((u) => ({
      id: u.id,
      fullName: u.fullName,
      email: u.email,
      avatar: u.avatar,
      status: u.status,
      lastLogin: u.lastLogin,
      createdAt: u.createdAt,
      roles: u.userRoles.map((ur) => ur.role),
      primaryRole: u.userRoles[0]?.role.slug || "viewer",
    }));

    return NextResponse.json({
      users: formatted,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    if (msg === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Users list error:", error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await requireAuth();

    const body = await request.json();
    const { fullName, email, password, roleId, status } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: "Full name, email, and password are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // Check for duplicate email
    const existing = await db.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existing) {
      return NextResponse.json({ error: "A user with this email already exists" }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await db.user.create({
      data: {
        fullName,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        status: status || "active",
      },
    });

    // Assign role if provided
    if (roleId) {
      await db.userRole.create({
        data: { userId: user.id, roleId },
      });
    }

    // Log activity
    await logActivity(payload.userId, "create_user", `Created user: ${email}`);

    return NextResponse.json({ message: "User created successfully", userId: user.id }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    if (msg === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Create user error:", error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
