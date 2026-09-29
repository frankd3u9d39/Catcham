#!/usr/bin/env bash
set -e

echo "Setting up CATCHAM development environment..."
cp -n .env.example .env || true
pnpm install
docker compose up -d postgres redis storage
echo "Waiting for PostgreSQL with PostGIS to initialize..."
sleep 5
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
echo "CATCHAM environment is ready."
