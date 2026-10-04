# Saka Laptop v2 — Laravel rebuild

This branch is the shared-hosting rebuild of Saka Laptop.

- Legacy production code remains on `main`.
- `laravel-v2` targets Hostinger Web Hosting using **Laravel 13 + PHP 8.3+ + MySQL**.
- Public website is server-rendered with Blade.
- Admin auth uses Laravel sessions.
- RBAC is enforced on the server.
- Images are stored as files, not base64 in MySQL.
- Database changes use migrations only.

## Current milestone

Foundation is in place:

- Laravel application bootstrap
- MySQL schema
- secure admin login
- roles + permissions
- settings single source of truth
- public homepage SSR
- article routes
- SEO landing page route foundation
- submissions / inventory / transaction schemas
- Hostinger deployment documentation

See:

- `docs/FEATURE-MAP.md`
- `docs/HOSTINGER-DEPLOY.md`
- `docs/MIGRATION-PLAN.md`

## Local setup

```bash
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
# Set ADMIN_PASSWORD in .env first
php artisan db:seed
php artisan serve
```
