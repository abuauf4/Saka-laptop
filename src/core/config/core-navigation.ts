// ─── Jakarta Laptops — Core Navigation Configuration ───
// 2 groups: Operasional (admin bisnis) + Developer (frontend control)
// Admin role: cuma Operasional. Developer/Super Admin: keduanya.

export interface NavItem {
  title: string;
  href: string;
  icon: string; // Lucide icon name as string
  permission: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const CORE_NAV_GROUPS: NavGroup[] = [
  // ─── OPERASIONAL (admin bisnis, gak ada hubungan sama frontend) ───
  {
    label: "Operasional",
    items: [
      { title: "Dashboard", href: "/admin", icon: "LayoutDashboard", permission: "dashboard.view" },
      { title: "Barang Masuk", href: "/admin/laptop-masuk", icon: "PackageOpen", permission: "laptop_masuk.view" },
      { title: "Inventory", href: "/admin/inventory", icon: "Warehouse", permission: "inventory.view" },
      { title: "Barang Terjual", href: "/admin/inventory?status=SOLD", icon: "ShoppingBag", permission: "inventory.view" },
      { title: "Laporan", href: "/admin/laporan", icon: "BarChart3", permission: "laporan.view" },
    ],
  },
  // ─── DEVELOPER (frontend control, settings2 yang berhubungan sama frontend) ───
  {
    label: "Developer",
    items: [
      { title: "Homepage", href: "/admin/homepage", icon: "Home", permission: "settings.view" },
      { title: "Branding", href: "/admin/branding", icon: "Palette", permission: "branding.view" },
      { title: "SEO", href: "/admin/seo", icon: "Search", permission: "seo.view" },
      { title: "Settings", href: "/admin/settings", icon: "Settings", permission: "settings.view" },
      { title: "Media", href: "/admin/media", icon: "Image", permission: "media.view" },
      { title: "Artikel", href: "/admin/articles", icon: "FileText", permission: "articles.view" },
      { title: "Testimoni", href: "/admin/testimoni", icon: "MessageSquareHeart", permission: "testimoni.view" },
      { title: "Users", href: "/admin/users", icon: "Users", permission: "users.view" },
      { title: "Roles", href: "/admin/roles", icon: "Shield", permission: "roles.view" },
      { title: "Modules", href: "/admin/modules", icon: "Package", permission: "users.view" },
    ],
  },
];
