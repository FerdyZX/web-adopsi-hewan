# 🐾 Adopsi Hewan Modern - Backend

API Backend untuk platform adopsi hewan menggunakan Express.js dan Supabase.

## 🚀 Teknologi

- **Node.js** dengan Express.js
- **Supabase** untuk database & auth
- **JWT** untuk authentication
- **Nodemailer** untuk email
- **Multer** untuk upload file
- **CORS** untuk cross-origin requests
- **Helmet** untuk security headers
- **Rate Limiting** untuk protection

## 🏗️ Struktur Proyek

```
backend/
├── src/
│   ├── routes/          # API routes
│   ├── controllers/      # Route handlers
│   ├── middleware/       # Express middleware
│   ├── utils/           # Utility functions
│   ├── db/              # Database config
│   └── server.js        # Main server
├── .env.example
├── .gitignore
└── package.json
```

## 🛠️ Instalasi

### Prerequisites
- Node.js 16+
- npm/yarn
- Akun Supabase dengan credentials

### Setup

```bash
cd backend
npm install
```

### Konfigurasi Environment

Copy `.env.example` ke `.env`:

```bash
PORT=5000
NODE_ENV=development

SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key

JWT_SECRET=your_jwt_secret
JWT_EXPIRY=7d

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@adopsihewan.com

GOOGLE_MAPS_API_KEY=your_google_maps_api_key
FRONTEND_URL=http://localhost:3000
```

## 🚀 Menjalankan Server

```bash
# Development dengan auto-reload
npm run dev

# Production
npm start
```

Server akan berjalan di `http://localhost:5000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/reset-password` - Reset password

### Animals
- `GET /api/hewan` - Dapatkan semua hewan (dengan filter & search)
- `GET /api/hewan/:id` - Dapatkan detail hewan
- `POST /api/hewan` - Tambah hewan (admin)
- `PUT /api/hewan/:id` - Update hewan (admin)
- `DELETE /api/hewan/:id` - Hapus hewan (admin)

### Adoptions
- `GET /api/adopsi` - Dapatkan semua pengajuan adopsi
- `POST /api/adopsi` - Ajukan adopsi
- `PATCH /api/adopsi/:id/status` - Update status adopsi

### Shelters
- `GET /api/shelter` - Dapatkan semua shelter
- `GET /api/shelter/:id` - Dapatkan detail shelter
- `POST /api/shelter` - Tambah shelter
- `PUT /api/shelter/:id` - Update shelter
- `DELETE /api/shelter/:id` - Hapus shelter

### Articles
- `GET /api/artikel` - Dapatkan semua artikel
- `GET /api/artikel/:id` - Dapatkan detail artikel
- `POST /api/artikel` - Tambah artikel
- `PUT /api/artikel/:id` - Update artikel
- `DELETE /api/artikel/:id` - Hapus artikel

## 🔐 Authentication

Menggunakan JWT token di header:
```
Authorization: Bearer <token>
```

## 📝 Request/Response Format

### Sukses Response
```json
{
  "message": "Success message",
  "data": { ... }
}
```

### Error Response
```json
{
  "message": "Error message",
  "status": 400
}
```

## 🛡️ Security Features

- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Rate limiting
- ✅ JWT authentication
- ✅ Input validation
- ✅ Error handling
- ✅ Row Level Security (Supabase)

## 📧 Email Configuration

Untuk send email via Nodemailer:

### Gmail
1. Enable 2FA di Gmail
2. Generate app password
3. Set di environment variable `SMTP_PASS`

### SendGrid / Mailgun
Update SMTP config di controller

## 🗄️ Database

Database struktur di Supabase PostgreSQL. Lihat `DATABASE_SCHEMA.md` untuk skema lengkap.

### Tabel Utama
- users - Pengguna
- animals - Data hewan
- shelters - Shelter
- adoptions - Pengajuan adopsi
- articles - Artikel edukasi
- notifications - Notifikasi
- chat_messages - Chat

## 🚀 Deployment

### Heroku
```bash
heroku create your-app-name
git push heroku main
```

### Railway / Render
1. Connect GitHub repository
2. Set environment variables
3. Deploy

### Docker
```bash
docker build -t adopsi-hewan-backend .
docker run -p 5000:5000 adopsi-hewan-backend
```

## 🐛 Debugging

Enable debug mode:
```bash
DEBUG=* npm run dev
```

## 📚 Dokumentasi Lebih Lanjut

- [Express.js Docs](https://expressjs.com/)
- [Supabase Docs](https://supabase.com/docs)
- [JWT Docs](https://jwt.io/)
- [Nodemailer Docs](https://nodemailer.com/)

## 📝 Lisensi

MIT License
