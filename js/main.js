/* =========================================================
   SITE CONFIG — edit here to update site content
========================================================= */
const siteConfig = {
  name: "Aji Wira Nugroho",
  brand: "Aji Wira",
  role: "Web Developer",

  // Ganti dengan data asli sebelum publish
  whatsappNumber: "6283173705726",  // format internasional tanpa + atau 0 di depan
  email: "ajiiwra@gmail.com",
  instagram: "Wirak_",       // contoh: "ajiwira.dev"
  twitter: "ISI_TWITTER",           // username X/Twitter, contoh: "ajiwira_dev" (tanpa @)
  linkedin: "aji-wira-nugroho-730523330",         // contoh: "aji-wira-nugroho"
  youtube: "@awn2323",           // contoh: "@ajiwiradev" atau nama channel/ID channel
  tiktok: "ISI_TIKTOK",             // username TikTok, contoh: "ajiwira.dev" (tanpa @)

  waMessage: "Halo Aji Wira, Saya ingin konsultasi mengenai kebutuhan website saya.",

  services: [
    {
      icon: "building",
      title: "Website Bisnis",
      desc: "Untuk UMKM, usaha lokal, brand, dan bisnis profesional.",
      features: ["Desain sesuai brand", "Responsive penuh", "Optimasi kecepatan"]
    },
    {
      icon: "landmark",
      title: "Company Profile",
      desc: "Website profesional untuk memperkenalkan perusahaan, layanan, tim, dan informasi bisnis.",
      features: ["Struktur informatif", "Halaman tim & layanan", "Tampilan korporat"]
    },
    {
      icon: "rocket",
      title: "Landing Page",
      desc: "Halaman khusus untuk promosi produk, jasa, campaign, atau iklan.",
      features: ["Fokus konversi", "Loading cepat", "Call-to-action jelas"]
    },
    {
      icon: "briefcase",
      title: "Portfolio Website",
      desc: "Website personal untuk freelancer, developer, designer, creator, dan profesional.",
      features: ["Showcase karya", "Desain personal brand", "Mudah diperbarui"]
    },
    {
      icon: "shopping",
      title: "Online Store",
      desc: "Website katalog/toko online dengan produk, keranjang, dan sistem pemesanan.",
      features: ["Katalog produk", "Sistem pemesanan", "Terintegrasi WhatsApp"]
    },
    {
      icon: "settings",
      title: "Custom Website",
      desc: "Website yang dibuat berdasarkan kebutuhan dan alur bisnis klien.",
      features: ["Fitur sesuai kebutuhan", "Konsultasi mendalam", "Skalabel ke depan"]
    }
  ],

  portfolio: [
    {
      category: "bisnis", categoryLabel: "Website Bisnis",
      title: "Contoh Project — Website Bisnis",
      desc: "Placeholder project untuk kategori website bisnis. Ganti dengan project asli Anda.",
      goal: "Menampilkan profil usaha secara profesional dan mudah dihubungi calon pelanggan.",
      features: ["Halaman layanan", "Formulir kontak", "Galeri produk"],
      tech: ["HTML5", "CSS3", "JavaScript"],
      result: "Menunggu data project asli.",
      demo: null
    },
    {
      category: "portfolio", categoryLabel: "Portfolio",
      title: "Contoh Project — Portfolio",
      desc: "Placeholder project untuk kategori portfolio personal.",
      goal: "Menampilkan karya dan pengalaman secara ringkas dan menarik.",
      features: ["Showcase karya", "CV interaktif", "Kontak langsung"],
      tech: ["HTML5", "Tailwind CSS", "JavaScript"],
      result: "Menunggu data project asli.",
      demo: null
    },
    {
      category: "landing", categoryLabel: "Landing Page",
      title: "Contoh Project — Landing Page",
      desc: "Placeholder project untuk kategori landing page promosi.",
      goal: "Mendorong pengunjung melakukan aksi tertentu (konversi).",
      features: ["Single page", "CTA jelas", "Loading cepat"],
      tech: ["HTML5", "CSS3"],
      result: "Menunggu data project asli.",
      demo: null
    },
    {
      category: "ecommerce", categoryLabel: "E-Commerce",
      title: "Contoh Project — Online Store",
      desc: "Placeholder project untuk kategori toko online.",
      goal: "Memudahkan pelanggan melihat katalog dan melakukan pemesanan.",
      features: ["Katalog produk", "Keranjang belanja", "Checkout via WhatsApp"],
      tech: ["JavaScript", "Tailwind CSS"],
      result: "Menunggu data project asli.",
      demo: null
    },
    {
      category: "custom", categoryLabel: "Custom Website",
      title: "Contoh Project — Custom Website",
      desc: "Placeholder project untuk kebutuhan khusus/fitur custom.",
      goal: "Menjawab kebutuhan spesifik yang tidak tercakup paket standar.",
      features: ["Fitur khusus", "Integrasi API", "Desain unik"],
      tech: ["JavaScript", "API Integration"],
      result: "Menunggu data project asli.",
      demo: null
    },
    {
      category: "bisnis", categoryLabel: "Website Bisnis",
      title: "Contoh Project — Company Profile",
      desc: "Placeholder project untuk kategori company profile.",
      goal: "Membangun kepercayaan calon klien lewat presentasi digital yang rapi.",
      features: ["Profil perusahaan", "Halaman tim", "Statistik pencapaian"],
      tech: ["HTML5", "CSS3", "JavaScript"],
      result: "Menunggu data project asli.",
      demo: null
    }
  ],

  pricing: [
    {
      name: "Starter",
      desc: "Untuk personal dan bisnis kecil.",
      price: "Mulai Rp.50.000",
      popular: false,
      features: ["1 halaman", "Responsive", "Modern UI", "Contact button", "Basic SEO", "Optimasi mobile"]
    },
    {
      name: "Business",
      desc: "Untuk bisnis yang membutuhkan website profesional.",
      price: "Mulai Rp.700.000",
      popular: true,
      features: ["Multi-section", "Responsive", "Custom design", "Contact integration", "SEO basic", "Performance optimization", "Portfolio/product section"]
    },
    {
      name: "Custom",
      desc: "Untuk kebutuhan khusus.",
      price: "Hubungi untuk konsultasi",
      popular: false,
      features: ["Custom design", "Custom functionality", "Database jika diperlukan", "API integration", "Advanced feature", "Custom consultation"]
    }
  ],

  testimonials: [
    // Tambahkan objek { quote, name, role } di sini jika testimonial asli sudah tersedia.
  ],

  faq: [
    { q: "Apakah website bisa dibuka di HP?", a: "Ya. Website dirancang responsive sehingga dapat menyesuaikan smartphone, tablet, laptop, dan desktop." },
    { q: "Apakah desain bisa disesuaikan?", a: "Ya. Desain dapat disesuaikan dengan kebutuhan dan identitas brand Anda." },
    { q: "Berapa lama proses pembuatan website?", a: "Waktu pengerjaan bergantung pada kompleksitas dan jumlah fitur yang dibutuhkan." },
    { q: "Apa itu domain dan hosting? (untuk yang belum paham istilahnya)", a: "Domain adalah alamat website Anda di internet, contoh 'namabisnis.com' — sederhananya seperti nama & alamat rumah. Hosting adalah tempat menyimpan seluruh file website agar bisa diakses siapa saja, 24 jam — seperti tanah & bangunan tempat 'rumah' (website) itu berdiri. Keduanya disewa per tahun dari penyedia layanan, terpisah dari jasa pembuatan website." },
    { q: "Apakah harga paket sudah termasuk domain dan hosting?", a: "Belum. Harga paket adalah biaya jasa desain & pembuatan website saja. Domain dan hosting disewa terpisah ke penyedia layanan pihak ketiga dan umumnya dibayar per tahun, bukan biaya satu kali seperti jasa pembuatan website. Pemisahan ini dilakukan agar harga tetap transparan dan tidak tercampur biaya sewa tahunan." },
    { q: "Kalau saya tidak paham cara beli domain dan hosting, bagaimana?", a: "Tidak perlu bingung. Saya dapat membantu merekomendasikan, memilihkan, bahkan membantu proses setup domain & hosting sesuai kebutuhan dan budget Anda. Semua bisa didiskusikan langsung saat sesi konsultasi." },
    { q: "Apakah ada opsi domain dan hosting gratis?", a: "Ada. Website bisa online tanpa biaya domain & hosting dengan memakai subdomain bawaan dari penyedia gratis (contoh: namabisnis.vercel.app). Konsekuensinya, alamat website kurang terlihat profesional, kapasitas & kecepatan mengikuti batas layanan gratis (tidak ada garansi), dan belum bisa pakai email profesional seperti nama@namabisnisanda.com. Opsi ini cocok untuk uji coba atau budget sangat terbatas, dan bisa diupgrade ke domain & hosting sendiri kapan saja." },
    { q: "Apakah website bisa dikembangkan lagi?", a: "Ya. Website dapat dikembangkan dengan fitur tambahan sesuai kebutuhan di kemudian hari." }
  ]
};

