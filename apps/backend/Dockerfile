FROM oven/bun:1.3.14-alpine AS base
WORKDIR /repo

FROM base AS deps
COPY package.json bun.lock turbo.json ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY apps/e2e/package.json ./apps/e2e/package.json
COPY apps/web/package.json ./apps/web/package.json
RUN bun install --frozen-lockfile

FROM deps AS build
COPY apps/backend ./apps/backend
WORKDIR /repo/apps/backend
ENV DATABASE_URL=postgresql://app:app@localhost:5432/bun_nest?schema=public
RUN bunx --bun prisma generate
RUN bun run build

FROM oven/bun:1.3.14-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY package.json bun.lock turbo.json ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY apps/e2e/package.json ./apps/e2e/package.json
COPY apps/web/package.json ./apps/web/package.json
RUN bun install --production --frozen-lockfile --filter @bun-nest/backend --omit peer \
  && rm -rf /root/.bun/install/cache

COPY --from=build /repo/apps/backend/config ./apps/backend/config
COPY --from=build /repo/dist/backend ./dist/backend

WORKDIR /app/apps/backend

EXPOSE 4000
CMD ["bun", "run", "start:prod"]
