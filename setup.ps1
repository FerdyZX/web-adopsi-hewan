#!/usr/bin/env pwsh

# Adopsi Hewan Modern - PowerShell Setup Script

Write-Host "`n🐾 Adopsi Hewan Modern - PowerShell Setup" -ForegroundColor Green
Write-Host "=========================================`n" -ForegroundColor Green

# Check if Node.js is installed
$nodeVersion = node --version 2>$null

if ($null -eq $nodeVersion) {
    Write-Host "❌ Node.js tidak terinstall. Silakan install Node.js 16+ terlebih dahulu." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Node.js $nodeVersion terdeteksi`n" -ForegroundColor Green

# Frontend setup
Write-Host "📦 Setup Frontend..." -ForegroundColor Cyan
Push-Location frontend
npm install
if (-not (Test-Path ".env.local")) {
    Copy-Item ".env.example" ".env.local"
    Write-Host "✅ .env.local created. Silakan isi dengan credentials Anda" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env.local sudah ada" -ForegroundColor Yellow
}
Pop-Location

# Backend setup
Write-Host "`n📦 Setup Backend..." -ForegroundColor Cyan
Push-Location backend
npm install
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env created. Silakan isi dengan credentials Anda" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env sudah ada" -ForegroundColor Yellow
}
Pop-Location

Write-Host "`n✅ Setup selesai!" -ForegroundColor Green
Write-Host "`n🚀 Untuk menjalankan:" -ForegroundColor Green
Write-Host "   Terminal 1 (Backend): cd backend; npm run dev" -ForegroundColor Cyan
Write-Host "   Terminal 2 (Frontend): cd frontend; npm run dev" -ForegroundColor Cyan
Write-Host "`n🌐 Akses http://localhost:3000`n" -ForegroundColor Green
