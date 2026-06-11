#!/bin/sh

echo "==> EduBridge starting..."
echo "==> PORT=${PORT:-3000}"
echo "==> HOSTNAME=0.0.0.0"

if [ -n "$DATABASE_URL" ]; then
  echo "==> Running database migrations..."
  ./node_modules/.bin/prisma migrate deploy || echo "==> WARNING: migrations failed — starting server anyway"
else
  echo "==> WARNING: DATABASE_URL is not set — skipping migrations"
fi

echo "==> Starting Next.js..."
exec ./node_modules/.bin/next start --hostname 0.0.0.0 --port "${PORT:-3000}"
