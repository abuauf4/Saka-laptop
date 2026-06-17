// ─── Saka Laptop — Core Navigation Configuration ───
// Adapted from nauka-platform. Includes Saka-specific menu items.

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
  {
    label: "Operasional",
    items: [
      { title: "Dashboard", href: "/admin", icon: "LayoutDashboard", permission: "dashboard.view" },
      { title: "Laptop Masuk", href: "/admin/laptop-masuk", icon: "PackageOpen", permission: "laptop_masuk.view" },
      { title: "QC", href: "/admin/qc", icon: "ClipboardCheck", permission: "qc.view" },
      { title: "Penawaran", href: "/admin/penawaran", icon: "Tag", permission: "penawaran.view" },
      { title: "Inventory", href: "/admin/inventory", icon: "Warehouse", permission: "inventory.view" },
      { title: "Laporan", href: "/admin/laporan", icon: "BarChart3", permission: "laporan.view" },
    ],
  },
  {
    label: "Konten",
    items: [
      { title: "Media", href: "/admin/media", icon: "Image", permission: "media.view" },
      { title: "Artikel", href: "/admin/articles", icon: "FileText", permission: "articles.view" },
    ],
  },
  {
    label: "Tampilan",
    items: [
      { title: "Branding", href: "/admin/branding", icon: "Palette", permission: "branding.view" },
      { title: "SEO", href: "/admin/seo", icon: "Search", permission: "seo.view" },
      { title: "Settings", href: "/admin/settings", icon: "Settings", permission: "settings.view" },
    ],
  },
  {
    label: "Sistem",
    items: [
      { title: "Users", href: "/admin/users", icon: "Users", permission: "users.view" },
      { title: "Roles", href: "/admin/roles", icon: "Shield", permission: "roles.view" },
      { title: "Modules", href: "/admin/modules", icon: "Package", permission: "users.view" },
    ],
  },
];
