# Panduan Ikon — Aji Wira Website

Semua ikon visual sekarang menggunakan SVG, bukan emoji, sehingga tampil lebih konsisten di desktop/mobile dan tidak bergantung pada font emoji perangkat.

## Lokasi utama
Edit file:
`js/main.js`

Cari bagian:
`EDITABLE ICON SYSTEM`

Di dalam objek `ICONS` terdapat semua ikon yang dipakai website.

### Ikon layanan
Mapping di `siteConfig.services`:
- `building` — Website Bisnis
- `landmark` — Company Profile
- `rocket` — Landing Page
- `briefcase` — Portfolio Website
- `shopping` — Online Store
- `settings` — Custom Website

Contoh:
```js
{
  icon: "rocket",
  title: "Landing Page",
  ...
}
```

Untuk mengganti ikon, cukup ubah `"rocket"` menjadi nama ikon lain yang tersedia di `ICONS`.

## Ikon keunggulan
Ikon pada bagian "Kenapa Memilih Saya" berada langsung di `index.html` melalui atribut:
`data-icon="..."`

Contoh:
```html
<span class="card-icon" data-icon="palette" aria-hidden="true"></span>
```

Nama yang tersedia antara lain:
`palette`, `smartphone`, `bolt`, `search`, `compass`, `wrench`.

## Logo sosial media
Logo sosial juga berada di `ICONS`:
- `whatsapp`
- `instagram`
- `x`
- `linkedin`
- `youtube`
- `tiktok`

Kontak/sosial dirender otomatis dari `siteConfig`, jadi tidak perlu menulis SVG berulang-ulang.

## Jika ingin membuat ikon sendiri
Tambahkan properti baru ke `ICONS` dengan SVG viewBox 24x24:
```js
myIcon: `<svg viewBox="0 0 24 24"><path d="..."/></svg>`
```

Lalu gunakan:
```js
icon: "myIcon"
```

atau pada HTML:
```html
<span data-icon="myIcon"></span>
```

## Prinsip desain
- SVG inline: tidak membutuhkan CDN/icon library eksternal.
- Stroke konsisten agar ikon terlihat satu keluarga.
- Logo brand dipisahkan dari ikon utilitas.
- Warna mengikuti `currentColor` dan token warna website.
- Tidak ada emoji yang dipakai sebagai ikon UI.
