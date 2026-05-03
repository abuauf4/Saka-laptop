"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      style={
        {
          "--normal-bg": "oklch(0.16 0 0)",
          "--normal-text": "oklch(0.95 0 0)",
          "--normal-border": "oklch(1 0 0 / 10%)",
          "--success-bg": "oklch(0.16 0.04 155)",
          "--success-text": "oklch(0.9 0.1 155)",
          "--success-border": "oklch(0.4 0.1 155 / 30%)",
          "--error-bg": "oklch(0.16 0.04 25)",
          "--error-text": "oklch(0.9 0.1 25)",
          "--error-border": "oklch(0.4 0.1 25 / 30%)",
          "--warning-bg": "oklch(0.16 0.04 80)",
          "--warning-text": "oklch(0.9 0.1 80)",
          "--warning-border": "oklch(0.4 0.1 80 / 30%)",
        } as React.CSSProperties
      }
      toastOptions={{
        className: "rounded-xl",
      }}
      {...props}
    />
  );
};

export { Toaster };