/* =========================================================
   EDITABLE ICON SYSTEM
   Semua ikon situs didefinisikan di satu tempat agar mudah
   diganti tanpa menyentuh struktur HTML.

   Untuk ikon non-brand, ubah SVG di objek ICONS.
   Untuk logo sosial, gunakan path SVG brand yang ada di bawah.
========================================================= */
const ICONS = {
  folder: `<svg viewBox="0 0 24 24"><path d="M3.5 7.5h6l2 2h9v8.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-8.5a2 2 0 0 1 2-2Z"/><path d="M3.5 7.5v-1a2 2 0 0 1 2-2h4l2 2h3"/></svg>`,
  star: `<svg viewBox="0 0 24 24"><path d="m12 3 2.7 5.45 6.02.88-4.36 4.25 1.03 6-5.39-2.84-5.39 2.84 1.03-6-4.36-4.25 6.02-.88L12 3Z"/></svg>`,
  bolt: `<svg viewBox="0 0 24 24"><path d="m13.2 2.8-8 10.1h6.1l-.5 8.3 8-10.1h-6.1l.5-8.3Z"/></svg>`,
  headphones: `<svg viewBox="0 0 24 24"><path d="M4 13v-1a8 8 0 0 1 16 0v1"/><path d="M4 13h2.5A1.5 1.5 0 0 1 8 14.5v3A1.5 1.5 0 0 1 6.5 19H5a1 1 0 0 1-1-1v-5ZM20 13h-2.5a1.5 1.5 0 0 0-1.5 1.5v3a1.5 1.5 0 0 0 1.5 1.5H19a1 1 0 0 0 1-1v-5Z"/></svg>`,
  palette: `<svg viewBox="0 0 24 24"><path d="M12 3.5a8.5 8.5 0 1 0 0 17h1.5a2 2 0 0 0 0-4h-1a1.5 1.5 0 0 1 0-3H16a4.5 4.5 0 0 0 4.5-4.5A5.5 5.5 0 0 0 15 3.5h-3Z"/><path d="M7.5 10h.01M9.5 7h.01M14 7h.01M17 10h.01"/></svg>`,
  smartphone: `<svg viewBox="0 0 24 24"><rect x="6.5" y="2.5" width="11" height="19" rx="2.2"/><path d="M10.5 18.5h3"/></svg>`,
  search: `<svg viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg>`,
  compass: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m15.7 8.3-2.2 5.2-5.2 2.2 2.2-5.2 5.2-2.2Z"/></svg>`,
  wrench: `<svg viewBox="0 0 24 24"><path d="M14.5 5.5a4.5 4.5 0 0 0 5.7 5.7l-7.8 7.8a2.3 2.3 0 0 1-3.3-3.3l7.8-7.8a4.5 4.5 0 0 1-2.4-2.4Z"/><path d="m6.2 5.1 3 3"/></svg>`,
  building: `<svg viewBox="0 0 24 24"><path d="M4 21V5.5L12 3l8 2.5V21"/><path d="M8 8h1M15 8h1M8 12h1M15 12h1M8 16h1M15 16h1M11 21v-3h2v3"/></svg>`,
  landmark: `<svg viewBox="0 0 24 24"><path d="m3 9 9-5 9 5"/><path d="M5 9h14M6 10v7M10 10v7M14 10v7M18 10v7M4 17h16M3 21h18"/></svg>`,
  rocket: `<svg viewBox="0 0 24 24"><path d="M14 4c2.7-.7 4.8-.7 6-.2.5 1.2.5 3.3-.2 6-1.1 4.2-4.8 7.8-9 9l-3.6-3.6c1.2-4.2 4.8-7.9 9-9Z"/><circle cx="15.5" cy="8.5" r="1.5"/><path d="M7.5 13.5 4 14l-1 3.5 3.5-1 1-3Z"/><path d="m10.5 18.5-.5 2.5-2.5-1.5"/></svg>`,
  briefcase: `<svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2"/></svg>`,
  shopping: `<svg viewBox="0 0 24 24"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></svg>`,
  settings: `<svg viewBox="0 0 24 24"><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"/><path d="m19.4 15 .1.1-1.7 2.9-.2-.1a2.7 2.7 0 0 0-3.7 1.6v.2h-3.4v-.2a2.7 2.7 0 0 0-3.7-1.6l-.2.1-1.7-2.9.1-.1a2.7 2.7 0 0 0 0-4l-.1-.1 1.7-2.9.2.1a2.7 2.7 0 0 0 3.7-1.6v-.2h3.4v.2a2.7 2.7 0 0 0 3.7 1.6l.2-.1 1.7 2.9-.1.1a2.7 2.7 0 0 0 0 4Z"/></svg>`,

  lightbulb: `<svg viewBox="0 0 24 24"><path d="M9 18h6M10 21h4"/><path d="M8.5 14.5A6 6 0 1 1 15.5 14.5c-.8.7-1.2 1.5-1.5 2.5h-4c-.3-1-.7-1.8-1.5-2.5Z"/><path d="M12 2v1M4.9 4.9l.7.7M2 12h1M19.1 4.9l-.7.7M21 12h-1"/></svg>`,
  mail: `<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>`,
  /* Brand marks: sengaja disimpan terpisah agar mudah diganti */
  whatsapp: `<svg viewBox="0 0 24 24"><path d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.8-1.3A9.5 9.5 0 1 0 12 2.5Zm0 2a7.5 7.5 0 0 1 6.3 11.6l-.3.4.7 2.4-2.5-.7-.4.2A7.5 7.5 0 1 1 12 4.5Zm-3.1 3.2c.2 0 .4 0 .5.3l.8 1.9c.1.3.1.5-.1.7l-.6.7c.5 1 1.3 1.8 2.3 2.3l.7-.6c.2-.2.4-.2.7-.1l1.9.8c.3.1.3.3.3.5 0 .8-.3 1.5-.9 1.8-.5.3-1.3.3-2.1 0-2.7-.9-5.1-3.3-6-6-.3-.8-.3-1.6 0-2.1.4-.5 1-.9 1.8-.9Z"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24"><rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.7" r="1"/></svg>`,
  x: `<svg viewBox="0 0 24 24"><path d="M5 4h3.8l3.7 5.1L16.8 4H19l-5.5 6.4L20 20h-3.8l-4.1-5.7L7.2 20H5l5.7-6.7L5 4Z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24"><path d="M5 8.5A1.5 1.5 0 1 0 5 5.5a1.5 1.5 0 0 0 0 3ZM3.7 10.2h2.6V20H3.7v-9.8ZM9 10.2h2.5v1.3h.1c.4-.8 1.4-1.7 3.1-1.7 3.3 0 3.9 2.1 3.9 4.8V20H16v-4.8c0-1.1 0-2.5-1.6-2.5s-1.9 1.2-1.9 2.4V20H9v-9.8Z"/></svg>`,
  youtube: `<svg viewBox="0 0 24 24"><path d="M21 7.2a2.7 2.7 0 0 0-1.9-1.9C17.4 5 12 5 12 5s-5.4 0-7.1.3A2.7 2.7 0 0 0 3 7.2 28 28 0 0 0 2.7 12 28 28 0 0 0 3 16.8a2.7 2.7 0 0 0 1.9 1.9C6.6 19 12 19 12 19s5.4 0 7.1-.3a2.7 2.7 0 0 0 1.9-1.9 28 28 0 0 0 .3-4.8 28 28 0 0 0-.3-4.8ZM10 15.5v-7l6 3.5-6 3.5Z"/></svg>`,
  tiktok: `<svg viewBox="0 0 24 24"><path d="M14 4v10.2a4.1 4.1 0 1 1-3.1-4v2.2a2 2 0 1 0 1 1.8V4h2.1c.4 1.8 1.5 3 3.5 3.4v2.2A6.2 6.2 0 0 1 14 8.2V14"/></svg>`
};

