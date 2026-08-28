# Security Notes

- Jangan commit `.env`, `.dev.vars`, dump database, private key, token, atau log sensitif.
- Server Key Midtrans dan provider secret harus server-side.
- Harga, diskon, status pembayaran, ownership refund, dan admin authorization harus diverifikasi server-side.
- Webhook Midtrans harus diverifikasi signature dan diproses idempotent.
- Gunakan HTTPS di deployment.
- Gunakan HttpOnly + Secure + SameSite cookie untuk session produksi.
- Password admin di-hash dengan PBKDF2-HMAC-SHA256 (210.000 iterasi, salt acak per password) — lihat scripts/hash-admin-password.mjs. Jangan pernah menyimpan plaintext.
- Endpoint login admin dibatasi rate limit ketat (5 percobaan/15 menit per IP, ditegakkan lewat D1 lintas isolate) dan Turnstile bila TURNSTILE_SECRET_KEY diset.
- Rate limiting endpoint publik (orders, refunds, inquiries, support, digital-orders) ditegakkan lewat tabel D1 rate_limits, bukan hanya memory in-process, agar konsisten lintas isolate/edge Cloudflare.
- Aksi admin (login, logout, perubahan status pesanan, keputusan refund) dicatat ke tabel audit_logs.
- Sanitasi input dan gunakan parameterized queries D1.
- Jangan menaruh token sensitif di localStorage/sessionStorage.
- Jangan menampilkan stack trace production.
- Audit event transaksi/refund/admin tanpa merekam secret atau data pribadi berlebihan.
- Aktifkan Cloudflare WAF/rate limiting/Turnstile bila sesuai threat model.
