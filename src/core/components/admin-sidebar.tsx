"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as LucideIcons from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth-store";
import { useRouter } from "next/navigation";

interface NavItem {
  title: string;
  href: string;
  icon: string;
  permission: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
  devOnly?: boolean;
}

interface NavigationData {
  core: NavGroup[];
  modules: NavGroup[];
}

// Dynamic icon resolver
function IconComponent({ name, className }: { name: string; className?: string }) {
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name];
  if (!Icon) return <LucideIcons.Circle className={className} />;
  return <Icon className={className} />;
}

export function AdminSidebar() {
  const pathname = usePathname();
  const { currentUser, hasPermission, logout } = useAuth();
  const router = useRouter();
  const [navigation, setNavigation] = useState<NavigationData | null>(null);

  useEffect(() => {
    fetch("/api/navigation")
      .then((res) => res.json())
      .then((data) => setNavigation(data))
      .catch(() => {
        // Fallback: empty navigation
        setNavigation({ core: [], modules: [] });
      });
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const canSee = (permission: string) => hasPermission(permission);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const allGroups: NavGroup[] = [
    ...(navigation?.core || []),
    ...(navigation?.modules || []),
  ];

  // Filter groups: devOnly groups hanya untuk super_admin
  const visibleGroups = allGroups.filter((group) => {
    if (group.devOnly && !currentUser?.isSuperAdmin) {
      return false;
    }
    return true;
  });

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="px-2 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <span className="text-sm font-bold">JL</span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Jakarta Laptops</span>
                  <span className="truncate text-xs text-muted-foreground">Pusat Inspeksi & Trade-in</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {!navigation ? (
          <div className="flex items-center justify-center py-8">
            <LucideIcons.Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          visibleGroups.map((group) => {
            const visibleItems = group.items.filter((item) => canSee(item.permission));
            if (visibleItems.length === 0) return null;
            return (
              <SidebarGroup key={group.label}>
                <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {visibleItems.map((item) => (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive(item.href)}
                          tooltip={item.title}
                        >
                          <Link href={item.href}>
                            <IconComponent name={item.icon} />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            );
          })
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-xs">
                      {currentUser ? getInitials(currentUser.fullName || currentUser.username) : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {currentUser?.fullName || currentUser?.username || "User"}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {currentUser?.role || "viewer"}
                    </span>
                  </div>
                  <LucideIcons.ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="top"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem onClick={() => router.push("/admin/profile")}>
                  <LucideIcons.UserCircle className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LucideIcons.LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
