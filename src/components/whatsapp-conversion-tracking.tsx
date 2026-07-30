"use client";

// ─── Jakarta Laptops — Google Ads WhatsApp Conversion Tracking ───
// Global click interceptor: kirim conversion event setiap kali user
// klik link/tombol yang mengarah ke WhatsApp.
//
// Konversi hanya dikirim untuk URL yang mengandung:
//   wa.me | api.whatsapp.com | whatsapp://
//
// Fitur:
//   - event_callback + fallback timeout (WA tetap terbuka jika tracking lambat)
//   - Satu klik = satu conversion (debounce per element)
//   - Tidak menghitung klik navigasi, telepon, atau tombol lain

import { useEffect } from "react";

const CONVERSION_SEND_TO = "AW-18221664763/H6mmCMD0itkcEPuT4vBD";
const FALLBACK_TIMEOUT = 1000; // ms — buka WA walau tracking belum selesai

/** Regex untuk detect URL WhatsApp */
const WA_URL_PATTERN = /wa\.me|api\.whatsapp\.com|whatsapp:\/\//i;

/** Track conversion via gtag, resolve setelah callback atau timeout */
function trackConversion(): Promise<void> {
  return new Promise((resolve) => {
    // Fallback: pastikan resolve dipanggil walau gtag tidak ada / lama
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
        // gtag belum tersedia, langsung resolve
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
    /** Set elemen yang sedang pending conversion (cegah duplikat) */
    const pendingElements = new WeakSet<HTMLAnchorElement>();

    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;

      // Cari anchor terdekat (karena klik bisa di <button> di dalam <a>)
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.href || "";

      // Hanya proses URL WhatsApp
      if (!WA_URL_PATTERN.test(href)) return;

      // Cegah duplikat: jika elemen ini sedang pending, skip
      if (pendingElements.has(anchor)) return;
      pendingElements.add(anchor);

      // Cegah navigasi default sementara
      e.preventDefault();
      e.stopPropagation();

      // Kirim conversion, lalu buka WA
      trackConversion().finally(() => {
        // Reset state supaya klik berikutnya dihitung
        pendingElements.delete(anchor);
        // Buka link WhatsApp
        window.open(href, anchor.target || "_blank", "noopener,noreferrer");
      });
    }

    document.addEventListener("click", handleClick, true); // capture phase
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  // Component ini tidak merender apa-apa
  return null;
}
