// ─── Nauka CMS — Branding Page (Server Component Wrapper)

import { BrandingClient } from "./branding-client";

export const metadata = {
  title: "Branding — Nauka CMS",
  description: "Manage site branding in Nauka CMS",
};

export default function BrandingPage() {
  return <BrandingClient />;
}
