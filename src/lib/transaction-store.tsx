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
export interface TransactionItem {
  productId: string | null;
  productName: string;
  price: number;
  quantity: number;
}

export interface Transaction {
  id: string;
  items: TransactionItem[];
  total: number;
  paymentMethod: "Cash" | "Transfer";
  status: "completed" | "refunded" | "cancelled";
  createdAt: string; // ISO string
  customerName: string;
  customerPhone: string;
  customerAddress: string;
}

/* ── Context shape ── */
interface TransactionStore {
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, "id" | "createdAt" | "status">) => Promise<Transaction>;
  updateStatus: (id: string, status: Transaction["status"]) => Promise<void>;
  isLoaded: boolean;
}

const TransactionContext = createContext<TransactionStore | null>(null);

/* ── Provider ── */
export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const initialized = useRef(false);

  // Fetch transactions from API on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    async function fetchTransactions() {
      try {
        const res = await fetch("/api/transactions");
        if (res.ok) {
          const data = await res.json();
          // Transform dates to ISO strings
          const transformed = data.map((t: Record<string, unknown>) => ({
            ...t,
            createdAt: new Date(t.createdAt as string).toISOString(),
            items: (t.items as Record<string, unknown>[]).map((item) => ({
              ...item,
              productId: item.productId || null,
            })),
          }));
          setTransactions(transformed);
        }
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      } finally {
        setIsLoaded(true);
      }
    }

    fetchTransactions();
  }, []);

  const addTransaction = useCallback(
    async (tx: Omit<Transaction, "id" | "createdAt" | "status">): Promise<Transaction> => {
      try {
        const res = await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tx),
        });

        if (res.ok) {
          const created = await res.json();
          const transformed: Transaction = {
            ...created,
            createdAt: new Date(created.createdAt).toISOString(),
            items: created.items.map((item: Record<string, unknown>) => ({
              ...item,
              productId: item.productId || null,
            })),
          };
          setTransactions((prev) => [transformed, ...prev]);
          return transformed;
        } else {
          throw new Error("Failed to create transaction");
        }
      } catch (err) {
        console.error("Failed to create transaction:", err);
        throw err;
      }
    },
    []
  );

  const updateStatus = useCallback(
    async (id: string, status: Transaction["status"]) => {
      try {
        const res = await fetch(`/api/transactions/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });

        if (res.ok) {
          const updated = await res.json();
          const transformed: Transaction = {
            ...updated,
            createdAt: new Date(updated.createdAt).toISOString(),
            items: updated.items.map((item: Record<string, unknown>) => ({
              ...item,
              productId: item.productId || null,
            })),
          };
          setTransactions((prev) =>
            prev.map((tx) => (tx.id === id ? transformed : tx))
          );
        }
      } catch (err) {
        console.error("Failed to update transaction status:", err);
      }
    },
    []
  );

  return (
    <TransactionContext.Provider
      value={{ transactions, addTransaction, updateStatus, isLoaded }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

/* ── Hook ── */
export function useTransactions(): TransactionStore {
  const ctx = useContext(TransactionContext);
  if (!ctx) {
    throw new Error("useTransactions must be used within a TransactionProvider");
  }
  return ctx;
}
