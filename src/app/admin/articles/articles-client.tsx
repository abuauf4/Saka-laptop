// ─── Nauka CMS — Articles Management Client Component ───

"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  ArrowLeft,
  ChevronDown,
  Image as ImageIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useAuthStore } from "@/lib/auth-store";

// ─── Types ───

interface ArticleRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  status: string;
  metaTitle: string | null;
  metaDesc: string | null;
  ogImage: string | null;
  authorId: string | null;
  authorName: string | null;
  categoryId: string | null;
  category: { id: string; name: string; slug: string } | null;
  createdAt: string;
  updatedAt: string;
}

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  articleCount: number;
}

type ViewMode = "list" | "editor" | "categories";

// ─── Slug helper ───

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─── Status badge ───

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
    published: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    archived: "border-zinc-500/20 bg-zinc-500/10 text-zinc-400",
  };
  return (
    <Badge variant="outline" className={`text-xs capitalize ${styles[status] || styles.draft}`}>
      {status}
    </Badge>
  );
}

// ─── Main Component ───

export function ArticlesClient() {
  const { hasPermission } = useAuthStore();

  // View mode
  const [view, setView] = useState<ViewMode>("list");

  // Article list state
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Editor state
  const [editArticle, setEditArticle] = useState<ArticleRow | null>(null);
  const [editorTitle, setEditorTitle] = useState("");
  const [editorSlug, setEditorSlug] = useState("");
  const [editorSlugManuallySet, setEditorSlugManuallySet] = useState(false);
  const [editorExcerpt, setEditorExcerpt] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [editorCoverImage, setEditorCoverImage] = useState("");
  const [editorCategoryId, setEditorCategoryId] = useState("");
  const [editorAuthorId, setEditorAuthorId] = useState("");
  const [editorStatus, setEditorStatus] = useState("draft");
  const [editorMetaTitle, setEditorMetaTitle] = useState("");
  const [editorMetaDesc, setEditorMetaDesc] = useState("");
  const [editorOgImage, setEditorOgImage] = useState("");
  const [seoOpen, setSeoOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ArticleRow | null>(null);

  // Category dialog
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [catEditId, setCatEditId] = useState<string | null>(null);
  const [catName, setCatName] = useState("");
  const [catSubmitting, setCatSubmitting] = useState(false);

  // Category delete
  const [catDeleteOpen, setCatDeleteOpen] = useState(false);
  const [catDeleteTarget, setCatDeleteTarget] = useState<CategoryRow | null>(null);

  const canCreate = hasPermission("articles.create");
  const canUpdate = hasPermission("articles.update");
  const canDelete = hasPermission("articles.delete");

  // ─── Fetch articles ───
  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        search,
        status: statusFilter,
        categoryId: categoryFilter !== "all" ? categoryFilter : "",
      });
      const res = await fetch(`/api/articles?${params}`);
      if (res.ok) {
        const data = await res.json();
        setArticles(data.articles);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch {
      toast.error("Failed to load articles");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, categoryFilter]);

  // ─── Fetch categories ───
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories);
      }
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // ─── Open editor for new article ───
  const handleCreate = () => {
    setEditArticle(null);
    setEditorTitle("");
    setEditorSlug("");
    setEditorSlugManuallySet(false);
    setEditorExcerpt("");
    setEditorContent("");
    setEditorCoverImage("");
    setEditorCategoryId("");
    setEditorAuthorId("");
    setEditorStatus("draft");
    setEditorMetaTitle("");
    setEditorMetaDesc("");
    setEditorOgImage("");
    setSeoOpen(false);
    setView("editor");
  };

  // ─── Open editor for existing article ───
  const handleEdit = (article: ArticleRow) => {
    setEditArticle(article);
    setEditorTitle(article.title);
    setEditorSlug(article.slug);
    setEditorSlugManuallySet(true);
    setEditorExcerpt(article.excerpt || "");
    setEditorContent(""); // Content is loaded separately
    setEditorCoverImage(article.coverImage || "");
    setEditorCategoryId(article.categoryId || "");
    setEditorAuthorId(article.authorId || "");
    setEditorStatus(article.status);
    setEditorMetaTitle(article.metaTitle || "");
    setEditorMetaDesc(article.metaDesc || "");
    setEditorOgImage(article.ogImage || "");
    setSeoOpen(false);

    // Load full article content
    fetch(`/api/articles/${article.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.article) {
          setEditorContent(data.article.content || "");
        }
      })
      .catch(() => {});

    setView("editor");
  };

  // ─── Title change → auto slug ───
  const handleTitleChange = (value: string) => {
    setEditorTitle(value);
    if (!editorSlugManuallySet) {
      setEditorSlug(generateSlug(value));
    }
  };

  // ─── Slug manual edit ───
  const handleSlugChange = (value: string) => {
    setEditorSlug(value);
    setEditorSlugManuallySet(true);
  };

  // ─── Save article ───
  const handleSave = async (saveAsStatus?: string) => {
    const statusToSave = saveAsStatus || editorStatus;
    setSubmitting(true);
    try {
      const body = {
        title: editorTitle,
        slug: editorSlug,
        excerpt: editorExcerpt,
        content: editorContent,
        coverImage: editorCoverImage,
        status: statusToSave,
        metaTitle: editorMetaTitle,
        metaDesc: editorMetaDesc,
        ogImage: editorOgImage,
        authorId: editorAuthorId || undefined,
        categoryId: editorCategoryId || null,
      };

      let res: Response;
      if (editArticle) {
        res = await fetch(`/api/articles/${editArticle.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch("/api/articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      if (res.ok) {
        toast.success(editArticle ? "Article updated successfully" : "Article created successfully");
        setView("list");
        fetchArticles();
        fetchCategories();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to save article");
      }
    } catch {
      toast.error("Failed to save article");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Delete article ───
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/articles/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Article deleted successfully");
        setDeleteOpen(false);
        setDeleteTarget(null);
        fetchArticles();
        fetchCategories();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to delete article");
      }
    } catch {
      toast.error("Failed to delete article");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Toggle publish ───
  const handleTogglePublish = async (article: ArticleRow) => {
    const newStatus = article.status === "published" ? "draft" : "published";
    try {
      const res = await fetch(`/api/articles/${article.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast.success(newStatus === "published" ? "Article published" : "Article unpublished");
        fetchArticles();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to update status");
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  // ─── Category CRUD ───
  const handleCategorySave = async () => {
    if (!catName.trim()) {
      toast.error("Category name is required");
      return;
    }
    setCatSubmitting(true);
    try {
      let res: Response;
      if (catEditId) {
        res = await fetch(`/api/categories/${catEditId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: catName }),
        });
      } else {
        res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: catName }),
        });
      }
      if (res.ok) {
        toast.success(catEditId ? "Category updated" : "Category created");
        setCatDialogOpen(false);
        setCatEditId(null);
        setCatName("");
        fetchCategories();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to save category");
      }
    } catch {
      toast.error("Failed to save category");
    } finally {
      setCatSubmitting(false);
    }
  };

  const handleCategoryDelete = async () => {
    if (!catDeleteTarget) return;
    setCatSubmitting(true);
    try {
      const res = await fetch(`/api/categories/${catDeleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Category deleted");
        setCatDeleteOpen(false);
        setCatDeleteTarget(null);
        fetchCategories();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to delete category");
      }
    } catch {
      toast.error("Failed to delete category");
    } finally {
      setCatSubmitting(false);
    }
  };

  const openCategoryEdit = (cat: CategoryRow) => {
    setCatEditId(cat.id);
    setCatName(cat.name);
    setCatDialogOpen(true);
  };

  const openCategoryCreate = () => {
    setCatEditId(null);
    setCatName("");
    setCatDialogOpen(true);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // ─── Render: Article List ───
  if (view === "list") {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Articles</h2>
            <p className="text-muted-foreground">Manage your blog posts and content</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setView("categories")} className="border-white/10">
              <FolderOpen className="mr-2 h-4 w-4" />
              Categories
            </Button>
            {canCreate && (
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Create Article
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 border-white/10 bg-white/5"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[140px] border-white/10 bg-white/5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[150px] border-white/10 bg-white/5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="rounded-lg border border-white/5 bg-white/[0.02]">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Author</TableHead>
                  <TableHead className="hidden lg:table-cell">Created</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                    </TableCell>
                  </TableRow>
                ) : articles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No articles found
                    </TableCell>
                  </TableRow>
                ) : (
                  articles.map((article) => (
                    <TableRow key={article.id} className="border-white/5">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {article.coverImage ? (
                            <div className="h-10 w-14 rounded overflow-hidden bg-white/5 flex-shrink-0">
                              <img
                                src={article.coverImage}
                                alt={article.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-10 w-14 rounded bg-white/5 flex items-center justify-center flex-shrink-0">
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate max-w-[200px] sm:max-w-[280px]">
                              {article.title}
                            </p>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-[280px]">
                              /{article.slug}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {article.category ? (
                          <Badge variant="outline" className="text-xs border-white/10">
                            {article.category.name}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">Uncategorized</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={article.status} />
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                        {article.authorName || "—"}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {formatDate(article.createdAt)}
                      </TableCell>
                      <TableCell>
                        {(canUpdate || canDelete) && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {canUpdate && (
                                <>
                                  <DropdownMenuItem onClick={() => handleEdit(article)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleTogglePublish(article)}>
                                    {article.status === "published" ? (
                                      <>
                                        <EyeOff className="mr-2 h-4 w-4" />
                                        Unpublish
                                      </>
                                    ) : (
                                      <>
                                        <Eye className="mr-2 h-4 w-4" />
                                        Publish
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                </>
                              )}
                              {canDelete && (
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => { setDeleteTarget(article); setDeleteOpen(true); }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {total} article{total !== 1 ? "s" : ""} total
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

        {/* Delete Confirmation */}
        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogContent className="border-white/10 bg-[#0D1117]">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Article</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete <strong>{deleteTarget?.title}</strong>? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-white/10">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
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

  // ─── Render: Article Editor ───
  if (view === "editor") {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setView("list")} className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                {editArticle ? "Edit Article" : "Create Article"}
              </h2>
              <p className="text-muted-foreground">
                {editArticle ? "Update article content and settings" : "Write a new article"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleSave("draft")}
              disabled={submitting || !canCreate}
              className="border-white/10"
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save as Draft
            </Button>
            <Button
              onClick={() => handleSave("published")}
              disabled={submitting || !canCreate}
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Publish
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Main Column */}
          <div className="space-y-6">
            {/* Basic Info */}
            <Card className="border-white/5 bg-white/[0.02]">
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Article title"
                    value={editorTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="border-white/10 bg-white/5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    placeholder="article-url-slug"
                    value={editorSlug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    className="border-white/10 bg-white/5"
                  />
                  <p className="text-xs text-muted-foreground">
                    Auto-generated from title. Edit to customize.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Brief summary of the article..."
                    value={editorExcerpt}
                    onChange={(e) => setEditorExcerpt(e.target.value)}
                    rows={3}
                    className="border-white/10 bg-white/5 resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Content */}
            <Card className="border-white/5 bg-white/[0.02]">
              <CardHeader>
                <CardTitle className="text-lg">Content</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Write your article content here (Markdown supported)..."
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                  rows={20}
                  className="border-white/10 bg-white/5 resize-y font-mono text-sm min-h-[300px]"
                />
              </CardContent>
            </Card>

            {/* SEO Section (Collapsible) */}
            <Collapsible open={seoOpen} onOpenChange={setSeoOpen}>
              <Card className="border-white/5 bg-white/[0.02]">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">SEO Settings</CardTitle>
                      <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${seoOpen ? "rotate-180" : ""}`} />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="metaTitle">Meta Title</Label>
                      <Input
                        id="metaTitle"
                        placeholder="SEO meta title"
                        value={editorMetaTitle}
                        onChange={(e) => setEditorMetaTitle(e.target.value)}
                        className="border-white/10 bg-white/5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="metaDesc">Meta Description</Label>
                      <Textarea
                        id="metaDesc"
                        placeholder="SEO meta description..."
                        value={editorMetaDesc}
                        onChange={(e) => setEditorMetaDesc(e.target.value)}
                        rows={3}
                        className="border-white/10 bg-white/5 resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ogImage">OG Image URL</Label>
                      <Input
                        id="ogImage"
                        placeholder="https://example.com/og-image.jpg"
                        value={editorOgImage}
                        onChange={(e) => setEditorOgImage(e.target.value)}
                        className="border-white/10 bg-white/5"
                      />
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Cover Image */}
            <Card className="border-white/5 bg-white/[0.02]">
              <CardHeader>
                <CardTitle className="text-lg">Cover Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="Image URL"
                  value={editorCoverImage}
                  onChange={(e) => setEditorCoverImage(e.target.value)}
                  className="border-white/10 bg-white/5"
                />
                {editorCoverImage && (
                  <div className="rounded-lg overflow-hidden border border-white/10">
                    <img
                      src={editorCoverImage}
                      alt="Cover preview"
                      className="w-full h-40 object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                )}
                {!editorCoverImage && (
                  <div className="rounded-lg border border-dashed border-white/10 h-40 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <ImageIcon className="mx-auto h-8 w-8 mb-2" />
                      <p className="text-xs">No cover image</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Classification */}
            <Card className="border-white/5 bg-white/[0.02]">
              <CardHeader>
                <CardTitle className="text-lg">Classification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={editorCategoryId} onValueChange={setEditorCategoryId}>
                    <SelectTrigger className="border-white/10 bg-white/5">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Uncategorized</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Author ID</Label>
                  <Input
                    placeholder="Author user ID (optional)"
                    value={editorAuthorId}
                    onChange={(e) => setEditorAuthorId(e.target.value)}
                    className="border-white/10 bg-white/5"
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty to use your account as author
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card className="border-white/5 bg-white/[0.02]">
              <CardHeader>
                <CardTitle className="text-lg">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={editorStatus} onValueChange={setEditorStatus}>
                  <div className="flex items-center space-x-2 mb-3">
                    <RadioGroupItem value="draft" id="draft" />
                    <Label htmlFor="draft" className="cursor-pointer flex items-center gap-2">
                      <StatusBadge status="draft" />
                      Draft
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 mb-3">
                    <RadioGroupItem value="published" id="published" />
                    <Label htmlFor="published" className="cursor-pointer flex items-center gap-2">
                      <StatusBadge status="published" />
                      Published
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="archived" id="archived" />
                    <Label htmlFor="archived" className="cursor-pointer flex items-center gap-2">
                      <StatusBadge status="archived" />
                      Archived
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // ─── Render: Categories ───
  if (view === "categories") {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setView("list")} className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
              <p className="text-muted-foreground">Manage article categories</p>
            </div>
          </div>
          <Button onClick={openCategoryCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>

        {/* Category List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {categories.map((cat) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Card className="border-white/5 bg-white/[0.02] hover:border-white/10 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{cat.name}</p>
                          <p className="text-xs text-muted-foreground">/{cat.slug}</p>
                        </div>
                        <Badge variant="outline" className="border-white/10 text-xs">
                          {cat.articleCount} article{cat.articleCount !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => openCategoryEdit(cat)}
                        >
                          <Pencil className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-destructive hover:text-destructive"
                          onClick={() => { setCatDeleteTarget(cat); setCatDeleteOpen(true); }}
                        >
                          <Trash2 className="mr-1 h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {categories.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <FolderOpen className="mx-auto h-10 w-10 mb-3" />
            <p>No categories yet</p>
            <p className="text-sm">Create your first category to organize articles</p>
          </div>
        )}

        {/* Category Create/Edit Dialog */}
        <Dialog open={catDialogOpen} onOpenChange={setCatDialogOpen}>
          <DialogContent className="border-white/10 bg-[#0D1117] sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{catEditId ? "Edit Category" : "Create Category"}</DialogTitle>
              <DialogDescription>
                {catEditId ? "Update the category name" : "Add a new category for your articles"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="catName">Name</Label>
                <Input
                  id="catName"
                  placeholder="Category name"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="border-white/10 bg-white/5"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCatDialogOpen(false)} className="border-white/10">
                Cancel
              </Button>
              <Button onClick={handleCategorySave} disabled={catSubmitting}>
                {catSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {catEditId ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Category Delete Confirmation */}
        <AlertDialog open={catDeleteOpen} onOpenChange={setCatDeleteOpen}>
          <AlertDialogContent className="border-white/10 bg-[#0D1117]">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Category</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete <strong>{catDeleteTarget?.name}</strong>?
                {catDeleteTarget && catDeleteTarget.articleCount > 0 && (
                  <span className="block mt-2 text-destructive">
                    This category has {catDeleteTarget.articleCount} article(s). Reassign them first.
                  </span>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-white/10">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCategoryDelete}
                disabled={catSubmitting || (catDeleteTarget?.articleCount ?? 0) > 0}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                {catSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return null;
}
