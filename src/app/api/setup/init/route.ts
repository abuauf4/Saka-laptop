// ─── Saka Laptop — Production Setup Endpoint ───
// One-time setup endpoint to seed production database.
// Protected by SETUP_KEY env var (random string you set in Vercel).
//
// Usage:
//   1. Set env vars in Vercel: DATABASE_URL, JWT_SECRET, SETUP_KEY
//   2. After first deploy, visit:
//      https://your-domain.com/api/setup/init?key=YOUR_SETUP_KEY
//   3. Wait for "Setup complete!" response
//   4. (Optional) Remove SETUP_KEY env var or set it to empty for safety
//
// This endpoint is idempotent — safe to call multiple times (uses upsert).

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/core/lib/db";
import bcrypt from "bcryptjs";
import {
  PERMISSION_KEYS,
  DEFAULT_ROLES,
  DEFAULT_ROLE_PERMISSIONS,
} from "@/core/config/core-permissions";

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const logs: string[] = [];

  try {
    // ─── Auth: require SETUP_KEY ───
    const setupKey = process.env.SETUP_KEY;
    if (!setupKey) {
      return NextResponse.json(
        {
          error:
            "SETUP_KEY env var not set. Set it in Vercel dashboard first, then retry.",
        },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const providedKey = searchParams.get("key");

    if (providedKey !== setupKey) {
      return NextResponse.json(
        { error: "Invalid setup key. Check SETUP_KEY env var." },
        { status: 401 }
      );
    }

    logs.push("✓ Setup key valid");

    // ─── 1. Seed Permissions ───
    let permCount = 0;
    for (const perm of PERMISSION_KEYS) {
      await db.permission.upsert({
        where: { name: perm.key },
        update: {
          category: perm.category,
          action: perm.action,
          label: perm.label,
        },
        create: {
          name: perm.key,
          category: perm.category,
          action: perm.action,
          label: perm.label,
        },
      });
      permCount++;
    }
    logs.push(`✓ Seeded ${permCount} permissions`);

    // ─── 2. Seed Roles + RolePermissions ───
    let roleCount = 0;
    for (const role of DEFAULT_ROLES) {
      const created = await db.role.upsert({
        where: { slug: role.slug },
        update: {
          name: role.name,
          description: role.description,
          isDefault: role.isDefault,
        },
        create: {
          name: role.name,
          slug: role.slug,
          description: role.description,
          isDefault: role.isDefault,
        },
      });

      const rolePerms = DEFAULT_ROLE_PERMISSIONS[role.slug] || [];
      const permRecords = await db.permission.findMany({
        where: { name: { in: rolePerms } },
      });

      // Clear existing
      await db.rolePermission.deleteMany({
        where: { roleId: created.id },
      });

      // Insert new
      for (const perm of permRecords) {
        await db.rolePermission.create({
          data: { roleId: created.id, permissionId: perm.id },
        });
      }
      roleCount++;
      logs.push(
        `✓ Role: ${role.name} (${permRecords.length} permissions)`
      );
    }

    // ─── 3. Seed Super Admin ───
    const adminEmail = "admin@saka-laptop.id";
    const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || "Saka2026!";
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const admin = await db.user.upsert({
      where: { email: adminEmail },
      update: {
        fullName: "Saka Admin",
        password: hashedPassword,
        status: "active",
      },
      create: {
        email: adminEmail,
        fullName: "Saka Admin",
        password: hashedPassword,
        status: "active",
      },
    });

    const superAdminRole = await db.role.findUnique({
      where: { slug: "super_admin" },
    });
    if (superAdminRole) {
      await db.userRole.upsert({
        where: {
          userId_roleId: {
            userId: admin.id,
            roleId: superAdminRole.id,
          },
        },
        update: {},
        create: {
          userId: admin.id,
          roleId: superAdminRole.id,
        },
      });
    }
    logs.push(`✓ Super admin: ${adminEmail} / ${adminPassword}`);

    // ─── 4. Seed Branding ───
    await db.branding.upsert({
      where: { id: "default" },
      update: {},
      create: {
        id: "default",
        siteName: "Saka Laptop",
        tagline: "Pusat Inspeksi & Trade-in Laptop Bekas",
        siteDescription:
          "Kirim data laptop bekas kamu. Tim kami akan melakukan pengecekan, QC, dan memberikan penawaran harga yang transparan.",
        copyrightText: "© 2026 Saka Laptop. All rights reserved.",
      },
    });
    logs.push("✓ Branding seeded");

    // ─── 5. Seed Settings ───
    await db.settings.upsert({
      where: { id: "default" },
      update: {},
      create: {
        id: "default",
        phone: "+62 896-6252-4542",
        whatsapp: "6289662524542",
        email: "halo@saka-laptop.id",
        address: "Jakarta Selatan, Indonesia",
      },
    });
    logs.push("✓ Settings seeded");

    // ─── 6. Seed SEO ───
    await db.seo.upsert({
      where: { id: "default" },
      update: {},
      create: {
        id: "default",
        siteTitle: "Saka Laptop — Pusat Inspeksi & Trade-in Laptop Bekas",
        metaDescription:
          "Kirim data laptop bekas kamu. Tim kami melakukan QC & memberikan penawaran transparan.",
        keywords:
          "terima laptop bekas, trade in laptop, inspeksi laptop, QC laptop bekas, jual laptop bekas, tukar tambah laptop",
        homepageTitle: "Saka Laptop — Pusat Inspeksi & Trade-in Laptop Bekas",
        homepageDesc:
          "Kirim data laptop bekas kamu. Tim kami akan melakukan pengecekan, QC, dan memberikan penawaran harga yang transparan.",
        ogTitle: "Saka Laptop — Pusat Inspeksi & Trade-in Laptop Bekas",
        ogDescription:
          "Kirim data laptop bekas. QC transparan, penawaran jelas, proses cepat.",
      },
    });
    logs.push("✓ SEO seeded");

    // ─── 7. Seed Lokasi (legacy, untuk WhatsApp homepage) ───
    await db.lokasi.upsert({
      where: { id: "default" },
      update: {},
      create: {
        id: "default",
        namaToko: "Saka Laptop",
        tagline: "Pusat Inspeksi & Trade-in Laptop Bekas",
        alamat: "Jakarta Selatan, Indonesia",
        telepon: "+62 896-6252-4542",
        whatsapp: "6289662524542",
        jamWeekday: "10:00 - 20:00",
        jamWeekend: "11:00 - 18:00",
      },
    });
    logs.push("✓ Lokasi seeded");

    // ─── 8. Seed StoreLogo ───
    await db.storeLogo.upsert({
      where: { id: "default" },
      update: {},
      create: { id: "default", logoData: "" },
    });
    logs.push("✓ StoreLogo seeded");

    // ─── 9. Activate Core + CMS Modules ───
    await db.coreModule.upsert({
      where: { slug: "core" },
      update: { status: "active" },
      create: {
        slug: "core",
        name: "Core",
        version: "1.0.0",
        description: "Core CMS functionality (RBAC, branding, settings)",
        status: "active",
        config: {},
      },
    });
    logs.push("✓ Core module active");

    await db.coreModule.upsert({
      where: { slug: "cms" },
      update: { status: "active" },
      create: {
        slug: "cms",
        name: "CMS",
        version: "1.0.0",
        description: "Content management (articles, categories)",
        status: "active",
        config: {},
      },
    });
    logs.push("✓ CMS module active");

    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      message: "Setup complete! You can now login at /admin/login",
      duration: `${duration}ms`,
      logs,
      credentials: {
        email: adminEmail,
        password: adminPassword,
        note: "⚠️  Change password immediately after first login via /admin/users",
      },
      nextSteps: [
        "1. Login at https://your-domain.com/admin/login",
        "2. Change admin password via /admin/users",
        "3. (Optional) Remove SETUP_KEY env var from Vercel for security",
      ],
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      {
        error: "Setup failed",
        message: error instanceof Error ? error.message : "Unknown error",
        logs,
      },
      { status: 500 }
    );
  }
}
