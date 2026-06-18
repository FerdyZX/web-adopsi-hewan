# 🐾 PowerShell Guide - Adopsi Hewan Modern

## ⚠️ Masalah yang Ditemukan

PowerShell memiliki syntax berbeda dari Bash/CMD. Berikut solusinya:

### ❌ SALAH (Tidak bekerja di PowerShell)
```powershell
cd backend && npm run dev
cd "c:\web adopsi Hewan"
setup.bat
```

### ✅ BENAR (PowerShell Syntax)
```powershell
cd backend; npm run dev
cd "c:\web adopsi Hewan"
.\setup.ps1
```

---

## 🚀 Quick Setup - PowerShell

### Opsi 1: Gunakan PowerShell Setup Script (RECOMMENDED)
```powershell
cd "c:\web adopsi Hewan"
.\setup.ps1
```

### Opsi 2: Manual Setup (Step by Step)

#### 1. Frontend Setup
```powershell
cd "c:\web adopsi Hewan\frontend"
npm install
Copy-Item ".env.example" ".env.local"
```

#### 2. Backend Setup
```powershell
cd "c:\web adopsi Hewan\backend"
npm install
Copy-Item ".env.example" ".env"
```

#### 3. Edit Environment Files
```powershell
# Frontend
notepad "c:\web adopsi Hewan\frontend\.env.local"

# Backend
notepad "c:\web adopsi Hewan\backend\.env"
```

---

## 🛠️ PowerShell Commands

### Navigasi
```powershell
# Masuk folder
cd "path\with spaces"
Push-Location "path"  # Better untuk navigation kompleks

# Keluar folder
Pop-Location          # Setelah Push-Location
cd ..

# List folder
ls
Get-ChildItem
```

### File Operations
```powershell
# Copy file
Copy-Item "source" "destination"

# Create folder
New-Item -ItemType Directory -Name "folder"

# Delete
Remove-Item "path"
```

### NPM Commands
```powershell
# Install dependencies
npm install

# Start dev server
npm run dev

# Build production
npm run build
```

---

## 🚀 Menjalankan Development

### Terminal 1 - Backend
```powershell
cd "c:\web adopsi Hewan\backend"
npm run dev
```

### Terminal 2 - Frontend
```powershell
cd "c:\web adopsi Hewan\frontend"
npm run dev
```

### Terminal 3 - (Optional) Run Commands
```powershell
cd "c:\web adopsi Hewan"
# Git commands, dll
```

---

## 📋 Complete Setup Steps untuk Windows PowerShell

```powershell
# 1. Navigate ke project
cd "c:\web adopsi Hewan"

# 2. Setup Frontend
Push-Location frontend
npm install
Copy-Item ".env.example" ".env.local"
Pop-Location

# 3. Setup Backend
Push-Location backend
npm install
Copy-Item ".env.example" ".env"
Pop-Location

# 4. Edit .env.local (frontend)
notepad "frontend\.env.local"
# Isi dengan:
# VITE_SUPABASE_URL=your_url
# VITE_SUPABASE_ANON_KEY=your_key
# VITE_API_URL=http://localhost:5000

# 5. Edit .env (backend)
notepad "backend\.env"
# Isi dengan credentials Supabase, email, dll

# 6. Start Backend (Terminal 1)
Push-Location backend
npm run dev
Pop-Location

# 7. Start Frontend (Terminal 2)
Push-Location frontend
npm run dev
Pop-Location

# 8. Buka browser
Start-Process "http://localhost:3000"
```

---

## 🔧 PowerShell Aliases yang Berguna

```powershell
# Membuat alias permanent (opsional)
# Tambah ke PowerShell profile

# Quick navigate
function cdBack { cd "c:\web adopsi Hewan" }
function cdFront { cd "c:\web adopsi Hewan\frontend" }
function cdBack { cd "c:\web adopsi Hewan\backend" }

# Quick commands
function npmDev { npm run dev }
function npmBuild { npm run build }
```

---

## 🆘 Troubleshooting

### Issue: "PowerShell cannot be loaded because running scripts is disabled"

**Solution:**
```powershell
# Run PowerShell sebagai Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Sekarang Anda bisa run scripts
.\setup.ps1
```

### Issue: ".ps1 is not digitally signed"

**Solution:**
```powershell
# Set execution policy untuk User scope
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Atau bypass untuk satu kali
powershell -ExecutionPolicy Bypass -File "setup.ps1"
```

### Issue: Folder tidak ditemukan

**Solution:**
```powershell
# Pastikan pakai quotes untuk folder dengan spaces
cd "c:\web adopsi Hewan"     # ✅ BENAR
cd c:\web adopsi Hewan       # ❌ SALAH - PowerShell pikir 3 argumen
```

### Issue: npm command not found

**Solution:**
```powershell
# Cek apakah Node.js terinstall
node --version
npm --version

# Jika tidak ada, install Node.js dari nodejs.org
# Setelah install, restart PowerShell
```

---

## 💡 Tips PowerShell

### 1. Gunakan Push-Location/Pop-Location untuk Navigation
```powershell
# Bad - tidak kembali ke folder awal
cd frontend
npm install
cd ..

# Good - kembali automatic
Push-Location frontend
npm install
Pop-Location
```

### 2. Gunakan Tab Completion
```powershell
# Type CD lalu tab untuk auto-complete
cd "c:\web" [TAB]  # Auto-complete ke "c:\web adopsi Hewan"
```

### 3. History Command
```powershell
# Lihat command history
Get-History

# Jalankan ulang command
# Press arrow-up atau Ctrl+P
```

### 4. Clear Screen
```powershell
Clear-Host
cls
```

---

## 📚 Useful PowerShell Resources

- [PowerShell Documentation](https://docs.microsoft.com/en-us/powershell/)
- [PowerShell Getting Started](https://docs.microsoft.com/en-us/powershell/scripting/getting-started)
- [PowerShell Cmdlets](https://docs.microsoft.com/en-us/powershell/scripting/developer/cmdlet)

---

## ✅ Checklist

Sebelum mulai development:

- [ ] Install Node.js 18+ (verify dengan `node --version`)
- [ ] Verify npm (`npm --version`)
- [ ] Create Supabase project
- [ ] Get Supabase URL & Keys
- [ ] Copy setup.ps1 ke project root (sudah included)
- [ ] Run `.\setup.ps1` (atau manual setup)
- [ ] Edit .env files dengan credentials
- [ ] Run `npm run dev` di backend terminal
- [ ] Run `npm run dev` di frontend terminal
- [ ] Open http://localhost:3000

---

**Happy Coding! 🚀**

Last Updated: 2024
