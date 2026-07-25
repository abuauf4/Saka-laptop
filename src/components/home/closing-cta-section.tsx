import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowRight } from "lucide-react";
import type { HomepageData, LokasiData } from "@/data/homepage-static";
import { buildWaLink } from "./shared";

export function ClosingCtaSection({
  homepage,
  lokasi,
}: {
  homepage: HomepageData;
  lokasi: LokasiData;
}) {
  const waLink = buildWaLink(lokasi);

  return (
    <section className="bg-[#000000] text-white">
      <div className="page-container py-20 md:py-32 text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight max-w-3xl mx-auto leading-tight">
          {homepage.closingTitle}
        </h2>
        <p className="mt-6 text-white/70 max-w-xl mx-auto text-base">
          {homepage.closingSubtitle}
        </p>
        <div className="mt-10 flex justify-center">
          <a href={waLink} target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              className="min-h-[52px] px-8 gap-2 text-base font-semibold bg-white text-black hover:bg-white/90"
            >
              <MessageCircle className="h-4 w-4" />
              Ajukan Laptop Sekarang
              <ArrowRight className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
