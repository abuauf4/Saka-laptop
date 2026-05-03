"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Laptop,
  ShoppingCart,
  Receipt,
  Store,
  Menu,
  MessageSquareHeart,
  Users,
  LogOut,
  Shield,
  KeyRound,
  StoreIcon,
  FileText,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useTheme } from "@/lib/theme-store";
import { useAuth, type PermissionKey } from "@/lib/auth-store";
import { StoreLogo } from "@/components/store-logo";
import { StoreNamePlain } from "@/components/store-name";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/* Nav items — permission key maps to each item */
const adminNavItems: { href: string; label: string; icon: typeof LayoutDashboard; permission: PermissionKey }[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, permission: "dashboard" },
  { href: "/admin/produk", label: "Produk", icon: Laptop, permission: "produk" },
  { href: "/admin/artikel", label: "Artikel", icon: FileText, permission: "produk" },
  { href: "/admin/testimoni", label: "Testimoni", icon: MessageSquareHeart, permission: "testimoni" },
  { href: "/admin/kasir", label: "Kasir", icon: ShoppingCart, permission: "kasir" },
  { href: "/admin/transaksi", label: "Transaksi", icon: Receipt, permission: "transaksi" },
  { href: "/admin/profil", label: "Profil Toko", icon: StoreIcon, permission: "profil" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, isDeveloper, hasPermission, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = useCallback(
    (href: string) => {
      if (href === "/admin") return pathname === "/admin";
      return pathname.startsWith(href);
    },
    [pathname]
  );

  // Filter nav items based on permissions
  const visibleNavItems = adminNavItems.filter((item) => hasPermission(item.permission));

  const currentPage = visibleNavItems.find((item) => isActive(item.href));

  const handleLogout = () => {
    logout();
    setLogoutOpen(false);
    setMobileOpen(false);
    router.push("/admin/login");
  };

  /* ── User info block ── */
  const UserInfo = () => {
    if (!currentUser) return null;
    return (
      <div className="flex items-center gap-2.5 px-4 py-3 bg-muted/30 border-b border-border/30">
        <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
          {isDeveloper ? (
            <KeyRound className="h-4 w-4 text-primary" />
          ) : (
            <Shield className="h-4 w-4 text-primary" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold truncate">{currentUser.username}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
            {currentUser.role}
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* ══════ MOBILE TOP BAR ══════ */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-14 px-4 border-b border-border/50 bg-background/90 backdrop-blur-xl shadow-soft-sm">
        {/* Left: Logo */}
        <Link href="/admin" className="flex items-center gap-2.5">
          <StoreLogo className="h-8 w-8 rounded-xl object-cover" />
          <span className="font-bold text-base"><StoreNamePlain /></span>
          <span className="text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
            Admin
          </span>
        </Link>

        {/* Right: Theme + Hamburger */}
        <div className="flex items-center gap-1">
          <ThemeSwitcher />
          <button
            onClick={() => setMobileOpen(true)}
            className="flex items-center justify-center h-10 w-10 rounded-xl hover:bg-muted/60 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* ══════ MOBILE DRAWER ══════ */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent className="w-[280px] bg-card border-border p-0 flex flex-col">
          {/* Drawer header */}
          <div className="flex items-center justify-between h-14 px-4 border-b border-border/50 flex-shrink-0">
            <div className="flex items-center gap-2">
              <StoreLogo className="h-7 w-7 rounded-lg object-cover" />
              <span className="font-bold text-sm">Menu Admin</span>
            </div>
          </div>

          {/* User info */}
          <UserInfo />

          {/* Current page indicator */}
          {currentPage && (
            <div className="px-4 py-3 bg-primary/5 border-b border-border/30">
              <p className="text-xs text-muted-foreground mb-1">Halaman saat ini</p>
              <div className="flex items-center gap-2">
                <currentPage.icon className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-primary">{currentPage.label}</span>
              </div>
            </div>
          )}

          {/* Nav links */}
          <nav className="flex-1 flex flex-col py-2 overflow-y-auto">
            {visibleNavItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-all duration-200 min-h-[48px]",
                    active
                      ? "bg-primary/10 text-primary border-r-2 border-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}

            {/* Users menu - developer only */}
            {isDeveloper && (
              <Link
                href="/admin/users"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-all duration-200 min-h-[48px]",
                  isActive("/admin/users")
                    ? "bg-primary/10 text-primary border-r-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Users className="h-4 w-4" />
                Kelola User
              </Link>
            )}
          </nav>

          {/* Bottom section */}
          <div className="border-t border-border/50 p-4 space-y-1 flex-shrink-0">
            <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground">
              <SidebarThemeIcon />
              <span className="flex-1">Tema</span>
              <ThemeSwitcher />
            </div>
            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 min-h-[44px]"
            >
              <Store className="h-4 w-4" />
              Ke Toko
            </Link>
            <button
              onClick={() => {
                setMobileOpen(false);
                setLogoutOpen(true);
              }}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 min-h-[44px] w-full"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* ══════ DESKTOP SIDEBAR ══════ */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-60 lg:bg-card lg:border-r lg:border-border/50 z-40 shadow-soft-sm">
        {/* Logo */}
        <Link href="/admin" className="flex items-center gap-2.5 px-5 h-14 border-b border-border/50 flex-shrink-0 hover:bg-muted/30 transition-colors">
          <StoreLogo className="h-8 w-8 rounded-lg object-cover" />
          <span className="font-bold text-lg"><StoreNamePlain /></span>
          <span className="text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
            Admin
          </span>
        </Link>

        {/* User info */}
        {currentUser && (
          <div className="flex items-center gap-2.5 px-5 py-3 border-b border-border/30">
            <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
              {isDeveloper ? (
                <KeyRound className="h-4 w-4 text-primary" />
              ) : (
                <Shield className="h-4 w-4 text-primary" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">{currentUser.username}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {currentUser.role}
              </p>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {visibleNavItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-primary/10 text-primary shadow-soft-sm shadow-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}

          {/* Users menu - developer only */}
          {isDeveloper && (
            <Link
              href="/admin/users"
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive("/admin/users")
                  ? "bg-primary/10 text-primary shadow-soft-sm shadow-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Users className="h-4 w-4" />
              Kelola User
            </Link>
          )}
        </nav>

        {/* Bottom: Theme + Back to store + Logout */}
        <div className="px-3 py-4 border-t border-border/50 flex-shrink-0 space-y-1">
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200">
            <SidebarThemeIcon />
            <span className="flex-1">Tema</span>
            <ThemeSwitcher />
          </div>
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
          >
            <Store className="h-4 w-4" />
            Ke Toko
          </Link>
          <button
            onClick={() => setLogoutOpen(true)}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 w-full"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* ══════ LOGOUT CONFIRM DIALOG ══════ */}
      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogContent className="bg-card border-border sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogOut className="h-5 w-5 text-red-400" />
              Konfirmasi Logout
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            Yakin ingin keluar dari panel admin?
          </p>
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 min-h-[44px] rounded-xl"
              onClick={() => setLogoutOpen(false)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              className="flex-1 min-h-[44px] rounded-xl gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ── Sidebar theme emoji icon ── */
function SidebarThemeIcon() {
  const { themeInfo } = useTheme();
  return <span className="text-base">{themeInfo.emoji}</span>;
}
