import Image from "next/image";
import type { HomepageData } from "@/lib/homepage-data";

export function TokoSection({ homepage }: { homepage: HomepageData }) {
  return (
    <section id="toko" className="border-b border-border bg-card/50">
      <div className="page-container py-20 md:py-28">
        <div className="max-w-2xl mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">
            Trust
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Toko & Aktivitas
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Tempat di mana laptop kamu ditangani. Bukan dekorasi, bukan
            render — ini lapangan kerja kami.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {homepage.tokoPhotos.map((photo, i) => (
            <div
              key={i}
              className={`relative rounded-xl overflow-hidden border border-border bg-muted ${
                i === 0
                  ? "col-span-2 lg:col-span-2 aspect-[4/3]"
                  : "aspect-square"
              }`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-xs font-medium text-white drop-shadow">
                  {photo.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
