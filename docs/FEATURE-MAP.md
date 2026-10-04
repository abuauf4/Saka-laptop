# Saka Laptop v2 — Feature Map

Source: legacy Next.js/Prisma app on `main`.

| Legacy feature | Laravel v2 target | Status |
|---|---|---|
| Public homepage | Blade SSR + MySQL singleton content | Foundation ready |
| Store/location settings | `settings` table | Foundation ready |
| SEO metadata | Server-rendered Blade metadata | Foundation ready |
| Articles | `articles` table + public routes | Foundation ready |
| Testimonials | `testimonials` table | Foundation ready |
| Admin login | Laravel session auth | Foundation ready |
| Users / roles / permissions | Server-enforced RBAC | Foundation ready |
| Laptop submissions | `submissions` table | Schema ready |
| QC | fields on `submissions`, dedicated UI next | Schema ready |
| Offer / penawaran | offer fields on `submissions` | Schema ready |
| Inventory | `inventory_items` table | Schema ready |
| Kasir | `transactions` table | Schema ready |
| Reports | aggregate queries over transactions | Next phase |
| Media upload | filesystem/public storage, DB stores paths only | Next phase |
| Homepage CMS | single source of truth in MySQL | Next phase UI |
| Landing SEO pages | Blade routes, content migration next | Route foundation ready |
| Google Ads / GA / Pixel | settings fields + secure server injection next | Next phase |

## Rules locked for v2

1. No base64 images in MySQL.
2. No schema mutation during requests.
3. Every admin mutation is permission-checked on the server.
4. Secrets are never returned by public endpoints.
5. No default production admin password.
6. Public website and admin CMS read/write the same MySQL records.
7. Production DB changes use Laravel migrations only.
