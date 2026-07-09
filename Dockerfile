# WorldCupIQ AI — production container
# Multi-stage build for a Cloud Run–friendly image.

FROM oven/bun:1 AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM oven/bun:1 AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

FROM oven/bun:1-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
COPY --from=build /app/.output ./.output
COPY --from=build /app/package.json ./package.json
EXPOSE 8080
CMD ["bun", "run", ".output/server/index.mjs"]