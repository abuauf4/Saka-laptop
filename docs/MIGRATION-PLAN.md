# Legacy → Laravel data migration plan

The legacy app remains untouched on `main`. `laravel-v2` is developed independently.

## Import order

1. Settings / lokasi / branding / SEO → `settings`
2. Homepage content → `homepage_contents`
3. Testimonials → `testimonials`
4. Articles → `articles`
5. Users / roles → create new Laravel users; do **not** copy legacy JWT/session data
6. Submissions → `submissions`
7. Inventory / barang → `inventory_items`
8. Kasir/sales → `transactions`

## Passwords

Existing bcrypt hashes can be migrated only after verifying compatibility. Admin access will initially be recreated with a new strong password from `ADMIN_PASSWORD`.

## Cutover

- Freeze legacy writes.
- Final export from PostgreSQL.
- Import into MySQL.
- Run reconciliation totals.
- Smoke-test public pages and admin.
- Point the domain to Hostinger only after verification.
