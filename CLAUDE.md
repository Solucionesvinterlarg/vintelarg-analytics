# CLAUDE.md — @vintelarg/analytics

## Qué es

Capa de reportería y analytics del ecosistema Vintelarg. Recibe datos de todos los módulos, los almacena en TimescaleDB como series temporales, y los presenta en dashboards.

## Stack

Drizzle ORM + TimescaleDB + Next.js 16 + Tailwind/shadcn + Recharts + PostgreSQL 16

## Setup

🔲 Pendiente — ver WALKTHROUGH.md

## Reglas

- Context7 obligatorio antes de escribir código con Drizzle
- Drizzle ORM para TODAS las queries
- Analytics es CONSUMIDOR de datos — no tiene lógica de negocio propia
- Otros módulos escriben datos via API de analytics
- TimescaleDB para series temporales, PostgreSQL para config
- Organizar TODO por módulo, nunca por tipo
- NO usar: MUI, Ant Design, Chakra, Redux, SWR, Mantine, HeroUI

## Estructura

```
vintelarg-analytics/
  packages/analytics/
    src/
      config.ts
      index.ts
      schema/                   → tablas TimescaleDB
      services/                 → ingesta + queries
      components/               → dashboards, charts
      hooks/
  scripts/analytics/
  docs/ARCHITECTURE.md
```

## Tablas (TimescaleDB :5434)

comisiones, pedidos, rankings, metricas_soporte, sesiones_bot.
Extensible: cada módulo nuevo puede agregar tablas de métricas.

## Quién escribe datos

| Módulo | Qué escribe |
|--------|------------|
| OMS / venta directa | pedidos |
| Fuerza de venta | comisiones, rankings |
| CRM | metricas_soporte |
| AI agent | sesiones_bot |

## Spec completa

Ver vault de Obsidian: `modulos/analytics/tecnico/spec.md`
