"use client";

import { useLokasi } from "@/lib/lokasi-store";

/**
 * Renders the store name dynamically from lokasi-store.
 * Splits the first word and the rest for styling purposes.
 */
export function StoreName({
  className = "text-lg font-bold tracking-tight",
}: {
  className?: string;
}) {
  const { lokasi, isLoaded } = useLokasi();
  const name = isLoaded ? lokasi.namaToko : "Saka Laptop";
  const firstWord = name.split(" ")[0];
  const rest = name.split(" ").slice(1).join(" ");

  return (
    <span className={className}>
      {firstWord}<span className="text-primary"> {rest}</span>
    </span>
  );
}

/**
 * Returns the plain store name (no styling split) — useful for plain text contexts
 */
export function StoreNamePlain() {
  const { lokasi, isLoaded } = useLokasi();
  const name = isLoaded ? lokasi.namaToko : "Saka Laptop";
  return <>{name}</>;
}
