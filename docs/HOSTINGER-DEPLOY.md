# Hostinger Single Web Hosting deployment

Target runtime: PHP 8.3+ / MySQL / Laravel 13.

Single Web Hosting does not provide SSH/Composer, so this project does **not** depend on running Composer or Artisan from Hostinger.

## Deployment model

1. GitHub Actions builds a production ZIP with the full `vendor/` directory.
2. Upload/extract the ZIP into the website directory from hPanel File Manager, or use Git deployment for source updates.
3. Create a MySQL database in hPanel.
4. Create `.env` from `.env.example` and fill:
   - `APP_KEY`
   - `APP_SETUP_KEY`
   - MySQL credentials
   - `ADMIN_PASSWORD`
5. Point the website document root to the project's `public/` directory.
6. Open `/setup`, enter `APP_SETUP_KEY`, and run the one-time installer.
7. After success, `storage/app/.installed` is created and the setup page returns 404.

## Build artifact

Workflow: `.github/workflows/build-hostinger.yml`

Artifact name: `saka-laptop-v2-hostinger`

The package contains production Composer dependencies, so Hostinger does not need Composer or SSH.

## Storage

Customer/product photos live under `storage/app/public`; MySQL stores file paths only.

## Security

- `APP_DEBUG=false`
- HTTPS only
- `SESSION_SECURE_COOKIE=true`
- use a random `APP_SETUP_KEY`
- use a strong `ADMIN_PASSWORD`
- never commit `.env`
- one-time setup self-disables after successful migration/seeding
