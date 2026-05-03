"use client";

import { useState, useEffect } from "react";

/**
 * Renders the store logo. Uses custom logo from database (StoreLogo table) if available,
 * otherwise falls back to /logo.png
 */
export function StoreLogo({
  className = "h-9 w-9 rounded-xl object-cover",
  alt = "Saka Laptop",
}: {
  className?: string;
  alt?: string;
}) {
  const [src, setSrc] = useState("/logo.png");

  useEffect(() => {
    async function fetchLogo() {
      try {
        const res = await fetch("/api/lokasi/logo");
        if (res.ok) {
          const data = await res.json();
          if (data.logoData) {
            setSrc(data.logoData);
          }
        }
      } catch {
        // Ignore errors, keep default logo
      }
    }
    fetchLogo();
  }, []);

  return <img src={src} alt={alt} className={className} />;
}
