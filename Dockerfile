FROM oven/bun:1.3.14 AS base
WORKDIR /app

FROM base AS deps
COPY package.json bun.lock tsconfig.json tsconfig.build.json prisma.config.ts ./
COPY prisma ./prisma
RUN bun install --frozen-lockfile

FROM deps AS build
COPY src ./src
ENV DATABASE_URL=postgresql://app:app@localhost:5432/bun_nest?schema=public
RUN bunx --bun prisma generate
RUN bun run build

FROM oven/bun:1.3.14-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY package.json bun.lock ./
RUN bun install --production --frozen-lockfile

COPY --from=build /app/dist ./dist

EXPOSE 4000
CMD ["bun", "run", "dist/src/main.js"]
