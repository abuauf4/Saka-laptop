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

/* ── Theme Types ── */
export type ThemeName =
  | "dark"
  | "midnight-ocean"
  | "cyberpunk"
  | "sunset"
  | "forest"
  | "light";

export interface ThemeInfo {
  name: ThemeName;
  label: string;
  emoji: string;
  description: string;
  isLight: boolean;
}

export const themes: ThemeInfo[] = [
  {
    name: "dark",
    label: "Dark Default",
    emoji: "🌑",
    description: "Tema gelap klasik yang nyaman di mata",
    isLight: false,
  },
  {
    name: "midnight-ocean",
    label: "Midnight Ocean",
    emoji: "🌊",
    description: "Biru malam yang dalam dan elegan",
    isLight: false,
  },
  {
    name: "cyberpunk",
    label: "Cyberpunk Neon",
    emoji: "🔮",
    description: "Neon menyala di kegelapan kota",
    isLight: false,
  },
  {
    name: "sunset",
    label: "Sunset Warm",
    emoji: "🌅",
    description: "Hangat seperti senja di pantai",
    isLight: false,
  },
  {
    name: "forest",
    label: "Forest Green",
    emoji: "🌲",
    description: "Hijau alam yang menenangkan",
    isLight: false,
  },
  {
    name: "light",
    label: "Light Clean",
    emoji: "☀️",
    description: "Tema terang bersih dan segar",
    isLight: true,
  },
];

/* ── Context Shape ── */
interface ThemeStore {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  themeInfo: ThemeInfo;
  isLight: boolean;
}

const ThemeContext = createContext<ThemeStore | null>(null);

const STORAGE_KEY = "saka_laptop_theme";

/* ── Helper: Apply theme to DOM ── */
function applyThemeToDOM(name: ThemeName, animate: boolean = false) {
  const root = document.documentElement;

  // Add transition class for smooth color change
  if (animate) {
    root.classList.add("theme-transitioning");
  }

  // Remove all theme classes
  root.classList.remove(
    "dark",
    "theme-midnight-ocean",
    "theme-cyberpunk",
    "theme-sunset",
    "theme-forest",
    "theme-light"
  );

  // Add appropriate class
  const info = themes.find((t) => t.name === name);
  if (info?.isLight) {
    root.classList.add("theme-light");
  } else {
    root.classList.add("dark");
  }

  // Also add specific theme class for CSS variable overrides
  if (name !== "dark") {
    root.classList.add(`theme-${name}`);
  }

  // Remove transition class after animation
  if (animate) {
    setTimeout(() => {
      root.classList.remove("theme-transitioning");
    }, 350);
  }
}

/* ── Provider ── */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("light");
  const [mounted, setMounted] = useState(false);
  const initialized = useRef(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    try {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeName | null;
      if (saved && themes.some((t) => t.name === saved)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- loading from localStorage on mount
        setThemeState(saved);
        applyThemeToDOM(saved);
      } else {
        applyThemeToDOM("light");
      }
    } catch {
      applyThemeToDOM("light");
    }
    setMounted(true);
  }, []);

  const setTheme = useCallback((name: ThemeName) => {
    setThemeState(name);
    applyThemeToDOM(name, true);
    try {
      localStorage.setItem(STORAGE_KEY, name);
    } catch {
      // Ignore
    }
  }, []);

  const themeInfo = themes.find((t) => t.name === theme) || themes[0];
  const isLight = themeInfo.isLight;

  // Prevent flash: render nothing until mounted
  if (!mounted) {
    return (
      <ThemeContext.Provider
        value={{ theme: "light", setTheme, themeInfo: themes.find(t => t.name === "light") || themes[0], isLight: true }}
      >
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeInfo, isLight }}>
      {children}
    </ThemeContext.Provider>
  );
}

/* ── Hook ── */
export function useTheme(): ThemeStore {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
