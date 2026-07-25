#!/bin/sh
# Railway startup — NEVER run migrate deploy here (causes P3009 crash loop)

echo "==> EduBridge booting on port ${PORT:-3000}"

if [ -z "$AUTH_SECRET" ] && [ -z "$NEXTAUTH_SECRET" ]; then
  if [ -n "$DATABASE_URL" ]; then
    export AUTH_SECRET="$(node -e "const c=require('crypto');process.stdout.write(c.createHash('sha256').update('edubridge-jwt-v1:'+process.env.DATABASE_URL).digest('base64'))")"
    echo "==> AUTH_SECRET derived from DATABASE_URL for edge middleware compatibility"
  else
    echo "==> WARNING: AUTH_SECRET not set and DATABASE_URL missing"
  fi
else
  echo "==> AUTH_SECRET is configured"
fi

export AUTH_TRUST_HOST="${AUTH_TRUST_HOST:-true}"

if [ -z "$AUTH_URL" ] && [ -z "$NEXTAUTH_URL" ] && [ -n "$RAILWAY_PUBLIC_DOMAIN" ]; then
  export AUTH_URL="https://${RAILWAY_PUBLIC_DOMAIN}"
  echo "==> AUTH_URL auto-set to ${AUTH_URL}"
fi

if [ -n "$DATABASE_URL" ]; then
  ./node_modules/.bin/prisma migrate resolve --rolled-back "20250611120000_init" 2>/dev/null || true

  echo "==> Syncing database schema..."
  if ./node_modules/.bin/prisma db push --accept-data-loss; then
    echo "==> Schema synced"
  else
    echo "==> WARNING: schema sync failed — check DATABASE_URL"
  fi

  echo "==> Creating admin accounts..."
  if node scripts/ensure-admins.cjs; then
    echo "==> Default accounts ready (ahmed@edubridge.com / Ahmed123)"
  else
    echo "==> WARNING: admin bootstrap failed"
  fi
else
  echo "==> WARNING: DATABASE_URL not set"
fi

exec ./node_modules/.bin/next start --hostname 0.0.0.0 --port "${PORT:-3000}"
