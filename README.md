# Aji Wira — Web Development Studio + Digital Store

Refactor ini mempertahankan frontend agency asli dan menambahkan modul Digital Store/Top Up secara terpisah. Homepage tetap berorientasi **jasa pembuatan website**, portfolio, paket, dan konsultasi; `topup.html` menjadi storefront digital.

## Struktur
- `index.html` — homepage agency existing yang diperluas.
- `topup.html` — katalog digital store.
- `game.html` — detail game + input akun + nominal.
- `checkout.html` — checkout top up.
- `order.html` — cek status order.
- `refund.html` — pengajuan refund.
- `admin.html` — shell dashboard; production harus memakai auth server-side.
- `functions/` — Cloudflare Pages Functions/API.
- `SCHEMA.sql` — schema D1 untuk agency + digital store.
- `.env.example` — nama secret saja.
- `wrangler.toml` — skeleton Cloudflare.

## Jalankan lokal
Frontend dapat dibuka sebagai static site. Untuk menguji API Cloudflare Pages Functions gunakan Wrangler/Cloudflare Pages dev dengan binding D1 sesuai konfigurasi deployment.

## Midtrans
Akun sandbox digunakan sebagai target awal. Isi secret melalui Cloudflare secrets/environment, **bukan** source frontend:
- `MIDTRANS_SERVER_KEY`
- `MIDTRANS_CLIENT_KEY` bila flow client memerlukannya
- `MIDTRANS_IS_PRODUCTION=false`
- `MIDTRANS_API_BASE_URL=https://app.sandbox.midtrans.com`

Server Key tidak pernah dikirim ke browser. Notification Midtrans diverifikasi server-side menggunakan signature yang dibentuk dari `order_id + status_code + gross_amount + server key`. Redirect browser bukan sumber kebenaran pembayaran.

## Database
Buat D1 dan jalankan `SCHEMA.sql`. Jangan menaruh credential database di repository.

## Provider
Saat ini provider adapter adalah **mock/sandbox**. Tidak ada API supplier fiktif. Implementasikan adapter nyata hanya setelah dokumentasi dan credential supplier tersedia.

## Order integrity
Client hanya mengirim `gameId`, `productId`, input akun, dan kontak. Backend mengambil harga dari katalog server-side dan menghitung total kembali. Promo yang belum dikonfigurasi tidak diterima secara diam-diam.

## Refund
Refund selalu melalui validasi ownership + status order + review workflow. Tidak semua transaksi digital otomatis dapat direfund.

## Security
Lihat `SECURITY.md`. Sebelum production, konfigurasi authentication admin, rate limiting/Turnstile sesuai kebutuhan, D1 binding, secrets, monitoring, dan provider nyata.


## Tahap 2 — konfigurasi tambahan sebelum produksi
- Admin production menggunakan tabel D1 `admins` multi-user. Buat SQL owner pertama dengan `node scripts/seed-admin.mjs admin@example.com "password-minimal-12" owner`, lalu jalankan SQL tersebut di D1.
- Verifikasi order/refund menggunakan kecocokan kontak + OTP email. Konfigurasikan `RESEND_API_KEY` dan `OTP_FROM_EMAIL`.
- Detail order API memerlukan header `x-order-verification` dari sesi OTP yang masih berlaku.
- Audit aktivitas admin dan verifikasi kepemilikan dicatat di `audit_logs`.
- `npm run check` memvalidasi asset, syntax, pricing, dan konsistensi INSERT. `npm run check:env` memblokir konfigurasi production yang belum lengkap.

## Deploy
1. Buat Cloudflare Pages project.
2. Hubungkan repository.
3. Konfigurasi D1 binding `DB`.
4. Tambahkan secrets via Cloudflare dashboard/CLI.
5. Pastikan `MIDTRANS_IS_PRODUCTION=false` untuk pengujian awal.
6. Konfigurasi notification URL Midtrans ke `/api/midtrans/notification`.
7. Uji mock -> sandbox -> baru production.

## Product model
The site is intentionally a two-line digital business: **Web Development Studio (primary)** and **Digital Store / Top Up (secondary)**. Agency routes include `agency.html`, `portfolio.html`, `packages.html`, `inquiry.html`, and a client-area shell at `project.html`. Digital Store remains separated under `topup.html`, `game.html`, `checkout.html`, `order.html`, and `refund.html`.

Agency inquiries use `POST /api/inquiries` and persist to D1 when `DB` is configured. Production authentication, admin authorization, Midtrans credentials, and real product-provider credentials must be configured server-side before enabling live operations.
