# Deploy Saka Laptop ke Hostinger Single

Paket production dibuat khusus shared hosting dan **tidak membutuhkan SSH atau Composer di Hostinger**.

## Isi ZIP

Setelah diextract pada folder domain, strukturnya harus seperti ini:

```
domains/jakartalaptops.com/
├── public_html/
│   ├── index.php
│   ├── install.php
│   ├── .htaccess
│   └── assets/...
├── saka-app/
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── resources/
│   ├── routes/
│   ├── storage/
│   └── vendor/
├── INSTALL-CODE.txt
└── README-FIRST.txt
```

Laravel source berada di luar `public_html`, jadi file aplikasi dan `.env` tidak terekspos sebagai file publik.

## Langkah deploy dari HP

1. Di hPanel, buat database MySQL dan catat DB Host, nama database, username, dan password.
2. Download artifact **saka-laptop-v2-hostinger** dari GitHub Actions.
3. Upload ZIP ke folder domain, **bukan ke dalam public_html**, lalu Extract.
4. Pastikan folder `public_html` dan `saka-app` sejajar.
5. Buka `INSTALL-CODE.txt` di File Manager dan copy kodenya.
6. Buka `https://jakartalaptops.com/install.php`.
7. Isi Install Code, data MySQL, email admin, dan password admin.
8. Klik **Install Saka Laptop**.
9. Setelah sukses, buka `/admin/login`.

Installer membuat `.env`, APP_KEY, migration, dan admin secara otomatis. Setelah sukses, marker instalasi dibuat dan token installer dihapus sehingga installer tidak dapat dijalankan ulang.

## Setelah install

Tes:
- homepage
- form lead → muncul di `/admin/leads`
- create + publish artikel
- `/sitemap.xml`
- `/robots.txt`
- mobile layout
