# Saka Laptop — Pusat Inspeksi & Trade-in Laptop Bekas

Next.js 16 + Prisma + TypeScript. Modular CMS architecture (RBAC + CMS + business modules).

## 🚀 Quick Start (Local Dev)

```bash
# Install dependencies
bun install

# Setup database (SQLite for local)
cp .env.example .env
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

⚠️ **CHANGE PASSWORD IMMEDIATELY after first login** via `/admin/users`

## 🗄️ Database

Two schema files maintained:

| File | Provider | Use Case |
|---|---|---|
| `prisma/schema.prisma` | SQLite (default) | Local dev & sandbox preview |
| `prisma/schema.production.prisma` | PostgreSQL | Production (Vercel/Supabase/Neon) |
| `prisma/schema.sqlite.prisma` | SQLite (backup) | Restore SQLite after using PG |

### Switch schema:

```bash
# Switch to PostgreSQL (for production testing)
bun run db:use-postgres

# Switch back to SQLite (for local dev)
bun run db:use-sqlite
```

## 🌐 Production Deployment (Vercel)

### 1. Set environment variables in Vercel dashboard:
- `DATABASE_URL` — PostgreSQL connection string (e.g. from Supabase/Neon)
- `JWT_SECRET` — strong random string (use `openssl rand -base64 32`)
- `NEXT_PUBLIC_SITE_URL` — your domain (e.g. `https://jakartalaptops.com`)

### 2. Switch schema to PostgreSQL BEFORE deploying:
```bash
bun run db:use-postgres
git add prisma/schema.prisma
git commit -m "chore: switch to PostgreSQL for production"
git push
```

### 3. After deploy, run migrations & seeds against production DB:
```bash
# Set DATABASE_URL to production PostgreSQL locally, then:
bun run db:push
bun run db:seed-rbac
bun run db:seed-lokasi
bun run db:activate-cms
```

### 4. (Optional) Switch schema back to SQLite for continued local dev:
```bash
bun run db:use-sqlite
git checkout prisma/schema.prisma  # discard local change
```

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
- **Submissions** — pengajuan laptop bekas (workflow: RECEIVED → QC_PROCESS → OFFER_SENT → ACCEPTED/REJECTED → INVENTORY → SOLD)
- **QC** — 12-item inspection checklist
- **Penawaran** — offer management
- **Inventory** — laptop inventory internal
- **Laporan** — sales report

## 🎨 Color Palette

Black + White + Blue accent (per PM brief v3)
- Primary: `#000000`
- Background: `#FAFAFA`
- Accent: `#2563EB` (blue, for tech highlights)
- Text: `#111827` / soft `#6B7280`
- Border: `#E5E7EB`

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── admin/              # Admin panel (15+ pages)
│   ├── ajukan/             # Customer form (laptop submission)
│   ├── api/                # API routes
│   ├── page.tsx            # Homepage (7 sections)
│   └── layout.tsx          # Root layout
├── core/                   # Nauka Core (RBAC + CMS foundation)
│   ├── components/         # admin-layout, sidebar, header, guards
│   ├── config/             # navigation, permissions
│   ├── lib/                # auth, db, module-registry
│   └── types/              # module contracts
├── lib/                    # Saka stores & utils
│   ├── auth-store.tsx      # Auth context (useAuth + useAuthStore shim)
│   ├── submission-store.tsx
│   └── ...
├── modules/                # Module contracts (CMS, Inventory stubs)
└── components/             # shadcn/ui + Saka components

prisma/
├── schema.prisma           # SQLite (default for dev)
├── schema.production.prisma # PostgreSQL (for production)
├── schema.sqlite.prisma    # SQLite backup
└── seed.ts                 # Legacy seed (Testimoni, StoreLogo)

scripts/
├── seed-rbac.ts            # RBAC + super admin + branding + settings + SEO
├── seed-lokasi.ts          # Legacy Lokasi (WhatsApp number)
├── register-cms.ts         # Activate CMS module
└── seed-sold-items.ts      # Dummy SOLD items (for dashboard verification)
```

## 📝 License

© 2026 Saka Laptop. All rights reserved.
