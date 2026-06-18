// ─── Inventory Module — Module Contract ───
import { ModuleContract } from "@/core/types/module";

export const InventoryModule: ModuleContract = {
  metadata: {
    slug: "inventory",
    name: "Inventory",
    version: "1.0.0",
    description: "Product inventory, categories, suppliers, and stock management",
    author: "Nauka",
    icon: "Package",
  },
  permissions: [
    { key: "inventory.view", label: "View Inventory" },
    { key: "inventory.create", label: "Create Inventory Items" },
    { key: "inventory.update", label: "Update Inventory Items" },
    { key: "inventory.delete", label: "Delete Inventory Items" },
    { key: "inventory.stock", label: "Manage Stock Movements" },
    { key: "inventory.import", label: "Import Inventory Data" },
    { key: "inventory.export", label: "Export Inventory Data" },
  ],
  menuItems: [
    { title: "Products", href: "/admin/inventory/products", icon: "Package", permission: "inventory.view" },
    { title: "Categories", href: "/admin/inventory/categories", icon: "FolderTree", permission: "inventory.view" },
    { title: "Suppliers", href: "/admin/inventory/suppliers", icon: "Truck", permission: "inventory.view" },
    { title: "Stock", href: "/admin/inventory/stock", icon: "ArrowLeftRight", permission: "inventory.stock" },
  ],
  dependencies: [],
};
