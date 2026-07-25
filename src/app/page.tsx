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

// Static cache — content hanya berubah via admin (revalidatePath on-demand).
// Tidak ada timer-based ISR write. Revalidation hanya dipicu saat admin save.
export const revalidate = false;

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
