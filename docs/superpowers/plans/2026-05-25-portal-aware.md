# Portal A-ware® Implementation Plan

> **For agentic workers:** Use this plan task-by-task. Foundation tasks are sequential; the 11 screens are independent and parallelizable.

**Goal:** Build the A-ware® portal (`apps/portal`) inside `vintelarg-Analytics` — one Next.js 16 app with dynamic per-role composition (desktop shell for internal roles, mobile shell for the sales network), OIDC login against the IdP, and the 11 design-handoff screens recreated pixel-faithfully with mock data.

**Architecture:** Mirror the proven `vintelarg-crm` app (same monorepo layout, same OIDC relying-party pattern with `jose`, same Tailwind v4 + shadcn "base-nova" token system, same Next 16 `proxy.ts` middleware). Route groups `(desktop)` / `(mobile)` each get a bespoke shell recreated from the handoff. `proxy.ts` protects routes; the session's `role` claim picks the shell + landing screen. Screen data is mock now (report tables not yet validated — see deviation note), behind a `lib/mock/` boundary so real Drizzle queries drop in later.

**Tech stack (locked to CRM versions):** next 16.2.6 · react 19.2.4 · tailwindcss 4 · shadcn 4.8 (base-nova / @base-ui/react) · jose 6 · lucide-react 1.16 · @tanstack/react-query 5 · zustand 5 · react-hook-form 7 + zod 4 · recharts (added per prompt) · drizzle-orm + pg (future data layer) · next-themes · motion.

---

## Environment (verified this session)
- node 22.14.0, pnpm 10.24.0 — OK.
- IdP **up** at `http://localhost:3000`.
- vintelarg_base DB reachable via **Tailscale `100.106.74.8:5433`** (NOT localhost:5433 — prompt was stale). Needed only to register the portal's OIDC client (`oauth_client` table) and for live login.
- Repo had only `doc/` + `README.md`, was **not** a git repo. Built fresh.

## Deviations from the prompt (intentional, justified)
1. **Mock data in screens.** Standing rule "repos = datos reales" is overridden by this prompt's explicit instruction (report tables unvalidated). Mitigation: all mock lives under `apps/portal/src/lib/mock/`, consumed via typed accessors so swapping to Drizzle later is mechanical. Auth uses the real IdP.
2. **Scaffold by mirroring the CRM, not `create-next-app` + `shadcn init`.** The CRM already solved Next 16 + Tailwind 4 + shadcn config and is the sibling ecosystem app. shadcn style is **base-nova / neutral** (CRM ground truth), not new-york.
3. **`proxy.ts`, not `middleware.ts`** — confirmed via Context7 for Next 16.2.
4. **OIDC client registered via a `register-oidc-client.mjs` script** (direct insert into `oauth_client`, idempotent) rather than raw curl — mirrors the CRM, no admin bearer token needed.

---

## Role → shell → landing map (from portal-spec.md)
| role claim | shell | landing | screen |
|---|---|---|---|
| admin | desktop | /admin | P08 |
| marketing | desktop | /dashboard | P06 |
| comercial | desktop | /dashboard | P05 |
| gerente_comercial | desktop | /dashboard | P04 |
| atencion_cliente | desktop | /atencion | P07 |
| lci | mobile | /home | P02 |
| emprendedor | mobile | /home | P01 |
Unknown role → mobile/home (safest for external). `/dashboard` picks P04/05/06 by role; `/home` picks P01/P02 by role.

---

