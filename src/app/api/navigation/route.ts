// ─── Saka Laptop — Dynamic Navigation API ───
// Returns core navigation groups for admin sidebar.

import { NextResponse } from "next/server";
import { CORE_NAV_GROUPS, NavGroup } from "@/core/config/core-navigation";
import { listModules } from "@/core/lib/module-registry";

// Module contracts (stub — Saka tidak punya module terpisah, semua nav item ada di CORE_NAV_GROUPS)
// Tapi pertahankan interface agar kompatibel dengan Nauka admin-sidebar.
const MODULE_CONTRACTS: Record<string, { menuItems: never[]; metadata: { name: string; icon: string } }> = {};

export async function GET() {
  try {
    // Cek active modules (untuk future extension)
    const activeModules = await listModules();
    const activeSlugs = new Set(
      activeModules.filter((m) => m.status === "active").map((m) => m.slug)
    );

    // Build module navigation groups (kosong sekarang karena Saka belum punya module terpisah)
    const moduleGroups: NavGroup[] = [];
    for (const [slug, contract] of Object.entries(MODULE_CONTRACTS)) {
      if (activeSlugs.has(slug) && contract.menuItems.length > 0) {
        moduleGroups.push({
          label: contract.metadata.name,
          items: contract.menuItems as NavGroup["items"],
        });
      }
    }

    return NextResponse.json({
      core: CORE_NAV_GROUPS,
      modules: moduleGroups,
    });
  } catch (error) {
    console.error("Navigation API error:", error);
    return NextResponse.json({
      core: CORE_NAV_GROUPS,
      modules: [],
    });
  }
}
