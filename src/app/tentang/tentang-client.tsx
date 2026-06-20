"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  ShieldCheck,
  Eye,
  Clock as ClockIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Eye,
  ShieldCheck,
  Clock: ClockIcon,
};

export function TentangClient({
  namaToko,
  tagline,
  alamat,
  telepon,
  whatsapp,
  jamWeekday,
  jamWeekend,
  mapsLink,
  brandTitle,
  brandCopy,
  brandPoints,
  workflowStages,
  siteDescription,
  copyrightText,
}: {
  namaToko: string;
  tagline: string;
  alamat: string;
  telepon: string;
  whatsapp: string;
  jamWeekday: string;
  jamWeekend: string;
  mapsLink: string;
  brandTitle: string;
  brandCopy: string;
  brandPoints: { icon: string; title: string; desc: string }[];
  workflowStages: { n: string; title: string; desc: string }[];
  siteDescription: string;
  copyrightText: string;
}) {
  const waNumber = whatsapp ? whatsapp.replace(/^0/, "62") : "";
  const waLink = waNumber ? `https://wa.me/${waNumber}` : "#";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="page-container flex h-16 items-center justify-between">
          <a href="/" className="text-base font-semibold tracking-tight">
            {namaToko || "Jakarta Laptops"}
          </a>
          <Button asChild size="sm" variant="ghost">
            <a href="/">← Beranda</a>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border">
          <div className="page-container py-16 md:py-24 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">
                Tentang Kami
              </p>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                {brandTitle || `Tentang ${namaToko}`}
              </h1>
              <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed">
                {brandCopy || siteDescription || tagline}
              </p>
              <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                Jakarta Laptops membantu proses penilaian dan pembelian laptop bekas secara profesional.
              </p>
              <p className="mt-2 text-base text-muted-foreground leading-relaxed">
                Berlokasi di Jakarta, kami menangani inspeksi perangkat, pengecekan kondisi, dan proses penawaran dengan pendekatan yang jelas dan transparan.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Values */}
        {brandPoints.length > 0 && (
          <section className="border-b border-border bg-card/50">
            <div className="page-container py-16 md:py-24">
              <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                {brandPoints.map((point, i) => {
                  const Icon = iconMap[point.icon] || ShieldCheck;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.12 }}
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-secondary-foreground mb-4">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{point.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{point.desc}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Workflow */}
        {workflowStages.length > 0 && (
          <section className="border-b border-border">
            <div className="page-container py-16 md:py-24 max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-12">Proses Kami</h2>
              <div className="space-y-6">
                {workflowStages.map((stage, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary text-primary font-bold text-sm">
                      {stage.n}
                    </div>
                    <div className="flex-1 pb-4">
                      <h3 className="font-semibold">{stage.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{stage.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Kontak */}
        <section className="border-b border-border bg-card/50">
          <div className="page-container py-16 md:py-24">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Kunjungi Toko</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {alamat && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold">Alamat</p>
                      <p className="text-sm text-muted-foreground">{alamat}</p>
                    </div>
                  </div>
                )}
                {telepon && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="text-sm font-semibold">Telepon</p>
                      <p className="text-sm text-muted-foreground">{telepon}</p>
                    </div>
                  </div>
                )}
                {whatsapp && (
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="text-sm font-semibold">WhatsApp</p>
                      <p className="text-sm text-muted-foreground">{whatsapp}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                {jamWeekday && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="text-sm font-semibold">Jam Weekday</p>
                      <p className="text-sm text-muted-foreground">{jamWeekday}</p>
                    </div>
                  </div>
                )}
                {jamWeekend && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="text-sm font-semibold">Jam Weekend</p>
                      <p className="text-sm text-muted-foreground">{jamWeekend}</p>
                    </div>
                  </div>
                )}
                {mapsLink && (
                  <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                    <MapPin className="h-4 w-4" /> Lihat di Google Maps
                  </a>
                )}
              </div>
            </div>
            {waLink !== "#" && (
              <div className="mt-8">
                <a href={waLink} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="gap-2">
                    <MessageCircle className="h-4 w-4" /> Hubungi via WhatsApp
                  </Button>
                </a>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card/30 py-6">
        <div className="page-container text-center">
          <p className="text-xs text-muted-foreground">{copyrightText || "© 2026 Nauka Motion. Laptop Lamamu Masih Bernilai."}</p>
        </div>
      </footer>
    </div>
  );
}
