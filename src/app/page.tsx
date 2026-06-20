// ─── Jakarta Laptops — Homepage (Server Component) ───
// Fetch semua content di SERVER saat request, pass ke client component.
// First paint langsung show latest content — no client-side fetch, no flicker.

import {
  fetchHomepageContent,
  fetchLokasi,
  fetchLogo,
  fetchTestimoni,
  type HomepageData,
  type LokasiData,
  type TestimoniData,
} from "@/lib/homepage-data";
import { HomePageClient } from "./HomePageClient";

// Cache di edge/CDN selama 5 menit. Homepage content gak berubah tiap menit,
// jadi caching 5 menit ngurangin TTFB drastis (~500ms → ~50ms di Vercel).
// Admin masih bisa langsung lihat perubahan setelah revalidate.
// Set `dynamic = "force-dynamic"` untuk disable caching completely.
export const revalidate = 300;

export default async function HomePage() {
  // Fetch semua data di server, parallel
  const [homepage, lokasi, logo, testimoni] = await Promise.all([
    fetchHomepageContent(),
    fetchLokasi(),
    fetchLogo(),
    fetchTestimoni(),
  ]);

  // Pass resolved data as props — client component gak perlu fetch
  return (
    <HomePageClient
      homepage={homepage}
      lokasi={lokasi}
      logo={logo.logoData}
      testimoni={testimoni}
    />
  );
}
