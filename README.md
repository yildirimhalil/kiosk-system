# Kiosk System

Çok şubeli işletmeler için **sipariş, menü, mutfak ve ödeme** akışlarını destekleyen bir backend API. NestJS + Prisma + PostgreSQL kullanır.

## Stack

- **Runtime:** Node.js 22
- **API:** NestJS 11
- **ORM:** Prisma 5
- **Veritabanı:** PostgreSQL 16
- **Konteyner:** Docker Compose (API + Postgres)

## Gereksinimler

- Node.js 22 ve npm
- PostgreSQL (yerel geliştirme için) **veya** yalnızca Docker

## Hızlı başlangıç (Docker)

`docker-compose.yml` içindeki kullanıcı/şifre/veritabanı adları **yalnızca geliştirme** içindir; üretimde değiştirin.

```bash
cp .env.example .env
# Docker ile Postgres kullanıyorsanız .env içindeki DATABASE_URL'i docker-compose.yml ile uyumlu yapın.
docker compose up --build
```

API: `http://localhost:3000`  
PostgreSQL: `localhost:5432` (kullanıcı `kiosk`, şifre `kiosk`, veritabanı `kiosk`)

## Yerel geliştirme

1. Bağımlılıklar (monorepo kökünden):

   ```bash
   npm install
   ```

2. Ortam değişkenleri:

   ```bash
   cp .env.example .env
   ```

   `DATABASE_URL` değerini kendi PostgreSQL örneğinize göre düzenleyin.

3. Veritabanı migrasyonları:

   ```bash
   npx prisma migrate dev
   ```

4. API’yi çalıştırma:

   ```bash
   cd apps/api && npm run start:dev
   ```

   `main.ts` kök dizindeki `.env` dosyasını okur; `apps/api` içinden çalıştırırken de `.env` kökte olmalıdır.

## Repo yapısı

| Yol | Açıklama |
|-----|----------|
| `apps/api` | NestJS uygulaması |
| `prisma` | Şema ve migrasyonlar |

## Komutlar (kök dizin)

| Komut | Açıklama |
|-------|----------|
| `npm run lint` | ESLint (CI ile aynı; düzeltme yapmaz) |
| `npm run build` | API derlemesi |
| `npm run test` | Jest testleri |

## Lisans

MIT — ayrıntılar için `LICENSE`.
