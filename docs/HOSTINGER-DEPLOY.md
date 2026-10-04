# Hostinger Auto-Deploy — Saka Laptop

Production flow:

```
laravel-v2
  ↓ GitHub Actions: build + verify
hostinger-prod
  ↓ Hostinger Git auto-deployment
public_html
```

## Setup Hostinger satu kali

1. hPanel → Website → Advanced → Git.
2. Connect GitHub dan pilih repo `abuauf4/Saka-laptop`.
3. Branch: `hostinger-prod`.
4. Root directory / install path: `public_html`.
5. Deploy.
6. Aktifkan **Auto-deployment**.

Setelah itu setiap perubahan yang lolos build di `laravel-v2` akan memperbarui `hostinger-prod`. Hostinger menarik branch production itu otomatis.

## Install pertama

Sebelum membuka website:

1. Buat database MySQL di hPanel.
2. Buka `https://jakartalaptops.com/install.php`.
3. Masukkan Install Code, DB Host, database name, username, password DB, email admin, dan password admin.
4. Klik **Install Saka Laptop**.
5. Setelah sukses buka `/admin/login`.

Konfigurasi runtime disimpan di folder `saka-runtime` di luar `public_html`, jadi auto-deploy Git tidak menghapus `.env`, session, cache, atau marker instalasi.

## Keamanan

- `.saka-app` berada di dalam deployment branch tetapi diblokir dari HTTP oleh root `.htaccess`.
- Runtime `.env` berada di luar `public_html`.
- Installer otomatis 404 setelah instalasi berhasil.
- Password admin awal dihapus dari runtime `.env` setelah proses seeding.
- Branch `hostinger-prod` adalah hasil build; jangan diedit manual.

## Update harian

Tidak perlu upload ZIP.

Cukup update `laravel-v2` → GitHub Actions build → `hostinger-prod` berubah → Hostinger auto-deploy.
