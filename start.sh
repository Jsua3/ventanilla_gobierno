#!/usr/bin/env bash
set -e

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║         VentanillaGov — Setup Inicial        ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# Backend
echo "📦 Instalando dependencias del backend..."
cd backend
npm install

echo ""
echo "⚙️  Generando cliente Prisma..."
npx prisma generate

echo ""
echo "🗄️  Ejecutando migraciones..."
npx prisma migrate dev --name init

echo ""
echo "🌱 Ejecutando seed..."
npx ts-node prisma/seed.ts

cd ..

# Frontend
echo ""
echo "📦 Instalando dependencias del frontend..."
cd frontend
npm install
cd ..

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║           Setup completado ✅                ║"
echo "╠══════════════════════════════════════════════╣"
echo "║  Backend:  http://localhost:3001             ║"
echo "║  Frontend: http://localhost:5173             ║"
echo "╠══════════════════════════════════════════════╣"
echo "║  Credenciales:                               ║"
echo "║  Ciudadano:   222222222 / user123            ║"
echo "║  Funcionario: 111111111 / func123            ║"
echo "║  Admin:       000000000 / admin123           ║"
echo "╚══════════════════════════════════════════════╝"
echo ""
echo "Para levantar en desarrollo:"
echo "  Terminal 1: cd backend && npm run dev"
echo "  Terminal 2: cd frontend && npm run dev"
echo ""
