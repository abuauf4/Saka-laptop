// ─── Nauka CMS — Roles & Permissions Client Component ───

"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Shield,
  Loader2,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/lib/auth-store";
import { PERMISSION_CATEGORIES, PERMISSION_ACTIONS } from "@/core/config/core-permissions";

// ─── Types ───

interface PermissionItem {
  id: string;
  name: string;
  category: string;
  action: string;
  label: string;
}

interface RoleRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isDefault: boolean;
  userCount: number;
  permissions: PermissionItem[];
  permissionIds: string[];
}

// ─── Schema ───

const roleSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  description: z.string().optional(),
});

type RoleForm = z.infer<typeof roleSchema>;

export function RolesClient() {
  const { hasPermission, isSuperAdmin: isSuperAdminUser } = useAuthStore();

  // State
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [permissions, setPermissions] = useState<PermissionItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialogs
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleRow | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Permission matrix state for create/edit
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<Set<string>>(new Set());

  // Form
  const roleForm = useForm<RoleForm>({
    resolver: zodResolver(roleSchema),
    defaultValues: { name: "", description: "" },
  });

  // Fetch data
  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/roles");
      if (res.ok) {
        const data = await res.json();
        setRoles(data.roles);
      }
    } catch {
      toast.error("Failed to load roles");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPermissions = useCallback(async () => {
    try {
      const res = await fetch("/api/permissions");
      if (res.ok) {
        const data = await res.json();
        setPermissions(data.permissions);
      }
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, [fetchRoles, fetchPermissions]);

  // Permission matrix helpers
  const getPermissionId = (category: string, action: string) => {
    const perm = permissions.find((p) => p.category === category && p.action === action);
    return perm?.id || "";
  };

  const isPermissionChecked = (category: string, action: string) => {
    const permId = getPermissionId(category, action);
    return selectedPermissionIds.has(permId);
  };

  const togglePermission = (category: string, action: string) => {
    const permId = getPermissionId(category, action);
    if (!permId) return;
    setSelectedPermissionIds((prev) => {
      const next = new Set(prev);
      if (next.has(permId)) {
        next.delete(permId);
      } else {
        next.add(permId);
      }
      return next;
    });
  };

  const toggleCategoryAll = (category: string, checked: boolean) => {
    setSelectedPermissionIds((prev) => {
      const next = new Set(prev);
      for (const action of PERMISSION_ACTIONS) {
        const permId = getPermissionId(category, action);
        if (permId) {
          if (checked) {
            next.add(permId);
          } else {
            next.delete(permId);
          }
        }
      }
      return next;
    });
  };

  const isCategoryAllChecked = (category: string) => {
    return PERMISSION_ACTIONS.every((action) => isPermissionChecked(category, action));
  };

  const isCategorySomeChecked = (category: string) => {
    return PERMISSION_ACTIONS.some((action) => isPermissionChecked(category, action));
  };

  const toggleAllPermissions = (checked: boolean) => {
    if (checked) {
      setSelectedPermissionIds(new Set(permissions.map((p) => p.id)));
    } else {
      setSelectedPermissionIds(new Set());
    }
  };

  // Create role
  const onCreateSubmit = async (data: RoleForm) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          description: data.description || null,
          permissionIds: Array.from(selectedPermissionIds),
        }),
      });
      if (res.ok) {
        toast.success("Role created successfully");
        setCreateOpen(false);
        roleForm.reset();
        setSelectedPermissionIds(new Set());
        fetchRoles();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to create role");
      }
    } catch {
      toast.error("Failed to create role");
    } finally {
      setSubmitting(false);
    }
  };

  // Edit role
  const onEditSubmit = async (data: RoleForm) => {
    if (!selectedRole) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/roles/${selectedRole.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          description: data.description || null,
          permissionIds: Array.from(selectedPermissionIds),
        }),
      });
      if (res.ok) {
        toast.success("Role updated successfully");
        setEditOpen(false);
        roleForm.reset();
        setSelectedRole(null);
        setSelectedPermissionIds(new Set());
        fetchRoles();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to update role");
      }
    } catch {
      toast.error("Failed to update role");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete role
  const onDeleteConfirm = async () => {
    if (!selectedRole) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/roles/${selectedRole.id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Role deleted successfully");
        setDeleteOpen(false);
        setSelectedRole(null);
        fetchRoles();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to delete role");
      }
    } catch {
      toast.error("Failed to delete role");
    } finally {
      setSubmitting(false);
    }
  };

  // Open edit dialog
  const handleEdit = (role: RoleRow) => {
    setSelectedRole(role);
    roleForm.reset({ name: role.name, description: role.description || "" });
    setSelectedPermissionIds(new Set(role.permissionIds));
    setEditOpen(true);
  };

  const canCreate = hasPermission("roles.create");
  const canUpdate = hasPermission("roles.update");
  const canDelete = hasPermission("roles.delete");

  // Permission Matrix Component
  const PermissionMatrix = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Permissions</h4>
        <div className="flex items-center gap-2">
          <Checkbox
            id="select-all-perms"
            checked={selectedPermissionIds.size === permissions.length && permissions.length > 0}
            onCheckedChange={(checked) => toggleAllPermissions(checked === true)}
          />
          <label htmlFor="select-all-perms" className="text-xs text-muted-foreground cursor-pointer">
            Select All
          </label>
        </div>
      </div>

      <div className="rounded-lg border border-white/5 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="w-[180px]">Category</TableHead>
              {PERMISSION_ACTIONS.map((action) => (
                <TableHead key={action} className="w-[80px] text-center capitalize">
                  {action}
                </TableHead>
              ))}
              <TableHead className="w-[70px] text-center">All</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PERMISSION_CATEGORIES.map((cat) => {
              const catLabel = cat.label;
              return (
                <TableRow key={cat.slug} className="border-white/5">
                  <TableCell className="font-medium text-sm">{catLabel}</TableCell>
                  {PERMISSION_ACTIONS.map((action) => (
                    <TableCell key={`${cat.slug}-${action}`} className="text-center">
                      <Checkbox
                        checked={isPermissionChecked(cat.slug, action)}
                        onCheckedChange={() => togglePermission(cat.slug, action)}
                      />
                    </TableCell>
                  ))}
                  <TableCell className="text-center">
                    <Checkbox
                      checked={isCategoryAllChecked(cat.slug)}
                      ref={(el) => {
                        if (el) {
                          (el as unknown as HTMLInputElement).dataset.state = isCategorySomeChecked(cat.slug) && !isCategoryAllChecked(cat.slug) ? "indeterminate" : isCategoryAllChecked(cat.slug) ? "checked" : "unchecked";
                        }
                      }}
                      onCheckedChange={(checked) => toggleCategoryAll(cat.slug, checked === true)}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Roles & Permissions</h2>
          <p className="text-muted-foreground">Manage access levels and permissions</p>
        </div>
        {canCreate && (
          <Button onClick={() => { roleForm.reset(); setSelectedPermissionIds(new Set()); setCreateOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Create Role
          </Button>
        )}
      </div>

      {/* Roles List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid gap-4"
        >
          {roles.map((role) => (
            <Card key={role.id} className="border-white/5 bg-white/[0.02]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{role.name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {role.description || "No description"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-white/10">
                      <Users className="mr-1 h-3 w-3" />
                      {role.userCount} user{role.userCount !== 1 ? "s" : ""}
                    </Badge>
                    {role.isDefault && (
                      <Badge variant="secondary" className="text-xs">
                        Default
                      </Badge>
                    )}
                    {(canUpdate || (canDelete && !role.isDefault)) && (
                      <div className="flex items-center gap-1">
                        {canUpdate && (
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(role)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        {canDelete && !role.isDefault && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => { setSelectedRole(role); setDeleteOpen(true); }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {role.permissions.length === 0 ? (
                    <span className="text-xs text-muted-foreground">No permissions assigned</span>
                  ) : (
                    role.permissions.map((perm) => (
                      <Badge
                        key={perm.id}
                        variant="outline"
                        className="text-[10px] px-1.5 py-0 border-white/10"
                      >
                        {perm.label}
                      </Badge>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}

      {/* Create Role Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="border-white/10 bg-[#0D1117] max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Role</DialogTitle>
            <DialogDescription>Define a new role with specific permissions</DialogDescription>
          </DialogHeader>
          <Form {...roleForm}>
            <form onSubmit={roleForm.handleSubmit(onCreateSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={roleForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Content Manager" className="border-white/10 bg-white/5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={roleForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Brief description of this role" className="border-white/10 bg-white/5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="bg-white/5" />

              <PermissionMatrix />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setCreateOpen(false)} className="border-white/10">
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Role
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="border-white/10 bg-[#0D1117] max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>Update role details and permissions</DialogDescription>
          </DialogHeader>
          <Form {...roleForm}>
            <form onSubmit={roleForm.handleSubmit(onEditSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={roleForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Content Manager" className="border-white/10 bg-white/5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={roleForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Brief description of this role" className="border-white/10 bg-white/5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="bg-white/5" />

              <PermissionMatrix />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditOpen(false)} className="border-white/10">
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Role
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="border-white/10 bg-[#0D1117]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the <strong>{selectedRole?.name}</strong> role? Users with this role will lose their permissions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDeleteConfirm}
              disabled={submitting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
