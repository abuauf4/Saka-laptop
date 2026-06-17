// ─── Nauka CMS — Branding Client Component

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
  Palette,
  ImageIcon,
  Link2,
  Globe,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
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
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/lib/auth-store";

// ─── Types

interface BrandingData {
  siteName: string;
  tagline: string;
  siteDescription: string | null;
  logo: string | null;
  favicon: string | null;
  copyrightText: string;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  youtube: string | null;
  linkedin: string | null;
}

// ─── Schema

const brandingSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  tagline: z.string().min(1, "Tagline is required"),
  siteDescription: z.string().optional(),
  logo: z.string().nullable(),
  favicon: z.string().nullable(),
  copyrightText: z.string().min(1, "Copyright text is required"),
  instagram: z.string().nullable(),
  facebook: z.string().nullable(),
  tiktok: z.string().nullable(),
  youtube: z.string().nullable(),
  linkedin: z.string().nullable(),
});

type BrandingForm = z.infer<typeof brandingSchema>;

export function BrandingClient() {
  const { hasPermission } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);

  const canUpdate = hasPermission("branding.update");
  const canView = hasPermission("branding.view");

  const form = useForm<BrandingForm>({
    resolver: zodResolver(brandingSchema),
    defaultValues: {
      siteName: "Nauka",
      tagline: "small movement, real impact",
      siteDescription: "",
      logo: null,
      favicon: null,
      copyrightText: "© 2026 Nauka. All rights reserved.",
      instagram: null,
      facebook: null,
      tiktok: null,
      youtube: null,
      linkedin: null,
    },
  });

  const fetchBranding = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/branding");
      if (res.ok) {
        const data: BrandingData = await res.json();
        form.reset({
          siteName: data.siteName || "Nauka",
          tagline: data.tagline || "",
          siteDescription: data.siteDescription || "",
          logo: data.logo || null,
          favicon: data.favicon || null,
          copyrightText: data.copyrightText || "",
          instagram: data.instagram || null,
          facebook: data.facebook || null,
          tiktok: data.tiktok || null,
          youtube: data.youtube || null,
          linkedin: data.linkedin || null,
        });
        setLogoPreview(data.logo || null);
        setFaviconPreview(data.favicon || null);
      }
    } catch {
      toast.error("Failed to load branding data");
    } finally {
      setLoading(false);
    }
  }, [form]);

  useEffect(() => {
    fetchBranding();
  }, [fetchBranding]);

  const onSubmit = async (data: BrandingForm) => {
    setSaving(true);
    try {
      const res = await fetch("/api/branding", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updated = await res.json();
        form.reset({
          siteName: updated.siteName,
          tagline: updated.tagline,
          siteDescription: updated.siteDescription || "",
          logo: updated.logo || null,
          favicon: updated.favicon || null,
          copyrightText: updated.copyrightText,
          instagram: updated.instagram || null,
          facebook: updated.facebook || null,
          tiktok: updated.tiktok || null,
          youtube: updated.youtube || null,
          linkedin: updated.linkedin || null,
        });
        toast.success("Branding saved successfully");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to save branding");
      }
    } catch {
      toast.error("Failed to save branding");
    } finally {
      setSaving(false);
    }
  };

  // No permission to view at all
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
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-white/5 bg-white/[0.02]">
            <CardHeader>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-56" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const { register, handleSubmit, watch, setValue, formState: { errors } } = form;

  const watchLogo = watch("logo");
  const watchFavicon = watch("favicon");

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
          <h2 className="text-2xl font-bold tracking-tight">Branding</h2>
          <p className="text-muted-foreground">Customize your site identity, assets, and social presence</p>
        </div>
        {canUpdate && (
          <Button onClick={handleSubmit(onSubmit)} disabled={saving}>
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save All Changes
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ─── General Section ─── */}
        <Card className="border-white/5 bg-white/[0.02]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <CardTitle>General</CardTitle>
            </div>
            <CardDescription>Basic site identity information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  placeholder="My Website"
                  className="border-white/10 bg-white/5"
                  disabled={!canUpdate}
                  {...register("siteName")}
                />
                {errors.siteName && (
                  <p className="text-xs text-destructive">{errors.siteName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  placeholder="A short catchy phrase"
                  className="border-white/10 bg-white/5"
                  disabled={!canUpdate}
                  {...register("tagline")}
                />
                {errors.tagline && (
                  <p className="text-xs text-destructive">{errors.tagline.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                placeholder="A brief description of your website..."
                className="min-h-[100px] border-white/10 bg-white/5 resize-none"
                disabled={!canUpdate}
                {...register("siteDescription")}
              />
            </div>
          </CardContent>
        </Card>

        {/* ─── Assets Section ─── */}
        <Card className="border-white/5 bg-white/[0.02]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" />
              <CardTitle>Assets</CardTitle>
            </div>
            <CardDescription>Logo and favicon for your site</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Logo */}
              <div className="space-y-3">
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  placeholder="https://example.com/logo.png"
                  className="border-white/10 bg-white/5"
                  disabled={!canUpdate}
                  {...register("logo")}
                  onChange={(e) => {
                    register("logo").onChange(e);
                    setLogoPreview(e.target.value || null);
                  }}
                />
                {watchLogo && (
                  <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
                    <img
                      src={watchLogo}
                      alt="Logo preview"
                      className="h-12 w-12 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <span className="text-sm text-muted-foreground">Logo preview</span>
                  </div>
                )}
              </div>
              {/* Favicon */}
              <div className="space-y-3">
                <Label htmlFor="favicon">Favicon URL</Label>
                <Input
                  id="favicon"
                  placeholder="https://example.com/favicon.ico"
                  className="border-white/10 bg-white/5"
                  disabled={!canUpdate}
                  {...register("favicon")}
                  onChange={(e) => {
                    register("favicon").onChange(e);
                    setFaviconPreview(e.target.value || null);
                  }}
                />
                {watchFavicon && (
                  <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
                    <img
                      src={watchFavicon}
                      alt="Favicon preview"
                      className="h-8 w-8 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <span className="text-sm text-muted-foreground">Favicon preview</span>
                  </div>
                )}
              </div>
            </div>
            {!canUpdate && (
              <p className="text-xs text-muted-foreground">
                Contact an administrator to update site assets.
              </p>
            )}
          </CardContent>
        </Card>

        {/* ─── Footer Section ─── */}
        <Card className="border-white/5 bg-white/[0.02]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              <CardTitle>Footer</CardTitle>
            </div>
            <CardDescription>Footer branding and copyright</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="copyrightText">Copyright Text</Label>
              <Input
                id="copyrightText"
                placeholder="© 2026 My Website. All rights reserved."
                className="border-white/10 bg-white/5"
                disabled={!canUpdate}
                {...register("copyrightText")}
              />
              {errors.copyrightText && (
                <p className="text-xs text-destructive">{errors.copyrightText.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ─── Social Media Section ─── */}
        <Card className="border-white/5 bg-white/[0.02]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-primary" />
              <CardTitle>Social Media</CardTitle>
            </div>
            <CardDescription>Links to your social media profiles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="instagram" className="flex items-center gap-2">
                  <Instagram className="h-4 w-4 text-pink-400" />
                  Instagram
                </Label>
                <Input
                  id="instagram"
                  placeholder="https://instagram.com/yourprofile"
                  className="border-white/10 bg-white/5"
                  disabled={!canUpdate}
                  {...register("instagram")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook" className="flex items-center gap-2">
                  <Facebook className="h-4 w-4 text-blue-400" />
                  Facebook
                </Label>
                <Input
                  id="facebook"
                  placeholder="https://facebook.com/yourpage"
                  className="border-white/10 bg-white/5"
                  disabled={!canUpdate}
                  {...register("facebook")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tiktok" className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-white/70" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.57 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.36-6.22V8.79a8.18 8.18 0 0 0 4.86 1.58V6.89a4.85 4.85 0 0 1-1-.2z"/>
                  </svg>
                  TikTok
                </Label>
                <Input
                  id="tiktok"
                  placeholder="https://tiktok.com/@yourprofile"
                  className="border-white/10 bg-white/5"
                  disabled={!canUpdate}
                  {...register("tiktok")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube" className="flex items-center gap-2">
                  <Youtube className="h-4 w-4 text-red-400" />
                  YouTube
                </Label>
                <Input
                  id="youtube"
                  placeholder="https://youtube.com/@yourchannel"
                  className="border-white/10 bg-white/5"
                  disabled={!canUpdate}
                  {...register("youtube")}
                />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="linkedin" className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4 text-sky-400" />
                  LinkedIn
                </Label>
                <Input
                  id="linkedin"
                  placeholder="https://linkedin.com/company/yourcompany"
                  className="border-white/10 bg-white/5"
                  disabled={!canUpdate}
                  {...register("linkedin")}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom save bar for mobile */}
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
                Save All Changes
              </Button>
            </div>
          </>
        )}
      </form>
    </motion.div>
  );
}
