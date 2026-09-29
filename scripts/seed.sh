#!/usr/bin/env bash
set -e
echo "Running CATCHAM seed..."
pnpm prisma:seed
