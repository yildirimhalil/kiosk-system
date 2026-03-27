<div align="center">

# Kiosk System

**Multi-branch restaurant & retail backend** — orders, menus, kitchen, and payments behind a single NestJS API with **JWT-scoped tenants**, **Prisma**, and **PostgreSQL**.

[![Node.js](https://img.shields.io/badge/node.js-22-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker_Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
[![CI](https://img.shields.io/badge/CI-GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)](.github/workflows/ci.yml)

</div>

---

## Table of contents

- [Why this project](#why-this-project)
- [Architecture](#architecture)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
  - [Docker (recommended)](#docker-recommended)
  - [Local development](#local-development)
- [Authentication](#authentication)
- [API reference](#api-reference)
- [Repository layout](#repository-layout)
- [Design intent & scope](#design-intent--scope)
- [Scripts](#scripts)
- [License](#license)

---

## Why this project

This codebase is built to read like **production-shaped backend work**: clear boundaries between branches (tenants), predictable HTTP semantics (`400` / `404` / `409`), and **transactional** payment handling with an optional **idempotency** hook — without pretending to integrate a real card network.

| | |
| :--- | :--- |
| **Multi-tenant by design** | Users and payments are scoped to a `branchId` carried in the JWT. |
| **Safety over demos** | Passwords hashed with bcrypt; duplicate logins rejected with **409**. |
| **Payments you can reason about** | Amount checks, status gates, double-payment prevention, atomic Prisma transactions. |
| **Ops-ready baseline** | Docker Compose for API + Postgres, Prisma migrations, GitHub Actions CI. |

---

## Architecture

```mermaid
flowchart LR
  subgraph Clients
    H[HTTP clients]
  end

  subgraph API["apps/api (NestJS)"]
    G[JwtAuthGuard]
    A[Auth]
    U[Users]
    P[Payments]
    O[Orders / Menu / Kitchen]
  end

  subgraph Data
    PR[(Prisma)]
    DB[(PostgreSQL)]
  end

  H --> G
  G --> A
  G --> U
  G --> P
  G --> O
  A --> PR
  U --> PR
  P --> PR
  O --> PR
  PR --> DB
```

---

## Tech stack

| Layer | Choice |
|--------|--------|
| Runtime | **Node.js 22** |
| Framework | **NestJS 11** |
| Data access | **Prisma 5** |
| Database | **PostgreSQL 16** |
| Packaging | **npm workspaces** monorepo |
| Local / demo infra | **Docker Compose** (API + Postgres) |

**Requirements:** Node.js 22 + npm, and either PostgreSQL locally **or** Docker only.

---

## Getting started

### Docker (recommended)

Credentials in `docker-compose.yml` are for **development** — change them before any real deployment.

```bash
cp .env.example .env
# If Postgres runs in Docker, set DATABASE_URL in .env to match docker-compose.yml.
docker compose up --build
```

| Service | URL / port |
|---------|------------|
| API | `http://localhost:3000` |
| PostgreSQL | `localhost:5432` — user `kiosk`, password `kiosk`, database `kiosk` |

### Local development

1. **Install** (from the repository root):

   ```bash
   npm install
   ```

2. **Environment**

   ```bash
   cp .env.example .env
   ```

   Point `DATABASE_URL` at your PostgreSQL instance.

3. **Migrations** — schema ships as a single **`init`** migration; apply after Postgres is up:

   ```bash
   npx prisma migrate deploy
   ```

   During schema work: `npx prisma migrate dev`.

4. **Run the API**

   ```bash
   cd apps/api && npm run start:dev
   ```

   `main.ts` loads `.env` from the **repository root** — keep `.env` there even when starting from `apps/api`.

---

## Authentication

- Most routes expect **`Authorization: Bearer <access_token>`**.
- **Public:** `GET /` (health), `POST /auth/login`.
- **Login body:** `branchCode` (matches branch `code`), `loginName`, `password` (≥ 6 characters).
- **`loginName`** is unique per branch; passwords stored with **bcrypt**.
- After migration, existing users may get a temporary password **`changeme`** — **replace in production**.

---

## API reference

### Users — `/users` (JWT required)

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| `GET` | `/users` | Same branch | List; optional `?branchId=` must match the token branch |
| `GET` | `/users/:id` | Same branch | Detail |
| `POST` | `/users` | **ADMIN** | Create; body: `name`, `loginName`, `password`, `role`, `isActive?` — duplicate `loginName` → **409** |
| `PUT` | `/users/:id` | **ADMIN** | Update `name`, `role`, `isActive`, `password?` |
| `DELETE` | `/users/:id` | **ADMIN** | Soft delete (`deletedAt`) |

### Payments — `POST /payments/:orderId/process` (JWT required)

There is **no** real PSP or card gateway here — the emphasis is **domain rules**, **consistency**, and **clear failure modes** (useful for portfolios and technical interviews).

| Rule | Behavior |
|------|----------|
| Branch isolation | Order must match JWT `branchId`; else **404** |
| Order status | Pay only when order is **CREATED**; else **400** |
| Amount | `amount` must equal order `totalAmount` (Decimal); else **400** |
| Double pay | Existing successful payment → **409** |
| Atomicity | Payment insert + order `PAID` + `paidAmount` in one **transaction** |
| Idempotency (optional) | `idempotencyKey` — same `reference` returns the **same** successful row |
| Beyond this repo | Webhooks, PSP signatures, `SERIALIZABLE` tuning — **out of scope** |

**Body:** `provider`, `amount`, optional `idempotencyKey`.

---

## Repository layout

| Path | Role |
|------|------|
| `apps/api` | NestJS application |
| `prisma` | Schema and SQL migrations |

---

## Design intent & scope

The goal is to demonstrate **mid-level backend signals**: multi-tenant data boundaries, JWT + branch scoping, user lifecycle with **409** on conflicts, payment flows with **transactions** and **optional idempotency**, plus **Docker** and **CI**. A live payment provider and full production operations are **intentionally** left as roadmap items — say so explicitly in interviews.

---

## Scripts

Run from the **repository root**:

| Command | Purpose |
|---------|---------|
| `npm run lint` | ESLint (matches CI; no auto-fix) |
| `npm run build` | Compile the API |
| `npm run test` | Jest |

---

## License

[MIT](LICENSE).
