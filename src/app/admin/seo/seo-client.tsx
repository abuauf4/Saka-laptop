// ─── Nauka CMS — SEO Client Component

"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Save,
  Loader2,
  Search,
  Globe,
  Home,
  Sparkles,
  ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/lib/auth-store";

// ─── Types

interface SeoData {
  id: string;
  siteTitle: string | null;
  metaDescription: string | null;
  keywords: string | null;
  homepageTitle: string | null;
  homepageDesc: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
}

interface BrandingData {
  siteName: string;
  tagline: string;
  siteDescription: string | null;
}

// ─── Schema

const seoSchema = z.object({
  siteTitle: z.string().nullable(),
  metaDescription: z.string().nullable(),
  keywords: z.string().nullable(),
  homepageTitle: z.string().nullable(),
  homepageDesc: z.string().nullable(),
  ogTitle: z.string().nullable(),
  ogDescription: z.string().nullable(),
  ogImage: z.string().nullable(),
});

type SeoForm = z.infer<typeof seoSchema>;

// ─── Character Count Indicator

function CharCount({
  value,
  min = 0,
  recommended = 160,
  max = 200,
}: {
  value: string;
  min?: number;
  recommended: number;
  max?: number;
}) {
  const len = value.length;
  let color = "text-muted-foreground";
  let status = "";

  if (len === 0) {
    status = "Empty";
  } else if (len < min) {
    color = "text-yellow-400";
    status = "Too short";
  } else if (len <= recommended) {
    color = "text-emerald-400";
    status = "Good";
  } else if (len <= max) {
    color = "text-yellow-400";
    status = "Slightly long";
  } else {
    color = "text-red-400";
    status = "Too long";
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className={color}>
        {len}/{recommended}
      </span>
      <span className={color}>({status})</span>
    </div>
  );
}

// ─── Google Search Preview

function GooglePreview({
  title,
  description,
  url,
}: {
  title: string;
  description: string;
  url: string;
}) {
  return (
    <div className="max-w-xl space-y-1 rounded-lg border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center gap-1.5">
        <div className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center">
          <Globe className="h-3 w-3 text-muted-foreground" />
        </div>
        <span className="text-xs text-muted-foreground truncate">
          {url || "https://example.com"}
        </span>
      </div>
      <h3 className="text-lg leading-snug text-blue-400 hover:underline cursor-pointer line-clamp-1">
        {title || "Page Title"}
      </h3>
      <p className="text-sm text-muted-foreground line-clamp-2">
        {description || "Meta description will appear here. Write a compelling description to improve click-through rates from search results."}
      </p>
    </div>
  );
}

