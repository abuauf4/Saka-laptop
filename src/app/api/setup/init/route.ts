// ─── Jakarta Laptops — Production Setup Endpoint ───
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
        siteName: "Jakarta Laptops",
        tagline: "Pusat Inspeksi & Trade-in Laptop Bekas",
        siteDescription:
          "Kirim data laptop bekas kamu. Tim kami akan melakukan pengecekan, QC, dan memberikan penawaran harga yang transparan.",
        copyrightText: "© 2026 Jakarta Laptops. All rights reserved.",
      },
    });
    logs.push("✓ Branding seeded");

    // ─── 5. Seed Settings ───
    await db.settings.upsert({
      where: { id: "default" },
      update: {},
      create: {
        id: "default",
        phone: "0881010302510",
        whatsapp: "62881010302510",
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
        siteTitle: "Jakarta Laptops — Pusat Inspeksi & Trade-in Laptop Bekas",
        metaDescription:
          "Kirim data laptop bekas kamu. Tim kami melakukan QC & memberikan penawaran transparan.",
        keywords:
          "terima laptop bekas, trade in laptop, inspeksi laptop, QC laptop bekas, jual laptop bekas, tukar tambah laptop",
        homepageTitle: "Jakarta Laptops — Pusat Inspeksi & Trade-in Laptop Bekas",
        homepageDesc:
          "Kirim data laptop bekas kamu. Tim kami akan melakukan pengecekan, QC, dan memberikan penawaran harga yang transparan.",
        ogTitle: "Jakarta Laptops — Pusat Inspeksi & Trade-in Laptop Bekas",
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
        namaToko: "Jakarta Laptops",
        tagline: "Pusat Inspeksi & Trade-in Laptop Bekas",
        alamat: "Jakarta Selatan, Indonesia",
        telepon: "0881010302510",
        whatsapp: "62881010302510",
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

    // ─── 10. Create HomepageContent table (if not exists) ───
    // Pakai raw SQL karena prisma db push gagal di Vercel build (pool exhaustion)
    try {
      await db.$executeRaw`
        CREATE TABLE IF NOT EXISTS "homepage_content" (
          "id" TEXT NOT NULL DEFAULT 'default',
          "heroEyebrow" TEXT NOT NULL DEFAULT 'Pusat Inspeksi & Trade-in Laptop Bekas',
          "heroTitle" TEXT NOT NULL DEFAULT 'Jual Laptop Bekas Tanpa Ribet.',
          "heroSubtitle" TEXT NOT NULL DEFAULT 'Kirim foto dan spesifikasi laptop melalui WhatsApp. Tim kami akan membantu proses pengecekan dan penawaran.',
          "heroImage" TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1920&q=90',
          "trustStats" TEXT NOT NULL DEFAULT '[]',
          "brandTitle" TEXT NOT NULL DEFAULT 'Bukan Sekadar Membeli Laptop.',
          "brandCopy" TEXT NOT NULL DEFAULT 'Kami membantu proses penilaian perangkat secara transparan sebelum memberikan penawaran.',
          "brandPoints" TEXT NOT NULL DEFAULT '[]',
          "workflowStages" TEXT NOT NULL DEFAULT '[]',
          "tokoPhotos" TEXT NOT NULL DEFAULT '[]',
          "deviceCategories" TEXT NOT NULL DEFAULT '[]',
          "faqs" TEXT NOT NULL DEFAULT '[]',
          "closingTitle" TEXT NOT NULL DEFAULT 'Laptop Lama Masih Bernilai.',
          "closingSubtitle" TEXT NOT NULL DEFAULT 'Chat kami sekarang via WhatsApp. Gratis, tanpa komitmen.',
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "homepage_content_pkey" PRIMARY KEY ("id")
        )
      `;
      logs.push("✓ HomepageContent table ready");
    } catch (tableErr) {
      // Table mungkin sudah ada, ignore error
      logs.push(`ℹ HomepageContent table: ${tableErr instanceof Error ? tableErr.message : "already exists"}`);
    }

    // ─── 11. Create Testimoni table (if not exists) ───
    try {
      await db.$executeRaw`
        CREATE TABLE IF NOT EXISTS "Testimoni" (
          "id" TEXT NOT NULL,
          "nama" TEXT NOT NULL,
          "role" TEXT NOT NULL,
          "teks" TEXT NOT NULL,
          "rating" INTEGER NOT NULL DEFAULT 5,
          "laptop" TEXT NOT NULL DEFAULT '',
          "avatar" TEXT NOT NULL DEFAULT '',
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "Testimoni_pkey" PRIMARY KEY ("id")
        )
      `;
      logs.push("✓ Testimoni table ready");
    } catch (tableErr) {
      logs.push(`ℹ Testimoni table: ${tableErr instanceof Error ? tableErr.message : "already exists"}`);
    }

    // ─── 12. Create Barang table (if not exists) ───
    try {
      await db.$executeRaw`
        CREATE TABLE IF NOT EXISTS "barang" (
          "id" TEXT NOT NULL,
          "kode" TEXT NOT NULL,
          "merk" TEXT NOT NULL,
          "tipe" TEXT NOT NULL,
          "spesifikasi" TEXT NOT NULL DEFAULT '',
          "keterangan" TEXT NOT NULL DEFAULT '',
          "hargaBeli" INTEGER NOT NULL DEFAULT 0,
          "status" TEXT NOT NULL DEFAULT 'available',
          "hargaJual" INTEGER,
          "namaPembeli" TEXT,
          "noWa" TEXT,
          "domisili" TEXT,
          "soldAt" TIMESTAMP(3),
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "barang_pkey" PRIMARY KEY ("id")
        )
      `;
      await db.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "barang_kode_key" ON "barang"("kode")`;
      await db.$executeRaw`CREATE INDEX IF NOT EXISTS "barang_status_idx" ON "barang"("status")`;
      await db.$executeRaw`CREATE INDEX IF NOT EXISTS "barang_createdAt_idx" ON "barang"("createdAt")`;
      await db.$executeRaw`CREATE INDEX IF NOT EXISTS "barang_merk_idx" ON "barang"("merk")`;
      logs.push("✓ Barang table ready");
    } catch (tableErr) {
      logs.push(`ℹ Barang table: ${tableErr instanceof Error ? tableErr.message : "already exists"}`);
    }

    // ─── 13. Create LandingPageContent table (if not exists) ───
    // Untuk /jual-laptop-bekas-jakarta supply acquisition LP.
    // CMS-editable via /admin/landing-page.
    try {
      await db.$executeRaw`
        CREATE TABLE IF NOT EXISTS "landing_page_content" (
          "id" TEXT NOT NULL DEFAULT 'default',
          "heroEyebrow" TEXT NOT NULL DEFAULT 'JUAL LAPTOP BEKAS JAKARTA',
          "heroTitle" TEXT NOT NULL DEFAULT 'Jual Laptop Bekas Anda Hari Ini.',
          "heroSubtitle" TEXT NOT NULL DEFAULT 'Estimasi harga cepat, proses transparan, pembayaran langsung. Pickup gratis Jabodetabek untuk laptop berkualitas.',
          "heroPrimaryCta" TEXT NOT NULL DEFAULT 'Kirim Foto Laptop',
          "heroSecondaryCta" TEXT NOT NULL DEFAULT 'Chat WhatsApp',
          "heroTrustBadges" TEXT NOT NULL DEFAULT '[]',
          "valuePillars" TEXT NOT NULL DEFAULT '[]',
          "processSteps" TEXT NOT NULL DEFAULT '[]',
          "estimasiTitle" TEXT NOT NULL DEFAULT 'Cek Estimasi Harga Laptop Anda',
          "estimasiSubtitle" TEXT NOT NULL DEFAULT 'Interactive widget, no commit, hasil instan',
          "estimasiCtaLabel" TEXT NOT NULL DEFAULT 'Lanjut Chat WhatsApp untuk Penawaran Akurat',
          "faqs" TEXT NOT NULL DEFAULT '[]',
          "trustStats" TEXT NOT NULL DEFAULT '[]',
          "trustTitle" TEXT NOT NULL DEFAULT 'Dipercaya 500+ Supplier',
          "trustSubtitle" TEXT NOT NULL DEFAULT 'Social proof & track record',
          "finalCtaTitle" TEXT NOT NULL DEFAULT 'Siap Jual Laptop Bekas Anda?',
          "finalCtaSubtitle" TEXT NOT NULL DEFAULT 'Estimasi harga dalam 15 menit. Pickup gratis Jabodetabek. Bayar spot.',
          "finalCtaPrimary" TEXT NOT NULL DEFAULT 'Kirim Foto Laptop',
          "finalCtaSecondary" TEXT NOT NULL DEFAULT 'Chat WhatsApp',
          "metaTitle" TEXT NOT NULL DEFAULT 'Jual Laptop Bekas Jakarta — Estimasi Cepat, Pickup Gratis | Jakarta Laptops',
          "metaDescription" TEXT NOT NULL DEFAULT 'Jual laptop bekas Jakarta dengan estimasi harga cepat, proses transparan, pembayaran langsung. Pickup gratis Jabodetabek. Terima kondisi minus. Chat WA sekarang!',
          "ogTitle" TEXT NOT NULL DEFAULT 'Jual Laptop Bekas Anda Hari Ini — Jakarta Laptops',
          "ogDescription" TEXT NOT NULL DEFAULT 'Estimasi harga cepat, proses transparan, pembayaran langsung. Pickup gratis Jabodetabek.',
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "landing_page_content_pkey" PRIMARY KEY ("id")
        )
      `;
      logs.push("✓ LandingPageContent table ready");
    } catch (tableErr) {
      logs.push(`ℹ LandingPageContent table: ${tableErr instanceof Error ? tableErr.message : "already exists"}`);
    }

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
