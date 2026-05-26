# Prompt para nueva sesión — Vintelarg Dashboards + Migración

Copiá todo lo que sigue y pegalo como primer mensaje en una nueva conversación:

---

## Contexto del proyecto

Este proyecto es `@vintelarg/auth` — sistema de autenticación e identidad unificado para el ecosistema Vintelarg (Solucionesvinterlarg). Pero esta sesión se enfoca en los **dashboards Aware** y la **migración de datos JDE Oracle**.

Repo: github.com/Solucionesvinterlarg/vintelarg-auth

## Setup obligatorio al inicio

1. Recuperar contexto de sesiones anteriores:
```
engram:mem_context({ project: 'vintelarg-auth', limit: 20 })
```

2. Buscar contexto específico de dashboards y migración:
```
engram:mem_search({ query: 'dashboards 160 KPIs 3 portales 140 pantallas' })
engram:mem_search({ query: 'cuenta corriente F5947B11 divisiones zonas objetivos' })
engram:mem_search({ query: 'Puertos MCPs definitivos Contabo' })
engram:mem_search({ query: 'Tiempos migración JDE Oracle Antigravity' })
```

3. Leer documentación del vault:
```
filesystem:read_text_file({ path: 'C:\\Users\\Diego\\Qsync\\vintelarg-vault\\infra\\base-de-datos\\migracion-estado.md' })
filesystem:read_text_file({ path: 'C:\\Users\\Diego\\Qsync\\vintelarg-vault\\infra\\base-de-datos\\cuenta-corriente.md' })
filesystem:read_text_file({ path: 'C:\\Users\\Diego\\Qsync\\vintelarg-vault\\infra\\base-de-datos\\tablas-jde-nuevas.md' })
filesystem:read_text_file({ path: 'C:\\Users\\Diego\\Qsync\\vintelarg-vault\\infra\\base-de-datos\\tablas-jde-puntos.md' })
filesystem:read_text_file({ path: 'C:\\Users\\Diego\\Qsync\\vintelarg-vault\\modulos\\analytics\\funcional\\catalogo-pantallas.md' })
```

## Estado actual (21 mayo 2026)

### Migración JDE — FASE 1 COMPLETA
14 tablas master en vintelarg_base (:5433) + 3 tablas analytics en aware_analytics (:5434).
Total: 511K personas, 6.5M detalle docs, 1M cabecera docs, 466K fv_eventos.

### Migración JDE — FASE 2 EN CURSO
6 tablas nuevas: divisiones, zonas, objetivos_campania, programas_puntos, puntos_acumulados, cuenta_corriente.
- DDL y script de migración generados en `vintelarg-Analytics/doc/`
- Prompt para Antigravity listo: `PROMPT_ANTIGRAVITY_NUEVAS_TABLAS.md`
- **cuenta_corriente**: solo crear tabla vacía. Diego está creando F5947B11 en JDE.
- Las otras 5 tablas se migran ahora.

### Dashboards — Análisis completo
- 140 pantallas catalogadas en 6 apps (Landing, Revendedora, GZ/Unit, Backoffice, Admin, Chofer)
- 160 KPIs mapeados en 3 portales con fórmulas sugeridas
- Excel para validación de negocio generado (KPIs_por_Dashboard_Completo_3_Portales.xlsx)
- 6 definiciones pendientes de negocio: reglas títulos, liquidación, BBs, Score, WOE/WAO, cobertura

### Tablas pendientes
- cuenta_corriente: vacía, esperando F5947B11 en JDE
- Tablas de reglas/comisiones: esperando definición de negocio

## Infraestructura

### Contabo (100.106.74.8 Tailscale)
| Servicio | Puerto | Base | Credenciales |
|---|---|---|---|
| postgres-a | 5432 | aware_core | NO TOCAR |
| postgres-b | 5433 | vintelarg_base | pgadmin / Vintelarg013 |
| timescaledb | 5434 | aware_analytics | postgres / NovaDB2026!Segura# |

## Archivos clave
- `vintelarg-Analytics/doc/001A_create_new_tables.sql` — DDL 6 tablas
- `vintelarg-Analytics/doc/migrate-new-tables.cjs` — Script migración
- `vintelarg-Analytics/doc/PROMPT_ANTIGRAVITY_NUEVAS_TABLAS.md` — Prompt para Antigravity
- `AWARE_Catalogo_Pantallas_Completo.xlsx` — 140 pantallas
- `KPIs_por_Dashboard_Completo_3_Portales.xlsx` — 160 KPIs para negocio
- `Pantallas_x_Indicadores_JDE_vs_Vintelarg.xlsx` — Indicadores con cálculos

## Pendientes inmediatos
1. Verificar que Antigravity haya creado y migrado las 5 tablas (divisiones, zonas, objetivos, programas_puntos, puntos_acumulados)
2. Diego: crear F5947B11 en JDE → después migrar cuenta_corriente
3. Validar KPIs con negocio (6 preguntas pendientes)
4. Empezar diseño de pantallas en Claude Code

## Reglas
- Verificar datos con queries directos a MCPs, no confiar en reportes sin evidencia
- Siempre IP Tailscale, nunca IP pública
- Al finalizar: `engram:mem_session_summary({ project: 'vintelarg-auth' })`
- Actualizar docs del vault directo via MCP filesystem