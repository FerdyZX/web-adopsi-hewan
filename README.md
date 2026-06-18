# Main Project README

# 🐾 Adopsi Hewan Modern - Platform Adopsi Hewan Fullstack

> Platform adopsi hewan yang menghubungkan shelter, komunitas pecinta hewan, dan individu yang ingin mengadopsi.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node.js-16+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18.2+-blue.svg)](https://react.dev/)

## 📸 Fitur Utama

### 🌙 Dark Mode & Light Mode
- Toggle tema dengan animasi smooth
- Tersimpan di LocalStorage
- Mengikuti preferensi sistem

### 🔐 Sistem Autentikasi
- Login & Register dengan email
- Reset password
- Role-based access control
- Supabase Authentication

### 🐕 Daftar Hewan
- Filter: kategori, umur, jenis kelamin, lokasi, status kesehatan
- Sorting: terbaru, terlama, paling dilihat
- Search global realtime
- Galeri foto dan video

### 💔 Sistem Adopsi
- Form pengajuan adopsi lengkap
- Status tracking
- Notifikasi email
- Dashboard tracking

### 📖 Artikel Edukasi
- Tips perawatan hewan
- Kesehatan hewan
- Konservasi & hewan langka
- Sistem komentar & like

### 🗺️ Shelter System
- Integrasi Google Maps
- Lokasi shelter & navigasi
- Informasi operasional
- Kontak langsung

### 💬 Live Chat
- Chat realtime dengan shelter
- Notifikasi real-time
- Supabase Realtime

### 📱 PWA Support
- Install ke HP
- Offline mode
- Push notification
- Progressive Web App

## 🛠️ Tech Stack

### Frontend
- **React.js 18.2+** dengan Vite
- **Tailwind CSS** untuk styling
- **Framer Motion** untuk animasi
- **React Router** untuk navigasi
- **Zustand** untuk state management
- **i18next** untuk multi-bahasa

### Backend
- **Node.js** dengan Express.js
- **Supabase** untuk database & auth
- **JWT** untuk authentication
- **Nodemailer** untuk email
- **Socket.io** untuk realtime (optional)

### Database
- **PostgreSQL** via Supabase
- **Row Level Security**
- **Realtime subscriptions**
- **File storage** untuk foto/video

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm/yarn
- Akun Supabase
- Google Maps API key (optional)

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/adopsi-hewan.git
cd adopsi-hewan

# Frontend setup
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local dengan credentials
npm run dev

# Backend setup (di terminal baru)
cd backend
npm install
cp .env.example .env
# Edit .env dengan credentials
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`
Backend akan berjalan di `http://localhost:5000`

## 📁 Struktur Folder

```
adopsi-hewan/
├── frontend/                # React + Vite
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── context/        # Context API
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Utility functions
│   │   ├── styles/         # CSS global
│   │   ├── i18n/           # Translations
│   │   └── App.jsx
│   ├── public/             # Static files
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                # Express.js
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── db/            # Database config
│   │   ├── utils/         # Utilities
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── DATABASE_SCHEMA.md      # Database documentation
├── SETUP_GUIDE.md         # Setup instructions
└── README.md              # This file
```

## 📚 Dokumentasi

- [Frontend README](./frontend/README.md) - Detail frontend
- [Backend README](./backend/README.md) - Detail backend
- [Database Schema](./DATABASE_SCHEMA.md) - Schema lengkap
- [Setup Guide](./SETUP_GUIDE.md) - Panduan setup

## 🎯 Roadmap

### Phase 1 ✅ (Completed)
- [x] Struktur project
- [x] Frontend & Backend setup
- [x] Dark/Light mode
- [x] Authentication system
- [x] Landing page

### Phase 2 🚧 (In Progress)
- [ ] Animal listing & detail
- [ ] Adoption system
- [ ] Dashboard user
- [ ] Shelter system with maps
- [ ] Admin dashboard

### Phase 3 📋 (Planned)
- [ ] Live chat
- [ ] Article system
- [ ] Reviews & ratings
- [ ] Analytics
- [ ] Email notifications
- [ ] Push notifications

### Phase 4 🔮 (Future)
- [ ] AI recommendations
- [ ] Mobile app (React Native)
- [ ] Advanced search
- [ ] Reporting system
- [ ] Payment integration

## 🔐 Security

- ✅ Row Level Security (Supabase)
- ✅ JWT authentication
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Rate limiting
- ✅ Input validation
- ✅ Password hashing (bcrypt)

## 🌐 Deployment

### Frontend
```bash
npm run build
# Deploy ke Vercel, Netlify, atau server static
```

### Backend
```bash
# Deploy ke Heroku, Railway, Render, atau VPS
npm start
```

## 📊 Performance

- ⚡ Code splitting
- 🖼️ Image optimization
- 🗜️ CSS minification
- 📦 Bundle size < 500KB
- ⏱️ LCP < 2.5s
- 📱 Mobile optimized

## 🤝 Contributing

Kami welcome kontribusi! Lihat [CONTRIBUTING.md](CONTRIBUTING.md) untuk guidelines.

## 📝 License

MIT License - lihat [LICENSE](LICENSE) untuk details

## 👥 Authors

- **Your Name** - [GitHub](https://github.com)
- **Contributors** - [See Contributors](CONTRIBUTORS.md)

## 💬 Support

- 📧 Email: support@adopsihewan.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/adopsi-hewan/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/adopsi-hewan/discussions)

## 🙏 Acknowledgements

- Supabase untuk infrastructure
- Tailwind CSS untuk styling
- Framer Motion untuk animasi
- React Router untuk routing
- Semua contributors & users

---

**Made with ❤️ for animals lovers**

Star ⭐ project ini jika helpful!
