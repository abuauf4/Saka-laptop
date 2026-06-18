// ─── Nauka Modular Architecture — Module Contract Types ───

export type ModuleStatus = "active" | "inactive";

export interface ModuleMetadata {
  slug: string;           // e.g. 'inventory', 'cms'
  name: string;           // e.g. 'Inventory Management'
  version: string;        // e.g. '1.0.0'
  description?: string;
  author?: string;
  icon: string;           // Lucide icon name
}

export interface ModulePermission {
  key: string;            // e.g. 'inventory.view'
  label: string;          // e.g. 'View Inventory'
}

export interface ModuleMenuItem {
  title: string;
  href: string;
  icon: string;           // Lucide icon name
  permission: string;     // Permission key required to see this item
}

export interface ModuleDashboardWidget {
  title: string;
  type: "stat" | "list" | "chart";
  query: string;          // Identifier for the data query
}

export interface ModuleSettingsField {
  type: "string" | "number" | "boolean" | "select";
  default?: string | number | boolean;
  options?: string[];     // For select type
  label?: string;
}

export interface ModuleContract {
  metadata: ModuleMetadata;
  permissions: ModulePermission[];
  menuItems: ModuleMenuItem[];
  dependencies?: string[];            // Module slugs this module depends on
  settingsSchema?: Record<string, ModuleSettingsField>;
  dashboardWidgets?: ModuleDashboardWidget[];
}
