"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/lib/theme-store";

interface StoreMapProps {
  lat: number;
  lng: number;
  namaToko: string;
  alamat: string;
  className?: string;
}

export function StoreMap({ lat, lng, namaToko, alamat, className }: StoreMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [isReady, setIsReady] = useState(false);
  const { isLight } = useTheme();

  // Detect if dark mode
  const isDark = !isLight;

  useEffect(() => {
    // Dynamic import to avoid SSR issues
    let cancelled = false;

    async function initMap() {
      const L = (await import("leaflet")).default;

      // Import CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      if (cancelled || !mapRef.current) return;

      // Clean up existing map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Choose tile layer based on theme
      const tileUrl = isDark
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

      const attribution = isDark
        ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

      // Create map
      const map = L.map(mapRef.current, {
        center: [lat, lng],
        zoom: 16,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
        dragging: true,
      });

      // Add tile layer
      L.tileLayer(tileUrl, {
        attribution,
        maxZoom: 19,
      }).addTo(map);

      // Custom marker icon using SVG (no default Leaflet icon needed)
      const markerIcon = L.divIcon({
        className: "custom-marker",
        html: `
          <div style="
            position: relative;
            width: 40px;
            height: 52px;
          ">
            <svg width="40" height="52" viewBox="0 0 40 52" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 0C8.954 0 0 8.954 0 20c0 14 20 32 20 32s20-18 20-32C40 8.954 31.046 0 20 0z" fill="${isDark ? '#6366f1' : '#4f46e5'}"/>
              <circle cx="20" cy="18" r="8" fill="white"/>
              <circle cx="20" cy="18" r="4" fill="${isDark ? '#6366f1' : '#4f46e5'}"/>
            </svg>
          </div>
        `,
        iconSize: [40, 52],
        iconAnchor: [20, 52],
        popupAnchor: [0, -52],
      });

      // Add marker with popup
      L.marker([lat, lng], { icon: markerIcon })
        .addTo(map)
        .bindPopup(
          `<div style="
            font-family: system-ui, -apple-system, sans-serif;
            padding: 4px 2px;
            min-width: 180px;
          ">
            <div style="font-weight:700; font-size:14px; margin-bottom:4px; color:#1a1a1a;">${namaToko}</div>
            <div style="font-size:12px; color:#666; line-height:1.4;">${alamat}</div>
          </div>`,
          {
            className: "custom-popup",
            maxWidth: 260,
          }
        )
        .openPopup();

      // Add zoom control to bottom-right
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Add attribution to bottom-left (minimal)
      L.control.attribution({ position: "bottomleft", prefix: false }).addAttribution(
        '<span style="font-size:9px;opacity:0.5">OSM & CARTO</span>'
      ).addTo(map);

      mapInstanceRef.current = map;
      setIsReady(true);
    }

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initMap, 100);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng, namaToko, alamat, isDark]);

  return (
    <div className={`relative ${className || ""}`}>
      {/* Loading state */}
      {!isReady && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted/20 rounded-2xl">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <span className="text-xs text-muted-foreground">Memuat peta...</span>
          </div>
        </div>
      )}

      {/* Map container */}
      <div
        ref={mapRef}
        className="w-full h-full min-h-[300px] md:min-h-[360px] rounded-2xl overflow-hidden z-0"
        style={{ background: isDark ? "#1a1a2e" : "#f0ede6" }}
      />

      {/* Custom styles for Leaflet */}
      <style jsx global>{`
        .custom-marker {
          background: none !important;
          border: none !important;
        }
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px !important;
          box-shadow: 0 8px 30px rgba(0,0,0,0.15) !important;
          padding: 4px !important;
        }
        .custom-popup .leaflet-popup-tip {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
        }
        .custom-popup .leaflet-popup-content {
          margin: 10px 14px !important;
        }
        .custom-popup .leaflet-popup-close-button {
          color: #999 !important;
          font-size: 18px !important;
          padding: 4px 8px 0 0 !important;
        }
        .leaflet-control-zoom a {
          width: 34px !important;
          height: 34px !important;
          line-height: 34px !important;
          font-size: 16px !important;
          border-radius: 10px !important;
          border: none !important;
          margin-bottom: 4px !important;
          transition: all 0.2s;
        }
        .leaflet-control-zoom {
          border: none !important;
          border-radius: 12px !important;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12) !important;
        }
        .leaflet-control-attribution {
          background: rgba(255,255,255,0.6) !important;
          backdrop-filter: blur(4px);
          border-radius: 6px !important;
          padding: 2px 6px !important;
          font-size: 9px !important;
        }
      `}</style>
    </div>
  );
}
