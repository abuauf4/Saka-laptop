"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Tag,
  Loader2,
  Send,
  CheckCircle2,
  XCircle,
  Laptop,
  Sparkles,
  ClipboardCheck,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSubmissions, type Submission } from "@/lib/submission-store";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";

export default function PenawaranPage() {
  const searchParams = useSearchParams();
  const targetId = searchParams.get("id");

  const { submissions, isLoaded, updatePenawaran, updateStatus } =
    useSubmissions();
  const [selected, setSelected] = useState<Submission | null>(null);
  const [harga, setHarga] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  // List submissions in OFFER_SENT status or selected via ?id
  const offerQueue = useMemo(() => {
    return submissions.filter(
      (s) =>
        s.status === "OFFER_SENT" ||
        s.status === "QC_PROCESS" ||
        (targetId && s.id === targetId)
    );
  }, [submissions, targetId]);

  useEffect(() => {
    if (targetId && !selected) {
      const found = submissions.find((s) => s.id === targetId);
      if (found) {
        setSelected(found);
        setHarga(
          found.hargaPenawaran > 0
            ? String(found.hargaPenawaran)
            : found.estimasiAI
              ? String(found.estimasiAI)
              : ""
        );
        setNotes(found.penawaranNotes || "");
      }
    }
  }, [targetId, submissions, selected]);

  function selectSubmission(s: Submission) {
    setSelected(s);
    setHarga(
      s.hargaPenawaran > 0
        ? String(s.hargaPenawaran)
        : s.estimasiAI
          ? String(s.estimasiAI)
          : ""
    );
    setNotes(s.penawaranNotes || "");
  }

  async function sendOffer() {
    if (!selected) return;
    if (!harga || parseInt(harga) <= 0) {
      toast.error("Isi harga penawaran");
      return;
    }
    setSaving(true);
    try {
      await updatePenawaran(selected.id, parseInt(harga), notes);
      toast.success("Penawaran dikirim ke customer");
      setSelected({
        ...selected,
        hargaPenawaran: parseInt(harga),
        penawaranNotes: notes,
        status: "OFFER_SENT",
      });
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengirim penawaran");
    } finally {
      setSaving(false);
    }
  }

  async function markAccepted() {
    if (!selected) return;
    setSaving(true);
    try {
      await updateStatus(selected.id, "INVENTORY");
      toast.success("Deal! Laptop masuk inventory.");
      setSelected(null);
    } catch (err) {
      console.error(err);
      toast.error("Gagal update status");
    } finally {
      setSaving(false);
    }
  }

  async function markRejected() {
    if (!selected) return;
    if (!confirm("Tandai customer menolak penawaran?")) return;
    setSaving(true);
    try {
      await updateStatus(selected.id, "REJECTED");
      toast.success("Status: Tidak Deal");
      setSelected(null);
    } catch (err) {
      console.error(err);
      toast.error("Gagal update status");
    } finally {
      setSaving(false);
    }
  }

  // Parse QC checklist
  const qcChecklist = useMemo(() => {
    if (!selected) return {};
    try {
      return JSON.parse(selected.qcChecklist || "{}");
    } catch {
      return {};
    }
  }, [selected]);

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
            <Tag className="h-6 w-6 text-primary" />
            Penawaran
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Buat & kirim penawaran harga ke customer
          </p>
        </div>
      </div>

      <div className="page-container py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT: Queue */}
          <div className="lg:col-span-1 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Antrian Penawaran ({offerQueue.length})
            </p>
            {offerQueue.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center">
                  <Tag className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="text-xs text-muted-foreground">
                    Tidak ada antrian
                  </p>
                </CardContent>
              </Card>
            ) : (
              offerQueue.map((s) => (
                <Card
                  key={s.id}
                  className={`border-border/50 cursor-pointer hover:border-primary/30 transition-all ${
                    selected?.id === s.id ? "border-primary bg-primary/5" : ""
                  }`}
                  onClick={() => selectSubmission(s)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-2">
                      <div className="h-10 w-10 shrink-0 rounded-lg bg-muted/40 flex items-center justify-center overflow-hidden">
                        {s.foto ? (
                          <img
                            src={s.foto}
                            alt={s.namaLaptop}
                            className="h-full w-full object-cover"
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
                          {s.customerName}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          {s.hargaPenawaran > 0 ? (
                            <Badge variant="outline" className="text-[9px] bg-violet-500/10 text-violet-500 border-violet-500/30">
                              {formatPrice(s.hargaPenawaran)}
                            </Badge>
                          ) : s.estimasiAI > 0 ? (
                            <Badge variant="outline" className="text-[9px] bg-primary/10 text-primary border-primary/30">
                              AI: {formatPrice(s.estimasiAI)}
                            </Badge>
                          ) : null}
                          {s.status === "OFFER_SENT" && (
                            <Badge variant="outline" className="text-[9px] bg-amber-500/10 text-amber-500 border-amber-500/30">
                              Menunggu response
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* RIGHT: Form */}
          <div className="lg:col-span-2">
            {!selected ? (
              <Card className="border-dashed">
                <CardContent className="py-16 text-center">
                  <Tag className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Pilih laptop dari antrian untuk membuat penawaran
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
                    </div>
                  </CardContent>
                </Card>

                {/* QC Result Summary */}
                {Object.keys(qcChecklist).length > 0 && (
                  <Card className="border-border/50">
                    <CardContent className="p-4">
                      <p className="text-xs font-semibold mb-3 flex items-center gap-1.5">
                        <ClipboardCheck className="h-3.5 w-3.5" /> Hasil QC
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(qcChecklist).map(([key, value]) => {
                          const item = (
                            QC_ITEMS_LIST as { id: string; label: string }[]
                          ).find((i) => i.id === key);
                          if (!item) return null;
                          const v = value as string;
                          return (
                            <Badge
                              key={key}
                              variant="outline"
                              className={`text-[10px] ${
                                v === "ok"
                                  ? "bg-foreground/10 text-foreground border-foreground/30"
                                  : v === "issue"
                                    ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                                    : "bg-red-500/10 text-red-500 border-red-500/30"
                              }`}
                            >
                              {item.label}: {v.toUpperCase()}
                            </Badge>
                          );
                        })}
                      </div>
                      {selected.qcNotes && (
                        <p className="text-xs text-muted-foreground mt-3 bg-muted/40 rounded-lg p-2.5">
                          {selected.qcNotes}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Estimasi AI Reference */}
                {selected.estimasiAI > 0 && (
                  <Card className="border-primary/30 bg-primary/5">
                    <CardContent className="p-4">
                      <p className="text-xs font-semibold mb-2 flex items-center gap-1.5 text-primary">
                        <Sparkles className="h-3.5 w-3.5" /> Estimasi AI
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        {formatPrice(selected.estimasiAI)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Referensi awal. Sesuaikan berdasarkan hasil QC fisik.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Form Penawaran */}
                <Card className="border-border/50">
                  <CardContent className="p-5 space-y-4">
                    <div>
                      <Label className="text-xs font-medium mb-1.5 block">
                        Harga Penawaran (Rp) *
                      </Label>
                      <Input
                        type="number"
                        value={harga}
                        onChange={(e) => setHarga(e.target.value)}
                        placeholder="cth: 5500000"
                        className="h-12 text-lg font-semibold"
                      />
                      {harga && parseInt(harga) > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                          <p className="text-sm text-muted-foreground">
                            Tampilan:
                          </p>
                          <p className="text-lg font-bold text-violet-500">
                            {formatPrice(parseInt(harga))}
                          </p>
                          {selected.estimasiAI > 0 && (
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${
                                parseInt(harga) >= selected.estimasiAI
                                  ? "bg-foreground/10 text-foreground border-foreground/30"
                                  : "bg-amber-500/10 text-amber-500 border-amber-500/30"
                              }`}
                            >
                              <TrendingUp className="h-2.5 w-2.5 mr-1" />
                              {parseInt(harga) >= selected.estimasiAI
                                ? "Di atas estimasi"
                                : `Di bawah estimasi ${Math.round(
                                    ((selected.estimasiAI - parseInt(harga)) /
                                      selected.estimasiAI) *
                                      100
                                  )}%`}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs font-medium mb-1.5 block">
                        Catatan untuk Customer
                      </Label>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="cth: Berdasarkan QC, baterai health 78% dan ada dead pixel. Penawaran disesuaikan dari estimasi awal."
                        className="min-h-[80px]"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                {selected.status !== "OFFER_SENT" ? (
                  <Button
                    onClick={sendOffer}
                    disabled={saving || !harga}
                    className="w-full"
                    size="lg"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-1.5" />
                    )}
                    Kirim Penawaran ke Customer
                  </Button>
                ) : (
                  <Card className="border-amber-500/30 bg-amber-500/5">
                    <CardContent className="p-4 space-y-3">
                      <p className="text-sm font-semibold text-amber-500 flex items-center gap-1.5">
                        <Loader2 className="h-3.5 w-3.5" /> Menunggu response customer
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Penawaran sudah dikirim. Hubungi customer via WA untuk
                        konfirmasi.
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          onClick={markAccepted}
                          disabled={saving}
                          className="bg-foreground hover:bg-foreground/90"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1.5" /> Customer Deal
                        </Button>
                        <Button
                          onClick={markRejected}
                          disabled={saving}
                          variant="destructive"
                        >
                          <XCircle className="h-4 w-4 mr-1.5" /> Tidak Deal
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Update harga if already OFFER_SENT */}
                {selected.status === "OFFER_SENT" && (
                  <Button
                    variant="outline"
                    onClick={sendOffer}
                    disabled={saving}
                    className="w-full"
                  >
                    Update Harga & Catatan
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Import QC_ITEMS for displaying in summary
import { QC_ITEMS as QC_ITEMS_LIST } from "@/lib/submission-store";
