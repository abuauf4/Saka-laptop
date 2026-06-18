// ─── Jakarta Laptops — Tentang (About) Page ───
import type { Metadata } from "next";
import { fetchLokasi, fetchHomepageContent } from "@/lib/homepage-data";
import { db } from "@/core/lib/db";
import { TentangClient } from "./tentang-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Tentang Kami",
  description: "Kenali Jakarta Laptops — pusat inspeksi & trade-in laptop bekas terpercaya di Jakarta.",
};

export default async function TentangPage() {
  const [lokasi, homepage, branding] = await Promise.all([
    fetchLokasi(),
    fetchHomepageContent(),
    db.branding.findUnique({ where: { id: "default" } }).catch(() => null),
  ]);

  return (
    <TentangClient
      namaToko={lokasi.namaToko}
      tagline={lokasi.tagline}
      alamat={lokasi.alamat}
      telepon={lokasi.telepon}
      whatsapp={lokasi.whatsapp}
      jamWeekday={lokasi.jamWeekday}
      jamWeekend={lokasi.jamWeekend}
      mapsLink={lokasi.mapsLink}
      brandTitle={homepage.brandTitle}
      brandCopy={homepage.brandCopy}
      brandPoints={homepage.brandPoints}
      workflowStages={homepage.workflowStages}
      siteDescription={branding?.siteDescription || ""}
      copyrightText={branding?.copyrightText || ""}
    />
  );
}