function icon(name, className = "") {
  const svg = ICONS[name] || "";
  return svg ? `<span class="icon ${className}" aria-hidden="true">${svg}</span>` : "";
}

function hydrateStaticIcons() {
  $$("[data-icon]").forEach(el => {
    const name = el.dataset.icon;
    if (ICONS[name]) el.innerHTML = ICONS[name];
  });
}

/* =========================================================
   HELPERS
========================================================= */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouchDevice = window.matchMedia("(hover: none), (pointer: coarse)").matches;

function buildWaLink(customMessage) {
  const num = siteConfig.whatsappNumber;
  const msg = encodeURIComponent(customMessage || siteConfig.waMessage);
  if (!num || num === "ISI_NOMOR") return "#";
  return `https://wa.me/${num}?text=${msg}`;
}

/* =========================================================
   LOADING SCREEN
========================================================= */
window.addEventListener("load", () => {
  const loader = $("#loading-screen");
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add("hidden");
  }, 400);
});

/* =========================================================
   RENDER: SERVICES
========================================================= */
function renderServices() {
  const grid = $("#servicesGrid");
  if (!grid) return;
  grid.innerHTML = siteConfig.services.map((s, i) => `
    <article class="glass-card service-card" data-animate="fade-up" data-animate-delay="${i % 3}">
      <span class="card-icon">${icon(s.icon)}</span>
      <h3>${s.title}</h3>
      <p>${s.desc}</p>
      <ul class="service-features">
        ${s.features.map(f => `<li>${f}</li>`).join("")}
      </ul>
      <a href="#kontak" class="service-link" data-cursor="link">
        Pelajari
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </a>
    </article>
  `).join("");
}

