"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, Power, PowerOff } from "lucide-react";
import { AdminHeader } from "@/core/components/admin-header";
import { toast } from "sonner";

interface ModuleInfo {
  id: string;
  slug: string;
  name: string;
  version: string;
  description: string | null;
  status: "active" | "inactive";
  installedAt: string;
  updatedAt: string;
}

export function ModulesClient() {
  const { currentUser, isSuperAdmin: isUserSuperAdmin } = useAuthStore();
  const router = useRouter();
  const [modules, setModules] = useState<ModuleInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchModules = async () => {
    try {
      const res = await fetch("/api/modules");
      if (res.ok) {
        const data = await res.json();
        setModules(data.modules);
      } else if (res.status === 401 || res.status === 403) {
        router.push("/admin");
      }
    } catch {
      toast.error("Failed to load modules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const handleActivate = async (slug: string) => {
    setActionLoading(slug);
    try {
      const res = await fetch(`/api/modules/${slug}/activate`, { method: "POST" });
      if (res.ok) {
        toast.success(`Module "${slug}" activated`);
        await fetchModules();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to activate module");
      }
    } catch {
      toast.error("Failed to activate module");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeactivate = async (slug: string) => {
    setActionLoading(slug);
    try {
      const res = await fetch(`/api/modules/${slug}/deactivate`, { method: "POST" });
      if (res.ok) {
        toast.success(`Module "${slug}" deactivated`);
        await fetchModules();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to deactivate module");
      }
    } catch {
      toast.error("Failed to deactivate module");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <>
        <AdminHeader title="Modules" />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </>
    );
  }

  if (!isUserSuperAdmin) {
    return (
      <>
        <AdminHeader title="Modules" />
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Package className="h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">Only Super Admins can manage modules.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Modules" />
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Modules</h2>
          <p className="text-muted-foreground">
            Manage installed modules and their activation status.
          </p>
        </div>

        {modules.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
              <Package className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No modules installed yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((mod) => (
              <Card key={mod.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      <CardTitle className="text-base">{mod.name}</CardTitle>
                    </div>
                    <Badge
                      variant={mod.status === "active" ? "default" : "secondary"}
                      className={
                        mod.status === "active"
                          ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/20"
                          : ""
                      }
                    >
                      {mod.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    v{mod.version} · {mod.slug}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {mod.description && (
                    <p className="text-sm text-muted-foreground mb-4">
                      {mod.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    {mod.status === "inactive" ? (
                      <Button
                        size="sm"
                        onClick={() => handleActivate(mod.slug)}
                        disabled={actionLoading === mod.slug}
                        className="gap-1.5"
                      >
                        {actionLoading === mod.slug ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Power className="h-3.5 w-3.5" />
                        )}
                        Activate
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeactivate(mod.slug)}
                        disabled={actionLoading === mod.slug}
                        className="gap-1.5"
                      >
                        {actionLoading === mod.slug ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <PowerOff className="h-3.5 w-3.5" />
                        )}
                        Deactivate
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
