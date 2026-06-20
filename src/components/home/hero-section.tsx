import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MessageCircle, ShieldCheck, Eye, Clock } from "lucide-react";
import type { LokasiData, HomepageData } from "@/lib/homepage-data";
import { buildWaLink } from "./shared";

export function HeroSection({
  homepage,
  lokasi,
}: {
  homepage: HomepageData;
  lokasi: LokasiData;
}) {
  const waLink = buildWaLink(lokasi);
  const heroTitle = homepage.heroTitle;

  return (
    <section className="relative min-h-screen flex items-end overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={homepage.heroImage}
          alt="Teknisi Jakarta Laptops sedang inspeksi laptop bekas dengan multimeter"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
      </div>

      <div className="relative z-10 page-container w-full pb-24 md:pb-32 pt-32">
        <div className="max-w-2xl animate-fade-in-up">
          <div
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-4 py-1.5 mb-7"
            style={{ animationDelay: "150ms", animationFillMode: "both" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-xs font-medium text-white/90 tracking-wide">
              {homepage.heroEyebrow}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-white">
            {heroTitle.includes("Tanpa Ribet") ? (
              <>
                {heroTitle.replace(" Tanpa Ribet.", "")}{" "}
                <span className="text-white">Tanpa Ribet.</span>
              </>
            ) : (
              heroTitle
            )}
          </h1>

          <p className="mt-6 text-base md:text-lg text-white/85 leading-relaxed max-w-xl">
            {homepage.heroSubtitle}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <a href={waLink} target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto min-h-[54px] px-8 gap-2 text-base font-semibold rounded-xl border-white/60 text-white bg-white/5 hover:bg-white/15 hover:text-white hover:border-white"
              >
                <MessageCircle className="h-4 w-4" />
                Ajukan Laptop
              </Button>
            </a>
            <Link href="#proses">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto min-h-[54px] px-8 text-base font-semibold rounded-xl bg-white/10 backdrop-blur-md border-white/40 text-white hover:bg-white/20 hover:text-white"
              >
                Lihat Proses
              </Button>
            </Link>
          </div>

          <div
            className="mt-10 flex items-center gap-5 text-white/70 text-xs animate-fade-in"
            style={{ animationDelay: "600ms", animationFillMode: "both" }}
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-white" />
              QC Transparan
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5 text-white" />
              Penawaran Jelas
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-white" />
              Proses Cepat
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
