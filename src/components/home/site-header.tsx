"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import type { LokasiData } from "@/lib/homepage-data";
import { buildWaLink, resolveLogo } from "./shared";

const menuLinks = [
  { href: "/#proses", label: "Proses" },
  { href: "/#toko", label: "Toko" },
  { href: "/tentang", label: "Tentang" },
  { href: "/artikel", label: "Artikel" },
  { href: "/#faq", label: "FAQ" },
];

export function SiteHeader({
  lokasi,
  logo,
}: {
  lokasi: LokasiData;
  logo: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const waLink = buildWaLink(lokasi);
  const logoSrc = resolveLogo(logo);
  const namaToko = lokasi.namaToko || "";
  const [firstWord, ...rest] = namaToko.split(" ");
  const restName = rest.join(" ");

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-border bg-background/80 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="page-container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img
              src={logoSrc}
              alt={namaToko || "Logo"}
              className="h-9 w-9 rounded-xl object-cover"
            />
            <span
              className={`text-base font-semibold tracking-tight ${
                scrolled ? "" : "text-white"
              }`}
            >
              {namaToko ? (
                <span className="text-base font-semibold tracking-tight">
                  {firstWord}
                  {restName && (
                    <span className={scrolled ? "text-primary" : "text-white/70"}>
                      {" "}
                      {restName}
                    </span>
                  )}
                </span>
              ) : null}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {menuLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 text-sm font-medium transition-colors ${
                  scrolled
                    ? "text-muted-foreground hover:text-foreground"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a href={waLink} target="_blank" rel="noopener noreferrer">
              <Button
                size="sm"
                className={`gap-1.5 transition-colors ${
                  scrolled ? "" : "bg-white text-black hover:bg-white/90"
                }`}
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Ajukan Laptop
              </Button>
            </a>
            <button
              onClick={() => setMenuOpen(true)}
              className={`flex md:hidden h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                scrolled ? "hover:bg-muted" : "hover:bg-white/10 text-white"
              }`}
              aria-label="Buka menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent className="w-[300px] bg-background border-border p-0">
          <div className="flex items-center justify-between border-b border-border px-4 h-16">
            <div className="flex items-center gap-2">
              <img
                src={logoSrc}
                alt={namaToko || "Logo"}
                className="h-8 w-8 rounded-lg object-cover"
              />
              <span className="font-semibold">{namaToko}</span>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <nav className="flex flex-col p-4 gap-1">
            {menuLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium hover:bg-muted transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="mt-2"
            >
              <Button className="w-full gap-2">
                <MessageCircle className="h-4 w-4" />
                Ajukan via WhatsApp
              </Button>
            </a>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
