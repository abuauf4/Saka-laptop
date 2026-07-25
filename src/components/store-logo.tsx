"use client";

import { useState, useEffect } from "react";
import { SkeletonBox } from "@/components/skeleton-home";

/**
 * Renders the store logo from database (StoreLogo table).
 * Shows skeleton until loaded — NO default logo fallback.
 *
 * Cache strategy: browser cache with normal fetch (no cache-busting)
 */
export function StoreLogo({
  className = "h-9 w-9 rounded-xl object-cover",
  alt = "Store logo",
}: {
  className?: string;
  alt?: string;
}) {
  const [src, setSrc] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchLogo() {
      try {
        const res = await fetch("/api/lokasi/logo");
        if (res.ok) {
          const data = await res.json();
          if (data.logoData) {
            const logoSrc = data.logoData;
            if (logoSrc.startsWith("data:")) {
              setSrc(logoSrc);
            } else {
              setSrc(logoSrc);
            }
          }
          // If no logoData, src stays null → keep showing skeleton
        }
      } catch {
        // Keep showing skeleton
      } finally {
        setLoaded(true);
      }
    }
    fetchLogo();
  }, []);

  // Show skeleton while loading OR if no logo configured
  if (!src) {
    return (
      <SkeletonBox
        width="2.25rem"
        height="2.25rem"
        rounded="rounded-xl"
        className={className}
      />
    );
  }

  return <img src={src} alt={alt} className={className} />;
}
