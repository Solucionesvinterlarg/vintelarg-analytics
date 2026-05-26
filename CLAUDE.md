# vintelarg-Analytics — Portal A-ware®

Monorepo (pnpm) del **Portal A-ware®**: una sola app Next.js 16 con composición
dinámica de módulos por rol. Auth contra el IdP de `vintelarg-auth` vía OIDC
(igual patrón que `vintelarg-crm`). Las pantallas usan **datos mock** hasta
validar las tablas de reportes; auth es real.

## Estructura

```
vintelarg-Analytics/
├── pnpm-workspace.yaml        → packages/* + apps/*
├── apps/portal/               → la app (Next 16, puerto 3002)
│   ├── src/app/
│   │   ├── layout.tsx         → fonts (next/font local) + ThemeProvider + TooltipProvider
│   │   ├── globals.css        → tokens A-ware mapeados a shadcn (light/dark) + primitivos
│   │   ├── page.tsx           → raíz: redirige al landing según rol
│   │   ├── auth-error/
│   │   ├── api/auth/{login,callback,logout}/  → flujo OIDC (Authorization Code + PKCE)
│   │   ├── (desktop)/         → shell desktop (sidebar + topbar) — roles internos
│   │   │   ├── layout.tsx     → sidebar dinámico por rol
│   │   │   ├── dashboard/     → P04/P05/P06 (Dashboard 360° por rol)
│   │   │   ├── atencion/      → P07 (tickets)
│   │   │   └── admin/         → P08 panel · admin/modulos P10 · admin/permisos P11
│   │   └── (mobile)/          → shell mobile (bottom tabs) — red comercial externa
│   │       ├── layout.tsx     → tabs dinámicos por rol + bottom sheet "Más"
│   │       ├── home/          → P01 emprendedora / P02 LCI (según rol)
│   │       └── mas/           → P03 (menú "Más")
│   ├── src/proxy.ts           → Next 16 middleware (renombrado a proxy): protege rutas
│   ├── src/lib/
│   │   ├── auth.ts            → cliente OIDC (jose + fetch, server-only)
│   │   ├── session-token.ts   → JWT de sesión propio (HS256), cookie `portal_session`
│   │   ├── session.ts         → getCurrentUser() server-only
│   │   ├── portal-config.ts   → role→shell→landing + nav (sidebar/tabs) por rol
│   │   └── shell-store.ts     → zustand: sidebar colapsado + bottom sheet
│   ├── src/components/
│   │   ├── portal/            → KpiCard, Sparkline, PortalBadge, Toggle, CampaignPill,
│   │   │                        SectionEyebrow, AwareMark, LucideIcon, MoreSheetContent
│   │   ├── shells/            → desktop-sidebar/topbar, mobile-topbar/bottom-nav, mobile-shell
│   │   └── ui/                → shadcn (base-nova / @base-ui/react)
│   └── scripts/register-oidc-client.mjs  → registra el client OIDC en el IdP
├── doc/                       → SQL + análisis del schema (heredado)
└── docs/superpowers/plans/    → plan de implementación
```

## Stack

Next.js 16.2 (Turbopack, App Router) · React 19 · TypeScript · Tailwind v4 ·
shadcn/ui (base-nova) · lucide-react 1.16 (stroke 1.5) · jose 6 (OIDC + sesión) ·
zustand 5 · @tanstack/react-query 5 · react-hook-form 7 + zod 4 · recharts ·
drizzle-orm + pg (capa de datos futura) · next-themes (dark/light).

## Comandos

```bash
pnpm install
pnpm dev          # next dev -p 3002  (raíz: filtra @aware/portal-app)
pnpm build
pnpm --filter @aware/portal-app register:oidc   # registra el client OIDC en el IdP
```

## Auth (OIDC Relying Party)

- IdP (dev): `http://localhost:3000` · Portal (dev): `http://localhost:3002`.
- El portal NO usa Better Auth como dependencia: es un RP puro (`jose` + `fetch`),
  igual que el CRM. El IdP (vintelarg-auth) maneja Better Auth.
- Flujo: `/api/auth/login` (state+nonce+PKCE → IdP) → IdP login → `/api/auth/callback`
  (intercambia code, verifica id_token vía JWKS, re-empaqueta claims en cookie
  `portal_session` HS256) → redirige al landing según `role`.
- `proxy.ts` protege todo salvo `/api/auth` y `/auth-error`.
- Claims OIDC: sub, name, email, org_id, org_name, role, user_type.
- `.env.local` (no commiteado, ver `.env.example`): `AUTH_ISSUER`, `AUTH_OIDC_BASE`,
  `AUTH_CLIENT_ID`, `AUTH_CLIENT_SECRET`, `AUTH_REDIRECT_URI`, `APP_URL`, `SESSION_SECRET`,
  `DATABASE_URL` (sólo para registrar el client OIDC).

## Routing por rol (`src/lib/portal-config.ts`)

| role | shell | landing |
|------|-------|---------|
| admin | desktop | /admin (P08) |
| marketing | desktop | /dashboard (P06) |
| comercial | desktop | /dashboard (P05) |
| gerente_comercial | desktop | /dashboard (P04) |
| atencion_cliente | desktop | /atencion (P07) |
| lci | mobile | /home (P02) |
| emprendedor | mobile | /home (P01) |

`normalizeRole()` mapea sinónimos del claim (gc/ei → gerente_comercial,
revendedora → emprendedor, etc.). Rol desconocido → mobile/home.

## Diseño / tokens

- Fuente de verdad: `apps/portal/src/styles/aware-tokens.css` (handoff, referencia)
  y `src/app/globals.css` (aplicado: tokens A-ware mapeados a shadcn + primitivos).
- Primario **#685BC7** (`--aw-violet`, Pantone 2725 C) — **NUNCA #6C2BD9**.
- Tipografía: Plus Jakarta Sans (sans) + Merriweather (serif editorial), vía next/font local.
- Sidebar interno desktop: `--aw-purple-900` (#201A4C). Español argentino (voseo).

## Estado actual

- ✅ 11 pantallas del handoff implementadas (P01–P11) con datos mock.
- ✅ OIDC login E2E verificado (redirect chain) + client registrado en el IdP.
- ✅ `pnpm build` verde (14 rutas, TS limpio); QA visual con Playwright.
- 🔲 Conectar datos reales (Drizzle a vintelarg_base / aware_analytics) cuando se
  validen las tablas de reportes. Reemplazar `src/lib/mock/*`.
- 🔲 Módulos operativos (catálogo, pedido, cuenta corriente, reclamos) por etapa.
