# Setup Base de Datos — Ecosistema Vintelarg

## Instrucciones para Antigravity

Este documento contiene todo lo necesario para crear el schema completo del ecosistema Vintelarg.
Los datos se distribuyen en **dos bases de datos** dentro del mismo VPS 2 de Contabo (vmi3228575).

---

## Conexiones

> **REGLA:** Siempre usar la IP de Tailscale (`100.106.74.8`). La IP pública tiene firewall en los puertos de DB.

### Base 1 — vintelarg_base (PostgreSQL 16)

| Parámetro | Valor |
|-----------|-------|
| Host | 100.106.74.8 (Tailscale) |
| Puerto | **5433** |
| Base de datos | vintelarg_base |
| Usuario | pgadmin |
| Password | Vintelarg013 |
| Container | **postgres-b** |
| URI | `postgresql://pgadmin:Vintelarg013@100.106.74.8:5433/vintelarg_base` |

**Propósito:** 14 tablas maestro y operativas (artículos, campañas, catálogo, calendario, personas, fuerza de venta).

> ⚠️ **NO usar el puerto 5432** — ese es postgres-a (aware_core, producción Aware). Existe una vintelarg_base duplicada ahí pero NO es la principal.

### Base 2 — aware_analytics (TimescaleDB / PG16)

| Parámetro | Valor |
|-----------|-------|
| Host | 100.106.74.8 (Tailscale) |
| Puerto | **5434** |
| Base de datos | aware_analytics |
| Usuario | pgadmin |
| Password | Vintelarg013 |
| Container | **timescaledb** |
| Imagen | timescale/timescaledb:latest-pg16 |
| URI | `postgresql://pgadmin:Vintelarg013@100.106.74.8:5434/aware_analytics` |

**Propósito:** Tablas transaccionales de series de tiempo (documentos comerciales, eventos fuerza de venta). Usa la extensión TimescaleDB con hypertables.

---

## Mapa de contenedores en VPS 2 (Contabo)

| Contenedor | Puerto | Base | Uso |
|------------|--------|------|-----|
| postgres-a | 5432 | aware_core | Producción Aware — **NO TOCAR** |
| **postgres-b** | **5433** | **vintelarg_base** | **Principal ecosistema Vintelarg** |
| **timescaledb** | **5434** | **aware_analytics** | **Analytics y series de tiempo** |
| pgbouncer | 6432 | — | Connection pooling |

---

## Orden de ejecución

1. Conectar a **vintelarg_base** (puerto **5433**) → ejecutar `01-vintelarg-base.sql`
2. Conectar a **aware_analytics** (puerto **5434**) → ejecutar `02-aware-analytics.sql`
3. Verificar con los queries de validación al final de cada script

---

## Ejecución vía psql

```bash
# Desde el VPS o cualquier máquina con acceso a Tailscale:

# Base 1 — PostgreSQL (postgres-b, puerto 5433)
PGPASSWORD='Vintelarg013' psql -h 100.106.74.8 -p 5433 -U pgadmin -d vintelarg_base -f 01-vintelarg-base.sql

# Base 2 — TimescaleDB (puerto 5434)
PGPASSWORD='Vintelarg013' psql -h 100.106.74.8 -p 5434 -U pgadmin -d aware_analytics -f 02-aware-analytics.sql
```

---

## Notas

- Todos los scripts usan `CREATE TABLE IF NOT EXISTS` y `ON CONFLICT DO NOTHING` para ser idempotentes
- Las tablas TimescaleDB usan hypertables con `create_hypertable`
- Los índices usan `IF NOT EXISTS`
- El script de migración JDE es un archivo separado: `migrate-jde-oracle.js`
