// ─── Nauka CMS — SEO Page (Server Component Wrapper)

import { SeoClient } from "./seo-client";

export const metadata = {
  title: "SEO — Nauka CMS",
  description: "Manage SEO settings in Nauka CMS",
};

export default function SeoPage() {
  return <SeoClient />;
}
