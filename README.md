# Saka Laptop v2 — Laravel shared-hosting rebuild

Branch ini adalah versi ringan Saka Laptop untuk Hostinger Single Web Hosting.

## Scope yang dikunci

Backend **bukan panel admin besar**. Hanya ada:

- Login admin tunggal
- **Leads** — lihat customer masuk, buka WhatsApp, ubah status, simpan catatan follow-up
- **Artikel** — buat/edit draft, publish, SEO title/description, cover image

Tidak ada users/roles, dashboard operasional, inventory, QC, kasir, laporan, atau settings manager.

Public website tetap server-rendered dengan Blade dan SEO landing pages tetap dipertahankan.

## Stack

- Laravel 13
- PHP 8.3+
- MySQL
- Blade
- Build ZIP via GitHub Actions supaya Hostinger Single tidak perlu SSH/Composer

## Deploy

Lihat `docs/HOSTINGER-DEPLOY.md`.
