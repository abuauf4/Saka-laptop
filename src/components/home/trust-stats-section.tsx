import type { HomepageData } from "@/lib/homepage-data";

const FALLBACK_STATS = [
  {
    stat: "12",
    label: "Titik QC",
    desc: "Setiap laptop diperiksa di 12 titik: layar, keyboard, touchpad, baterai, charger, storage, RAM, kamera, speaker, port, WiFi, fisik.",
  },
  {
    stat: "1–2",
    label: "Hari Proses",
    desc: "Dari pengajuan via WhatsApp sampai penawaran final. Review awal 1×24 jam, inspeksi fisik 30–60 menit di toko.",
  },
  {
    stat: "100%",
    label: "Penawaran Transparan",
    desc: "Harga berdasarkan hasil QC aktual, bukan tebakan. Kamu lihat sendiri apa yang diperiksa dan kenapa harganya segitu.",
  },
];

export function TrustStatsSection({
  trustStats,
}: {
  trustStats: HomepageData["trustStats"];
}) {
  const stats = trustStats && trustStats.length > 0 ? trustStats : FALLBACK_STATS;

  return (
    <section className="border-b border-border bg-background">
      <div className="page-container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
          {stats.map((item, i) => (
            <div key={i} className="text-center md:text-left">
              <p className="text-5xl md:text-6xl font-bold tracking-tight text-foreground">
                {item.stat}
              </p>
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary mt-2 mb-3">
                {item.label}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto md:mx-0">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