/* =========================================================
   RENDER: PORTFOLIO
========================================================= */
function renderPortfolio() {
  const grid = $("#portfolioGrid");
  if (!grid) return;
  grid.innerHTML = siteConfig.portfolio.map((p, i) => `
    <div class="portfolio-card" data-category="${p.category}" data-index="${i}" data-animate="fade-up" data-animate-delay="${i % 3}" data-cursor="view">
      <div class="portfolio-thumb"><span>${p.title}</span>
        <span class="portfolio-category">${p.categoryLabel}</span>
      </div>
      <div class="portfolio-body">
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <div class="portfolio-tech">${p.tech.map(t => `<span class="tech-badge">${t}</span>`).join("")}</div>
        <div class="portfolio-actions">
          <button class="btn btn-secondary btn-detail" data-index="${i}">Detail</button>
          ${p.demo ? `<a href="${p.demo}" class="btn btn-primary" target="_blank" rel="noopener" onclick="event.stopPropagation()">Demo</a>` : ""}
        </div>
      </div>
    </div>
  `).join("");

  $$(".portfolio-card").forEach(card => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;
      openProjectModal(Number(card.dataset.index));
    });
  });
}

function openProjectModal(index) {
  const p = siteConfig.portfolio[index];
  if (!p) return;
  const modal = $("#projectModal");
  if (!modal) return;
  const setText=(sel,value)=>{const el=$(sel);if(el)el.textContent=value??""};
  const setHtml=(sel,value)=>{const el=$(sel);if(el)el.innerHTML=value};
  setText("#modalCategory",p.categoryLabel); setText("#modalTitle",p.title); setText("#modalDesc",p.desc); setText("#modalGoal",p.goal); setHtml("#modalFeatures",p.features.map(f=>`<li>${f}</li>`).join("")); setHtml("#modalTech",p.tech.map(t=>`<span class="tech-badge">${t}</span>`).join("")); setText("#modalResult",p.result);

  const demoBtn = $("#modalDemo");
  if (demoBtn && p.demo) {
    demoBtn.href = p.demo;
    demoBtn.style.display = "inline-flex";
  } else if (demoBtn) {
    demoBtn.style.display = "none";
  }

  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeProjectModal() {
  const modal = $("#projectModal");
  if (!modal) return;
  modal.classList.remove("open");
  document.body.style.overflow = "";
}

const modalClose = $("#modalClose");
const projectModal = $("#projectModal");
if (modalClose) modalClose.addEventListener("click", closeProjectModal);
if (projectModal) projectModal.addEventListener("click", (e) => {
  if (e.target.id === "projectModal") closeProjectModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeProjectModal();
});

/* Portfolio filter */
function initPortfolioFilter() {
  $$(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      $$(".filter-btn").forEach(b => { b.classList.remove("active"); b.setAttribute("aria-selected", "false"); });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      const filter = btn.dataset.filter;
      $$(".portfolio-card").forEach(card => {
        const match = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("hidden-item", !match);
      });
    });
  });
}

