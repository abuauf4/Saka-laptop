/**
 * Shim: re-exports dari @/core/lib/auth untuk backward compatibility.
 * Semua kode Saka lama yang import dari "@/lib/auth-server" akan tetap jalan.
 *
 * Note: PERMISSION_KEYS lama (Saka format: "dashboard", "laptop_masuk", etc)
 * sudah gak relevant di RBAC baru. Gunakan PERMISSION_KEY_STRINGS dari
 * @/core/config/core-permissions untuk semua permission keys.
 *
 * Note: auth-server lama pake "developer" role, sistem baru pake "super_admin".
 * requireDeveloper() sekarang alias untuk requireSuperAdmin().
 */

export {
  hashPassword,
  verifyPassword,
  signToken,
  verifyToken,
  getAuthFromRequest,
  requireAuth,
  requireSuperAdmin,
  requireRole,
  requirePermission,
  getUserWithPermissions,
  logActivity,
  COOKIE_NAME,
  type JwtPayload,
} from "@/core/lib/auth";

import { requireSuperAdmin } from "@/core/lib/auth";

/** Saka compat: requireDeveloper = requireSuperAdmin di sistem baru */
export async function requireDeveloper() {
  return requireSuperAdmin();
}

/** Saka compat: setAuthCookie (tidak dipakai lagi — cookie di-set di API login) */
export async function setAuthCookie(_token: string) {
  // no-op — cookie di-handle di /api/auth/login
  console.warn("setAuthCookie is deprecated, cookie set by /api/auth/login");
}

/** Saka compat: clearAuthCookie (tidak dipakai lagi) */
export async function clearAuthCookie() {
  // no-op
  console.warn("clearAuthCookie is deprecated, cookie cleared by /api/auth/logout");
}

/** Saka compat: PERMISSION_KEYS (string array) */
import { PERMISSION_KEY_STRINGS } from "@/core/config/core-permissions";
export const PERMISSION_KEYS = PERMISSION_KEY_STRINGS;

/** Saka compat: PermissionKey type */
export type PermissionKey = string;

/** Saka compat: UserRole type */
export type UserRole = string;

/** Saka compat: AuthResult type */
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
