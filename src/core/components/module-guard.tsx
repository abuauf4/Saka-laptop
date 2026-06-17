// ─── Nauka Core — Module Guard Component ───
// Blocks access to admin pages when their module is deactivated.
// Similar to AuthGuard but checks module activation status.

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminHeader } from "@/core/components/admin-header";

interface ModuleGuardProps {
  slug: string;
  children: React.ReactNode;
}

interface ModuleStatus {
  active: boolean;
  name: string;
  slug: string;
}

export function ModuleGuard({ slug, children }: ModuleGuardProps) {
  const router = useRouter();
  const [moduleStatus, setModuleStatus] = useState<ModuleStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkModule() {
      try {
        const res = await fetch(`/api/modules/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setModuleStatus({
            active: data.module?.status === "active",
            name: data.module?.name || slug,
            slug: data.module?.slug || slug,
          });
        } else if (res.status === 404) {
          // Module not installed
          setModuleStatus({ active: false, name: slug, slug });
        } else {
          // Error — default to allowing access (fail open for module check)
          setModuleStatus({ active: true, name: slug, slug });
        }
      } catch {
        // Network error — fail open
        setModuleStatus({ active: true, name: slug, slug });
      } finally {
        setLoading(false);
      }
    }
    checkModule();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Checking module status...</p>
        </div>
      </div>
    );
  }

  if (!moduleStatus?.active) {
    return (
      <>
        <AdminHeader title="Module Inactive" />
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="flex flex-col items-center gap-6 text-center max-w-md">
            <div className="rounded-full bg-destructive/10 p-6">
              <PackageX className="h-12 w-12 text-destructive" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">
                Module Not Active
              </h2>
              <p className="text-muted-foreground">
                The <span className="font-semibold text-foreground">{moduleStatus?.name || slug}</span> module
                is currently deactivated. This page is unavailable until the module is reactivated by a Super Admin.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => router.push("/admin")}>
                Back to Dashboard
              </Button>
              <Button onClick={() => router.push("/admin/modules")}>
                Manage Modules
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return <>{children}</>;
}
