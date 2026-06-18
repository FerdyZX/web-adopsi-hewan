@echo off

echo.
echo 🐾 Adopsi Hewan Modern - Setup Script
echo ======================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js tidak terinstall. Silakan install Node.js 16+ terlebih dahulu.
    exit /b 1
)

REM Get Node version
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% terdeteksi
echo.

REM Frontend setup
echo 📦 Setup Frontend...
cd frontend
call npm install
if not exist .env.local (
    copy .env.example .env.local
    echo ✅ .env.local created. Silakan isi dengan credentials Anda
) else (
    echo ⚠️  .env.local sudah ada
)
cd ..

REM Backend setup
echo.
echo 📦 Setup Backend...
cd backend
call npm install
if not exist .env (
    copy .env.example .env
    echo ✅ .env created. Silakan isi dengan credentials Anda
) else (
    echo ⚠️  .env sudah ada
)
cd ..

echo.
echo ✅ Setup selesai!
echo.
echo 🚀 Untuk menjalankan:
echo    Terminal 1 ^(Backend^): cd backend ^&^& npm run dev
echo    Terminal 2 ^(Frontend^): cd frontend ^&^& npm run dev
echo.
echo 🌐 Akses http://localhost:3000
echo.
pause
