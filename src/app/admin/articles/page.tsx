// ─── Nauka CMS — Articles Page (Server Component Wrapper) ───

import { ModuleGuard } from "@/core/components/module-guard";
import { ArticlesClient } from "./articles-client";

export const metadata = {
  title: "Articles — Nauka CMS",
  description: "Manage articles in Nauka CMS",
};

export default function ArticlesPage() {
  return (
    <ModuleGuard slug="cms">
      <ArticlesClient />
    </ModuleGuard>
  );
}
