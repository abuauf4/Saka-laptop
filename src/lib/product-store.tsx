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
import { type Product } from "./products";

/* ── Context shape ── */
interface ProductStore {
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  isLoaded: boolean;
}

const ProductContext = createContext<ProductStore | null>(null);

/* ── Provider ── */
export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const initialized = useRef(false);

  // Fetch products from API on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setIsLoaded(true);
      }
    }

    fetchProducts();
  }, []);

  const addProduct = useCallback(async (product: Omit<Product, "id">) => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (res.ok) {
        const created = await res.json();
        setProducts((prev) => [created, ...prev]);
      } else {
        console.error("Failed to add product");
      }
    } catch (err) {
      console.error("Failed to add product:", err);
    }
  }, []);

  const updateProduct = useCallback(async (id: string, data: Partial<Product>) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const updated = await res.json();
        setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      } else {
        console.error("Failed to update product");
      }
    } catch (err) {
      console.error("Failed to update product:", err);
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        console.error("Failed to delete product");
      }
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        isLoaded,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

/* ── Hook ── */
export function useProducts(): ProductStore {
  const ctx = useContext(ProductContext);
  if (!ctx) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return ctx;
}
