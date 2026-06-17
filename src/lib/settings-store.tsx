// ─── Nauka CMS — Client-side Settings Store (Zustand) ───

"use client";

import { create } from "zustand";

interface BrandingData {
  siteName: string;
  tagline: string;
  siteDescription: string | null;
  logo: string | null;
  favicon: string | null;
  copyrightText: string;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  youtube: string | null;
  linkedin: string | null;
}

interface ThemeData {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgColor: string;
  textColor: string;
  headingFont: string;
  bodyFont: string;
  borderRadius: string;
  containerWidth: string;
  buttonStyle: string;
  backgroundMode: string;
}

interface SettingsData {
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  googleMapsUrl: string | null;
  googleAnalyticsId: string | null;
  metaPixelId: string | null;
  maintenanceMode: boolean;
}

interface SettingsState {
  branding: BrandingData | null;
  theme: ThemeData | null;
  settings: SettingsData | null;
  isLoading: boolean;
  fetchBranding: () => Promise<void>;
  fetchTheme: () => Promise<void>;
  fetchSettings: () => Promise<void>;
  updateBranding: (data: Partial<BrandingData>) => Promise<void>;
  updateTheme: (data: Partial<ThemeData>) => Promise<void>;
  updateSettings: (data: Partial<SettingsData>) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  branding: null,
  theme: null,
  settings: null,
  isLoading: false,

  fetchBranding: async () => {
    try {
      const res = await fetch("/api/branding");
      if (res.ok) {
        const data = await res.json();
        set({ branding: data });
      }
    } catch {
      // silently fail
    }
  },

  fetchTheme: async () => {
    try {
      const res = await fetch("/api/theme");
      if (res.ok) {
        const data = await res.json();
        set({ theme: data });
      }
    } catch {
      // silently fail
    }
  },

  fetchSettings: async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        set({ settings: data });
      }
    } catch {
      // silently fail
    }
  },

  updateBranding: async (data: Partial<BrandingData>) => {
    const res = await fetch("/api/branding", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const updated = await res.json();
      set({ branding: updated });
    } else {
      const err = await res.json();
      throw new Error(err.error || "Failed to update branding");
    }
  },

  updateTheme: async (data: Partial<ThemeData>) => {
    const res = await fetch("/api/theme", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const updated = await res.json();
      set({ theme: updated });
    } else {
      const err = await res.json();
      throw new Error(err.error || "Failed to update theme");
    }
  },

  updateSettings: async (data: Partial<SettingsData>) => {
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const updated = await res.json();
      set({ settings: updated });
    } else {
      const err = await res.json();
      throw new Error(err.error || "Failed to update settings");
    }
  },
}));
