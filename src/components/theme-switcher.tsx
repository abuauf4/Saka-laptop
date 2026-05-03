"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Check, X } from "lucide-react";
import { useTheme, themes, type ThemeName } from "@/lib/theme-store";
import { cn } from "@/lib/utils";

export function ThemeSwitcher() {
  const { theme, setTheme, themeInfo } = useTheme();
  const [open, setOpen] = useState(false);
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);

  // Ensure portal target exists (only on client) — using state instead of ref to satisfy lint
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- setting portal target on mount
    setPortalEl(document.body);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleSelect = (name: ThemeName) => {
    setTheme(name);
    // Small delay for visual feedback before closing
    setTimeout(() => setOpen(false), 300);
  };

  // Overlay content to be portaled
  const overlayContent = (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="theme-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Theme Picker Panel */}
          <motion.div
            key="theme-panel"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 bottom-6 z-[9999] mx-auto max-w-md rounded-2xl border border-border/50 bg-card shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
                  <Palette className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Pilih Tema</h3>
                  <p className="text-xs text-muted-foreground">
                    Tema saat ini: {themeInfo.emoji} {themeInfo.label}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted/60 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Theme Grid */}
            <div className="p-4 grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
              {themes.map((t, i) => {
                const isSelected = theme === t.name;
                return (
                  <motion.button
                    key={t.name}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.25 }}
                    onClick={() => handleSelect(t.name)}
                    className={cn(
                      "relative flex flex-col items-start gap-1.5 rounded-xl border-2 p-4 transition-all duration-300 text-left min-h-[100px]",
                      isSelected
                        ? "border-primary bg-primary/10 shadow-soft-md shadow-primary/10"
                        : "border-border/50 bg-background hover:border-primary/30 hover:shadow-soft-md hover:shadow-black/5"
                    )}
                  >
                    {/* Emoji + Check */}
                    <div className="flex items-center justify-between w-full">
                      <span className="text-2xl">{t.emoji}</span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", damping: 15 }}
                          className="flex h-5 w-5 items-center justify-center rounded-full bg-primary"
                        >
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </motion.div>
                      )}
                    </div>

                    {/* Label */}
                    <div>
                      <p className={cn(
                        "text-sm font-semibold leading-tight",
                        isSelected && "text-primary"
                      )}>
                        {t.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {t.description}
                      </p>
                    </div>

                    {/* Color preview dots */}
                    <div className="flex gap-1 mt-auto">
                      <ThemeColorDots name={t.name} />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl hover:bg-muted/60 transition-all duration-200 touch-target"
        aria-label="Ganti tema"
      >
        <Palette className="h-5 w-5" />
        {/* Animated dot to show current theme color */}
        <span
          className="absolute bottom-1 right-1 h-2 w-2 rounded-full bg-primary ring-2 ring-background"
        />
      </button>

      {/* Portal overlay into document.body to escape backdrop-blur stacking contexts */}
      {portalEl && createPortal(overlayContent, portalEl)}
    </>
  );
}

/* ── Small color dots to preview theme ── */
function ThemeColorDots({ name }: { name: ThemeName }) {
  const colorMap: Record<ThemeName, string[]> = {
    dark: ["bg-emerald-500", "bg-gray-700", "bg-gray-900"],
    "midnight-ocean": ["bg-cyan-500", "bg-blue-800", "bg-slate-900"],
    cyberpunk: ["bg-fuchsia-500", "bg-violet-600", "bg-slate-950"],
    sunset: ["bg-orange-500", "bg-amber-600", "bg-stone-900"],
    forest: ["bg-emerald-500", "bg-green-700", "bg-stone-900"],
    light: ["bg-emerald-500", "bg-gray-200", "bg-white"],
  };

  const colors = colorMap[name] || colorMap.dark;

  return (
    <>
      {colors.map((color, i) => (
        <span
          key={i}
          className={cn("h-2.5 w-2.5 rounded-full", color)}
        />
      ))}
    </>
  );
}
