# Bun Nest Products API

Sample NestJS REST API using Bun, Zod 4 validation, Prisma 7, Postgres, Redis, and Vitest.

## Install

```bash
bun install
```

Copy environment values:

```bash
cp .env.example .env
```

Start local infrastructure:

```bash
bun run db:up
```

Generate Prisma Client and run migrations:

```bash
bun run prisma:generate
bun run prisma:migrate
```

## Run

```bash
bun run dev
```

The API starts at `http://localhost:4000/api`.

## Build

```bash
bun run build
```

## Docker

```bash
docker build -t bun-nest-products-api .
docker run --rm -p 4000:4000 --env-file .env bun-nest-products-api
```

## Endpoints

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PATCH /api/products/:id`
- `DELETE /api/products/:id`

Example payload:

```json
{
  "name": "Keyboard",
  "description": "Mechanical keyboard",
  "price": 99,
  "stock": 10
}
```

## Module Layout

```text
src/modules/products
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
which uses `DatabaseService` from `src/modules/database`.

## Test

```bash
bun run test
```

Unit tests currently target application services only:

```bash
bun run vitest --coverage
```

Coverage thresholds are set to 95% for statements, branches, functions, and
lines. Controller, schema, and repository integration tests will be added in a
separate integration test suite.
