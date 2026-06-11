#!/bin/sh

echo "==> EduBridge starting..."
echo "==> PORT=${PORT:-3000}"

sync_database() {
  if [ -z "$DATABASE_URL" ]; then
    echo "==> WARNING: DATABASE_URL is not set — skipping database sync"
    return 0
  fi

  echo "==> Syncing database schema..."

  if ./node_modules/.bin/prisma migrate deploy; then
    echo "==> Migrations applied successfully"
    return 0
  fi

  echo "==> Migrate failed — resolving failed migration state..."
  ./node_modules/.bin/prisma migrate resolve --rolled-back "20250611120000_init" 2>/dev/null || true

  if ./node_modules/.bin/prisma migrate deploy; then
    echo "==> Migrations applied on retry"
    return 0
  fi

  echo "==> Falling back to prisma db push..."
  ./node_modules/.bin/prisma db push --skip-generate || echo "==> WARNING: database sync failed — server will start anyway"
}

sync_database

echo "==> Starting Next.js on 0.0.0.0:${PORT:-3000}..."
exec ./node_modules/.bin/next start --hostname 0.0.0.0 --port "${PORT:-3000}"
