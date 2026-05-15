# Bun Nest Workspace

Turborepo workspace with a NestJS API in `apps/backend` and a Vite React app in
`apps/web`.

## Install

```bash
bun install
```

Copy environment values:

```bash
cp .env.example .env
cp apps/backend/config/config.yml.example apps/backend/config/config.yml
```

Backend configuration is loaded from `apps/backend/config/config.yml`. Environment
overrides use nested `__` keys, for example `DATABASE__URL`, `HOST__PORT`, or
`LOGGER__FORMAT`. Logger format supports `json` and `text`.

Start local infrastructure:

```bash
bun run db:up
```

Generate Prisma Client and run migrations:

```bash
bun run backend:prisma:generate
bun run backend:prisma:migrate
```

## Run

```bash
bun run backend:dev
```

The API starts at `http://localhost:4000/api`.

Run the Vite web app:

```bash
bun run web:dev
```

The web app starts at `http://localhost:5173` and proxies `/api` requests to the
Nest API.

## Build

```bash
bun run build
```

## Docker

```bash
docker build -f apps/backend/Dockerfile -t bun-nest-products-api .
docker run --rm -p 4000:4000 --env-file .env bun-nest-products-api
```

## Endpoints

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PATCH /api/products/:id`
- `DELETE /api/products/:id`
- `GET /api/orders`
- `GET /api/orders/:id`
- `POST /api/orders`
- `PATCH /api/orders/:id/cancel`

Example payload:

```json
{
  "name": "Keyboard",
  "description": "Mechanical keyboard",
  "price": 99,
  "stock": 10
}
```

Create order payload:

```json
{
  "items": [
    {
      "productId": "00000000-0000-0000-0000-000000000001",
      "quantity": 2
    }
  ]
}
```

## Module Layout

```text
apps/backend/src/modules/products
├── application/services
├── domain/dto
├── domain/entities
├── domain/interfaces
├── infrastructure/repositories
├── index.ts
├── product.controller.ts
└── product.module.ts
```

The HTTP controller calls `ProductService`, and `ProductService` depends on the
`ProductRepository` interface. Nest binds that interface to `ProductPrismaRepo`,
which uses `DatabaseService` from `apps/backend/src/modules/database`.

## Test

```bash
bun run test
```

Unit tests currently target application services only:

```bash
bun run backend:test
```

Coverage thresholds are set to 95% for statements, branches, functions, and
lines. Controller, schema, and repository integration tests will be added in a
separate integration test suite.
