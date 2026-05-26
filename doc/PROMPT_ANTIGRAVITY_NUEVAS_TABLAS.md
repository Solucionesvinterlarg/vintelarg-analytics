# Prompt para Antigravity — Crear 6 tablas nuevas y migrar datos

## Contexto

Necesitamos crear 6 tablas nuevas y migrar datos desde JDE Oracle. Las tablas se dividen en 2 bases de datos siguiendo el patrón existente (maestro en PostgreSQL, transaccional en TimescaleDB).

## ⚠️ IMPORTANTE: cuenta_corriente

La tabla `cuenta_corriente` se debe **CREAR (DDL)** pero **NO MIGRAR datos todavía**. Diego está generando la tabla F5947B11 en JDE que será la fuente definitiva. Hasta que esa tabla esté lista y tenga datos, cuenta_corriente queda vacía. NO usar F5903B como fuente temporal.

## Archivos de referencia

En `C:\Users\Diego\Qsync\Vintelarg_base\vintelarg-Analytics\doc\` están:
- `001A_create_new_tables.sql` — DDL de las 6 tablas (NECESITA CORRECCIONES, ver abajo)
- `migrate-new-tables.cjs` — Script de migración (NECESITA CORRECCIONES, ver abajo)

## Distribución de tablas por base de datos

### PostgreSQL — vintelarg_base (postgres-b :5433)
Tablas maestro/configuración, mismo patrón que campanias, articulos, personas:

| Tabla destino | Tabla JDE origen | Tipo | Migrar datos |
|---|---|---|---|
| divisiones | Seed manual + F590109 | Maestro | ✅ SÍ — seed 5 filas + relación zona↔div |
| zonas | F59CO002 | Maestro | ✅ SÍ |
| objetivos_campania | F59IOVTA | Config | ✅ SÍ |
| programas_puntos | F590106 | Config | ✅ SÍ |

### TimescaleDB — aware_analytics (timescaledb :5434)
Tablas transaccionales, mismo patrón que documentos_cabecera, documentos_detalle, fv_eventos:

| Tabla destino | Tabla JDE origen | Tipo | Migrar datos |
|---|---|---|---|
| cuenta_corriente | F5947B11 (NO EXISTE AÚN) | Transaccional | ❌ NO — solo crear tabla vacía |
| puntos_acumulados | F590103 | Transaccional | ✅ SÍ |

## CORRECCIONES NECESARIAS al DDL (001A_create_new_tables.sql)

### 1. Separar en 2 scripts DDL:
- **001A_create_master_tables.sql** → ejecutar en vintelarg_base (:5433) — divisiones, zonas, objetivos_campania, programas_puntos + seed de divisiones
- **001B_create_analytics_tables.sql** → ejecutar en aware_analytics (:5434) — cuenta_corriente, puntos_acumulados. Convertir cuenta_corriente a hypertable después de CREATE TABLE:
  ```sql
  -- Ejecutar en aware_analytics (:5434)
  CREATE TABLE IF NOT EXISTS cuenta_corriente ( ... );  -- misma definición del DDL
  SELECT create_hypertable('cuenta_corriente', 'fecha', if_not_exists => TRUE);
  
  CREATE TABLE IF NOT EXISTS puntos_acumulados ( ... );  -- misma definición del DDL
  -- puntos_acumulados NO necesita hypertable, es menor volumen
  ```

### 2. Los índices de cuenta_corriente y puntos_acumulados van en :5434, no en :5433.

## CORRECCIONES NECESARIAS al script de migración (migrate-new-tables.cjs)

### 1. Eliminar la migración de cuenta_corriente
Remover completamente el bloque de migración de cuenta_corriente (el que lee F5903B). La tabla se crea vacía y se migrará en una etapa posterior cuando Diego tenga lista la tabla F5947B11 en JDE.

### 2. Puerto de PostgreSQL
El script tiene `port: 5432` pero vintelarg_base es **postgres-b en puerto 5433**.
Verificar cuál es el puerto correcto desde donde corre el script:
- Desde Tailscale → :5433
- ¿Desde el servidor local puede ser :5432?
Referencia: tu script `migrate-jde-oracle.cjs` usa 5432 y funcionó. Verificar si es correcto o si fue un error que funcionó por mapping de Docker.

### 3. Agregar configuración TimescaleDB
Agregar TSDB_CONFIG para puntos_acumulados (misma config que en migrate-jde-oracle.cjs):
```javascript
const TSDB_CONFIG = {
  host:     '100.106.74.8',
  port:     5434,
  database: 'aware_analytics',
  user:     'postgres',
  password: 'NovaDB2026!Segura#',
  max:      5,
};
```

### 4. Separar migraciones por pool
- zonas, objetivos_campania, programas_puntos → usar `pgPool` (vintelarg_base :5433)
- puntos_acumulados → usar `tsdbPool` (aware_analytics :5434)
- cuenta_corriente → NO MIGRAR

### 5. Truncate separado por base
```javascript
// Truncate en vintelarg_base
for (const tbl of ['programas_puntos', 'objetivos_campania', 'zonas']) {
  await pgPool.query(`TRUNCATE TABLE ${tbl} CASCADE`);
}
// Truncate en aware_analytics (solo puntos, NO cuenta_corriente)
for (const tbl of ['puntos_acumulados']) {
  await tsdbPool.query(`TRUNCATE TABLE ${tbl} CASCADE`);
}
```

## Orden de ejecución

1. Ejecutar DDL maestro en vintelarg_base (:5433) — crea divisiones, zonas, objetivos, programas_puntos + seed divisiones
2. Ejecutar DDL analytics en aware_analytics (:5434) — crea cuenta_corriente (hypertable vacía), puntos_acumulados
3. Ejecutar migrate-new-tables.cjs corregido — migra datos de zonas, objetivos, programas_puntos y puntos_acumulados (NO cuenta_corriente)

## Credenciales

- **PostgreSQL (vintelarg_base :5433)**: pgadmin / Vintelarg013
- **TimescaleDB (aware_analytics :5434)**: postgres / NovaDB2026!Segura#
- **JDE Oracle**: PRODDTA / PRODDTA @ 10.96.4.85:1521/jde91prd
- **Siempre vía Tailscale**: 100.106.74.8 (NUNCA IP pública)

## Tablas JDE a consultar (solo las que se migran ahora)

| Tabla JDE | Campos clave | Filtro |
|---|---|---|
| F590109 | DI59DIV, DIZON | Sin filtro (todas) |
| F59CO002 | ZOZON, ZOAN8, ZO59NOMBGTE, ZOEMAIL, ZO59ZNOCOM | Sin filtro |
| F59IOVTA | OVZON, OVUPC1, OVUPC2, OV59CORDNET(entero), OV59FACNETA(÷100), OV59PORCCOB(÷1000), OV59CHABZON(entero), OV59CORDBRU(entero) | Sin filtro |
| F590106 | PV59NOMP, PV59TIPROG, PV59DEPROG, PVALLBMIN/MAX, PVUPC1/2, PV59UPC1/2, PVAA03, PVLITM, PVITM, PVXPQTY, PV59FCTPTO | Sin filtro |
| F590103 | CVAN8, CVSRDM, CVZON, CV59PUNACU(entero), CV59PUNCAM(entero), CVUPC1, CVUPC2, CV59NOMP | WHERE CVSRDM >= 202501 |

**NO consultar F5903B** — cuenta_corriente se migrará después cuando Diego cree F5947B11 en JDE.

## Validación post-migración

Después de migrar, verificar conteos:
```sql
-- En vintelarg_base (:5433)
SELECT 'divisiones' as tabla, count(*) FROM divisiones
UNION ALL SELECT 'zonas', count(*) FROM zonas
UNION ALL SELECT 'objetivos_campania', count(*) FROM objetivos_campania
UNION ALL SELECT 'programas_puntos', count(*) FROM programas_puntos;

-- En aware_analytics (:5434)
SELECT 'cuenta_corriente' as tabla, count(*) FROM cuenta_corriente  -- debe ser 0
UNION ALL SELECT 'puntos_acumulados', count(*) FROM puntos_acumulados;
```

Divisiones: 5 filas (seed). Zonas: ~83. Cuenta corriente: **0 filas (esperado)**. El resto depende del volumen en JDE.