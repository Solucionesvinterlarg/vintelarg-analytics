# ============================================================
# Dockerfile — Portal A-ware® (@aware/portal-app, apps/portal, Next.js 16 standalone)
# Monorepo pnpm: aunque el portal NO depende de @vintelarg/analytics, el install
# usa --frozen-lockfile y el lockfile 9.0 abarca todo el workspace, así que el
# package.json de packages/analytics debe estar presente para reconciliar.
# El BUILD solo compila el portal (analytics no se buildea: el portal define su
# schema local). Pensado para deploy en Dokploy (build por Dockerfile).
# Postgres (vintelarg_base + aware_analytics) y el IdP son externos:
# se configuran por variables de entorno.
# ============================================================

# ---------- Base con pnpm ----------
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
# libc6-compat: deps nativas (pg) lo necesitan en alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ---------- Dependencias (cacheable) ----------
FROM base AS deps
# Solo los manifests para aprovechar la cache de capas.
# packages/analytics/package.json es necesario para --frozen-lockfile aunque
# el portal no lo importe (el lockfile abarca todo el workspace).
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/analytics/package.json ./packages/analytics/
COPY apps/portal/package.json ./apps/portal/
RUN pnpm install --frozen-lockfile

# ---------- Build ----------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/analytics/node_modules ./packages/analytics/node_modules
COPY --from=deps /app/apps/portal/node_modules ./apps/portal/node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Solo se buildea el portal; analytics no se compila (el portal es standalone).
RUN pnpm --filter @aware/portal-app build

# ---------- Runner (imagen final liviana) ----------
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Usuario no-root por seguridad
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# El build standalone deja todo lo necesario en .next/standalone
# (incluye server.js y las deps mínimas del workspace).
COPY --from=builder --chown=nextjs:nodejs /app/apps/portal/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/portal/.next/static ./apps/portal/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/portal/public ./apps/portal/public

USER nextjs

EXPOSE 3002
ENV PORT=3002
ENV HOSTNAME=0.0.0.0

# server.js queda en la ruta del workspace dentro de standalone
CMD ["node", "apps/portal/server.js"]
