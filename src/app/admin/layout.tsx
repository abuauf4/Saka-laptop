// ─── Saka Laptop — Admin Layout (Nauka Core) ───
// Adapted from nauka-platform. Includes AuthGuard + dynamic sidebar.

"use client";

import { usePathname } from "next/navigation";
import { AuthGuard } from "@/core/components/auth-guard";
import { AdminSidebar } from "@/core/components/admin-sidebar";
import { AdminHeader } from "@/core/components/admin-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AuthProvider } from "@/lib/auth-store";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <AuthProvider><AuthGuard>{children}</AuthGuard></AuthProvider>;
  }

  return (
    <AuthProvider>
      <AuthGuard>
        <SidebarProvider>
          <AdminSidebar />
          <SidebarInset>
            <AdminHeader />
            <main className="flex-1 overflow-auto p-4 md:p-6">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </AuthGuard>
    </AuthProvider>
  );
}
