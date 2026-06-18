// ─── Saka Laptop — Permission Key Definitions ───
// Adapted from nauka-platform. Includes Saka-specific categories (laptop_masuk, qc, penawaran, inventory, laporan).

export type PermissionAction = "view" | "create" | "update" | "delete";

export interface PermissionKey {
  key: string; // e.g. "users.view"
  category: string; // e.g. "users"
  action: PermissionAction;
  label: string; // Human-readable
}

export const PERMISSION_CATEGORIES = [
  { slug: "dashboard", label: "Dashboard" },
  { slug: "laptop_masuk", label: "Laptop Masuk" },
  { slug: "qc", label: "QC" },
  { slug: "penawaran", label: "Penawaran" },
  { slug: "inventory", label: "Inventory" },
  { slug: "laporan", label: "Laporan" },
  { slug: "users", label: "Users" },
  { slug: "roles", label: "Roles & Permissions" },
  { slug: "branding", label: "Branding" },
  { slug: "seo", label: "SEO" },
  { slug: "media", label: "Media" },
  { slug: "articles", label: "Articles" },
  { slug: "settings", label: "Settings" },
  { slug: "modules", label: "Modules" },
] as const;

export const PERMISSION_ACTIONS: PermissionAction[] = ["view", "create", "update", "delete"];

export const PERMISSION_KEYS: PermissionKey[] = PERMISSION_CATEGORIES.flatMap((cat) =>
  PERMISSION_ACTIONS.map((action) => ({
    key: `${cat.slug}.${action}`,
    category: cat.slug,
    action,
    label: `${cat.label}: ${action.charAt(0).toUpperCase() + action.slice(1)}`,
  }))
);

export const PERMISSION_KEY_STRINGS = PERMISSION_KEYS.map((p) => p.key);

// Default role permissions mapping
export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  super_admin: PERMISSION_KEY_STRINGS, // All permissions
  admin: PERMISSION_KEY_STRINGS, // All permissions
  manager: [
    "dashboard.view",
    "laptop_masuk.view", "laptop_masuk.create", "laptop_masuk.update",
    "qc.view", "qc.update",
    "penawaran.view", "penawaran.create", "penawaran.update",
    "inventory.view", "inventory.create", "inventory.update", "inventory.delete",
    "laporan.view",
    "media.view", "media.create", "media.update", "media.delete",
    "articles.view", "articles.create", "articles.update", "articles.delete",
    "branding.view", "seo.view", "settings.view",
  ],
  staff: [
    "dashboard.view",
    "laptop_masuk.view", "laptop_masuk.create", "laptop_masuk.update",
    "qc.view", "qc.update",
    "penawaran.view", "penawaran.create", "penawaran.update",
    "inventory.view", "inventory.create", "inventory.update",
    "laporan.view",
    "media.view", "media.create", "media.update",
  ],
  viewer: [
    "dashboard.view",
    "laptop_masuk.view",
    "qc.view",
    "penawaran.view",
    "inventory.view",
    "laporan.view",
    "branding.view", "seo.view",
    "media.view", "articles.view", "settings.view",
  ],
};

// Default roles
export const DEFAULT_ROLES = [
  { name: "Super Admin", slug: "super_admin", description: "Full access to all features", isDefault: true },
  { name: "Admin", slug: "admin", description: "Administrative access with all permissions", isDefault: true },
  { name: "Manager", slug: "manager", description: "Manage operations & inventory", isDefault: true },
  { name: "Staff", slug: "staff", description: "Handle submissions, QC, and penawaran", isDefault: true },
  { name: "Viewer", slug: "viewer", description: "Read-only access", isDefault: true },
] as const;

// ─── Core Module Contract ───
import { ModuleContract } from "@/core/types/module";

export const CoreModuleContract: ModuleContract = {
  metadata: {
    slug: "core",
    name: "Core",
    version: "1.0.0",
    description: "Core CMS functionality",
    icon: "Shield",
  },
  permissions: PERMISSION_KEYS.map((p) => ({
    key: p.key,
    label: p.label,
  })),
  menuItems: [], // Core menu items are handled separately
};
