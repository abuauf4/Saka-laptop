# Legacy → Laravel migration plan

Legacy Next.js tetap aman di `main`. Branch `laravel-v2` hanya memindahkan data yang masih relevan.

## Yang dipindahkan

1. Data identitas website yang dibutuhkan public pages
2. Homepage content yang ingin dipertahankan
3. Testimoni yang valid
4. Artikel published/draft yang masih dipakai
5. Lead/customer inquiry yang masih relevan bila perlu

## Yang tidak dipindahkan ke v2

- role/permission lama
- inventory
- QC
- penawaran operasional
- kasir/transaksi
- laporan internal

Admin dibuat ulang sebagai satu akun dengan password baru dari `ADMIN_PASSWORD`.

## Cutover

- Selesaikan tampilan public + form lead
- Import artikel/konten
- Smoke test lead masuk dan artikel publish
- Upload paket Hostinger
- Jalankan `/setup`
- Verifikasi mobile/desktop + SEO
- Baru arahkan domain ke hosting baru
