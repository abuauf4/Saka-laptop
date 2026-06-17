// ─── Nauka CMS — Media Library Client Component ───

"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Upload,
  Image as ImageIcon,
  FileText,
  Grid,
  List,
  Search,
  Copy,
  Trash2,
  Pencil,
  ExternalLink,
  FolderOpen,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useAuthStore } from "@/lib/auth-store";

// ─── Types ───

interface MediaItem {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  folder: string;
  altText: string | null;
  width: number | null;
  height: number | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Constants ───

const FOLDERS = ["Hero", "Gallery", "Articles", "SEO", "General"] as const;
const ALLOWED_TYPES = ["jpg", "jpeg", "png", "webp", "svg", "pdf"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const IMAGE_TYPES = ["jpg", "jpeg", "png", "webp", "svg"];

// ─── Helpers ───

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImageType(fileType: string): boolean {
  return IMAGE_TYPES.includes(fileType.toLowerCase());
}

function getFileExtension(fileName: string): string {
  return fileName.split(".").pop()?.toLowerCase() || "";
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Component ───

export function MediaClient() {
  const { hasPermission } = useAuthStore();

  // State
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [folder, setFolder] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);

  // Upload
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadFolder, setUploadFolder] = useState("General");
  const [uploadAltText, setUploadAltText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Rename
  const [renameOpen, setRenameOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [renameAltText, setRenameAltText] = useState("");
  const [renameFolder, setRenameFolder] = useState("");
  const [renaming, setRenaming] = useState(false);

  // Delete
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Permissions
  const canCreate = hasPermission("media.create");
  const canUpdate = hasPermission("media.update");
  const canDelete = hasPermission("media.delete");

  // ─── Fetch Media ───

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        search,
        folder,
      });
      const res = await fetch(`/api/media?${params}`);
      if (res.ok) {
        const data = await res.json();
        setMedia(data.media);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch {
      toast.error("Failed to load media");
    } finally {
      setLoading(false);
    }
  }, [page, search, folder]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  // ─── Upload Handlers ───

  const validateFiles = (files: File[]): { valid: File[]; errors: string[] } => {
    const valid: File[] = [];
    const errors: string[] = [];

    for (const file of files) {
      const ext = getFileExtension(file.name);
      if (!ALLOWED_TYPES.includes(ext)) {
        errors.push(`${file.name}: Type .${ext} not allowed`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: Exceeds 5MB limit`);
        continue;
      }
      valid.push(file);
    }

    return { valid, errors };
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    const { valid, errors } = validateFiles(Array.from(files));
    errors.forEach((e) => toast.error(e));
    if (valid.length > 0) {
      setUploadFiles((prev) => [...prev, ...valid]);
      setUploadOpen(true);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!canCreate) {
      toast.error("You don't have permission to upload files");
      return;
    }
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeUploadFile = (index: number) => {
    setUploadFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (uploadFiles.length === 0) return;
    setUploading(true);

    let successCount = 0;
    let failCount = 0;

    for (const file of uploadFiles) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", uploadFolder);
        if (uploadAltText) formData.append("altText", uploadAltText);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          successCount++;
        } else {
          const err = await res.json();
          toast.error(`${file.name}: ${err.error || "Upload failed"}`);
          failCount++;
        }
      } catch {
        toast.error(`${file.name}: Upload failed`);
        failCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} file${successCount > 1 ? "s" : ""} uploaded successfully`);
      fetchMedia();
    }

    if (failCount === 0) {
      setUploadOpen(false);
      setUploadFiles([]);
      setUploadAltText("");
    }

    setUploading(false);
  };

  // ─── Action Handlers ───

  const handlePreview = (item: MediaItem) => {
    window.open(item.filePath, "_blank");
  };

  const handleCopyUrl = async (item: MediaItem) => {
    try {
      const url = `${window.location.origin}${item.filePath}`;
      await navigator.clipboard.writeText(url);
      toast.success("URL copied!");
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  const handleRename = (item: MediaItem) => {
    setSelectedMedia(item);
    setRenameValue(item.fileName);
    setRenameAltText(item.altText || "");
    setRenameFolder(item.folder);
    setRenameOpen(true);
  };

  const onRenameSubmit = async () => {
    if (!selectedMedia) return;
    setRenaming(true);
    try {
      const res = await fetch(`/api/media/${selectedMedia.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: renameValue,
          altText: renameAltText,
          folder: renameFolder,
        }),
      });
      if (res.ok) {
        toast.success("Media updated successfully");
        setRenameOpen(false);
        setSelectedMedia(null);
        fetchMedia();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to update media");
      }
    } catch {
      toast.error("Failed to update media");
    } finally {
      setRenaming(false);
    }
  };

  const handleDelete = (item: MediaItem) => {
    setSelectedMedia(item);
    setDeleteOpen(true);
  };

  const onDeleteConfirm = async () => {
    if (!selectedMedia) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/media/${selectedMedia.id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Media deleted successfully");
        setDeleteOpen(false);
        setSelectedMedia(null);
        fetchMedia();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to delete media");
      }
    } catch {
      toast.error("Failed to delete media");
    } finally {
      setDeleting(false);
    }
  };

  // ─── File Thumbnail ───

  const FileThumbnail = ({ item, size = "md" }: { item: MediaItem; size?: "sm" | "md" }) => {
    const isImage = isImageType(item.fileType);
    const dimClass = size === "sm" ? "h-8 w-8" : "h-full w-full";

    if (isImage) {
      return (
        <img
          src={item.filePath}
          alt={item.altText || item.fileName}
          className={`${dimClass} object-cover rounded`}
          loading="lazy"
        />
      );
    }

    return (
      <div className={`${dimClass} flex items-center justify-center bg-white/5 rounded`}>
        <FileText className={size === "sm" ? "h-4 w-4" : "h-8 w-8"} style={{ color: "#ef4444" }} />
      </div>
    );
  };

  // ─── Render ───

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Media Library</h2>
          <p className="text-muted-foreground">Upload and manage your media files</p>
        </div>
        {canCreate && (
          <Button
            onClick={() => {
              setUploadFiles([]);
              setUploadAltText("");
              setUploadFolder("General");
              fileInputRef.current?.click();
            }}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Files
          </Button>
        )}
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ALLOWED_TYPES.map((t) => `.${t}`).join(",")}
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
      </div>

      {/* Upload Drop Zone */}
      {canCreate && (
        <div
          ref={dropRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative rounded-xl border-2 border-dashed p-8 text-center transition-colors
            ${isDragOver
              ? "border-primary bg-primary/5"
              : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.03]"
            }
          `}
        >
          <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-sm font-medium text-muted-foreground">
            Drop files here or click to upload
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            JPG, PNG, WebP, SVG, PDF — Max 5MB per file
          </p>
        </div>
      )}

      {/* Folder Tabs + Search + View Toggle */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={folder}
          onValueChange={(v) => { setFolder(v); setPage(1); }}
          className="w-full sm:w-auto"
        >
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            {FOLDERS.map((f) => (
              <TabsTrigger key={f} value={f} className="text-xs">
                {f}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 border-white/10 bg-white/5"
            />
          </div>

          <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              className="h-9 w-9 rounded-none"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              className="h-9 w-9 rounded-none"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : media.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mb-3 opacity-40" />
              <p className="text-sm">No media files found</p>
              <p className="text-xs mt-1">Upload files to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {media.map((item) => (
                <Card
                  key={item.id}
                  className="group relative overflow-hidden border-white/5 bg-white/[0.02] hover:border-white/10 transition-colors py-0 gap-0"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-square overflow-hidden bg-white/5">
                    <FileThumbnail item={item} />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white hover:bg-white/20"
                        onClick={() => handlePreview(item)}
                        title="Preview"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white hover:bg-white/20"
                        onClick={() => handleCopyUrl(item)}
                        title="Copy URL"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      {canUpdate && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-white hover:bg-white/20"
                          onClick={() => handleRename(item)}
                          title="Rename"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-white hover:bg-white/20"
                          onClick={() => handleDelete(item)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  {/* Info */}
                  <CardContent className="p-3">
                    <p className="text-sm font-medium truncate" title={item.fileName}>
                      {item.fileName}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground uppercase">
                        {item.fileType}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(item.fileSize)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="rounded-lg border border-white/5 bg-white/[0.02]">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="w-[60px]">Preview</TableHead>
                  <TableHead>File Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Folder</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                    </TableCell>
                  </TableRow>
                ) : media.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No media files found
                    </TableCell>
                  </TableRow>
                ) : (
                  media.map((item) => (
                    <TableRow key={item.id} className="border-white/5">
                      <TableCell>
                        <FileThumbnail item={item} size="sm" />
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-sm truncate max-w-[200px]" title={item.fileName}>
                          {item.fileName}
                        </p>
                        {item.altText && (
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {item.altText}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs uppercase text-muted-foreground">
                          {item.fileType}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatFileSize(item.fileSize)}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <FolderOpen className="h-3 w-3" />
                          {item.folder}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(item.createdAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handlePreview(item)}>
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCopyUrl(item)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Copy URL
                            </DropdownMenuItem>
                            {canUpdate && (
                              <DropdownMenuItem onClick={() => handleRename(item)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Rename
                              </DropdownMenuItem>
                            )}
                            {canDelete && (
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDelete(item)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {total} file{total !== 1 ? "s" : ""} total
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-white/10"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-white/10"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onOpenChange={(open) => {
        if (!open) {
          setUploadFiles([]);
          setUploadAltText("");
        }
        setUploadOpen(open);
      }}>
        <DialogContent className="border-white/10 bg-[#0D1117] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
            <DialogDescription>Upload media files to your library</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Selected Files */}
            {uploadFiles.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {uploadFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between gap-2 rounded-lg border border-white/5 bg-white/[0.02] p-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {isImageType(getFileExtension(file.name)) ? (
                        <ImageIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                      ) : (
                        <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                      <span className="text-sm truncate">{file.name}</span>
                      <span className="text-xs text-muted-foreground shrink-0">
                        ({formatFileSize(file.size)})
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={() => removeUploadFile(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add more files */}
            <Button
              variant="outline"
              className="w-full border-dashed border-white/10"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Add more files
            </Button>

            {/* Folder selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Folder</label>
              <Select value={uploadFolder} onValueChange={setUploadFolder}>
                <SelectTrigger className="border-white/10 bg-white/5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FOLDERS.map((f) => (
                    <SelectItem key={f} value={f}>
                      <span className="flex items-center gap-2">
                        <FolderOpen className="h-3 w-3" />
                        {f}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Alt text */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Alt Text (optional)</label>
              <Input
                placeholder="Describe the image for accessibility"
                value={uploadAltText}
                onChange={(e) => setUploadAltText(e.target.value)}
                className="border-white/10 bg-white/5"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setUploadOpen(false);
                setUploadFiles([]);
                setUploadAltText("");
              }}
              className="border-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={uploading || uploadFiles.length === 0}
            >
              {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Upload {uploadFiles.length > 0 ? `(${uploadFiles.length})` : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className="border-white/10 bg-[#0D1117] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Media</DialogTitle>
            <DialogDescription>Update file details</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Preview */}
            {selectedMedia && (
              <div className="flex items-center justify-center rounded-lg border border-white/5 bg-white/[0.02] p-4">
                <div className="h-24 w-24">
                  <FileThumbnail item={selectedMedia} />
                </div>
              </div>
            )}

            {/* File name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">File Name</label>
              <Input
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                className="border-white/10 bg-white/5"
              />
            </div>

            {/* Alt text */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Alt Text</label>
              <Input
                placeholder="Describe the image for accessibility"
                value={renameAltText}
                onChange={(e) => setRenameAltText(e.target.value)}
                className="border-white/10 bg-white/5"
              />
            </div>

            {/* Folder */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Folder</label>
              <Select value={renameFolder} onValueChange={setRenameFolder}>
                <SelectTrigger className="border-white/10 bg-white/5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FOLDERS.map((f) => (
                    <SelectItem key={f} value={f}>
                      <span className="flex items-center gap-2">
                        <FolderOpen className="h-3 w-3" />
                        {f}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRenameOpen(false)}
              className="border-white/10"
            >
              Cancel
            </Button>
            <Button onClick={onRenameSubmit} disabled={renaming}>
              {renaming && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="border-white/10 bg-[#0D1117]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Media</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{selectedMedia?.fileName}</strong>? This action
              cannot be undone. The file will be permanently removed from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDeleteConfirm}
              disabled={deleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
