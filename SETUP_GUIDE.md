# Project Setup Guide - Adopsi Hewan Modern

## 📋 Daftar Checklist

### 1. Persiapan Awal
- [ ] Clone/download project
- [ ] Install Node.js 16+ & npm
- [ ] Buat akun Supabase
- [ ] Buat akun Google Cloud untuk Maps API

### 2. Frontend Setup
- [ ] `cd frontend`
- [ ] `npm install`
- [ ] Copy `.env.example` → `.env.local`
- [ ] Fill Supabase credentials
- [ ] `npm run dev`

### 3. Backend Setup
- [ ] `cd backend`
- [ ] `npm install`
- [ ] Copy `.env.example` → `.env`
- [ ] Fill Supabase & email config
- [ ] `npm run dev`

### 4. Supabase Configuration
- [ ] Setup PostgreSQL database
- [ ] Run SQL dari `DATABASE_SCHEMA.md`
- [ ] Setup Storage buckets
- [ ] Enable RLS policies
- [ ] Setup Authentication

### 5. Testing
- [ ] Register user baru
- [ ] Login
- [ ] Lihat daftar hewan
- [ ] Test dark mode

## 🔗 Integrasi Services

### Supabase
1. Buat project baru di supabase.com
2. Copy URL & Anon Key
3. Paste di environment variables

### Google Maps
1. Buka Google Cloud Console
2. Enable Maps & Places API
3. Buat API key
4. Paste di environment variables

### Email (Gmail)
1. Enable 2FA di Gmail
2. Generate app password
3. Gunakan sebagai SMTP_PASS

## 🚀 Quick Start

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

Buka http://localhost:3000

## 📱 Fitur yang Sudah Ready

✅ Dark/Light mode
✅ Authentication (login/register)
✅ Landing page dengan hero section
✅ Navbar responsive dengan mobile menu
✅ Footer
✅ Multi-bahasa (i18n)
✅ Protected routes
✅ PWA support

## 🚧 Fitur yang Perlu Dikembangkan

- [ ] Animal listing page dengan filters
- [ ] Animal detail page
- [ ] Shelter system dengan maps
- [ ] Adoption form & status tracking
- [ ] Dashboard (user & admin)
- [ ] Favorites system
- [ ] Live chat realtime
- [ ] Article system
- [ ] Reviews & ratings
- [ ] Analytics dashboard

## 📞 Support

- 📧 Email: support@adopsihewan.com
- 🐱 GitHub: (link repository)
- 💬 Discord: (link community)

---

**Selamat coding! 🚀**
