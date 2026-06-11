#!/bin/sh

echo "==> EduBridge starting on port ${PORT:-3000}"

if [ -n "$DATABASE_URL" ]; then
  echo "==> Pushing database schema (bypasses failed migrations)..."
  ./node_modules/.bin/prisma db push --skip-generate --accept-data-loss 2>&1 || true
else
  echo "==> WARNING: DATABASE_URL not set"
fi

echo "==> Starting Next.js..."
exec ./node_modules/.bin/next start --hostname 0.0.0.0 --port "${PORT:-3000}"
