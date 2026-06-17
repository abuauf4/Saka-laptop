"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ClipboardCheck,
  Loader2,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Save,
  ArrowRight,
  Laptop,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useSubmissions,
  QC_ITEMS,
  QC_STATUS_OPTIONS,
  type Submission,
} from "@/lib/submission-store";
import { formatPrice, formatDateTime } from "@/lib/format";
import { toast } from "sonner";

type QCValue = "ok" | "issue" | "fail" | "";

export default function QCPage() {
  const searchParams = useSearchParams();
  const targetId = searchParams.get("id");

  const { submissions, isLoaded, updateQC, updateStatus } = useSubmissions();
  const [selected, setSelected] = useState<Submission | null>(null);
  const [checklist, setChecklist] = useState<Record<string, QCValue>>({});
  const [qcNotes, setQcNotes] = useState("");
  const [saving, setSaving] = useState(false);

  // List of submissions in QC_PROCESS (or selected via ?id)
  const qcQueue = useMemo(() => {
    return submissions.filter(
      (s) => s.status === "QC_PROCESS" || (targetId && s.id === targetId)
    );
  }, [submissions, targetId]);

  // Auto-select first item if ?id is set
  useEffect(() => {
    if (targetId && !selected) {
      const found = submissions.find((s) => s.id === targetId);
      if (found) {
        setSelected(found);
        // Load existing checklist if any
        try {
          const existing = JSON.parse(found.qcChecklist || "{}");
          setChecklist(existing);
        } catch {
          setChecklist({});
        }
        setQcNotes(found.qcNotes || "");
      }
    }
  }, [targetId, submissions, selected]);

  function selectSubmission(s: Submission) {
    setSelected(s);
    try {
      const existing = JSON.parse(s.qcChecklist || "{}");
      setChecklist(existing);
    } catch {
      setChecklist({});
    }
    setQcNotes(s.qcNotes || "");
  }

  function setItem(id: string, value: QCValue) {
    setChecklist((prev) => ({ ...prev, [id]: value }));
  }

  const qcSummary = useMemo(() => {
    const items = QC_ITEMS.map((i) => checklist[i.id] || "");
    return {
      ok: items.filter((v) => v === "ok").length,
      issue: items.filter((v) => v === "issue").length,
      fail: items.filter((v) => v === "fail").length,
      pending: items.filter((v) => v === "").length,
    };
  }, [checklist]);

  const allChecked = qcSummary.pending === 0;

  async function saveAndOffer() {
    if (!selected) return;
    if (!allChecked) {
      toast.error("Lengkapi semua item QC terlebih dahulu");
      return;
    }
    setSaving(true);
    try {
      // Save QC + auto transition to OFFER_SENT
      await updateQC(selected.id, checklist as Record<string, string>, qcNotes);
      toast.success("QC tersimpan. Lanjut ke Penawaran.");
      // Navigate to penawaran page via window.location (since this is client)
      window.location.href = `/admin/penawaran?id=${selected.id}`;
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan QC");
    } finally {
      setSaving(false);
    }
  }

  async function saveOnly() {
    if (!selected) return;
    setSaving(true);
    try {
      await updateQC(selected.id, checklist as Record<string, string>, qcNotes);
      toast.success("QC tersimpan (draft)");
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan");
    } finally {
      setSaving(false);
    }
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
      <div className="border-b border-border/40 bg-card/30">
        <div className="page-container py-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ClipboardCheck className="h-6 w-6 text-primary" />
            QC Inspeksi
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Checklist 12 titik inspeksi standar
          </p>
        </div>
      </div>

      <div className="page-container py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT: Queue list */}
          <div className="lg:col-span-1 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Antrian QC ({qcQueue.length})
            </p>
            {qcQueue.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center">
                  <ClipboardCheck className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="text-xs text-muted-foreground">
                    Tidak ada antrian QC
                  </p>
                </CardContent>
              </Card>
            ) : (
              qcQueue.map((s) => (
                <Card
                  key={s.id}
                  className={`border-border/50 cursor-pointer hover:border-primary/30 transition-all ${
                    selected?.id === s.id ? "border-primary bg-primary/5" : ""
                  }`}
                  onClick={() => selectSubmission(s)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-2">
                      <div className="h-10 w-10 shrink-0 rounded-lg bg-muted/40 flex items-center justify-center">
                        {s.foto ? (
                          <img
                            src={s.foto}
                            alt={s.namaLaptop}
                            className="h-full w-full object-cover rounded-lg"
                          />
                        ) : (
                          <Laptop className="h-4 w-4 text-muted-foreground/40" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {s.namaLaptop}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {s.customerName} · {formatDateTime(s.createdAt)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* RIGHT: QC form */}
          <div className="lg:col-span-2">
            {!selected ? (
              <Card className="border-dashed">
                <CardContent className="py-16 text-center">
                  <ClipboardCheck className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Pilih laptop dari antrian untuk mulai QC
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Header */}
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-14 w-14 shrink-0 rounded-xl bg-muted/40 flex items-center justify-center overflow-hidden">
                        {selected.foto ? (
                          <img
                            src={selected.foto}
                            alt={selected.namaLaptop}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Laptop className="h-5 w-5 text-muted-foreground/40" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h2 className="font-bold">{selected.namaLaptop}</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {selected.brand} · {selected.processor} ·{" "}
                          {selected.ram}/{selected.storage}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {selected.customerName} · {selected.customerPhone}
                        </p>
                      </div>
                      {selected.estimasiAI > 0 && (
                        <div className="text-right">
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1 justify-end">
                            <Sparkles className="h-3 w-3" /> Estimasi AI
                          </p>
                          <p className="text-base font-bold text-primary">
                            {formatPrice(selected.estimasiAI)}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* QC Summary */}
                <div className="grid grid-cols-4 gap-2">
                  <SummaryPill
                    label="OK"
                    value={qcSummary.ok}
                    icon={CheckCircle2}
                    color="text-foreground"
                  />
                  <SummaryPill
                    label="Issue"
                    value={qcSummary.issue}
                    icon={AlertCircle}
                    color="text-amber-500"
                  />
                  <SummaryPill
                    label="Gagal"
                    value={qcSummary.fail}
                    icon={XCircle}
                    color="text-red-500"
                  />
                  <SummaryPill
                    label="Pending"
                    value={qcSummary.pending}
                    icon={Loader2}
                    color="text-muted-foreground"
                  />
                </div>

                {/* QC Checklist Grid */}
                <Card className="border-border/50">
                  <CardContent className="p-5">
                    <p className="text-sm font-semibold mb-4">
                      Checklist Inspeksi (12 titik)
                    </p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {QC_ITEMS.map((item) => {
                        const value = checklist[item.id] || "";
                        return (
                          <div
                            key={item.id}
                            className="rounded-lg border border-border/50 p-3"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xl">{item.icon}</span>
                              <span className="text-sm font-medium">
                                {item.label}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-1">
                              {QC_STATUS_OPTIONS.map((opt) => (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => setItem(item.id, opt.value)}
                                  className={`rounded-md py-1.5 text-[10px] font-semibold border transition-all ${
                                    value === opt.value
                                      ? opt.value === "ok"
                                        ? "border-foreground bg-foreground/10 text-foreground"
                                        : opt.value === "issue"
                                          ? "border-amber-500 bg-amber-500/15 text-amber-500"
                                          : "border-red-500 bg-red-500/15 text-red-500"
                                      : "border-border/50 text-muted-foreground hover:border-primary/30"
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* QC Notes */}
                <Card className="border-border/50">
                  <CardContent className="p-5">
                    <Label className="text-xs font-medium mb-2 block">
                      Catatan QC (untuk customer)
                    </Label>
                    <Textarea
                      value={qcNotes}
                      onChange={(e) => setQcNotes(e.target.value)}
                      placeholder="cth: Layar ada dead pixel di pojok kanan atas. Baterai health 78%. Keyboard ada 1 tombol (W) agak keras. Selebihnya normal."
                      className="min-h-[100px]"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Catatan ini akan dikirim ke customer bersama penawaran harga.
                    </p>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={saveOnly}
                    disabled={saving}
                    className="flex-1"
                  >
                    <Save className="h-4 w-4 mr-1.5" /> Simpan Draft
                  </Button>
                  <Button
                    onClick={saveAndOffer}
                    disabled={saving || !allChecked}
                    className="flex-1"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                    ) : (
                      <ArrowRight className="h-4 w-4 mr-1.5" />
                    )}
                    Simpan & Lanjut ke Penawaran
                  </Button>
                </div>
                {!allChecked && (
                  <p className="text-xs text-amber-500 text-center">
                    Lengkapi semua {qcSummary.pending} item tersisa untuk lanjut
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryPill({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-border/50 bg-card/50 p-2.5 text-center">
      <Icon className={`h-4 w-4 mx-auto ${color}`} />
      <p className={`text-lg font-bold ${color} mt-0.5`}>{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}
