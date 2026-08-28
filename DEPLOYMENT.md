# Cloudflare Deployment

## Frontend + Functions
Project ini disiapkan untuk Cloudflare Pages + Pages Functions. Jangan deploy sebagai Node server tradisional.

## D1
Buat database D1, lalu jalankan `SCHEMA.sql` melalui Wrangler. Setelah database siap, bind sebagai `DB`.

## Secrets
Simpan `MIDTRANS_SERVER_KEY`, `PROVIDER_API_KEY`, `PROVIDER_API_SECRET`, `SESSION_SECRET`, dan secret lain melalui Cloudflare Secrets/environment. Jangan masukkan nilai asli ke Git.

## Environment
Development: Midtrans sandbox + mock provider.
Production: `MIDTRANS_IS_PRODUCTION=true` hanya setelah sandbox lulus.

## Checklist
- D1 binding tersedia
- secrets tersedia
- notification URL Midtrans terdaftar
- webhook signature test lulus
- duplicate notification test lulus
- price tampering test lulus
- admin auth test lulus
- refund ownership test lulus
- mobile smoke test lulus
