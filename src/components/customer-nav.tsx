"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Laptop, MessageSquareHeart } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ThemeSwitcher } from "@/components/theme-switcher";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/finder", label: "Finder", icon: Search },
  { href: "/produk", label: "Produk", icon: Laptop },
  { href: "/#testimoni", label: "Testimoni", icon: MessageSquareHeart },
];

export function CustomerNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-card/95 backdrop-blur-xl safe-area-bottom shadow-soft-lg">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-4">
        {navItems.map((item) => {
          const isActive = !item.href.startsWith("/#") && pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center gap-1 rounded-xl px-5 py-2 transition-all duration-300 min-w-[64px] min-h-[48px] justify-center",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 transition-all duration-300",
                  isActive && "scale-110"
                )}
              />
              <span className={cn("text-xs font-medium", isActive && "font-semibold")}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-px h-0.5 w-8 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
        {/* Theme Switcher */}
        <ThemeSwitcher />
      </div>
    </nav>
  );
}
