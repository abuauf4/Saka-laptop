// ─── Saka Laptop — Homepage Editor Admin Page ───
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/image-upload";

// ─── Types ───
interface TrustStat {
  stat: string;
  label: string;
  desc: string;
}
interface BrandPoint {
  icon: string;
  title: string;
  desc: string;
}
interface WorkflowStage {
  n: string;
  title: string;
  desc: string;
}
interface TokoPhoto {
  src: string;
  alt: string;
  label: string;
}
interface DeviceCategory {
  label: string;
  emoji: string;
}
interface Faq {
  q: string;
  a: string;
}
interface HomepageContent {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  trustStats: TrustStat[];
  brandTitle: string;
  brandCopy: string;
  brandPoints: BrandPoint[];
  workflowStages: WorkflowStage[];
  tokoPhotos: TokoPhoto[];
  deviceCategories: DeviceCategory[];
  faqs: Faq[];
  closingTitle: string;
  closingSubtitle: string;
}

const EMPTY_CONTENT: HomepageContent = {
  heroEyebrow: "",
  heroTitle: "",
  heroSubtitle: "",
  heroImage: "",
  trustStats: [],
  brandTitle: "",
  brandCopy: "",
  brandPoints: [],
  workflowStages: [],
  tokoPhotos: [],
  deviceCategories: [],
  faqs: [],
  closingTitle: "",
  closingSubtitle: "",
};

