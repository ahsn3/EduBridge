#!/bin/sh
# Run ONCE in Railway Console after first deploy:
#   sh scripts/railway-setup.sh

set -e
echo "==> Pushing schema to database..."
./node_modules/.bin/prisma db push --accept-data-loss
echo "==> Seeding database..."
node scripts/ensure-admins.cjs
./node_modules/.bin/tsx prisma/seed.ts
echo "==> Done! Login with student@edubridge.com / password123"
