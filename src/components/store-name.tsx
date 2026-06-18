"use client";

import { useLokasi } from "@/lib/lokasi-store";
import { SkeletonText } from "@/components/skeleton-home";

/**
 * Renders the store name dynamically from lokasi-store.
 * Shows skeleton until API data is loaded — NO hardcoded fallback.
 */
export function StoreName({
  className = "text-lg font-bold tracking-tight",
}: {
  className?: string;
}) {
  const { lokasi, isLoaded } = useLokasi();

  // Show skeleton while loading — never show stale/hardcoded name
  if (!isLoaded || !lokasi.namaToko) {
    return <SkeletonText width="120px" height="1rem" />;
  }

  const name = lokasi.namaToko;
  const firstWord = name.split(" ")[0];
  const rest = name.split(" ").slice(1).join(" ");

  return (
    <span className={className}>
      {firstWord}
      {rest && <span className="text-primary"> {rest}</span>}
    </span>
  );
}

/**
 * Returns the plain store name (no styling split).
 * Returns empty string while loading — caller should handle skeleton.
 */
export function StoreNamePlain() {
  const { lokasi, isLoaded } = useLokasi();

  if (!isLoaded || !lokasi.namaToko) {
    return <SkeletonText width="100px" height="0.875rem" />;
  }

  return <>{lokasi.namaToko}</>;
}