/* =========================================================
   RENDER: PRICING
========================================================= */
function renderPricing() {
  const grid = $("#pricingGrid");
  if (!grid) return;
  grid.innerHTML = siteConfig.pricing.map((p, i) => `
    <div class="price-card ${p.popular ? "popular" : ""}" data-animate="fade-up" data-animate-delay="${i}">
      ${p.popular ? `<span class="popular-badge">Paling Populer</span>` : ""}
      <span class="price-name">${p.name}</span>
      <p class="price-desc">${p.desc}</p>
      <div class="price-amount">${p.price}</div>
      <span class="price-note">*Belum termasuk domain &amp; hosting</span>
      <ul class="price-features">
        ${p.features.map(f => `<li>${f}</li>`).join("")}
      </ul>
      <a href="#kontak" class="btn ${p.popular ? "btn-primary" : "btn-secondary"} btn-block" data-cursor="link">Pilih Paket</a>
    </div>
  `).join("");
}

/* =========================================================
   RENDER: TESTIMONIALS
========================================================= */
function renderTestimonials() {
  const wrap = $("#testimonialWrap");
  if (!wrap) return;
  if (!siteConfig.testimonials.length) {
    wrap.innerHTML = `<div class="testimonial-empty"></div>`;
    return;
  }
  wrap.innerHTML = siteConfig.testimonials.map(t => `
    <div class="testimonial-slide">
      <p class="testimonial-quote">"${t.quote}"</p>
      <div class="testimonial-author">
        <strong>${t.name}</strong>
        <span>${t.role}</span>
      </div>
    </div>
  `).join("");
}

/* =========================================================
   RENDER: FAQ
========================================================= */
function renderFaq() {
  const list = $("#faqList");
  if (!list) return;
  list.innerHTML = siteConfig.faq.map((f, i) => `
    <div class="faq-item" data-index="${i}">
      <button class="faq-question" aria-expanded="false">
        <span>${f.q}</span>
        <span class="faq-icon">+</span>
      </button>
      <div class="faq-answer">
        <div class="faq-answer-inner">${f.a}</div>
      </div>
    </div>
  `).join("");

  $$(".faq-question").forEach(btn => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const answer = item.querySelector(".faq-answer");
      const isOpen = item.classList.contains("open");

      $$(".faq-item.open").forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove("open");
          openItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
          openItem.querySelector(".faq-answer").style.maxHeight = null;
        }
      });

      item.classList.toggle("open", !isOpen);
      btn.setAttribute("aria-expanded", String(!isOpen));
      answer.style.maxHeight = !isOpen ? answer.scrollHeight + "px" : null;
    });
  });
}

/* =========================================================
   RENDER: CONTACT LINKS + SOCIAL
========================================================= */
function renderContactLinks() {
  const links = [];
  if (siteConfig.whatsappNumber && siteConfig.whatsappNumber !== "6283173705726") {
    links.push({ icon: "whatsapp", label: "WhatsApp", href: buildWaLink() });
  }
  if (siteConfig.email && siteConfig.email !== "ajiiwra@gmail.com") {
    links.push({ icon: "mail", label: siteConfig.email, href: `mailto:${siteConfig.email}` });
  }
  if (siteConfig.instagram && siteConfig.instagram !== "Wirak_") {
    links.push({ icon: "instagram", label: `@${siteConfig.instagram}`, href: `https://instagram.com/${siteConfig.instagram}` });
  }
  if (siteConfig.twitter && siteConfig.twitter !== "ISI_TWITTER") {
    links.push({ icon: "x", label: `@${siteConfig.twitter}`, href: `https://x.com/${siteConfig.twitter}` });
  }
  if (siteConfig.linkedin && siteConfig.linkedin !== "aji-wira-nugroho-730523330") {
    links.push({ icon: "briefcase", label: "LinkedIn", href: `https://linkedin.com/in/${siteConfig.linkedin}` });
  }
  if (siteConfig.youtube && siteConfig.youtube !== "@awn2323") {
    links.push({ icon: "youtube", label: "YouTube", href: `https://youtube.com/${siteConfig.youtube}` });
  }
  if (siteConfig.tiktok && siteConfig.tiktok !== "ISI_TIKTOK") {
    links.push({ icon: "tiktok", label: `@${siteConfig.tiktok}`, href: `https://tiktok.com/@${siteConfig.tiktok}` });
  }

  const container = $("#contactLinks");
  if (!container) return;
  container.innerHTML = links.length
    ? links.map(l => `<a class="contact-link" href="${l.href}" target="_blank" rel="noopener"><span class="ci">${icon(l.icon)}</span> ${l.label}</a>`).join("")
    : `<p style="color:var(--muted);font-size:13.5px;"></p>`;

  const social = $("#footerSocial");
  const socialLinks = [];
  if (siteConfig.instagram && siteConfig.instagram !== "ISI_INSTAGRAM") socialLinks.push({ icon: "instagram", href: `https://instagram.com/${siteConfig.instagram}`, label: "Instagram" });
  if (siteConfig.twitter && siteConfig.twitter !== "ISI_TWITTER") socialLinks.push({ icon: "x", href: `https://x.com/${siteConfig.twitter}`, label: "X (Twitter)" });
  if (siteConfig.linkedin && siteConfig.linkedin !== "") socialLinks.push({ icon: "linkedin", href: `https://linkedin.com/in/${siteConfig.linkedin}`, label: "LinkedIn" });
  if (siteConfig.youtube && siteConfig.youtube !== "") socialLinks.push({ icon: "youtube", href: `https://youtube.com/${siteConfig.youtube}`, label: "YouTube" });
  if (siteConfig.tiktok && siteConfig.tiktok !== "ISI_TIKTOK") socialLinks.push({ icon: "tiktok", href: `https://tiktok.com/@${siteConfig.tiktok}`, label: "TikTok" });
  if (siteConfig.whatsappNumber && siteConfig.whatsappNumber !== "ISI_NOMOR") socialLinks.push({ icon: "whatsapp", href: buildWaLink(), label: "WhatsApp" });
  if (social) social.innerHTML = socialLinks.map(s => `<a class="social-link" href="${s.href}" target="_blank" rel="noopener" aria-label="${s.label}"><span class="social-icon">${icon(s.icon)}</span><span class="social-label">${s.label}</span><span class="social-arrow" aria-hidden="true">↗</span></a>`).join("");

  // Buttons
  const waLink = buildWaLink();
  [$("#ctaConsultNow"), $("#mobileWaBtn"), $("#floatingWa")].forEach(el => { if (el) el.href = waLink; });
  if (waLink === "#") {
    $$("#floatingWa, #ctaConsultNow, #mobileWaBtn").forEach(el => el.style.opacity = ".5");
  }
}

