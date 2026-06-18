#!/bin/bash

# Adopsi Hewan Modern - Setup Script

echo "🐾 Adopsi Hewan Modern - Setup Script"
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js tidak terinstall. Silakan install Node.js 16+ terlebih dahulu."
    exit 1
fi

echo "✅ Node.js $(node --version) terdeteksi"

# Frontend setup
echo ""
echo "📦 Setup Frontend..."
cd frontend
npm install

# Create .env.local
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "✅ .env.local created. Silakan isi dengan credentials Anda"
else
    echo "⚠️  .env.local sudah ada"
fi

cd ..

# Backend setup
echo ""
echo "📦 Setup Backend..."
cd backend
npm install

# Create .env
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ .env created. Silakan isi dengan credentials Anda"
else
    echo "⚠️  .env sudah ada"
fi

cd ..

echo ""
echo "✅ Setup selesai!"
echo ""
echo "🚀 Untuk menjalankan:"
echo "   Terminal 1 (Backend): cd backend && npm run dev"
echo "   Terminal 2 (Frontend): cd frontend && npm run dev"
echo ""
echo "🌐 Akses http://localhost:3000"
