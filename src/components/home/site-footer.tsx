import Link from "next/link";
import { Phone, MessageCircle, MapPin, Clock } from "lucide-react";
import type { LokasiData } from "@/data/homepage-static";
import { buildWaLink, resolveLogo } from "./shared";

const footerLinks = [
  { href: "/#proses", label: "Proses" },
  { href: "/#toko", label: "Toko" },
  { href: "/tentang", label: "Tentang" },
  { href: "/artikel", label: "Artikel" },
  { href: "/#faq", label: "FAQ" },
];

export function SiteFooter({ lokasi, logo }: { lokasi: LokasiData; logo: string }) {
  const waLink = buildWaLink(lokasi);
  const logoSrc = resolveLogo(logo);

  return (
    <footer className="border-t border-border bg-card/30">
      <div className="page-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img
                src={logoSrc}
                alt={lokasi.namaToko || "Logo"}
                className="h-8 w-8 rounded-lg object-cover"
              />
              <span className="font-semibold">{lokasi.namaToko}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Laptop Lamamu Masih Bernilai.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Kontak
            </p>
            <div className="space-y-2 text-sm">
              {lokasi.telepon && (
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  <span>{lokasi.telepon}</span>
                </p>
              )}
              {lokasi.whatsapp && (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>WhatsApp: {lokasi.whatsapp}</span>
                </a>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Lokasi & Jam
            </p>
            <div className="space-y-2 text-sm">
              {lokasi.alamat && (
                <p className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span>{lokasi.alamat}</span>
                </p>
              )}
              {lokasi.jamWeekday && (
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  <span>Weekday: {lokasi.jamWeekday}</span>
                </p>
              )}
              {lokasi.jamWeekend && (
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  <span>Weekend: {lokasi.jamWeekend}</span>
                </p>
              )}
              {lokasi.mapsLink && (
                <a
                  href={lokasi.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline mt-1"
                >
                  <MapPin className="h-3 w-3" />
                  Lihat di Google Maps
                </a>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Mulai Sekarang
            </p>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors mb-4"
            >
              <MessageCircle className="h-4 w-4" />
              Ajukan via WhatsApp
            </a>
            <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
              {footerLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="hover:text-foreground transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground text-center md:text-left">
            &copy; 2026 Nauka Motion. Laptop Lamamu Masih Bernilai.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {footerLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="hover:text-foreground transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
