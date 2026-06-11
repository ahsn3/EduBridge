#!/bin/sh
# Railway startup — NEVER run migrate deploy here (causes P3009 crash loop)

echo "==> EduBridge booting on port ${PORT:-3000}"

# Clear any failed migration record from previous deploy attempts
if [ -n "$DATABASE_URL" ]; then
  ./node_modules/.bin/prisma migrate resolve --rolled-back "20250611120000_init" 2>/dev/null || true
fi

exec ./node_modules/.bin/next start --hostname 0.0.0.0 --port "${PORT:-3000}"
