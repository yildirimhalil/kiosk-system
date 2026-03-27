#!/bin/sh
set -e
cd /app
npx prisma migrate deploy
exec node apps/api/dist/main.js
