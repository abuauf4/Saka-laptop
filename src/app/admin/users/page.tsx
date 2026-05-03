"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  Trash2,
  Shield,
  Users,
  Eye,
  EyeOff,
  Check,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth, PERMISSION_KEYS, PERMISSION_LABELS, type UserRole, type PermissionKey } from "@/lib/auth-store";
import { toast } from "sonner";

export default function UsersPage() {
  const { users, currentUser, createUser, deleteUser, isDeveloper } = useAuth();
  const [addOpen, setAddOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("admin");
  const [newPermissions, setNewPermissions] = useState<PermissionKey[]>([...PERMISSION_KEYS]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Only developer can access this page
  if (!isDeveloper) {
    return (
      <div className="page-container py-10">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Shield className="h-16 w-16 text-muted-foreground/20 mb-4" />
          <h2 className="text-xl font-bold mb-2">Akses Ditolak</h2>
          <p className="text-sm text-muted-foreground">
            Hanya developer yang bisa mengelola user admin
          </p>
        </div>
      </div>
    );
  }

  const handleAddUser = async () => {
    setLoading(true);
    try {
      const result = await createUser(newUsername, newPassword, newRole, newRole === "developer" ? [...PERMISSION_KEYS] : newPermissions);
      if (result.success) {
        toast.success(`User "${newUsername}" berhasil dibuat`);
        setNewUsername("");
        setNewPassword("");
        setNewRole("admin");
        setNewPermissions([...PERMISSION_KEYS]);
        setAddOpen(false);
      } else {
        toast.error(result.error || "Gagal membuat user");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setDeleteLoading(true);
    try {
      const result = await deleteUser(userId);
      if (result.success) {
        toast.success("User berhasil dihapus");
        setDeleteConfirm(null);
      } else {
        toast.error(result.error || "Gagal menghapus user");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setDeleteLoading(false);
    }
  };

  const togglePermission = (key: PermissionKey) => {
    setNewPermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const adminUsers = users.filter((u) => u.role === "admin");
  const devUsers = users.filter((u) => u.role === "developer");

  return (
    <div className="page-container py-6 pb-28 lg:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Kelola User
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {users.length} user terdaftar
          </p>
        </div>

        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 rounded-xl min-h-[44px]">
              <UserPlus className="h-4 w-4" />
              Tambah User
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                Buat User Baru
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Username</label>
                <Input
                  placeholder="Minimal 3 karakter"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="h-12 rounded-xl bg-background border-border/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimal 6 karakter"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-12 rounded-xl bg-background border-border/50 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setNewRole("admin");
                      setNewPermissions([...PERMISSION_KEYS]);
                    }}
                    className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                      newRole === "admin"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/50 bg-card text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    <Shield className="h-4 w-4" />
                    Admin
                  </button>
                  <button
                    onClick={() => {
                      setNewRole("developer");
                      setNewPermissions([...PERMISSION_KEYS]);
                    }}
                    className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                      newRole === "developer"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/50 bg-card text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    <KeyRound className="h-4 w-4" />
                    Developer
                  </button>
                </div>
              </div>

              {/* Permissions — only shown for admin role */}
              {newRole === "admin" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Akses Menu</label>
                  <p className="text-xs text-muted-foreground">Pilih menu yang bisa diakses user ini</p>
                  <div className="space-y-1.5">
                    {PERMISSION_KEYS.map((key) => (
                      <div
                        key={key}
                        role="button"
                        tabIndex={0}
                        onClick={() => togglePermission(key)}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); togglePermission(key); } }}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-all select-none ${
                          newPermissions.includes(key)
                            ? "bg-primary/10 border border-primary/30"
                            : "bg-card border border-border/30 hover:border-border/60"
                        }`}
                      >
                        <div className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all ${
                          newPermissions.includes(key)
                            ? "bg-primary border-primary"
                            : "border-border/50"
                        }`}>
                          {newPermissions.includes(key) && (
                            <Check className="h-3 w-3 text-primary-foreground" />
                          )}
                        </div>
                        <span className={`text-sm font-medium ${
                          newPermissions.includes(key) ? "text-foreground" : "text-muted-foreground"
                        }`}>
                          {PERMISSION_LABELS[key]}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setNewPermissions([...PERMISSION_KEYS])}
                      className="text-xs text-primary font-medium hover:underline"
                    >
                      Pilih Semua
                    </button>
                    <span className="text-xs text-muted-foreground">·</span>
                    <button
                      type="button"
                      onClick={() => setNewPermissions([])}
                      className="text-xs text-primary font-medium hover:underline"
                    >
                      Hapus Semua
                    </button>
                  </div>
                </div>
              )}

              {newRole === "developer" && (
                <p className="text-xs text-muted-foreground bg-muted/30 rounded-lg px-3 py-2">
                  Developer memiliki akses ke semua menu secara otomatis
                </p>
              )}

              <Button
                onClick={handleAddUser}
                disabled={loading || !newUsername.trim() || !newPassword || (newRole === "admin" && newPermissions.length === 0)}
                className="w-full min-h-[48px] font-semibold rounded-xl gap-2"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Buat User
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Developer Section */}
      {devUsers.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Developer
          </h2>
          <div className="space-y-2">
            {devUsers.map((user) => (
              <Card key={user.id} className="border-primary/20 bg-primary/5">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center">
                      <KeyRound className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{user.username}</p>
                        {currentUser?.id === user.id && (
                          <Badge className="text-[10px] px-1.5 py-0 bg-primary/20 text-primary border-primary/30">
                            Anda
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Developer · Semua Menu · Sejak {new Date(user.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-xs">
                    <KeyRound className="h-3 w-3 mr-1" />
                    Developer
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Admin Section */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Admin ({adminUsers.length})
        </h2>
        {adminUsers.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <Users className="h-10 w-10 text-muted-foreground/20 mb-3" />
              <p className="text-sm text-muted-foreground">
                Belum ada user admin. Buat user baru untuk memberikan akses.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {adminUsers.map((user) => (
                <motion.div
                  key={user.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="border-border/50">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-muted/30 flex items-center justify-center">
                          <Shield className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold">{user.username}</p>
                          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            <p className="text-xs text-muted-foreground">Akses:</p>
                            {user.permissions.map((p) => (
                              <span key={p} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                                {PERMISSION_LABELS[p]}
                              </span>
                            ))}
                            {user.permissions.length === 0 && (
                              <span className="text-[10px] text-muted-foreground">Tidak ada akses</span>
                            )}
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            Sejak {new Date(user.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                      </div>

                      {deleteConfirm === user.id ? (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-lg text-xs h-8"
                            onClick={() => setDeleteConfirm(null)}
                          >
                            Batal
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="rounded-lg text-xs h-8 gap-1"
                            disabled={deleteLoading}
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            {deleteLoading ? (
                              <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                <Trash2 className="h-3 w-3" />
                                Hapus
                              </>
                            )}
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                          onClick={() => setDeleteConfirm(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
