# 🐾 Adopsi Hewan Modern - Frontend

Platform adopsi hewan fullstack modern dengan fitur lengkap untuk menghubungkan shelter, komunitas pecinta hewan, dan individu yang ingin mengadopsi.

## 🚀 Teknologi

- **React.js** 18.2+ dengan Vite
- **Tailwind CSS** untuk styling responsive
- **React Router** untuk navigasi
- **Framer Motion** untuk animasi smooth
- **Supabase** untuk backend dan database
- **i18n** untuk multi-bahasa (Indonesia & English)
- **PWA** untuk instalasi ke HP

## ✨ Fitur Utama

### Dark Mode & Light Mode
- Toggle tema dengan satu klik
- Tersimpan di LocalStorage
- Animasi transisi smooth
- Tailwind dark mode

### Landing Page
- Hero section dengan call-to-action
- Statistik realtime
- Kategori hewan yang mudah diakses
- Search global

### Sistem Autentikasi
- Login & Register dengan email
- Reset password
- Role-based access (User, Admin Shelter, Super Admin)
- Supabase Authentication

### Halaman Daftar Hewan
- Filter: kategori, umur, jenis kelamin, lokasi, status kesehatan
- Sorting: terbaru, terlama, paling dilihat, paling difavoritkan
- Search realtime

### Halaman Detail Hewan
- Galeri foto dengan multiple images
- Video hewan
- Informasi lengkap: ras, umur, berat, kondisi kesehatan, vaksin
- Tombol: Ajukan Adopsi, Favorit, Share, WhatsApp

### Dashboard User
- Profil personal
- Riwayat adopsi
- Daftar favorit
- Status pengajuan adopsi
- Notifikasi

### Dashboard Admin Shelter
- CRUD hewan, kategori, artikel
- Upload foto & video
- Kelola pengajuan adopsi
- Kelola pengguna shelter

### Dashboard Super Admin
- Manajemen semua shelter
- Verifikasi shelter
- Statistik platform
- Moderasi konten

## 📋 Fitur Tambahan

- 🎯 **Sistem Favorit** - Simpan hewan favorit
- 🏠 **Sistem Adopsi** - Form lengkap dengan status tracking
- 📖 **Artikel Edukasi** - Tips perawatan, kesehatan, konservasi
- 🗺️ **Google Maps** - Lokasi shelter & navigasi
- 💬 **Live Chat** - Chat realtime dengan shelter
- 🤖 **AI Rekomendasi** - Sistem rekomendasi hewan
- 🌍 **Multi Bahasa** - Indonesia & English
- 📧 **Email Notifikasi** - Notifikasi untuk event penting
- 🔔 **Realtime Notification** - Notifikasi real-time Supabase
- ⭐ **Review & Rating** - Rating 1-5 bintang
- 📱 **PWA** - Install ke HP & offline mode
- 📊 **Analytics** - Dashboard statistik

## 🛠️ Instalasi

### Prerequisites
- Node.js 16+ dan npm/yarn
- Akun Supabase
- API key Google Maps (opsional)

### Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

### Konfigurasi Environment

Copy `.env.example` ke `.env.local`:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## 📁 Struktur Folder

```
frontend/
├── src/
│   ├── components/       # Component React
│   ├── pages/           # Halaman
│   ├── context/         # Context API (Theme, Auth)
│   ├── hooks/           # Custom hooks
│   ├── utils/           # Utility functions
│   ├── styles/          # CSS global
│   ├── i18n/            # i18n config & translations
│   ├── App.jsx          # Root component
│   └── main.jsx         # Entry point
├── public/              # Static files, PWA manifest, service worker
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## 🎨 Desain

- **Glassmorphism** - Card & navbar dengan efek glass
- **Soft Shadow** - Shadow halus untuk depth
- **Rounded XL** - Corner radius besar
- **Gradient** - Gradient modern di hero
- **Skeleton Loading** - Loading state yang smooth
- **Framer Motion** - Animasi smooth di seluruh app
- **Floating Navbar** - Navbar sticky dengan animasi

## 📱 Responsive Design

- Mobile First approach
- Breakpoints: sm(640px), md(768px), lg(1024px), xl(1280px)
- Bottom navigation untuk mobile
- Responsive grid & layout

## 🌐 Optimasi SEO

- Meta tags & Open Graph
- Sitemap.xml
- Robots.txt
- Structured Data JSON-LD
- Mobile optimized

## 📦 Build & Deploy

```bash
# Build untuk production
npm run build

# Preview build
npm run preview

# Deploy ke vercel/netlify
# Pastikan build folder sudah dihasilkan
```

## 📚 Dokumentasi Lebih Lanjut

- [React Router Docs](https://reactrouter.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Supabase Docs](https://supabase.com/docs)
- [i18next Docs](https://www.i18next.com/)

## 📝 Lisensi

MIT License
