# Contributing

## Git Commit & Push Rules

**WAJIB** — Setiap commit dan push ke repository ini **harus** menggunakan author:

```
Name:  abuauf4
Email: mochamadbagussuhada@gmail.com
```

### Setup (sekali saja)

```bash
git config user.name "abuauf4"
git config user.email "mochamadbagussuhada@gmail.com"
```

Atau khusus repo ini saja:

```bash
git config --local user.name "abuauf4"
git config --local user.email "mochamadbagussuhada@gmail.com"
```

### Verifikasi sebelum push

Cek author terakhir:

```bash
git log -1 --format='%an <%ae>'
```

Harus menampilkan: `abuauf4 <mochamadbagussuhada@gmail.com>`

Jika salah, amend commit terakhir:

```bash
git commit --amend --author="abuauf4 <mochamadbagussuhada@gmail.com>" --no-edit
```

### Kenapa ini penting?

- Supaya semua commit history di GitHub konsisten satu author.
- Vercel auto-deploy dari branch `main` — tidak ada masalah selama push ke `main`.
- Commit dengan author berbeda akan di-reject / harus di-rewrite.
