// ─── Nauka CMS — Server-side Auth Utilities ───

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { db } from "@/core/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "saka_laptop_bekas_dev_secret_2026";
export const COOKIE_NAME = "saka_auth_token";

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  permissions: string[];
}

// ─── Password Utilities ───

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ─── JWT Utilities ───

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

// ─── Auth from Request ───

export async function getAuthFromRequest(): Promise<JwtPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

// ─── Auth Guards (for API routes) ───

export async function requireAuth(): Promise<JwtPayload> {
  const payload = await getAuthFromRequest();
  if (!payload) {
    throw new Error("Unauthorized");
  }
  return payload;
}

export async function requireSuperAdmin(): Promise<JwtPayload> {
  const payload = await requireAuth();
  if (payload.role !== "super_admin") {
    throw new Error("Forbidden: Super Admin access required");
  }
  return payload;
}

export async function requireRole(allowedRoles: string[]): Promise<JwtPayload> {
  const payload = await requireAuth();
  if (!allowedRoles.includes(payload.role)) {
    throw new Error("Forbidden: Insufficient role");
  }
  return payload;
}

export async function requirePermission(permissionKey: string): Promise<JwtPayload> {
  const payload = await requireAuth();
  if (payload.role === "super_admin") return payload; // super_admin bypasses
  if (!payload.permissions.includes(permissionKey)) {
    const error = new Error(`Forbidden: Missing permission "${permissionKey}"`);
    (error as any).code = "FORBIDDEN_PERMISSION";
    throw error;
  }
  return payload;
}

// ─── Helper: Get user with roles & permissions ───

export async function getUserWithPermissions(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: {
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) return null;

  const roles = user.userRoles.map((ur) => ur.role);
  const primaryRole = roles[0]?.slug || "viewer";
  const isSuperAdmin = roles.some((r) => r.slug === "super_admin");

  // Collect all unique permission keys
  const permissionSet = new Set<string>();
  for (const ur of user.userRoles) {
    for (const rp of ur.role.rolePermissions) {
      permissionSet.add(rp.permission.name);
    }
  }

  // Super admin gets all permissions implicitly
  const permissions = Array.from(permissionSet);

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    avatar: user.avatar,
    status: user.status,
    lastLogin: user.lastLogin,
    roles: roles.map((r) => ({ id: r.id, name: r.name, slug: r.slug })),
    primaryRole,
    isSuperAdmin,
    permissions,
  };
}

// ─── Helper: Log Activity ───

export async function logActivity(userId: string, action: string, details?: string) {
  try {
    await db.activity.create({
      data: { userId, action, details: details || null },
    });
  } catch {
    // Silently fail — activity logging is non-critical
  }
}
