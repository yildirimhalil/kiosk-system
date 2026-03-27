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

3. Veritabanı migrasyonları (şema tek **`init`** migrasyonunda; PostgreSQL ayağa kalkınca):

   ```bash
   npx prisma migrate deploy
   ```

   Geliştirme için şema değişikliği üretmek istersen: `npx prisma migrate dev`.

4. API’yi çalıştırma:

   ```bash
   cd apps/api && npm run start:dev
   ```

   `main.ts` kök dizindeki `.env` dosyasını okur; `apps/api` içinden çalıştırırken de `.env` kökte olmalıdır.

## Kimlik doğrulama (JWT)

- Çoğu HTTP rotası **Bearer JWT** ister; `Authorization: Bearer <access_token>`.
- **Açık rotalar:** `GET /` (health), `POST /auth/login`.
- Giriş gövdesi: `branchCode` (şubenin `code` alanı), `loginName`, `password` (min. 6 karakter).
- `User` kaydında `loginName` şube içinde benzersizdir; şifre `bcrypt` ile saklanır.
- Migrasyon sonrası mevcut kullanıcılar için geçici şifre **`changeme`** atanır (prod'da mutlaka değiştirin).

## Kullanıcılar (`/users`, JWT gerekli)

| Metot | Yol | Yetki | Açıklama |
|-------|-----|--------|----------|
| GET | `/users` | Aynı şube | Liste; `?branchId=` verilirse yalnızca token’daki şube ile aynı olmalı |
| GET | `/users/:id` | Aynı şube | Detay |
| POST | `/users` | **ADMIN** | Şube, token’daki `branchId`; gövde: `name`, `loginName`, `password`, `role`, `isActive?` — `loginName` çakışırsa **409** |
| PUT | `/users/:id` | **ADMIN** | `name`, `role`, `isActive`, `password?` |
| DELETE | `/users/:id` | **ADMIN** | Soft delete (`deletedAt`) |

## Ödeme (`POST /payments/:orderId/process`, JWT gerekli)

Gerçek **PSP / kart ağ geçidi yok**; domain ve API için **iş kuralları** ve **tutarlılık** öne çıkarılmıştır (portföy / mid sinyali).

| Kural | Açıklama |
|--------|----------|
| Şube izolasyonu | Sipariş yalnızca token’daki `branchId` ile eşleşir; aksi **404** |
| Durum | Ödeme yalnızca sipariş **CREATED** iken; aksi **400** |
| Tutar | `amount`, sipariş `totalAmount` ile **Decimal** birebir eşit olmalı; aksi **400** |
| Çift ödeme | Başarılı ödeme varsa **409** |
| Atomiklik | Ödeme kaydı + sipariş `PAID` + `paidAmount` tek **Prisma transaction** |
| Idempotency (opsiyonel) | `idempotencyKey`; aynı `reference` ile başarılı ödeme varsa **aynı kayıt** döner |
| Üretim | Webhook, imza, satır kilidi / SERIALIZABLE, harici PSP — bu repoda **kapsam dışı** |

**Gövde:** `provider`, `amount`, isteğe bağlı `idempotencyKey`.

## Repo yapısı

| Yol | Açıklama |
|-----|----------|
| `apps/api` | NestJS uygulaması |
| `prisma` | Şema ve migrasyonlar |

## Portföy notu (mid seviyesine yakın sinyaller)

Bu repoda özellikle şunlar bilinçli olarak vurgulanır: **çok kiracılı şema**, **JWT + şube sınırı**, **kullanıcı yönetimi + 409** (unique), **ödeme akışında iş kuralları + transaction + idempotency seçeneği**, **Docker + CI**. Gerçek ödeme sağlayıcısı ve üretim operasyonu **bilinçli olarak yok**; mülakatta “scope ve roadmap” olarak anlatılmalıdır.

## Komutlar (kök dizin)

| Komut | Açıklama |
|-------|----------|
| `npm run lint` | ESLint (CI ile aynı; düzeltme yapmaz) |
| `npm run build` | API derlemesi |
| `npm run test` | Jest testleri |

## Lisans

MIT — ayrıntılar için `LICENSE`.
