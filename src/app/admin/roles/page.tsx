// ─── Nauka CMS — Roles & Permissions Page (Server Component Wrapper) ───

import { RolesClient } from "./roles-client";

export const metadata = {
  title: "Roles & Permissions — Nauka CMS",
  description: "Manage roles and permissions in Nauka CMS",
};

export default function RolesPage() {
  return <RolesClient />;
}