export default function HomepageEditorPage() {
  const [content, setContent] = useState<HomepageContent>(EMPTY_CONTENT);
  const [isLoaded, setIsLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadContent = useCallback(async () => {
    try {
      const res = await fetch("/api/homepage");
      if (res.ok) {
        const data = await res.json();
        setContent(data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal load homepage content");
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Gagal save");
      }
      toast.success("Homepage content disimpan");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Gagal save");
    } finally {
      setSaving(false);
    }
  }

  // ─── Array helpers ───
  function updateArrayItem<T>(
    field: keyof HomepageContent,
    index: number,
    updates: Partial<T>
  ) {
    setContent((prev) => {
      const arr = [...(prev[field] as unknown[])] as T[];
      arr[index] = { ...arr[index], ...updates };
      return { ...prev, [field]: arr };
    });
  }

  function addArrayItem<T>(field: keyof HomepageContent, item: T) {
    setContent((prev) => ({
      ...prev,
      [field]: [...(prev[field] as unknown[]), item] as unknown[],
    }));
  }

  function removeArrayItem(field: keyof HomepageContent, index: number) {
    setContent((prev) => {
      const arr = [...(prev[field] as unknown[])];
      arr.splice(index, 1);
      return { ...prev, [field]: arr };
    });
  }

  function moveArrayItem(field: keyof HomepageContent, index: number, dir: -1 | 1) {
    setContent((prev) => {
      const arr = [...(prev[field] as unknown[])];
      const newIndex = index + dir;
      if (newIndex < 0 || newIndex >= arr.length) return prev;
      [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
      return { ...prev, [field]: arr };
    });
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background">
      {/* Deprecation Notice */}
      <div className="border-b-4 border-amber-500 bg-amber-50 dark:bg-amber-950/30">
        <div className="page-container py-3">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            Homepage Sudah Fully Static — Editor Ini Tidak Lagi Berpengaruh
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
            Homepage sekarang menggunakan data dari <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded">src/data/homepage-static.ts</code>. 
            Perubahan di sini tidak akan terlihat di homepage publik. Untuk mengubah homepage, edit file static tersebut langsung di kode.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-border/40 bg-card/30 sticky top-0 z-10 backdrop-blur-md">
        <div className="page-container py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              Homepage Editor
              <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Deprecated</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Edit semua section homepage dari sini
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving} className="gap-1.5">
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save
          </Button>
        </div>
      </div>

      <div className="page-container py-6 space-y-6">
        {/* ── Hero Section ── */}
        <Section title="Hero Section" desc="Section paling atas homepage">
          <Field label="Eyebrow Badge" hint="Teks kecil di atas headline">
            <Input
              value={content.heroEyebrow}
              onChange={(e) => setContent({ ...content, heroEyebrow: e.target.value })}
              className="h-10"
            />
          </Field>
          <Field label="Headline" hint="Headline utama (besar)">
            <Input
              value={content.heroTitle}
              onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
              className="h-10"
            />
          </Field>
          <Field label="Subtitle" hint="Paragraf di bawah headline">
            <Textarea
              value={content.heroSubtitle}
              onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
              className="min-h-[60px]"
            />
          </Field>
          <Field label="Hero Image" hint="Upload atau paste URL gambar background hero (1920×1080 recommended)">
            <ImageUpload
              value={content.heroImage}
              onChange={(url) => setContent({ ...content, heroImage: url })}
              label="Hero Image"
              folder="Homepage"
            />
          </Field>
        </Section>

        {/* ── Trust Stats ── */}
        <Section title="Trust Stats" desc="3 angka setelah hero (real numbers only)">
          <ArrayEditor
            items={content.trustStats}
            onAdd={() => addArrayItem("trustStats", { stat: "", label: "", desc: "" })}
            onRemove={(i) => removeArrayItem("trustStats", i)}
            onMove={(i, dir) => moveArrayItem("trustStats", i, dir)}
            renderItem={(item, i) => (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Input
                  value={item.stat}
                  onChange={(e) => updateArrayItem<TrustStat>("trustStats", i, { stat: e.target.value })}
                  placeholder="cth: 12"
                  className="h-10"
                />
                <Input
                  value={item.label}
                  onChange={(e) => updateArrayItem<TrustStat>("trustStats", i, { label: e.target.value })}
                  placeholder="cth: Titik QC"
                  className="h-10"
                />
                <Textarea
                  value={item.desc}
                  onChange={(e) => updateArrayItem<TrustStat>("trustStats", i, { desc: e.target.value })}
                  placeholder="Deskripsi..."
                  className="min-h-[40px] sm:col-span-3"
                />
              </div>
            )}
          />
        </Section>

        {/* ── Brand Statement ── */}
        <Section title="Brand Statement" desc="Section 'Bukan Sekadar Membeli Laptop'">
          <Field label="Title">
            <Input
              value={content.brandTitle}
              onChange={(e) => setContent({ ...content, brandTitle: e.target.value })}
              className="h-10"
            />
          </Field>
          <Field label="Copy">
            <Textarea
              value={content.brandCopy}
              onChange={(e) => setContent({ ...content, brandCopy: e.target.value })}
              className="min-h-[60px]"
            />
          </Field>
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Brand Points (3 items)</Label>
            <ArrayEditor
              items={content.brandPoints}
              onAdd={() => addArrayItem("brandPoints", { icon: "Eye", title: "", desc: "" })}
              onRemove={(i) => removeArrayItem("brandPoints", i)}
              onMove={(i, dir) => moveArrayItem("brandPoints", i, dir)}
              renderItem={(item, i) => (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <Input
                    value={item.icon}
                    onChange={(e) => updateArrayItem<BrandPoint>("brandPoints", i, { icon: e.target.value })}
                    placeholder="Lucide icon name (Eye, ShieldCheck, Clock)"
                    className="h-10"
                  />
                  <Input
                    value={item.title}
                    onChange={(e) => updateArrayItem<BrandPoint>("brandPoints", i, { title: e.target.value })}
                    placeholder="Title (cth: Transparan)"
                    className="h-10 sm:col-span-1"
                  />
                  <Textarea
                    value={item.desc}
                    onChange={(e) => updateArrayItem<BrandPoint>("brandPoints", i, { desc: e.target.value })}
                    placeholder="Deskripsi..."
                    className="min-h-[40px] sm:col-span-2"
                  />
                </div>
              )}
            />
          </div>
        </Section>

        {/* ── Workflow ── */}
        <Section title="Workflow Stages" desc="5 tahap proses (Ajukan → Deal)">
          <ArrayEditor
            items={content.workflowStages}
            onAdd={() => addArrayItem("workflowStages", { n: String(content.workflowStages.length + 1).padStart(2, "0"), title: "", desc: "" })}
            onRemove={(i) => removeArrayItem("workflowStages", i)}
            onMove={(i, dir) => moveArrayItem("workflowStages", i, dir)}
            renderItem={(item, i) => (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <Input
                  value={item.n}
                  onChange={(e) => updateArrayItem<WorkflowStage>("workflowStages", i, { n: e.target.value })}
                  placeholder="01"
                  className="h-10"
                />
                <Input
                  value={item.title}
                  onChange={(e) => updateArrayItem<WorkflowStage>("workflowStages", i, { title: e.target.value })}
                  placeholder="Title"
                  className="h-10"
                />
                <Textarea
                  value={item.desc}
                  onChange={(e) => updateArrayItem<WorkflowStage>("workflowStages", i, { desc: e.target.value })}
                  placeholder="Deskripsi..."
                  className="min-h-[40px] sm:col-span-2"
                />
              </div>
            )}
          />
        </Section>

        {/* ── Toko Photos ── */}
        <Section title="Toko & Aktivitas Photos" desc="4 foto aktivitas toko (trust building)">
          <ArrayEditor
            items={content.tokoPhotos}
            onAdd={() => addArrayItem("tokoPhotos", { src: "", alt: "", label: "" })}
            onRemove={(i) => removeArrayItem("tokoPhotos", i)}
            onMove={(i, dir) => moveArrayItem("tokoPhotos", i, dir)}
            renderItem={(item, i) => (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Input
                  value={item.label}
                  onChange={(e) => updateArrayItem<TokoPhoto>("tokoPhotos", i, { label: e.target.value })}
                  placeholder="Label (cth: Inspeksi Fisik)"
                  className="h-10"
                />
                <div className="sm:col-span-2">
                  <ImageUpload
                    value={item.src}
                    onChange={(url) => updateArrayItem<TokoPhoto>("tokoPhotos", i, { src: url })}
                    label={item.label || "Toko Photo"}
                    folder="Toko"
                  />
                </div>
                <Input
                  value={item.alt}
                  onChange={(e) => updateArrayItem<TokoPhoto>("tokoPhotos", i, { alt: e.target.value })}
                  placeholder="Alt text (untuk SEO)"
                  className="h-10 sm:col-span-3"
                />
              </div>
            )}
          />
        </Section>

        {/* ── Device Categories ── */}
        <Section title="Perangkat Diterima" desc="Badge kategori laptop yang diterima">
          <ArrayEditor
            items={content.deviceCategories}
            onAdd={() => addArrayItem("deviceCategories", { label: "", emoji: "💻" })}
            onRemove={(i) => removeArrayItem("deviceCategories", i)}
            onMove={(i, dir) => moveArrayItem("deviceCategories", i, dir)}
            renderItem={(item, i) => (
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={item.emoji}
                  onChange={(e) => updateArrayItem<DeviceCategory>("deviceCategories", i, { emoji: e.target.value })}
                  placeholder="Emoji (cth: 💼)"
                  className="h-10"
                />
                <Input
                  value={item.label}
                  onChange={(e) => updateArrayItem<DeviceCategory>("deviceCategories", i, { label: e.target.value })}
                  placeholder="Label (cth: Laptop Kantor)"
                  className="h-10"
                />
              </div>
            )}
          />
        </Section>

        {/* ── FAQ ── */}
        <Section title="FAQ" desc="Pertanyaan yang sering ditanyakan">
          <ArrayEditor
            items={content.faqs}
            onAdd={() => addArrayItem("faqs", { q: "", a: "" })}
            onRemove={(i) => removeArrayItem("faqs", i)}
            onMove={(i, dir) => moveArrayItem("faqs", i, dir)}
            renderItem={(item, i) => (
              <div className="space-y-2">
                <Input
                  value={item.q}
                  onChange={(e) => updateArrayItem<Faq>("faqs", i, { q: e.target.value })}
                  placeholder="Pertanyaan"
                  className="h-10"
                />
                <Textarea
                  value={item.a}
                  onChange={(e) => updateArrayItem<Faq>("faqs", i, { a: e.target.value })}
                  placeholder="Jawaban..."
                  className="min-h-[60px]"
                />
              </div>
            )}
          />
        </Section>

        {/* ── Closing CTA ── */}
        <Section title="Closing CTA" desc="Section terakhir dengan background gelap">
          <Field label="Title">
            <Input
              value={content.closingTitle}
              onChange={(e) => setContent({ ...content, closingTitle: e.target.value })}
              className="h-10"
            />
          </Field>
          <Field label="Subtitle">
            <Textarea
              value={content.closingSubtitle}
              onChange={(e) => setContent({ ...content, closingSubtitle: e.target.value })}
              className="min-h-[60px]"
            />
          </Field>
        </Section>

        {/* Save button bottom */}
        <div className="sticky bottom-4 flex justify-end">
          <Button onClick={handleSave} disabled={saving} size="lg" className="gap-2 shadow-lg">
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save All Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─── Helper Components ─── */

function Section({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-border/50">
      <CardContent className="p-5 space-y-4">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">
        {label}
        {hint && <span className="text-muted-foreground ml-2 font-normal">— {hint}</span>}
      </Label>
      {children}
    </div>
  );
}

function ArrayEditor<T>({
  items,
  onAdd,
  onRemove,
  onMove,
  renderItem,
}: {
  items: T[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onMove: (index: number, dir: -1 | 1) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-start gap-2 rounded-lg border border-border/40 bg-background/60 p-3"
        >
          <div className="flex flex-col gap-1 pt-1">
            <button
              onClick={() => onMove(i, -1)}
              disabled={i === 0}
              className="text-muted-foreground hover:text-foreground disabled:opacity-30"
              aria-label="Move up"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onMove(i, 1)}
              disabled={i === items.length - 1}
              className="text-muted-foreground hover:text-foreground disabled:opacity-30"
              aria-label="Move down"
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex-1 min-w-0">{renderItem(item, i)}</div>
          <button
            onClick={() => onRemove(i)}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded p-1 mt-1"
            aria-label="Remove"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={onAdd}
        className="w-full gap-1.5 border-dashed"
      >
        <Plus className="h-4 w-4" />
        Add Item
      </Button>
    </div>
  );
}