/* =========================================================
   NAVBAR: scroll state, active link, smooth scroll, mobile menu
========================================================= */
const navbar = $("#navbar");
const sections = ["home", "layanan", "portfolio", "paket", "tentang", "kontak"];

function handleNavbarScroll() {
  if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 40);
}

function updateActiveNav() {
  let current = sections[0];
  const scrollPos = window.scrollY + 140;
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= scrollPos) current = id;
  });
  $$(".nav-link").forEach(link => link.classList.toggle("active", link.dataset.section === current));
  $$(".mobile-link").forEach(link => link.classList.toggle("active", link.dataset.section === current));
}

/* Mobile menu */
const hamburger = $("#hamburger");
const mobileMenu = $("#mobileMenu");
const mobileBackdrop = $("#mobileBackdrop");

function toggleMobileMenu(open) {
  if (!mobileMenu || !mobileBackdrop || !hamburger) return;
  const isOpen = open !== undefined ? open : !mobileMenu.classList.contains("open");
  mobileMenu.classList.toggle("open", isOpen);
  mobileBackdrop.classList.toggle("open", isOpen);
  hamburger.classList.toggle("active", isOpen);
  hamburger.setAttribute("aria-expanded", String(isOpen));
  document.body.style.overflow = isOpen ? "hidden" : "";
}
if (hamburger && mobileMenu && mobileBackdrop) {
  hamburger.addEventListener("click", () => toggleMobileMenu());
  mobileBackdrop.addEventListener("click", () => toggleMobileMenu(false));
}
$$(".mobile-link").forEach(link => link.addEventListener("click", () => toggleMobileMenu(false)));

/* =========================================================
   THEME TOGGLE
========================================================= */
const themeToggle = $("#themeToggle");
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  if (themeToggle) themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  localStorage.setItem("aw-theme", theme);

  // Profil: kemeja putih untuk mode terang, kemeja hitam untuk mode gelap
  const photo = $("#profilePhoto");
  if (photo) {
    const src = theme === "light" ? photo.dataset.srcLight : photo.dataset.srcDark;
    if (src && photo.getAttribute("src") !== src) photo.setAttribute("src", src);
  }
}
(function initTheme() {
  const saved = localStorage.getItem("aw-theme");
  const preferred = saved || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  applyTheme(preferred);
})();
if (themeToggle) themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});

/* =========================================================
   SCROLL PROGRESS + BACK TO TOP + NAVBAR (single scroll listener)
========================================================= */
const scrollProgress = $("#scroll-progress");
const backToTop = $("#backToTop");

function onScroll() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (scrollProgress) scrollProgress.style.width = pct + "%";

  handleNavbarScroll();
  updateActiveNav();
  if (backToTop) backToTop.classList.toggle("show", scrollTop > window.innerHeight * 0.8);
  updateTimelineProgress();
}
window.addEventListener("scroll", onScroll, { passive: true });
if (backToTop) backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" }));

/* =========================================================
   TIMELINE PROGRESS
========================================================= */
function updateTimelineProgress() {
  const timeline = $("#timeline");
  const bar = $("#timelineProgress");
  if (!timeline || !bar) return;
  const rect = timeline.getBoundingClientRect();
  const vh = window.innerHeight;
  if (rect.top < vh * 0.75 && rect.bottom > 0) {
    const total = rect.height;
    const visible = Math.min(Math.max(vh * 0.75 - rect.top, 0), total);
    bar.style.width = Math.min((visible / total) * 100, 100) + "%";
  }
}