## FASE 1 — Monorepo + scaffold (mirror CRM)
- [ ] `git init`; root `package.json`, `pnpm-workspace.yaml` (`packages/*`, `apps/*`), `.gitignore`.
- [ ] Create `apps/portal/` by copying CRM config: `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `next-env.d.ts`, `components.json`. New `package.json` → name `@aware/portal-app`, `dev: next dev -p 3002`, add `recharts`, drop `@vintelarg/crm`.
- [ ] Copy 4 fonts → `apps/portal/src/fonts/`.
- [ ] `src/app/globals.css` = CRM's A-ware shadcn token file **+** handoff primitives it lacks (`--aw-purple-900`, `--cat-*`, full type/space scale, shadows, `--aw-violet-light` reconciled to handoff #E8E5F8). Also drop the authoritative `colors_and_type.css` → `src/styles/aware-tokens.css` and `@import` it.
- [ ] Copy brand assets → `public/`: `logo-color.png`, `logo-white.png`, `gran-a-chevron.svg`.
- [ ] `pnpm install`; confirm `pnpm --filter @aware/portal-app dev` boots on :3002.

## FASE 2 — OIDC relying party (mirror CRM, port 3002)
- [ ] `src/lib/utils.ts` (cn), `src/lib/auth.ts` (default redirect :3002), `src/lib/session-token.ts` (cookie `portal_session`, type `PortalUser`).
- [ ] `src/app/api/auth/{login,callback,logout}/route.ts`. Callback redirects to role landing (see map) instead of hardcoded /dashboard.
- [ ] `src/proxy.ts` — protect all non-public routes; redirect anon → /api/auth/login.
- [ ] `src/app/auth-error/page.tsx`, `src/components/theme-provider.tsx`, adapted `src/app/layout.tsx`.
- [ ] `.env.local` (fill `AUTH_CLIENT_ID/SECRET` from step below), `.env.example`.
- [ ] `scripts/register-oidc-client.mjs` (name "Portal A-ware (dev)", redirect `http://localhost:3002/api/auth/callback`); run it; paste creds into `.env.local`.
- [ ] `src/app/page.tsx` — read session, redirect to role landing or login.

## FASE 3 — Shells (bespoke, from handoff)
- [ ] `src/lib/portal-config.ts` — role→shell, role→nav items (sidebar item sets from dashboards.jsx/atencion-admin.jsx), role→landing.
- [ ] `src/components/shells/desktop-sidebar.tsx` — dark `--aw-purple-900`, A-ware logo, items/divider/label/badge, active violet, collapse 260↔68 (240ms), user footer. From `shared.jsx DesktopSidebar`.
- [ ] `src/components/shells/desktop-topbar.tsx` — 64px, title + filter chips + bell + avatar; `right` slot. Collapse toggle (panel-left-close/open). Auto-collapse < 1100px.
- [ ] `src/components/shells/mobile-topbar.tsx`, `mobile-bottom-nav.tsx` (blur, dynamic tabs).
- [ ] `app/(desktop)/layout.tsx` + `app/(mobile)/layout.tsx` — server: `getCurrentUser()` → build nav by role → render shell. zustand store for `collapsed` + mobile `moreSheetOpen`.

## FASE 4 — Shared primitives (from shared.jsx)
- [ ] `src/components/portal/`: `kpi-card.tsx`, `sparkline.tsx`, `badge.tsx` (8 tones), `toggle.tsx` (36×20), `campaign-pill.tsx`, `section-eyebrow.tsx`, `semaforo.tsx`. CSS variables only; no hardcoded hex outside tokens.

## FASE 5 — 11 screens (parallelizable; reference JSX in vault design_files/src/)
Mobile (390, mobile-first): **P01** `(mobile)/home` emprendedor · **P02** `(mobile)/home` lci · **P03** `(mobile)/mas` bottom sheet (overlay, focus trap, ESC).
Desktop (1280): **P04/P05/P06** `(desktop)/dashboard` by role (9-KPI grid + alert bar) · **P07** `(desktop)/atencion` (filters, metric cards, tickets table, pagination) · **P08** `(desktop)/admin` (metric cards + activity timeline + shortcuts) · **P09** sidebar = the shell component (Fase 3) · **P10** `(desktop)/admin/modulos` (module list + toggles + dirty save) · **P11** `(desktop)/admin/permisos` (roles×perms matrix, edited dots, save).
Each screen: mock data in `lib/mock/`, shared primitives, shadcn primitives for inner controls, responsive + dark mode.

## FASE 6 — Finalize
- [ ] Update repo `CLAUDE.md` (real structure, stack, routes, components, run/auth notes).
- [ ] Verify: `pnpm dev` on :3002 → / → IdP login → back to portal; admin→P08, emprendedor→P01; sidebar collapse; "Más" sheet; dark mode; sidebar auto-collapse <1100px. Use Playwright MCP for screenshots.
- [ ] `git` commits per phase; create GitHub repo `Solucionesvinterlarg/vintelarg-Analytics` and push.
- [ ] `mem_session_summary`.

## Self-review notes
- Spec coverage: all 11 screens mapped to routes; shells + primitives + OIDC + routing covered. ✓
- Role string values from IdP are uncertain → routing maps known values, defaults safely, and `/dashboard`+`/home` pick screens by role so any account renders something. Verify actual claim values during login test.
- Lucide v1.16 icon names from handoff must exist in that version — verify on first import; substitute nearest if renamed.
