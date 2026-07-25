// ─── Saka Laptop — Homepage (Fully Static) ───
// All content is sourced from src/data/homepage-static.ts.
// No database queries, no API calls, no runtime fetch.
// Revalidation = false (permanent static).

import {
  HOMEPAGE_CONTENT,
  LOKASI,
  LOGO,
  TESTIMONI,
} from "@/data/homepage-static";
import { HomePageClient } from "./HomePageClient";

// Permanent static — no ISR, no revalidation, no DB dependency.
export const revalidate = false;

export default function HomePage() {
  return (
    <HomePageClient
      homepage={HOMEPAGE_CONTENT}
      lokasi={LOKASI}
      logo={LOGO}
      testimoni={TESTIMONI}
    />
  );
}
