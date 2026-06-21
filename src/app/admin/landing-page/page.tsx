// ─── Saka Laptop — Landing Page Editor Admin Page ───
// CMS editor untuk /jual-laptop-bekas-jakarta
// Mirror pattern /admin/homepage/page.tsx

"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Save,
  Loader2,
  Plus,
  Trash2,
  GripVertical,
  Eye,
  ArrowUp,
  ArrowDown,
  Home,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

// ─── Types ───
interface HeroTrustBadge {
  text: string;
}
interface ValuePillar {
  icon: string;
  headline: string;
  subCopy: string;
}
interface ProcessStep {
  step: string;
  headline: string;
  subCopy: string;
  duration: string;
}
interface FaqItem {
  q: string;
  a: string;
  keyword: string;
}
interface TrustStat {
  stat: string;
  label: string;
}
interface LandingPageContent {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  heroTrustBadges: HeroTrustBadge[];

  valuePillars: ValuePillar[];
  processSteps: ProcessStep[];

  estimasiTitle: string;
  estimasiSubtitle: string;
  estimasiCtaLabel: string;

  faqs: FaqItem[];

  trustStats: TrustStat[];
  trustTitle: string;
  trustSubtitle: string;

  finalCtaTitle: string;
  finalCtaSubtitle: string;
  finalCtaPrimary: string;
  finalCtaSecondary: string;

  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
}

const ICON_OPTIONS = [
  "Clock",
  "Camera",
  "Truck",
  "Wallet",
  "AlertCircle",
  "Sparkles",
  "Shield",
  "MapPin",
];

