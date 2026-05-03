"use client";

import { Toaster } from "@/components/ui/sonner";
import { useTheme } from "@/lib/theme-store";

export function ThemeAwareToaster() {
  const { isLight } = useTheme();

  return (
    <Toaster
      richColors
      theme={isLight ? "light" : "dark"}
      position="top-center"
      closeButton
      duration={3000}
      visibleToasts={3}
    />
  );
}
