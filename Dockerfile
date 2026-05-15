FROM oven/bun:1.3.14 AS base
WORKDIR /repo

FROM base AS deps
COPY package.json bun.lock turbo.json ./
COPY apps/backend/package.json ./apps/backend/package.json
RUN bun install --frozen-lockfile

FROM deps AS build
COPY apps/backend ./apps/backend
WORKDIR /repo/apps/backend
ENV DATABASE_URL=postgresql://app:app@localhost:5432/bun_nest?schema=public
RUN bunx --bun prisma generate
RUN bun run build

FROM oven/bun:1.3.14-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY package.json bun.lock ./
COPY apps/backend/package.json ./apps/backend/package.json
RUN bun install --production --frozen-lockfile

COPY --from=build /repo/apps/backend/config ./apps/backend/config
COPY --from=build /repo/dist/backend ./dist/backend

WORKDIR /app/apps/backend

EXPOSE 4000
CMD ["bun", "run", "../../dist/backend/src/main.js"]