export function SeoClient() {
  const { hasPermission } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [branding, setBranding] = useState<BrandingData | null>(null);
  const [activeTab, setActiveTab] = useState("global");

  const canUpdate = hasPermission("seo.update");
  const canView = hasPermission("seo.view");

  const form = useForm<SeoForm>({
    resolver: zodResolver(seoSchema),
    defaultValues: {
      siteTitle: null,
      metaDescription: null,
      keywords: null,
      homepageTitle: null,
      homepageDesc: null,
      ogTitle: null,
      ogDescription: null,
      ogImage: null,
    },
  });

  const { handleSubmit, watch, setValue, register, reset, formState: { errors } } = form;
  const watchAll = watch();

  const fetchSeo = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/seo");
      if (res.ok) {
        const data: SeoData = await res.json();
        reset({
          siteTitle: data.siteTitle || null,
          metaDescription: data.metaDescription || null,
          keywords: data.keywords || null,
          homepageTitle: data.homepageTitle || null,
          homepageDesc: data.homepageDesc || null,
          ogTitle: data.ogTitle || null,
          ogDescription: data.ogDescription || null,
          ogImage: data.ogImage || null,
        });
      }
    } catch {
      toast.error("Failed to load SEO data");
    } finally {
      setLoading(false);
    }
  }, [reset]);

  const fetchBranding = useCallback(async () => {
    try {
      const res = await fetch("/api/branding");
      if (res.ok) {
        const data: BrandingData = await res.json();
        setBranding(data);
      }
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchSeo();
    fetchBranding();
  }, [fetchSeo, fetchBranding]);

  const onSubmit = async (data: SeoForm) => {
    setSaving(true);
    try {
      const res = await fetch("/api/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updated = await res.json();
        reset(updated);
        toast.success("SEO settings saved successfully");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to save SEO settings");
      }
    } catch {
      toast.error("Failed to save SEO settings");
    } finally {
      setSaving(false);
    }
  };

  // Auto-fill from branding
  const autoFillGlobalFromBranding = () => {
    if (!branding) {
      toast.error("Branding data not loaded yet");
      return;
    }
    setValue("siteTitle", branding.siteName);
    if (branding.tagline) {
      setValue("metaDescription", branding.tagline);
    } else if (branding.siteDescription) {
      setValue("metaDescription", branding.siteDescription);
    }
    toast.success("Auto-filled from branding");
  };

  const autoFillHomepageFromBranding = () => {
    if (!branding) {
      toast.error("Branding data not loaded yet");
      return;
    }
    setValue("homepageTitle", branding.siteName);
    setValue("ogTitle", branding.siteName);
    if (branding.siteDescription) {
      setValue("homepageDesc", branding.siteDescription);
      setValue("ogDescription", branding.siteDescription);
    } else if (branding.tagline) {
      setValue("homepageDesc", branding.tagline);
      setValue("ogDescription", branding.tagline);
    }
    toast.success("Auto-filled from branding");
  };

  if (!canView) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">You don&apos;t have permission to view this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-36 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-72" />
        <Card className="border-white/5 bg-white/[0.02]">
          <CardHeader>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-56" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">SEO</h2>
          <p className="text-muted-foreground">Manage search engine optimization settings</p>
        </div>
        {canUpdate && (
          <Button onClick={handleSubmit(onSubmit)} disabled={saving}>
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save SEO Settings
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="border-white/10">
            <TabsTrigger value="global" className="gap-1.5">
              <Globe className="h-4 w-4" />
              Global SEO
            </TabsTrigger>
            <TabsTrigger value="homepage" className="gap-1.5">
              <Home className="h-4 w-4" />
              Homepage SEO
            </TabsTrigger>
          </TabsList>

          {/* ─── Global SEO Tab ─── */}
          <TabsContent value="global" className="space-y-6 mt-6">
            <Card className="border-white/5 bg-white/[0.02]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Search className="h-5 w-5 text-primary" />
                      <CardTitle>Global SEO Settings</CardTitle>
                    </div>
                    <CardDescription>
                      Default SEO metadata applied across your entire site
                    </CardDescription>
                  </div>
                  {canUpdate && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-white/10 gap-1.5"
                      onClick={autoFillGlobalFromBranding}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Auto-fill from Branding
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteTitle">Site Title</Label>
                  <Input
                    id="siteTitle"
                    placeholder="My Website — Official Site"
                    className="border-white/10 bg-white/5"
                    disabled={!canUpdate}
                    {...register("siteTitle")}
                  />
                  <p className="text-xs text-muted-foreground">
                    The main title used in search results and browser tabs
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <CharCount
                      value={watchAll.metaDescription || ""}
                      recommended={155}
                      max={200}
                    />
                  </div>
                  <Textarea
                    id="metaDescription"
                    placeholder="A compelling description of your website for search engines..."
                    className="min-h-[100px] border-white/10 bg-white/5 resize-none"
                    disabled={!canUpdate}
                    {...register("metaDescription")}
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: 150-160 characters for optimal display in search results
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords</Label>
                  <Input
                    id="keywords"
                    placeholder="keyword1, keyword2, keyword3"
                    className="border-white/10 bg-white/5"
                    disabled={!canUpdate}
                    {...register("keywords")}
                  />
                  <p className="text-xs text-muted-foreground">
                    Comma-separated keywords relevant to your site
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Google Preview — Global */}
            <Card className="border-white/5 bg-white/[0.02]">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-primary" />
                  <CardTitle>Search Result Preview</CardTitle>
                </div>
                <CardDescription>How your site may appear in Google search results</CardDescription>
              </CardHeader>
              <CardContent>
                <GooglePreview
                  title={watchAll.siteTitle || ""}
                  description={watchAll.metaDescription || ""}
                  url="https://example.com"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── Homepage SEO Tab ─── */}
          <TabsContent value="homepage" className="space-y-6 mt-6">
            <Card className="border-white/5 bg-white/[0.02]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Home className="h-5 w-5 text-primary" />
                      <CardTitle>Homepage SEO</CardTitle>
                    </div>
                    <CardDescription>
                      Specific SEO metadata for your homepage
                    </CardDescription>
                  </div>
                  {canUpdate && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-white/10 gap-1.5"
                      onClick={autoFillHomepageFromBranding}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Auto-fill from Branding
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="homepageTitle">Meta Title</Label>
                    <Input
                      id="homepageTitle"
                      placeholder="Homepage — My Website"
                      className="border-white/10 bg-white/5"
                      disabled={!canUpdate}
                      {...register("homepageTitle")}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="homepageDesc">Meta Description</Label>
                      <CharCount
                        value={watchAll.homepageDesc || ""}
                        recommended={155}
                        max={200}
                      />
                    </div>
                    <Textarea
                      id="homepageDesc"
                      placeholder="Description for your homepage..."
                      className="min-h-[80px] border-white/10 bg-white/5 resize-none"
                      disabled={!canUpdate}
                      {...register("homepageDesc")}
                    />
                  </div>
                </div>

                <Separator className="bg-white/5" />

                {/* Open Graph */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <svg className="h-4 w-4 text-green-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.77 2L2 6.77v10.46L6.77 22h10.46L22 17.23V6.77L17.23 2H6.77zM7 4h10l3 3v10l-3 3H7l-3-3V7l3-3z"/>
                      <path d="M8 7v10h3v-4h2v4h3V7h-3v3h-2V7H8z"/>
                    </svg>
                    Open Graph (Social Sharing)
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Controls how your homepage appears when shared on social media
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="ogTitle">OG Title</Label>
                      <Input
                        id="ogTitle"
                        placeholder="Title shown when shared on social media"
                        className="border-white/10 bg-white/5"
                        disabled={!canUpdate}
                        {...register("ogTitle")}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="ogDescription">OG Description</Label>
                        <CharCount
                          value={watchAll.ogDescription || ""}
                          recommended={155}
                          max={200}
                        />
                      </div>
                      <Textarea
                        id="ogDescription"
                        placeholder="Description shown when shared on social media..."
                        className="min-h-[80px] border-white/10 bg-white/5 resize-none"
                        disabled={!canUpdate}
                        {...register("ogDescription")}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ogImage">OG Image URL</Label>
                    <Input
                      id="ogImage"
                      placeholder="https://example.com/og-image.jpg"
                      className="border-white/10 bg-white/5"
                      disabled={!canUpdate}
                      {...register("ogImage")}
                    />
                    <p className="text-xs text-muted-foreground">
                      Recommended: 1200×630px for optimal display on social platforms
                    </p>
                    {watchAll.ogImage && (
                      <div className="mt-2 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                        <img
                          src={watchAll.ogImage}
                          alt="OG Image preview"
                          className="w-full max-w-sm object-cover aspect-[1200/630]"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Google Preview — Homepage */}
            <Card className="border-white/5 bg-white/[0.02]">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-primary" />
                  <CardTitle>Homepage Search Preview</CardTitle>
                </div>
                <CardDescription>How your homepage may appear in search results</CardDescription>
              </CardHeader>
              <CardContent>
                <GooglePreview
                  title={watchAll.homepageTitle || watchAll.siteTitle || ""}
                  description={watchAll.homepageDesc || watchAll.metaDescription || ""}
                  url="https://example.com"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Bottom save bar */}
        {canUpdate && (
          <>
            <Separator className="bg-white/5" />
            <div className="flex justify-end">
              <Button type="submit" disabled={saving} size="lg">
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save SEO Settings
              </Button>
            </div>
          </>
        )}
      </form>
    </motion.div>
  );
}
