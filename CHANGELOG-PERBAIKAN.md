# Changelog Perbaikan — berdasarkan Laporan Audit 27 Agustus 2026

## Kritikal — selesai
- **#1** Bug `INSERT INTO orders` (placeholder tidak cocok) di `functions/api/orders.js` — diperbaiki.
- **(baru ditemukan saat perbaikan, kelas bug sama dengan #1)** Bug serupa di `functions/api/support.js` (`INSERT INTO support_tickets`) — diperbaiki. Ditemukan oleh pemeriksaan otomatis baru di `scripts/smoke-test.mjs`.
- **#2** Hashing password admin diganti dari SHA-512 polos menjadi **PBKDF2-HMAC-SHA256 (210.000 iterasi, salt acak per password)**. Lihat `functions/_lib.js` (`hashPassword`/`verifyPassword`) dan `scripts/hash-admin-password.mjs` yang sudah diperbarui. Dukungan mundur (fallback) ke hash lama sementara masih ada untuk migrasi — segera generate ulang `ADMIN_PASSWORD_HASH` dan hapus `ADMIN_PASSWORD_SALT`.
- **#3** Endpoint login admin (`functions/api/admin/session.js`) sekarang memakai `rateLimit` (5 percobaan/15 menit) dan `verifyTurnstile`.
- **#4** `rateLimit()` di `functions/_lib.js` sekarang benar-benar menegakkan batas lewat tabel D1 `rate_limits` (baca-lalu-tulis), bukan hanya penghitung in-memory per isolate.

## Tinggi — selesai
- **#5** Semua pesanan yang mencapai status `paid` sekarang membuat catatan `manual_fulfillments` (sebelumnya hanya e-wallet) — lihat `functions/api/midtrans/notification.js`. Endpoint admin baru `functions/api/admin/orders.js` untuk melihat & mengubah status pesanan top up game/layanan digital lain.
- **#6** Endpoint admin baru `functions/api/admin/refunds.js` untuk meninjau, menyetujui/menolak, dan menyelesaikan refund — mengisi mesin status yang sebelumnya menggantung di `refund_requested`.
- **#7** Dashboard admin (`admin.html` + `js/admin.js`) ditulis ulang: kartu statistik Overview kini terisi data nyata (`functions/api/admin/stats.js`), dan setiap menu (Agency, Digital Store, Orders, Refunds) memiliki fungsi nyata, bukan lagi tampilan kosong.
- **#8** Endpoint admin baru untuk `inquiries` (`functions/api/admin/inquiries.js`) dan `support_tickets` (`functions/api/admin/support.js`), lengkap dengan UI di dashboard.

## Sedang — sebagian selesai
- **#12** Audit log kini ditulis (`auditLog()` di `functions/_lib.js`) untuk login/logout admin, perubahan status pesanan, refund, inquiry, dan tiket support.
- **#13** Skrip baru `scripts/check-production-env.mjs` (`npm run check:env`) memvalidasi environment variable keamanan wajib sebelum deploy, agar Turnstile/rate limiting/login admin tidak diam-diam nonaktif.
- **#9** (belum) Migrasi ke tabel `admins` multi-user — arsitektur PBKDF2 baru sudah kompatibel, tapi endpoint masih baca dari environment variable tunggal.
- **#10** (belum) Kebijakan privasi belum ditulis ulang mengikuti UU PDP — perlu ditinjau bersama pihak legal.
- **#11** (belum) Verifikasi kepemilikan order/refund masih berbasis kecocokan kontak tanpa OTP.

## Rendah — sebagian selesai
- **#14** `scripts/smoke-test.mjs` sekarang memvalidasi otomatis setiap `INSERT ... VALUES ... .bind()` di seluruh `functions/` (jumlah kolom = jumlah placeholder = jumlah argumen bind) — inilah yang menemukan bug kedua di atas.
- **#17** Berkas `_headers` baru menambahkan Content-Security-Policy dan Strict-Transport-Security untuk Cloudflare Pages.
- **#15, #16** (belum) Kompleksitas password admin & kebijakan retensi data PII eksplisit belum diterapkan.

## Cara memakai hash password admin yang baru
```
node scripts/hash-admin-password.mjs "password-anda-min-8-karakter"
# salin baris ADMIN_PASSWORD_HASH=pbkdf2$... ke environment variable produksi
# ADMIN_PASSWORD_SALT tidak lagi diperlukan untuk hash baru
```

## Verifikasi
`npm run check` (smoke test, termasuk validasi SQL INSERT baru) — **lolos**, 10 pernyataan INSERT tervalidasi.

## Tahap 2 — implementasi lanjutan
- **#8** Endpoint admin inquiries & support sudah tersedia dan terhubung ke audit log.
- **#9** Admin authentication dimigrasikan ke tabel D1 `admins` multi-user dengan role `owner/admin/support`, validasi `active` pada setiap request, serta endpoint owner untuk membuat/menonaktifkan/mengubah admin.
- **#10** Kebijakan privasi diperluas untuk data pribadi, tujuan pemrosesan, pihak pemroses, retensi, hak pengguna, cookie, keamanan, dan review UU PDP.
- **#11** Kepemilikan order kini berlapis: kecocokan kontak + OTP ke email order + token akses singkat. Detail order dan refund tidak lagi cukup hanya dengan Order ID/kontak.
- **#12** Audit log diperluas untuk login admin, perubahan inquiry/tiket/order/refund, pembuatan admin, permintaan refund, dan verifikasi kepemilikan order.
- **#13** Checklist production environment kini mewajibkan konfigurasi OTP email dan tidak lagi bergantung pada password admin environment.
- Tambahan: `scripts/seed-admin.mjs` untuk membuat SQL seed owner pertama.
