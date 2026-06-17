"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

/* ── TYPES ── */
// Compatible dengan Saka lama (currentUser.username, role, permissions)
// + fields Nauka (fullName, email, isSuperAdmin, primaryRole, avatar)

export interface AuthUser {
  id: string;
  // Saka fields
  username: string; // = email (alias for backward compat)
  role: string; // primaryRole slug
  permissions: string[];
  createdAt: string;
  // Nauka fields
  email: string;
  fullName: string;
  avatar: string | null;
  isSuperAdmin: boolean;
  primaryRole: string;
}

export interface AuthState {
  currentUser: AuthUser | null;
  isLoaded: boolean;
}

/* ── CONTEXT ── */
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  hasPermission: (key: string) => boolean;
  // Saka compat
  isDeveloper: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  /* ── LOAD FROM API ON MOUNT ── */
  const checkAuth = useCallback(async () => {
    try {
      const meRes = await fetch("/api/auth/me");
      if (meRes.ok) {
        const meData = await meRes.json();
        if (meData.user) {
          const u = meData.user;
          setCurrentUser({
            id: u.id,
            username: u.email || u.fullName, // backward compat
            email: u.email,
            fullName: u.fullName,
            avatar: u.avatar,
            role: u.primaryRole || u.role || "viewer",
            primaryRole: u.primaryRole || u.role || "viewer",
            permissions: u.permissions || [],
            isSuperAdmin: !!u.isSuperAdmin,
            createdAt: u.createdAt || new Date().toISOString(),
          });
        } else {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    } catch (err) {
      console.error("Failed to load auth state:", err);
      setCurrentUser(null);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /* ── LOGIN (email + password) ── */
  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          return { success: false, error: data.error || "Login gagal" };
        }

        const u = data.user;
        setCurrentUser({
          id: u.id,
          username: u.email || u.fullName,
          email: u.email,
          fullName: u.fullName,
          avatar: u.avatar,
          role: u.primaryRole || "viewer",
          primaryRole: u.primaryRole || "viewer",
          permissions: u.permissions || [],
          isSuperAdmin: !!u.isSuperAdmin,
          createdAt: u.createdAt || new Date().toISOString(),
        });

        return { success: true };
      } catch (err) {
        console.error("Login error:", err);
        return { success: false, error: "Terjadi kesalahan" };
      }
    },
    []
  );

  /* ── LOGOUT ── */
  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setCurrentUser(null);
    }
  }, []);

  /* ── HELPERS ── */
  const hasPermission = useCallback(
    (key: string): boolean => {
      if (!currentUser) return false;
      if (currentUser.isSuperAdmin) return true;
      return currentUser.permissions.includes(key);
    },
    [currentUser]
  );

  // Saka compat: isDeveloper = isSuperAdmin
  const isDeveloper = currentUser?.isSuperAdmin ?? false;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoaded,
        login,
        logout,
        checkAuth,
        hasPermission,
        isDeveloper,
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

/* ── BACKWARD COMPAT: legacy PermissionKey type ── */
// Saka pages import PermissionKey from auth-store for typing.
// We provide a stub type that accepts any string now.
export type PermissionKey = string;
export type UserRole = string;

/* ── COMPAT SHIM: useAuthStore ──
 * Nauka pages import useAuthStore (Zustand) from "@/lib/auth-store".
 * We provide a shim that wraps useAuth (Context) to expose the same interface.
 * This avoids rewriting all Nauka admin pages.
 */
import { useMemo } from "react";

export function useAuthStore() {
  const auth = useAuth();
  return useMemo(
    () => ({
      currentUser: auth.currentUser
        ? {
            id: auth.currentUser.id,
            email: auth.currentUser.email,
            fullName: auth.currentUser.fullName,
            avatar: auth.currentUser.avatar,
            role: auth.currentUser.primaryRole,
            permissions: auth.currentUser.permissions,
            isSuperAdmin: auth.currentUser.isSuperAdmin,
          }
        : null,
      isAuthenticated: !!auth.currentUser,
      isLoading: !auth.isLoaded,
      isSuperAdmin: auth.currentUser?.isSuperAdmin ?? false,
      login: async (email: string, password: string) => {
        const result = await auth.login(email, password);
        if (!result.success) throw new Error(result.error || "Login failed");
      },
      logout: auth.logout,
      checkAuth: auth.checkAuth,
      hasPermission: auth.hasPermission,
    }),
    [auth]
  );
}
