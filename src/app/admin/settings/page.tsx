// ─── Nauka CMS — Settings Page (Server Component Wrapper) ───

import { SettingsClient } from "./settings-client";

export const metadata = {
  title: "Settings — Nauka CMS",
  description: "Manage website settings in Nauka CMS",
};

export default function SettingsPage() {
  return <SettingsClient />;
}