/* =========================================================
   SCROLL REVEAL (IntersectionObserver)
========================================================= */
function initScrollReveal() {
  const targets = $$("[data-animate]");
  if (prefersReducedMotion) {
    targets.forEach(t => t.classList.add("in-view"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
  targets.forEach(t => io.observe(t));
}

/* =========================================================
   ANIMATED COUNTERS
========================================================= */
function initCounters() {
  const counters = $$("[data-count]");
  if (!counters.length) return;

  const animate = (el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    if (prefersReducedMotion) { el.textContent = target + suffix; return; }
    const duration = 1200;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => io.observe(c));
}

/* =========================================================
   PARALLAX (mouse on desktop, scroll on mobile) — respects reduced motion
========================================================= */
function initParallax() {
  if (prefersReducedMotion) return;
  const glows = $$(".glow");
  const profileCard = $("#profileCard");
  const floatCards = $$(".float-card");
  const parallaxEls = [...glows, ...(profileCard ? [profileCard] : []), ...floatCards];

  if (!isTouchDevice) {
    let mouseX = 0, mouseY = 0, curX = 0, curY = 0;
    window.addEventListener("mousemove", (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    function raf() {
      curX += (mouseX - curX) * 0.06;
      curY += (mouseY - curY) * 0.06;
      parallaxEls.forEach(el => {
        const depth = Number(el.dataset.depth || 0.05) * 40;
        el.style.transform = `translate(${curX * depth}px, ${curY * depth}px)`;
      });
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  } else {
    // Lightweight scroll-based parallax on mobile
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      glows.forEach(el => {
        const depth = Number(el.dataset.depth || 0.05);
        el.style.transform = `translateY(${y * depth * 0.4}px)`;
      });
    }, { passive: true });
  }
}

/* =========================================================
   PARTICLE SYSTEM (canvas, lightweight, auto-reduced on low-end)
========================================================= */
function initParticles() {
  const canvas = $("#particles");
  // Dimatikan di HP/touch device supaya ringan & hemat baterai (juga disembunyikan lewat CSS)
  if (!canvas || prefersReducedMotion || isTouchDevice) return;
  const ctx = canvas.getContext("2d");
  let w, h, particles, running = true, rafId;

  const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
  const count = isLowEnd ? 26 : 55;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  function resize() {
    w = window.innerWidth;
    h = document.documentElement.scrollHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function createParticles() {
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.4,
      vy: -(Math.random() * 0.15 + 0.05),
      vx: (Math.random() - 0.5) * 0.08,
      o: Math.random() * 0.35 + 0.08
    }));
  }
  function draw() {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.y += p.vy;
      p.x += p.vx;
      if (p.y < -10) p.y = h + 10;
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      ctx.beginPath();
      ctx.fillStyle = `rgba(140,255,0,${p.o})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    rafId = requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();
  window.addEventListener("resize", () => { resize(); }, { passive: true });

  // Jeda animasi saat tab tidak terlihat — hemat CPU/baterai
  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running) { rafId = requestAnimationFrame(draw); }
    else { cancelAnimationFrame(rafId); }
  });
}

/* =========================================================
   CUSTOM CURSOR (desktop only)
========================================================= */
function initCustomCursor() {
  if (isTouchDevice) return;
  document.body.classList.add("cursor-enabled");
  const ring = $("#cursorRing");
  const dot = $("#cursorDot");
  const label = $("#cursorLabel");
  let rx = 0, ry = 0, dx = 0, dy = 0;

  window.addEventListener("mousemove", (e) => {
    dx = e.clientX; dy = e.clientY;
    dot.style.left = dx + "px"; dot.style.top = dy + "px";
  });
  function raf() {
    rx += (dx - rx) * 0.18;
    ry += (dy - ry) * 0.18;
    ring.style.left = rx + "px"; ring.style.top = ry + "px";
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  document.addEventListener("mouseover", (e) => {
    const viewTarget = e.target.closest('[data-cursor="view"]');
    const linkTarget = e.target.closest('[data-cursor="link"], a, button');
    if (viewTarget) {
      ring.classList.add("is-view");
      label.textContent = "VIEW";
    } else if (linkTarget) {
      ring.classList.add("is-link");
      label.textContent = "";
    }
  });
  document.addEventListener("mouseout", (e) => {
    const viewTarget = e.target.closest('[data-cursor="view"]');
    const linkTarget = e.target.closest('[data-cursor="link"], a, button');
    if (viewTarget) { ring.classList.remove("is-view"); label.textContent = ""; }
    if (linkTarget) ring.classList.remove("is-link");
  });
}

function formatIDRBudget(value) {
// Budget selalu ditampilkan dalam format Indonesia: Rp 1.234.567,89.
// Titik = pemisah ribuan, koma = pemisah desimal.
let raw = String(value ?? "").replace(/[^0-9,.-]/g, "");
if (!raw) return "";

// Tanda minus tidak relevan untuk budget, sedangkan titik diperlakukan
// sebagai pemisah ribuan. Koma menjadi satu-satunya pemisah desimal.
raw = raw.replace(/-/g, "").replace(/\./g, "");

const commaIndex = raw.indexOf(",");
let integerPart = commaIndex >= 0 ? raw.slice(0, commaIndex) : raw;
let decimalPart = commaIndex >= 0 ? raw.slice(commaIndex + 1).replace(/,/g, "") : "";

integerPart = integerPart.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
decimalPart = decimalPart.replace(/\D/g, "").slice(0, 2);

if (!integerPart) integerPart = "0";

const grouped = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
return `Rp ${grouped}${commaIndex >= 0 ? `,${decimalPart}` : ""}`;
}

function setupBudgetFormatter() {
const budgetInput = $("#fBudget");
if (!budgetInput) return;

budgetInput.addEventListener("input", () => {
  const before = budgetInput.value;
  const caret = budgetInput.selectionStart ?? before.length;
  const digitsBeforeCaret = before.slice(0, caret).replace(/\D/g, "").length;

  const formatted = formatIDRBudget(before);
  budgetInput.value = formatted;

  // Saat pengguna mengetik di ujung input (kasus paling umum), pertahankan
  // kursor di ujung agar koma desimal dan angka berikutnya dapat langsung diketik.
  if (caret >= before.length) {
    budgetInput.setSelectionRange(formatted.length, formatted.length);
    return;
  }

  // Untuk pengeditan di tengah angka, pertahankan posisi relatif berdasarkan
  // jumlah digit yang berada sebelum kursor.
  let digitCount = 0;
  let newCaret = 3; // setelah prefix "Rp "
  for (let i = 3; i < formatted.length; i += 1) {
    if (/\d/.test(formatted[i])) digitCount += 1;
    if (digitCount >= digitsBeforeCaret) {
      newCaret = i + 1;
      break;
    }
  }
  budgetInput.setSelectionRange(newCaret, newCaret);
});

budgetInput.addEventListener("blur", () => {
  if (budgetInput.value) budgetInput.value = formatIDRBudget(budgetInput.value);
});
}

/* =========================================================
   CONTACT FORM VALIDATION
========================================================= */
function initContactForm() {
  const form = $("#contactForm");
  const status = $("#formStatus");
  const submitBtn = $("#formSubmit");
  if (!form || !status || !submitBtn) return;

  function setError(id, message) {
    const input = $("#" + id);
    const row = input.closest(".form-row");
    const errorEl = document.querySelector(`[data-error="${id}"]`);
    row.classList.toggle("error", !!message);
    if (errorEl) errorEl.textContent = message || "";
  }


  function validate() {
      let valid = true;
      const nameEl=$("#fName"),emailEl=$("#fEmail"),typeEl=$("#fType"),messageEl=$("#fMessage");
      if(!nameEl||!emailEl||!typeEl||!messageEl)return false;
      const name = nameEl.value.trim();
      const email = emailEl.value.trim();
      const type = typeEl.value;
      const message = messageEl.value.trim();

      if (!name) { setError("fName", "Nama wajib diisi."); valid = false; } else setError("fName", "");
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRe.test(email)) { setError("fEmail", "Masukkan email yang valid."); valid = false; } else setError("fEmail", "");
      if (!type) { setError("fType", "Pilih jenis website."); valid = false; } else setError("fType", "");
      if (!message) { setError("fMessage", "Pesan wajib diisi."); valid = false; } else setError("fMessage", "");

      return valid;
    }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.textContent = "";
    status.className = "form-status";

    if (!validate()) {
      status.textContent = "Mohon periksa kembali data yang diisi.";
      status.classList.add("error");
      return;
    }

    submitBtn.classList.add("loading");
    submitBtn.disabled = true;

    // Form diteruskan langsung ke WhatsApp (belum ada backend/API server).
    const nameEl=$("#fName"),emailEl=$("#fEmail"),typeEl=$("#fType"),budgetEl=$("#fBudget"),messageEl=$("#fMessage");
    if(!nameEl||!emailEl||!typeEl||!budgetEl||!messageEl){status.textContent="Formulir tidak lengkap.";status.classList.add("error");submitBtn.disabled=false;submitBtn.classList.remove("loading");return;}
    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const type = typeEl.value;
    const budget = budgetEl.value.trim();
    const message = messageEl.value.trim();

    const waText = [
      "Halo Aji Wira, saya ingin konsultasi pembuatan website.",
      "",
      `Nama: ${name}`,
      `Email: ${email}`,
      `Jenis Website: ${type}`,
      budget ? `Budget: ${budget}` : null,
      `Pesan: ${message}`
    ].filter(Boolean).join("\n");

    const waUrl = buildWaLink(waText);

    submitBtn.classList.remove("loading");
    submitBtn.disabled = false;

    if (waUrl === "#") {
      status.textContent = "Nomor WhatsApp belum dikonfigurasi. Silakan coba lagi nanti.";
      status.classList.add("error");
      return;
    }

    // Dibuka langsung di dalam event submit (bukan di dalam setTimeout) agar
    // tidak diblokir popup blocker browser mobile.
    window.open(waUrl, "_blank", "noopener");

    status.textContent = "Terima kasih! Pesan Anda sedang diteruskan ke WhatsApp.";
    status.classList.add("success");
    form.reset();
  });
}

/* =========================================================
   EASTER EGG
========================================================= */
function initEasterEgg() {
  const marks = $$("#logoMark");
  let clicks = 0;
  marks.forEach(mark => {
    mark.addEventListener("click", (e) => {
      e.preventDefault();
      clicks++;
      if (clicks >= 5) {
        clicks = 0;
        const toast = $("#easterToast");
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 2600);
      }
    });
  });
}

/* =========================================================
   INIT
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const footerYear = $("#footerYear");
  if (footerYear) footerYear.textContent = new Date().getFullYear();

  hydrateStaticIcons();
  renderServices();
  renderPortfolio();
  renderPricing();
  setupBudgetFormatter();
  renderTestimonials();
  renderFaq();
  renderContactLinks();

  initPortfolioFilter();
  initScrollReveal();
  initCounters();
  initParallax();
  initParticles();
  initCustomCursor();
  initContactForm();
  initEasterEgg();

  onScroll();
});
