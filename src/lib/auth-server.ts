import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { db } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "saka_laptop_secret_2026";
const COOKIE_NAME = "saka_auth_token";

/* ── Types ── */
export type UserRole = "developer" | "admin";

export const PERMISSION_KEYS = [
  "dashboard",
  "produk",
  "testimoni",
  "kasir",
  "transaksi",
  "profil",
] as const;

export type PermissionKey = (typeof PERMISSION_KEYS)[number];

export interface JwtPayload {
  userId: string;
  username: string;
  role: UserRole;
  permissions: PermissionKey[];
}

export interface AuthResult {
  success: boolean;
  user?: {
    id: string;
    username: string;
    role: UserRole;
    permissions: PermissionKey[];
    createdAt: string;
  };
  error?: string;
}

/* ── Password hashing ── */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/* ── JWT ── */
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

/* ── Cookie helpers ── */
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAuthFromRequest(): Promise<AuthResult> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      return { success: false, error: "No token" };
    }

    const payload = verifyToken(token);
    if (!payload) {
      return { success: false, error: "Invalid token" };
    }

    // Verify user still exists in DB
    const user = await db.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      return { success: false, error: "User not found" };
    }

    const permissions = JSON.parse(user.permissions) as PermissionKey[];

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role as UserRole,
        permissions: user.role === "developer" ? [...PERMISSION_KEYS] : permissions,
        createdAt: user.createdAt.toISOString(),
      },
    };
  } catch {
    return { success: false, error: "Auth error" };
  }
}

/* ── Permission check ── */
export function hasPermission(user: { role: UserRole; permissions: PermissionKey[] }, key: PermissionKey): boolean {
  if (user.role === "developer") return true;
  return user.permissions.includes(key);
}

/* ── Require auth helper (throws if not authenticated) ── */
export async function requireAuth(): Promise<NonNullable<AuthResult["user"]>> {
  const result = await getAuthFromRequest();
  if (!result.success || !result.user) {
    throw new Error("Unauthorized");
  }
  return result.user;
}

/* ── Require developer role ── */
export async function requireDeveloper(): Promise<NonNullable<AuthResult["user"]>> {
  const user = await requireAuth();
  if (user.role !== "developer") {
    throw new Error("Forbidden: developer only");
  }
  return user;
}
