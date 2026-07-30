"use client";

// ─── Jakarta Laptops — Google Ads WhatsApp Conversion Tracking ───
// Global click interceptor: kirim conversion event setiap kali user
// klik link/tombol yang mengarah ke WhatsApp.
//
// Konversi hanya dikirim untuk URL yang mengandung:
//   wa.me | api.whatsapp.com | whatsapp://
//
// Perilaku:
//   - target="_blank" → tracking di background, link buka seperti biasa (tanpa delay)
//   - same-tab (tanpa target) → tunggu event_callback / fallback, lalu navigasi
//   - Temporary lock 2s per elemen mencegah double-fire dari satu klik
//   - Lock auto-release → klik berikutnya setelah 2s tetap jadi conversion baru

import { useEffect } from "react";

const CONVERSION_SEND_TO = "AW-18221664763/H6mmCMD0itkcEPuT4vBD";
const FALLBACK_TIMEOUT = 1000; // ms
const DEBOUNCE_MS = 2000; // lock per elemen setelah klik

/** Regex untuk detect URL WhatsApp */
const WA_URL_PATTERN = /wa\.me|api\.whatsapp\.com|whatsapp:\/\//i;

/** Track conversion via gtag (fire-and-forget, tanpa blocking) */
function fireConversion(): void {
  try {
    const w = window as Record<string, unknown>;
    if (typeof w.gtag === "function") {
      w.gtag("event", "conversion", {
        send_to: CONVERSION_SEND_TO,
        value: 1.0,
        currency: "IDR",
      });
    }
  } catch {
    // tracking error, jangan block UX
  }
}

/** Track conversion lalu resolve setelah callback atau fallback */
function trackConversionThenNavigate(): Promise<void> {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, FALLBACK_TIMEOUT);

    try {
      const w = window as Record<string, unknown>;
      if (typeof w.gtag === "function") {
        w.gtag("event", "conversion", {
          send_to: CONVERSION_SEND_TO,
          value: 1.0,
          currency: "IDR",
          event_callback: () => {
            clearTimeout(timer);
            resolve();
          },
        });
      } else {
        clearTimeout(timer);
        resolve();
      }
    } catch {
      clearTimeout(timer);
      resolve();
    }
  });
}

export function WhatsAppConversionTracking() {
  useEffect(() => {
    /** Temporary lock per elemen: element → timestamp saat terakhir diklik */
    const lockMap = new WeakMap<HTMLAnchorElement, number>();

    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.href || "";
      if (!WA_URL_PATTERN.test(href)) return;

      // Cek lock: jika elemen diklik < 2 detik lalu, skip
      const now = Date.now();
      const lastClick = lockMap.get(anchor) || 0;
      if (now - lastClick < DEBOUNCE_MS) return;

      // Set lock
      lockMap.set(anchor, now);

      const isBlank = anchor.target === "_blank";

      if (isBlank) {
        // target="_blank" → fire tracking tanpa block navigasi default
        fireConversion();
        // Biarkan browser handle navigasi secara native (e.preventDefault TIDAK dipanggil)
      } else {
        // Same-tab → tunggu tracking, lalu navigasi manual
        e.preventDefault();
        trackConversionThenNavigate().finally(() => {
          window.location.href = href;
        });
      }
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
