#!/bin/sh
set -e

echo "==> EduBridge starting..."
echo "==> PORT=${PORT:-3000}"

echo "==> Running database migrations..."
./node_modules/.bin/prisma migrate deploy

echo "==> Starting Next.js server..."
exec ./node_modules/.bin/next start --hostname 0.0.0.0 --port "${PORT:-3000}"
