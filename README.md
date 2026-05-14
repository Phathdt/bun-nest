# Bun Nest Products API

Sample NestJS REST API using Bun, Zod 4 validation, and Vitest.

## Install

```bash
bun install
```

## Run

```bash
bun run dev
```

The API starts at `http://localhost:4000/api`.

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

## Test

```bash
bun run test
```
