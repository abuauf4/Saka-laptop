// ─── Nauka Core — Module Registry Server Functions ───
// Server-side only. Manages the core_modules table.

import { db } from "./db";
import { Prisma } from "@prisma/client";

export interface ModuleInfo {
  id: string;
  slug: string;
  name: string;
  version: string;
  description: string | null;
  status: "active" | "inactive";
  config: Record<string, unknown> | null;
  installedAt: Date;
  updatedAt: Date;
}

/** Serialize/deserialize config (SQLite stores as String, PostgreSQL as Json) */
function parseConfig(raw: unknown): Record<string, unknown> | null {
  if (!raw) return null;
  if (typeof raw === "string") {
    try { return JSON.parse(raw); } catch { return null; }
  }
  return raw as Record<string, unknown>;
}

/** Serialize config to native object (Prisma will handle Json or String automatically) */
function serializeConfig(config: Record<string, unknown> | null | undefined) {
  if (!config) return Prisma.JsonNull;
  return config as Prisma.InputJsonValue;
}

/**
 * List all installed modules.
 */
export async function listModules(): Promise<ModuleInfo[]> {
  const modules = await db.coreModule.findMany({
    orderBy: { name: "asc" },
  });
  return modules as ModuleInfo[];
}

/**
 * Get a single module by slug.
 */
export async function getModule(slug: string): Promise<ModuleInfo | null> {
  const mod = await db.coreModule.findUnique({ where: { slug } });
  return mod as ModuleInfo | null;
}

/**
 * Check if a module is active.
 */
export async function isModuleActive(slug: string): Promise<boolean> {
  const mod = await db.coreModule.findUnique({
    where: { slug },
    select: { status: true },
  });
  return mod?.status === "active";
}

/**
 * Get all active module slugs.
 */
export async function getActiveModuleSlugs(): Promise<string[]> {
  const modules = await db.coreModule.findMany({
    where: { status: "active" },
    select: { slug: true },
  });
  return modules.map((m) => m.slug);
}

/**
 * Register a module in the registry.
 */
export async function registerModule(data: {
  slug: string;
  name: string;
  version: string;
  description?: string;
  config?: Record<string, unknown>;
}): Promise<ModuleInfo> {
  return db.coreModule.upsert({
    where: { slug: data.slug },
    update: {
      name: data.name,
      version: data.version,
      description: data.description,
    },
    create: {
      slug: data.slug,
      name: data.name,
      version: data.version,
      description: data.description,
      status: "inactive",
      config: serializeConfig(data.config),
    },
  }) as Promise<ModuleInfo>;
}

/**
 * Activate a module.
 */
export async function activateModule(slug: string): Promise<ModuleInfo> {
  const mod = await db.coreModule.findUnique({ where: { slug } });
  if (!mod) throw new Error(`Module "${slug}" is not installed`);

  // Check dependencies
  // For V1, dependency checking is done in the API route

  return db.coreModule.update({
    where: { slug },
    data: { status: "active" },
  }) as Promise<ModuleInfo>;
}

/**
 * Deactivate a module.
 */
export async function deactivateModule(slug: string): Promise<ModuleInfo> {
  const mod = await db.coreModule.findUnique({ where: { slug } });
  if (!mod) throw new Error(`Module "${slug}" is not installed`);

  return db.coreModule.update({
    where: { slug },
    data: { status: "inactive" },
  }) as Promise<ModuleInfo>;
}

/**
 * Require a module to be active. Throws if inactive or not installed.
 * Use this in API routes to block access when a module is deactivated.
 */
export async function requireModuleActive(slug: string): Promise<ModuleInfo> {
  const mod = await db.coreModule.findUnique({ where: { slug } });
  if (!mod) {
    const error = new Error(`Module "${slug}" is not installed`);
    (error as unknown as { code: string }).code = "MODULE_NOT_INSTALLED";
    throw error;
  }
  if (mod.status !== "active") {
    const error = new Error(`Module "${slug}" is currently inactive`);
    (error as unknown as { code: string }).code = "MODULE_INACTIVE";
    throw error;
  }
  return mod as ModuleInfo;
}

/**
 * Get module configuration.
 */
export async function getModuleConfig(slug: string): Promise<Record<string, unknown> | null> {
  const mod = await db.coreModule.findUnique({
    where: { slug },
    select: { config: true },
  });
  return parseConfig(mod?.config);
}

/**
 * Update module configuration.
 */
export async function updateModuleConfig(
  slug: string,
  config: Record<string, unknown>
): Promise<ModuleInfo> {
  const mod = await db.coreModule.findUnique({ where: { slug } });
  if (!mod) throw new Error(`Module "${slug}" is not installed`);

  return db.coreModule.update({
    where: { slug },
    data: { config: serializeConfig(config) },
  }) as Promise<ModuleInfo>;
}
