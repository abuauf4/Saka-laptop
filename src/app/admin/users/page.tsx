// ─── Nauka CMS — Users Page (Server Component Wrapper) ───

import { UsersClient } from "./users-client";

export const metadata = {
  title: "Users — Nauka CMS",
  description: "Manage users in Nauka CMS",
};

export default function UsersPage() {
  return <UsersClient />;
}
