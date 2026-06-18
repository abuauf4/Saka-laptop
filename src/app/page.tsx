// ─── Jakarta Laptops — Homepage (Server Component) ───
// Fetch semua content di SERVER saat request, pass ke client component.
// First paint langsung show latest content — no client-side fetch, no flicker.

import {
  fetchHomepageContent,
  fetchLokasi,
  fetchLogo,
  type HomepageData,
  type LokasiData,
} from "@/lib/homepage-data";
import { HomePageClient } from "./HomePageClient";

// Always fresh — no static caching. Content editable dari admin.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  // Fetch semua data di server, parallel
  const [homepage, lokasi, logo] = await Promise.all([
    fetchHomepageContent(),
    fetchLokasi(),
    fetchLogo(),
  ]);

  // Pass resolved data as props — client component gak perlu fetch
  return (
    <HomePageClient
      homepage={homepage}
      lokasi={lokasi}
      logo={logo.logoData}
    />
  );
}
