"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

/* ── TYPES ── */
export type UserRole = "developer" | "admin";

/* Permission keys — each maps to an admin menu */
export const PERMISSION_KEYS = [
  "dashboard",
  "produk",
  "testimoni",
  "kasir",
  "transaksi",
  "profil",
] as const;

export type PermissionKey = (typeof PERMISSION_KEYS)[number];

export const PERMISSION_LABELS: Record<PermissionKey, string> = {
  dashboard: "Dashboard",
  produk: "Produk",
  testimoni: "Testimoni",
  kasir: "Kasir",
  transaksi: "Transaksi",
  profil: "Profil Toko",
};

export interface AuthUser {
  id: string;
  username: string;
  role: UserRole;
  permissions: PermissionKey[];  // which menus this user can access (only for "admin" role)
  createdAt: string;
}

export interface AuthState {
  users: AuthUser[];
  currentUser: AuthUser | null;
  isLoaded: boolean;
}

/* ── CONTEXT ── */
interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  createUser: (username: string, password: string, role: UserRole, permissions: PermissionKey[]) => Promise<{ success: boolean; error?: string }>;
  deleteUser: (userId: string) => Promise<{ success: boolean; error?: string }>;
  changePassword: (userId: string, oldPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  isDeveloper: boolean;
  hasPermission: (key: PermissionKey) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  /* ── LOAD FROM API ON MOUNT ── */
  useEffect(() => {
    async function load() {
      try {
        // First check if we have an active session
        const meRes = await fetch("/api/auth/me");
        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData.user) {
            setCurrentUser(meData.user);

            // If developer, fetch users list
            if (meData.user.role === "developer") {
              const usersRes = await fetch("/api/auth/users");
              if (usersRes.ok) {
                const usersData = await usersRes.json();
                setUsers(usersData.users || []);
              }
            }
          }
        }
      } catch (err) {
        console.error("Failed to load auth state:", err);
      }
      setIsLoaded(true);
    }
    load();
  }, []);

  /* ── LOGIN ── */
  const login = useCallback(
    async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (res.ok) {
          setCurrentUser(data.user);

          // If developer, fetch users list
          if (data.user.role === "developer") {
            const usersRes = await fetch("/api/auth/users");
            if (usersRes.ok) {
              const usersData = await usersRes.json();
              setUsers(usersData.users || []);
            }
          }

          return { success: true };
        } else {
          return { success: false, error: data.error || "Login gagal" };
        }
      } catch {
        return { success: false, error: "Terjadi kesalahan jaringan" };
      }
    },
    []
  );

  /* ── LOGOUT ── */
  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore
    }
    setCurrentUser(null);
    setUsers([]);
  }, []);

  /* ── HAS PERMISSION ── */
  const hasPermission = useCallback(
    (key: PermissionKey): boolean => {
      if (!currentUser) return false;
      if (currentUser.role === "developer") return true;  // developer has all access
      return currentUser.permissions.includes(key);
    },
    [currentUser]
  );

  /* ── CREATE USER (developer only) ── */
  const createUser = useCallback(
    async (username: string, password: string, role: UserRole, permissions: PermissionKey[]): Promise<{ success: boolean; error?: string }> => {
      if (!currentUser || currentUser.role !== "developer") {
        return { success: false, error: "Hanya developer yang bisa membuat user baru" };
      }

      if (!username.trim() || !password.trim()) {
        return { success: false, error: "Username dan password wajib diisi" };
      }

      if (username.trim().length < 3) {
        return { success: false, error: "Username minimal 3 karakter" };
      }

      if (password.length < 6) {
        return { success: false, error: "Password minimal 6 karakter" };
      }

      try {
        const res = await fetch("/api/auth/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, role, permissions }),
        });

        const data = await res.json();

        if (res.ok) {
          // Refresh users list
          const usersRes = await fetch("/api/auth/users");
          if (usersRes.ok) {
            const usersData = await usersRes.json();
            setUsers(usersData.users || []);
          }
          return { success: true };
        } else {
          return { success: false, error: data.error || "Gagal membuat user" };
        }
      } catch {
        return { success: false, error: "Terjadi kesalahan jaringan" };
      }
    },
    [currentUser]
  );

  /* ── DELETE USER (developer only) ── */
  const deleteUser = useCallback(
    async (userId: string): Promise<{ success: boolean; error?: string }> => {
      if (!currentUser || currentUser.role !== "developer") {
        return { success: false, error: "Hanya developer yang bisa menghapus user" };
      }

      try {
        const res = await fetch(`/api/auth/users/${userId}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (res.ok) {
          // Refresh users list
          const usersRes = await fetch("/api/auth/users");
          if (usersRes.ok) {
            const usersData = await usersRes.json();
            setUsers(usersData.users || []);
          }
          return { success: true };
        } else {
          return { success: false, error: data.error || "Gagal menghapus user" };
        }
      } catch {
        return { success: false, error: "Terjadi kesalahan jaringan" };
      }
    },
    [currentUser]
  );

  /* ── CHANGE PASSWORD ── */
  const changePassword = useCallback(
    async (userId: string, oldPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
      if (!currentUser) return { success: false, error: "Belum login" };

      // Only allow changing own password
      if (currentUser.id !== userId) {
        return { success: false, error: "Hanya bisa mengubah password akun sendiri" };
      }

      if (newPassword.length < 6) {
        return { success: false, error: "Password baru minimal 6 karakter" };
      }

      try {
        const res = await fetch("/api/auth/change-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ oldPassword, newPassword }),
        });

        const data = await res.json();

        if (res.ok) {
          return { success: true };
        } else {
          return { success: false, error: data.error || "Gagal mengubah password" };
        }
      } catch {
        return { success: false, error: "Terjadi kesalahan jaringan" };
      }
    },
    [currentUser]
  );

  const isDeveloper = currentUser?.role === "developer";

  return (
    <AuthContext.Provider
      value={{
        users,
        currentUser,
        isLoaded,
        login,
        logout,
        createUser,
        deleteUser,
        changePassword,
        isDeveloper,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
