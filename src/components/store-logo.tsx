"use client";

import { useState, useEffect } from "react";

/**
 * Renders the store logo. Uses custom logo from database (StoreLogo table) if available,
 * otherwise falls back to /logo.png
 *
 * Cache strategy: no-store + timestamp query param untuk bypass browser image cache.
 * Browser aggressively caches image src — kalau logo di-update, user tetap lihat
 * logo lama karena URL sama. Tambah timestamp untuk force reload.
 */
export function StoreLogo({
  className = "h-9 w-9 rounded-xl object-cover",
  alt = "Jakarta Laptops",
}: {
  className?: string;
  alt?: string;
}) {
  const [src, setSrc] = useState<string>("/logo.png");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchLogo() {
      try {
        // cache: 'no-store' supaya gak cached di browser
        const res = await fetch("/api/lokasi/logo", {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.logoData) {
            // Tambah timestamp buat cache-busting (force browser reload image)
            // Base64 data URLs gak di-cache agresif, tapi kalau URL, tambah query param
            const logoSrc = data.logoData;
            if (logoSrc.startsWith("data:")) {
              setSrc(logoSrc);
            } else {
              // URL-based — append cache buster
              const sep = logoSrc.includes("?") ? "&" : "?";
              setSrc(`${logoSrc}${sep}t=${Date.now()}`);
            }
          }
        }
      } catch {
        // Ignore errors, keep default logo
      } finally {
        setLoaded(true);
      }
    }
    fetchLogo();
  }, []);

  return <img src={src} alt={alt} className={className} />;
}
