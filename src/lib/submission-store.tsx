"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";

/* ── Types ── */
export const SUBMISSION_STATUS = [
  "RECEIVED",
  "QC_PROCESS",
  "OFFER_SENT",
  "ACCEPTED",
  "REJECTED",
  "INVENTORY",
  "SOLD",
] as const;

export type SubmissionStatus = (typeof SUBMISSION_STATUS)[number];

export const STATUS_LABELS: Record<SubmissionStatus, string> = {
  RECEIVED: "Data Diterima",
  QC_PROCESS: "QC Berjalan",
  OFFER_SENT: "Penawaran Dikirim",
  ACCEPTED: "Deal",
  REJECTED: "Tidak Deal",
  INVENTORY: "Inventory",
  SOLD: "Disalurkan",
};

export const STATUS_COLORS: Record<SubmissionStatus, string> = {
  RECEIVED: "bg-sky-500/15 text-sky-500 border-sky-500/30",
  QC_PROCESS: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  OFFER_SENT: "bg-violet-500/15 text-violet-500 border-violet-500/30",
  ACCEPTED: "bg-foreground/10 text-foreground border-foreground/30",
  REJECTED: "bg-red-500/15 text-red-500 border-red-500/30",
  INVENTORY: "bg-primary/15 text-primary border-primary/30",
  SOLD: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
};

export interface Submission {
  id: string;
  namaLaptop: string;
  brand: string;
  kategori: string;
  ram: string;
  storage: string;
  gpu: string;
  processor: string;
  tahun: number;
  kondisi: string;
  kelengkapan: string;
  catatan: string;
  foto: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  estimasiAI: number;
  estimasiNotes: string;
  qcChecklist: string;
  qcNotes: string;
  hargaPenawaran: number;
  penawaranNotes: string;
  penawaranSentAt: string | null;
  customerResponse: string;
  customerResponseAt: string | null;
  status: SubmissionStatus;
  inventoryItemId: string | null;
  createdAt: string;
  updatedAt: string;
}

interface SubmissionStore {
  submissions: Submission[];
  isLoaded: boolean;
  refresh: () => Promise<void>;
  updateStatus: (id: string, status: SubmissionStatus) => Promise<void>;
  updateQC: (
    id: string,
    qcChecklist: Record<string, string>,
    qcNotes: string
  ) => Promise<void>;
  updatePenawaran: (
    id: string,
    hargaPenawaran: number,
    penawaranNotes: string
  ) => Promise<void>;
  deleteSubmission: (id: string) => Promise<void>;
}

const SubmissionContext = createContext<SubmissionStore | null>(null);

/* ── Provider ── */
export function SubmissionProvider({ children }: { children: ReactNode }) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const initialized = useRef(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/submissions");
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      }
    } catch (err) {
      console.error("Failed to fetch submissions:", err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    refresh();
  }, [refresh]);

  const updateStatus = useCallback(
    async (id: string, status: SubmissionStatus) => {
      const res = await fetch(`/api/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setSubmissions((prev) =>
          prev.map((s) => (s.id === id ? updated : s))
        );
      }
    },
    []
  );

  const updateQC = useCallback(
    async (
      id: string,
      qcChecklist: Record<string, string>,
      qcNotes: string
    ) => {
      const res = await fetch(`/api/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          qcChecklist: JSON.stringify(qcChecklist),
          qcNotes,
          status: "OFFER_SENT",
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setSubmissions((prev) =>
          prev.map((s) => (s.id === id ? updated : s))
        );
      }
    },
    []
  );

  const updatePenawaran = useCallback(
    async (id: string, hargaPenawaran: number, penawaranNotes: string) => {
      const res = await fetch(`/api/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hargaPenawaran,
          penawaranNotes,
          status: "OFFER_SENT",
          penawaranSentAt: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setSubmissions((prev) =>
          prev.map((s) => (s.id === id ? updated : s))
        );
      }
    },
    []
  );

  const deleteSubmission = useCallback(async (id: string) => {
    const res = await fetch(`/api/submissions/${id}`, { method: "DELETE" });
    if (res.ok) {
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    }
  }, []);

  return (
    <SubmissionContext.Provider
      value={{
        submissions,
        isLoaded,
        refresh,
        updateStatus,
        updateQC,
        updatePenawaran,
        deleteSubmission,
      }}
    >
      {children}
    </SubmissionContext.Provider>
  );
}

/* ── Hook ── */
export function useSubmissions(): SubmissionStore {
  const ctx = useContext(SubmissionContext);
  if (!ctx) {
    throw new Error("useSubmissions must be used within a SubmissionProvider");
  }
  return ctx;
}

/* ── QC Items (12 inspection items) ── */
export const QC_ITEMS = [
  { id: "layar", label: "Layar", icon: "🖥️" },
  { id: "keyboard", label: "Keyboard", icon: "⌨️" },
  { id: "touchpad", label: "Touchpad", icon: "🖱️" },
  { id: "baterai", label: "Baterai", icon: "🔋" },
  { id: "charger", label: "Charger", icon: "🔌" },
  { id: "storage", label: "Storage", icon: "💾" },
  { id: "ram", label: "RAM", icon: "⚡" },
  { id: "kamera", label: "Kamera", icon: "📷" },
  { id: "speaker", label: "Speaker", icon: "🔊" },
  { id: "port", label: "Port I/O", icon: "🔗" },
  { id: "wifi", label: "WiFi/BT", icon: "📶" },
  { id: "fisik", label: "Kondisi Fisik", icon: "✨" },
] as const;

export const QC_STATUS_OPTIONS = [
  { value: "ok", label: "OK", color: "text-foreground" },
  { value: "issue", label: "Issue", color: "text-amber-500" },
  { value: "fail", label: "Gagal", color: "text-red-500" },
] as const;
