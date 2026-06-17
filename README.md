# Saka Laptop — Pusat Inspeksi & Trade-in Laptop Bekas

Next.js 16 + Prisma + TypeScript. Modular CMS architecture (RBAC + CMS + business modules).

## 🚀 Production Deployment (Vercel)

### 1. Push repo to GitHub
Repo: https://github.com/abuauf4/Saka-laptop

### 2. Set Environment Variables in Vercel
Buka dashboard Vercel → Settings → Environment Variables:

| Variable | Value | Required |
|---|---|---|
| `DATABASE_URL` | `postgresql://...?pgBouncer=true&connection_limit=1` (Supabase/Neon, WAJIB pakai pgBouncer+connection_limit=1) | ✅ YES |
| `JWT_SECRET` | random string 32+ chars (e.g. `openssl rand -base64 32`) | ✅ YES |
| `SETUP_KEY` | random string (e.g. `saka-setup-2026-secret-key`) | ✅ YES (for setup) |
| `ADMIN_INITIAL_PASSWORD` | `Saka2026!` (or custom) | Optional |
| `NEXT_PUBLIC_SITE_URL` | `https://jakartalaptops.com` | Optional |

⚠️ **CRITICAL untuk DATABASE_URL**: Vercel serverless + Supabase/Neon connection pool limit 15. Tanpa `pgBouncer=true&connection_limit=1`, API bakal 500 "max clients reached" saat traffic naik.

**Contoh DATABASE_URL yang benar:**
```
postgresql://postgres.xxxx:password@aws-0-region.pooler.supabase.com:6543/postgres?pgBouncer=true&connection_limit=1
```

Catatan:
- Pakai **pooler hostname** (cth: `aws-0-region.pooler.supabase.com`), BUKAN direct hostname (`db.xxxx.supabase.co`)
- Pakai **port 6543** (pgBouncer), BUKAN 5432 (direct)
- Tambah `?pgBouncer=true&connection_limit=1` di akhir URL

### 3. Deploy di Vercel
Connect repo → Deploy. Tunggu build selesai.

### 4. Run Setup (one-time, via browser)
Buka URL ini di browser (ganti domain & SETUP_KEY):
```
https://jakartalaptops.com/api/setup/init?key=SAMA_DENGAN_SETUP_KEY_YG_DI_SET_DI_LANGKAH_2
```

Akan muncul JSON response:
```json
{
  "success": true,
  "message": "Setup complete! You can now login at /admin/login",
  "credentials": {
    "email": "admin@saka-laptop.id",
    "password": "Saka2026!"
  }
}
```

### 5. Login & Ganti Password
- Buka `https://jakartalaptops.com/admin/login`
- Login: `admin@saka-laptop.id` / `Saka2026!`
- Buka `/admin/users` → edit Saka Admin → **Change Password** (WAJIB!)

### 6. (Optional) Cleanup Setup Key
Untuk security, hapus `SETUP_KEY` env var dari Vercel setelah setup selesai.

---

## 💻 Local Development

```bash
# Install
bun install

# Switch schema ke SQLite untuk local dev
# (schema.prisma default = PostgreSQL untuk production)
cp prisma/schema.sqlite.prisma prisma/schema.prisma
bun run db:generate

# Setup DB lokal
cp .env.example .env  # edit DATABASE_URL ke "file:./db/saka.db"
bun run db:push
bun run db:seed-rbac
bun run db:seed-lokasi
bun run db:activate-cms

# Start dev server
bun run dev
```

Open http://localhost:3000

**Default admin login:**
- Email: `admin@saka-laptop.id`
- Password: `Saka2026!`

---

## 📦 Modules

### Core (always active)
- **Auth (RBAC)** — User, Role, Permission, UserRole, RolePermission
- **Branding** — site name, logo, social media
- **SEO** — meta tags, OG tags
- **Settings** — contact info, SMTP, GA, Meta Pixel
- **Media** — media library
- **Users & Roles** — RBAC management

### CMS Module (active)
- **Articles** — blog/articles CRUD with categories

### Saka Business Modules (always active)
- **Submissions** — pengajuan laptop bekas
  - Workflow: RECEIVED → QC_PROCESS → OFFER_SENT → ACCEPTED/REJECTED → INVENTORY → SOLD
- **QC** — 12-item inspection checklist
- **Penawaran** — offer management
- **Inventory** — laptop inventory internal
- **Laporan** — sales report with charts

---

## 🎨 Color Palette

Black + White + Blue accent
- Primary: `#000000`
- Background: `#FAFAFA`
- Accent: `#2563EB` (blue, for tech highlights)
- Text: `#111827` / soft `#6B7280`
- Border: `#E5E7EB`

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── admin/              # Admin panel (15+ pages)
│   ├── ajukan/             # Customer form (laptop submission)
│   ├── api/                # API routes
│   │   ├── setup/init/     # One-time setup endpoint (production seed)
│   │   └── ...
│   ├── page.tsx            # Homepage (7 sections)
│   └── layout.tsx          # Root layout
├── core/                   # Nauka Core (RBAC + CMS foundation)
│   ├── components/         # admin-layout, sidebar, header, guards
│   ├── config/             # navigation, permissions
│   ├── lib/                # auth, db, module-registry
│   └── types/              # module contracts
├── lib/                    # Saka stores & utils
├── modules/                # Module contracts (CMS, Inventory stubs)
└── components/             # shadcn/ui + Saka components

prisma/
├── schema.prisma           # PostgreSQL (default, for production)
├── schema.sqlite.prisma    # SQLite (for local dev)
├── schema.production.prisma # PostgreSQL backup
└── seed.ts                 # Legacy seed

scripts/
├── seed-rbac.ts            # RBAC + super admin + branding + settings + SEO
├── seed-lokasi.ts          # Legacy Lokasi (WhatsApp number)
├── register-cms.ts         # Activate CMS module
└── seed-sold-items.ts      # Dummy SOLD items
```

---

## 🆘 Troubleshooting

### Login 500 error di production
- Cek `DATABASE_URL` valid PostgreSQL connection string
- Cek `JWT_SECRET` sudah di-set
- Pastikan setup endpoint udah dipanggil: `/api/setup/init?key=SETUP_KEY`

### `/api/lokasi` 500
- DB belum di-seed. Run `/api/setup/init?key=SETUP_KEY` untuk seed Lokasi.

### Prisma client error
- Hapus `.next/` folder & redeploy
- Atau tambahkan `prisma generate` ke build command di Vercel

### Mau ganti password admin
- Login → `/admin/users` → edit user → change password

---

## 📝 License

© 2026 Saka Laptop. All rights reserved.
