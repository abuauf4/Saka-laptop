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
export interface Testimoni {
  id: string;
  nama: string;
  role: string;
  teks: string;
  rating: number; // 1–5
  laptop: string;
  avatar: string;
}

/* ── Context shape ── */
interface TestimoniStore {
  testimoni: Testimoni[];
  addTestimoni: (t: Omit<Testimoni, "id">) => Promise<void>;
  updateTestimoni: (id: string, data: Partial<Testimoni>) => Promise<void>;
  deleteTestimoni: (id: string) => Promise<void>;
  isLoaded: boolean;
}

const TestimoniContext = createContext<TestimoniStore | null>(null);

/* ── Provider ── */
export function TestimoniProvider({ children }: { children: ReactNode }) {
  const [testimoni, setTestimoni] = useState<Testimoni[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const initialized = useRef(false);

  // Fetch testimoni from API on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    async function fetchTestimoni() {
      try {
        const res = await fetch("/api/testimoni");
        if (res.ok) {
          const data = await res.json();
          setTestimoni(data);
        }
      } catch (err) {
        console.error("Failed to fetch testimoni:", err);
      } finally {
        setIsLoaded(true);
      }
    }

    fetchTestimoni();
  }, []);

  const addTestimoni = useCallback(async (t: Omit<Testimoni, "id">) => {
    try {
      const res = await fetch("/api/testimoni", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(t),
      });

      if (res.ok) {
        const created = await res.json();
        setTestimoni((prev) => [created, ...prev]);
      }
    } catch (err) {
      console.error("Failed to add testimoni:", err);
    }
  }, []);

  const updateTestimoni = useCallback(async (id: string, data: Partial<Testimoni>) => {
    try {
      const res = await fetch(`/api/testimoni/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const updated = await res.json();
        setTestimoni((prev) =>
          prev.map((t) => (t.id === id ? updated : t))
        );
      }
    } catch (err) {
      console.error("Failed to update testimoni:", err);
    }
  }, []);

  const deleteTestimoni = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/testimoni/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setTestimoni((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete testimoni:", err);
    }
  }, []);

  return (
    <TestimoniContext.Provider
      value={{
        testimoni,
        addTestimoni,
        updateTestimoni,
        deleteTestimoni,
        isLoaded,
      }}
    >
      {children}
    </TestimoniContext.Provider>
  );
}

/* ── Hook ── */
export function useTestimoni(): TestimoniStore {
  const ctx = useContext(TestimoniContext);
  if (!ctx) {
    throw new Error("useTestimoni must be used within a TestimoniProvider");
  }
  return ctx;
}
