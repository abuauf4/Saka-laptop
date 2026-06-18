// ─── Jakarta Laptops — Core Navigation Configuration ───
// Split into 2 sections:
// 1. Operasional — all admin roles (barang masuk, kasir, inventory, laporan)
// 2. Pengaturan Website — developer only (homepage, branding, seo, settings, media, articles, testimoni)
// 3. Sistem — developer only (users, roles, modules)

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  permission: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
  devOnly?: boolean; // if true, only visible to developer/super_admin
}

export const CORE_NAV_GROUPS: NavGroup[] = [
  {
    label: "Operasional",
    items: [
      { title: "Dashboard", href: "/admin", icon: "LayoutDashboard", permission: "dashboard.view" },
      { title: "Barang Masuk", href: "/admin/barang-masuk", icon: "PackagePlus", permission: "inventory.view" },
      { title: "Kasir", href: "/admin/kasir", icon: "ShoppingCart", permission: "kasir.view" },
      { title: "Inventory", href: "/admin/inventory", icon: "Warehouse", permission: "inventory.view" },
      { title: "Laporan Keuangan", href: "/admin/laporan-keuangan", icon: "BarChart3", permission: "laporan.view" },
    ],
  },
  {
    label: "Pengaturan Website",
    devOnly: true,
    items: [
      { title: "Homepage", href: "/admin/homepage", icon: "Home", permission: "settings.view" },
      { title: "Branding", href: "/admin/branding", icon: "Palette", permission: "branding.view" },
      { title: "SEO", href: "/admin/seo", icon: "Search", permission: "seo.view" },
      { title: "Settings", href: "/admin/settings", icon: "Settings", permission: "settings.view" },
      { title: "Media", href: "/admin/media", icon: "Image", permission: "media.view" },
      { title: "Artikel", href: "/admin/articles", icon: "FileText", permission: "articles.view" },
      { title: "Testimoni", href: "/admin/testimoni", icon: "MessageSquareHeart", permission: "testimoni.view" },
    ],
  },
  {
    label: "Sistem",
    devOnly: true,
    items: [
      { title: "Users", href: "/admin/users", icon: "Users", permission: "users.view" },
      { title: "Roles", href: "/admin/roles", icon: "Shield", permission: "roles.view" },
      { title: "Modules", href: "/admin/modules", icon: "Package", permission: "users.view" },
    ],
  },
];
