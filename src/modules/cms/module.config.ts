// ─── CMS Module — Module Contract ───
import { ModuleContract } from "@/core/types/module";

export const CmsModule: ModuleContract = {
  metadata: {
    slug: "cms",
    name: "CMS Content",
    version: "1.0.0",
    description: "Pages, sections, homepage builder, and articles",
    author: "Nauka",
    icon: "FileText",
  },
  permissions: [
    { key: "homepage.view", label: "View Homepage" },
    { key: "homepage.create", label: "Create Homepage" },
    { key: "homepage.update", label: "Update Homepage" },
    { key: "articles.view", label: "View Articles" },
    { key: "articles.create", label: "Create Articles" },
    { key: "articles.update", label: "Update Articles" },
    { key: "articles.delete", label: "Delete Articles" },
  ],
  menuItems: [
    { title: "Homepage", href: "/admin/homepage", icon: "Home", permission: "homepage.view" },
    { title: "Articles", href: "/admin/articles", icon: "Newspaper", permission: "articles.view" },
  ],
  dependencies: [],
};
