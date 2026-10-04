# Hostinger Single Web Hosting deployment

Target runtime: PHP 8.3+ / MySQL / Laravel 13.

## hPanel prerequisites

1. Create a MySQL database and user.
2. Set PHP to 8.3 or newer.
3. Deploy the `laravel-v2` branch with Git or upload the project.
4. The web document root must point to the project's `public/` directory.
5. Copy `.env.example` to `.env` and fill production values.
6. Set a strong `ADMIN_PASSWORD` before seeding.

## First deployment commands

```bash
composer install --no-dev --optimize-autoloader
php artisan key:generate --force
php artisan migrate --force
php artisan db:seed --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

If SSH is unavailable, use Hostinger's Laravel deployment/Auto Installer workflow first, then replace application source with this branch and configure `.env` in hPanel.

## Storage

Customer/product photos live under `storage/app/public`; MySQL stores file paths only.

## Security

- `APP_DEBUG=false`
- HTTPS only
- `SESSION_SECURE_COOKIE=true`
- Never commit `.env`
- Remove any temporary migration/import endpoints after use