export default function LandingPageAdminPage() {
  const [content, setContent] = useState<LandingPageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ─── Fetch content on mount ───
  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch("/api/landing-page", { cache: "no-store" });
      const data = await res.json();
      setContent({
        heroEyebrow: data.heroEyebrow || "",
        heroTitle: data.heroTitle || "",
        heroSubtitle: data.heroSubtitle || "",
        heroPrimaryCta: data.heroPrimaryCta || "",
        heroSecondaryCta: data.heroSecondaryCta || "",
        heroTrustBadges: Array.isArray(data.heroTrustBadges) ? data.heroTrustBadges : [],
        valuePillars: Array.isArray(data.valuePillars) ? data.valuePillars : [],
        processSteps: Array.isArray(data.processSteps) ? data.processSteps : [],
        estimasiTitle: data.estimasiTitle || "",
        estimasiSubtitle: data.estimasiSubtitle || "",
        estimasiCtaLabel: data.estimasiCtaLabel || "",
        faqs: Array.isArray(data.faqs) ? data.faqs : [],
        trustStats: Array.isArray(data.trustStats) ? data.trustStats : [],
        trustTitle: data.trustTitle || "",
        trustSubtitle: data.trustSubtitle || "",
        finalCtaTitle: data.finalCtaTitle || "",
        finalCtaSubtitle: data.finalCtaSubtitle || "",
        finalCtaPrimary: data.finalCtaPrimary || "",
        finalCtaSecondary: data.finalCtaSecondary || "",
        metaTitle: data.metaTitle || "",
        metaDescription: data.metaDescription || "",
        ogTitle: data.ogTitle || "",
        ogDescription: data.ogDescription || "",
      });
    } catch {
      toast.error("Gagal load landing page content");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // ─── Save handler ───
  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    try {
      const res = await fetch("/api/landing-page", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Gagal save");
      }
      toast.success("Landing page content saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal save content");
    } finally {
      setSaving(false);
    }
  };

  // ─── Generic field update ───
  const update = <K extends keyof LandingPageContent>(
    field: K,
    value: LandingPageContent[K]
  ) => {
    setContent((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  // ─── Array item helpers ───
  function moveItem<T>(arr: T[], from: number, to: number): T[] {
    if (to < 0 || to >= arr.length) return arr;
    const copy = [...arr];
    const [item] = copy.splice(from, 1);
    copy.splice(to, 0, item);
    return copy;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Gagal load content.</p>
        <Button onClick={fetchContent} className="mt-4">
          Coba lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Landing Page Editor
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Edit content untuk /jual-laptop-bekas-jakarta
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/jual-laptop-bekas-jakarta" target="_blank">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-1" />
              Preview
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </Link>
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <Home className="h-4 w-4 mr-1" />
              Dashboard
            </Button>
          </Link>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-1" />
            )}
            Save
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Hero Section</h2>

          <div>
            <Label htmlFor="hero-eyebrow">Eyebrow (kicker)</Label>
            <Input
              id="hero-eyebrow"
              value={content.heroEyebrow}
              onChange={(e) => update("heroEyebrow", e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="hero-title">H1 Title</Label>
            <Input
              id="hero-title"
              value={content.heroTitle}
              onChange={(e) => update("heroTitle", e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="hero-subtitle">Subtitle</Label>
            <Textarea
              id="hero-subtitle"
              value={content.heroSubtitle}
              onChange={(e) => update("heroSubtitle", e.target.value)}
              className="mt-1"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="hero-cta-1">Primary CTA Text</Label>
              <Input
                id="hero-cta-1"
                value={content.heroPrimaryCta}
                onChange={(e) => update("heroPrimaryCta", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="hero-cta-2">Secondary CTA Text</Label>
              <Input
                id="hero-cta-2"
                value={content.heroSecondaryCta}
                onChange={(e) => update("heroSecondaryCta", e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Trust badges editor */}
          <div>
            <Label>Hero Trust Badges (3 micro-trust)</Label>
            <div className="space-y-2 mt-2">
              {content.heroTrustBadges.map((badge, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <GripVertical className="h-4 w-4 text-slate-400" />
                  <Input
                    value={badge.text}
                    onChange={(e) => {
                      const next = [...content.heroTrustBadges];
                      next[idx] = { text: e.target.value };
                      update("heroTrustBadges", next);
                    }}
                    placeholder="e.g. Respon 15 menit"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      update(
                        "heroTrustBadges",
                        content.heroTrustBadges.filter((_, i) => i !== idx)
                      )
                    }
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  update("heroTrustBadges", [
                    ...content.heroTrustBadges,
                    { text: "" },
                  ])
                }
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Badge
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5 Value Pillars */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            5 Value Proposition Pillars
          </h2>

          {content.valuePillars.map((pillar, idx) => (
            <div key={idx} className="border border-slate-200 rounded-md p-3 space-y-2 bg-slate-50">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">
                  Pillar #{idx + 1}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={idx === 0}
                    onClick={() =>
                      update(
                        "valuePillars",
                        moveItem(content.valuePillars, idx, idx - 1)
                      )
                    }
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={idx === content.valuePillars.length - 1}
                    onClick={() =>
                      update(
                        "valuePillars",
                        moveItem(content.valuePillars, idx, idx + 1)
                      )
                    }
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      update(
                        "valuePillars",
                        content.valuePillars.filter((_, i) => i !== idx)
                      )
                    }
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-xs">Icon (lucide-react)</Label>
                <select
                  value={pillar.icon}
                  onChange={(e) => {
                    const next = [...content.valuePillars];
                    next[idx] = { ...pillar, icon: e.target.value };
                    update("valuePillars", next);
                  }}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm mt-1"
                >
                  {ICON_OPTIONS.map((ic) => (
                    <option key={ic} value={ic}>
                      {ic}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                value={pillar.headline}
                onChange={(e) => {
                  const next = [...content.valuePillars];
                  next[idx] = { ...pillar, headline: e.target.value };
                  update("valuePillars", next);
                }}
                placeholder="Headline (e.g. Respon 15 Menit)"
              />
              <Textarea
                value={pillar.subCopy}
                onChange={(e) => {
                  const next = [...content.valuePillars];
                  next[idx] = { ...pillar, subCopy: e.target.value };
                  update("valuePillars", next);
                }}
                placeholder="Sub-copy"
                rows={2}
              />
            </div>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              update("valuePillars", [
                ...content.valuePillars,
                { icon: "Sparkles", headline: "", subCopy: "" },
              ])
            }
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Pillar
          </Button>
        </CardContent>
      </Card>

      {/* Process Steps */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            4-Step Process
          </h2>

          {content.processSteps.map((step, idx) => (
            <div key={idx} className="border border-slate-200 rounded-md p-3 space-y-2 bg-slate-50">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">
                  Step {step.step}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    update(
                      "processSteps",
                      content.processSteps.filter((_, i) => i !== idx)
                    )
                  }
                >
                  <Trash2 className="h-3 w-3 text-red-500" />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-xs">Step Number</Label>
                  <Input
                    value={step.step}
                    onChange={(e) => {
                      const next = [...content.processSteps];
                      next[idx] = { ...step, step: e.target.value };
                      update("processSteps", next);
                    }}
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Headline</Label>
                  <Input
                    value={step.headline}
                    onChange={(e) => {
                      const next = [...content.processSteps];
                      next[idx] = { ...step, headline: e.target.value };
                      update("processSteps", next);
                    }}
                    className="mt-1"
                  />
                </div>
              </div>
              <Textarea
                value={step.subCopy}
                onChange={(e) => {
                  const next = [...content.processSteps];
                  next[idx] = { ...step, subCopy: e.target.value };
                  update("processSteps", next);
                }}
                placeholder="Sub-copy"
                rows={2}
              />
              <Input
                value={step.duration}
                onChange={(e) => {
                  const next = [...content.processSteps];
                  next[idx] = { ...step, duration: e.target.value };
                  update("processSteps", next);
                }}
                placeholder="Duration (e.g. 5 menit)"
              />
            </div>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              update("processSteps", [
                ...content.processSteps,
                {
                  step: String(content.processSteps.length + 1),
                  headline: "",
                  subCopy: "",
                  duration: "",
                },
              ])
            }
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Step
          </Button>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            FAQ SEO (8 questions)
          </h2>

          {content.faqs.map((faq, idx) => (
            <div key={idx} className="border border-slate-200 rounded-md p-3 space-y-2 bg-slate-50">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">
                  FAQ #{idx + 1}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    update(
                      "faqs",
                      content.faqs.filter((_, i) => i !== idx)
                    )
                  }
                >
                  <Trash2 className="h-3 w-3 text-red-500" />
                </Button>
              </div>
              <Input
                value={faq.q}
                onChange={(e) => {
                  const next = [...content.faqs];
                  next[idx] = { ...faq, q: e.target.value };
                  update("faqs", next);
                }}
                placeholder="Question (include target keyword)"
              />
              <Textarea
                value={faq.a}
                onChange={(e) => {
                  const next = [...content.faqs];
                  next[idx] = { ...faq, a: e.target.value };
                  update("faqs", next);
                }}
                placeholder="Answer (concise, lead-generating)"
                rows={3}
              />
              <Input
                value={faq.keyword}
                onChange={(e) => {
                  const next = [...content.faqs];
                  next[idx] = { ...faq, keyword: e.target.value };
                  update("faqs", next);
                }}
                placeholder="Target keyword (e.g. jual macbook bekas jakarta)"
              />
            </div>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              update("faqs", [
                ...content.faqs,
                { q: "", a: "", keyword: "" },
              ])
            }
          >
            <Plus className="h-4 w-4 mr-1" />
            Add FAQ
          </Button>
        </CardContent>
      </Card>

      {/* Trust + Final CTA + SEO in one card (compact) */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            Trust Stats + Final CTA + SEO Metadata
          </h2>

          <div>
            <Label htmlFor="trust-title">Trust Title</Label>
            <Input
              id="trust-title"
              value={content.trustTitle}
              onChange={(e) => update("trustTitle", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="trust-subtitle">Trust Subtitle</Label>
            <Input
              id="trust-subtitle"
              value={content.trustSubtitle}
              onChange={(e) => update("trustSubtitle", e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {content.trustStats.map((stat, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-md p-2 bg-slate-50 space-y-2"
              >
                <Input
                  value={stat.stat}
                  onChange={(e) => {
                    const next = [...content.trustStats];
                    next[idx] = { ...stat, stat: e.target.value };
                    update("trustStats", next);
                  }}
                  placeholder="Stat (e.g. 500+)"
                />
                <Input
                  value={stat.label}
                  onChange={(e) => {
                    const next = [...content.trustStats];
                    next[idx] = { ...stat, label: e.target.value };
                    update("trustStats", next);
                  }}
                  placeholder="Label"
                />
              </div>
            ))}
          </div>

          <hr className="border-slate-200" />

          <div>
            <Label htmlFor="final-title">Final CTA Title</Label>
            <Input
              id="final-title"
              value={content.finalCtaTitle}
              onChange={(e) => update("finalCtaTitle", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="final-subtitle">Final CTA Subtitle</Label>
            <Textarea
              id="final-subtitle"
              value={content.finalCtaSubtitle}
              onChange={(e) => update("finalCtaSubtitle", e.target.value)}
              className="mt-1"
              rows={2}
            />
          </div>

          <hr className="border-slate-200" />

          <div>
            <Label htmlFor="meta-title">Meta Title (Google SERP)</Label>
            <Input
              id="meta-title"
              value={content.metaTitle}
              onChange={(e) => update("metaTitle", e.target.value)}
              className="mt-1"
              maxLength={60}
            />
            <p className="text-xs text-slate-500 mt-1">
              {content.metaTitle.length}/60 karakter
            </p>
          </div>
          <div>
            <Label htmlFor="meta-desc">Meta Description</Label>
            <Textarea
              id="meta-desc"
              value={content.metaDescription}
              onChange={(e) => update("metaDescription", e.target.value)}
              className="mt-1"
              rows={2}
              maxLength={160}
            />
            <p className="text-xs text-slate-500 mt-1">
              {content.metaDescription.length}/160 karakter
            </p>
          </div>
          <div>
            <Label htmlFor="og-title">OG Title (Facebook share)</Label>
            <Input
              id="og-title"
              value={content.ogTitle}
              onChange={(e) => update("ogTitle", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="og-desc">OG Description</Label>
            <Textarea
              id="og-desc"
              value={content.ogDescription}
              onChange={(e) => update("ogDescription", e.target.value)}
              className="mt-1"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Floating save button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="shadow-lg bg-blue-600 hover:bg-blue-700"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-1" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
