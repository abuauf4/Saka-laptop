"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AuthProvider, useAuth } from "@/lib/auth-store";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { currentUser, isLoaded } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoaded && !currentUser && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [isLoaded, currentUser, router, pathname]);

  // Show loading while checking auth
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in and not on login page → will redirect
  if (!currentUser && pathname !== "/admin/login") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Logged in but on login page → redirect to admin
  if (currentUser && pathname === "/admin/login") {
    router.replace("/admin");
    return null;
  }

  // Not logged in and on login page → show login page (no sidebar)
  if (!currentUser && pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Logged in → show admin layout
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AdminSidebar />
      <main className="lg:pl-60 pt-14 lg:pt-0 flex-1 flex flex-col">
        <div className="flex-1">
          {children}
        </div>
        <footer className="border-t border-border/50 bg-card/50">
          <div className="page-container py-4">
            <p className="text-xs text-muted-foreground text-center">
              &copy; 2026 Nauka Creative Digital. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AuthGuard>
        {children}
      </AuthGuard>
    </AuthProvider>
  );
}
