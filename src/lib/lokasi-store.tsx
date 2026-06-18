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

/* ── Store location data shape ── */
export interface LokasiToko {
  namaToko: string;
  tagline: string;
  foto: string;           // URL or path to store photo
  alamat: string;
  telepon: string;        // e.g. "+62 896-6252-4542"
  whatsapp: string;       // e.g. "6289662524542"
  jamWeekday: string;     // e.g. "Senin - Sabtu: 09.00 - 21.00 WIB"
  jamWeekend: string;     // e.g. "Minggu: 10.00 - 18.00 WIB"
  lat: number;            // Latitude for map marker
  lng: number;            // Longitude for map marker
  mapsLink: string;       // Google Maps link for "Buka Maps"
}

/* ── Default seed data ── */
const defaultLokasi: LokasiToko = {
  namaToko: "Jakarta Laptops",
  tagline: "Toko Laptop Terpercaya",
  foto: "/store-front.png",
  alamat: "Jl. Raya Kebayoran Lama No. 12, Kel. Kebayoran Lama, Kec. Kebayoran Lama, Jakarta Selatan 12210",
  telepon: "+62 896-6252-4542",
  whatsapp: "6289662524542",
  jamWeekday: "Senin - Sabtu: 09.00 - 21.00 WIB",
  jamWeekend: "Minggu: 10.00 - 18.00 WIB",
  lat: -6.2445,
  lng: 106.7813,
  mapsLink: "https://maps.google.com/?q=Saka+Laptop+Jl.+Raya+Kebayoran+Lama+Jakarta+Selatan",
};

/* ── Context shape ── */
interface LokasiStore {
  lokasi: LokasiToko;
  updateLokasi: (data: Partial<LokasiToko>) => Promise<void>;
  resetLokasi: () => void;
  isLoaded: boolean;
}

const LokasiContext = createContext<LokasiStore | null>(null);

/* ── Provider ── */
export function LokasiProvider({ children }: { children: ReactNode }) {
  const [lokasi, setLokasi] = useState<LokasiToko>(defaultLokasi);
  const [isLoaded, setIsLoaded] = useState(false);
  const initialized = useRef(false);

  // Fetch lokasi from API on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    async function fetchLokasi() {
      try {
        const res = await fetch("/api/lokasi", {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });
        if (res.ok) {
          const data = await res.json();
          setLokasi({
            namaToko: data.namaToko || defaultLokasi.namaToko,
            tagline: data.tagline || defaultLokasi.tagline,
            foto: data.foto || defaultLokasi.foto,
            alamat: data.alamat || defaultLokasi.alamat,
            telepon: data.telepon || defaultLokasi.telepon,
            whatsapp: data.whatsapp || defaultLokasi.whatsapp,
            jamWeekday: data.jamWeekday || defaultLokasi.jamWeekday,
            jamWeekend: data.jamWeekend || defaultLokasi.jamWeekend,
            lat: data.lat ?? defaultLokasi.lat,
            lng: data.lng ?? defaultLokasi.lng,
            mapsLink: data.mapsLink || defaultLokasi.mapsLink,
          });
        }
      } catch (err) {
        console.error("Failed to fetch lokasi:", err);
      } finally {
        setIsLoaded(true);
      }
    }

    fetchLokasi();
  }, []);

  const updateLokasi = useCallback(async (data: Partial<LokasiToko>) => {
    try {
      const res = await fetch("/api/lokasi", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const updated = await res.json();
        setLokasi({
          namaToko: updated.namaToko || defaultLokasi.namaToko,
          tagline: updated.tagline || defaultLokasi.tagline,
          foto: updated.foto || defaultLokasi.foto,
          alamat: updated.alamat || defaultLokasi.alamat,
          telepon: updated.telepon || defaultLokasi.telepon,
          whatsapp: updated.whatsapp || defaultLokasi.whatsapp,
          jamWeekday: updated.jamWeekday || defaultLokasi.jamWeekday,
          jamWeekend: updated.jamWeekend || defaultLokasi.jamWeekend,
          lat: updated.lat ?? defaultLokasi.lat,
          lng: updated.lng ?? defaultLokasi.lng,
          mapsLink: updated.mapsLink || defaultLokasi.mapsLink,
        });
      }
    } catch (err) {
      console.error("Failed to update lokasi:", err);
    }
  }, []);

  const resetLokasi = useCallback(() => {
    setLokasi(defaultLokasi);
  }, []);

  return (
    <LokasiContext.Provider
      value={{ lokasi, updateLokasi, resetLokasi, isLoaded }}
    >
      {children}
    </LokasiContext.Provider>
  );
}

/* ── Hook ── */
export function useLokasi(): LokasiStore {
  const ctx = useContext(LokasiContext);
  if (!ctx) {
    throw new Error("useLokasi must be used within a LokasiProvider");
  }
  return ctx;
}
