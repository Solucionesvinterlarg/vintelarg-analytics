/**
 * migrate-new-tables.cjs
 * Migración de tablas nuevas: divisiones(seed manual), zonas, objetivos, programas_puntos, puntos_acumulados
 * 
 * PRE-REQUISITO: Ejecutar primero 001A_create_master_tables.sql (vintelarg_base) y 001B_create_analytics_tables.sql (aware_analytics)
 * 
 * Ejecutar desde el workspace:
 *   node doc/migrate-new-tables.cjs
 * 
 * NOTA: cuenta_corriente se crea vacía por DDL y NO se migra aquí. Se esperará a que F5947B11 exista.
 */

const oracledb = require('oracledb');
const { Pool } = require('pg');

// ============================================================
// CONFIGURACIÓN
// ============================================================

const JDE_CONFIG = {
  user:            'PRODDTA',
  password:        'PRODDTA',
  connectString:   '10.96.4.85:1521/jde91prd.global.company.domain',
  schema:          'PRODDTA',
};

const PG_CONFIG = {
  host:     '100.106.74.8',
  port:     5433,  // postgres-b → vintelarg_base
  database: 'vintelarg_base',
  user:     'pgadmin',
  password: 'Vintelarg013',
  max:      5,
};

const TSDB_CONFIG = {
  host:     '100.106.74.8',
  port:     5434,  // timescaledb → aware_analytics
  database: 'aware_analytics',
  user:     'postgres',
  password: 'NovaDB2026!Segura#',
  max:      5,
};

const BATCH_SIZE = 1000;

// ============================================================
// UTILIDADES
// ============================================================

function julianToDate(julianNum) {
  if (!julianNum || julianNum === 0) return null;
  const s = String(julianNum).padStart(6, '0');
  const century = parseInt(s[0]) + 19;
  const year = century * 100 + parseInt(s.substring(1, 3));
  const dayOfYear = parseInt(s.substring(3, 6));
  if (dayOfYear === 0 || dayOfYear > 366) return null;
  const d = new Date(year, 0, dayOfYear);
  return d.toISOString().split('T')[0];
}

function div(value, factor) {
  if (value == null || value === 0) return null;
  return Number((value / factor).toFixed(factor >= 10000 ? 4 : factor >= 1000 ? 3 : 2));
}

function t(value) {
  if (value == null) return null;
  const trimmed = String(value).trim();
  return trimmed === '' ? null : trimmed;
}

function toIntOrNull(value) {
  if (value == null) return null;
  const str = String(value).trim();
  if (str === '') return null;
  const parsed = parseInt(str, 10);
  return isNaN(parsed) ? null : parsed;
}

function toBool(value) {
  if (value == null) return false;
  const v = String(value).trim().toUpperCase();
  return v === 'S' || v === 'Y' || v === '1';
}

// ============================================================
// MIGRACIÓN STREAMING
// ============================================================

async function migrateTable({ oraConn, pgPool, name, query, transform, insertSQL, onDone }) {
  console.log(`\n📦 Migrando: ${name}`);
  const startTime = Date.now();
  let total = 0;
  let batch = [];

  const result = await oraConn.execute(query, [], {
    resultSet: true,
    fetchArraySize: BATCH_SIZE,
    outFormat: oracledb.OUT_FORMAT_OBJECT,
  });

  const rs = result.resultSet;
  let row;

  while ((row = await rs.getRow())) {
    const transformed = transform(row);
    if (transformed === null) continue;

    batch.push(transformed);
    total++;

    if (batch.length >= BATCH_SIZE) {
      await insertBatch(pgPool, insertSQL, batch);
      process.stdout.write(`  → ${total} filas...\r`);
      batch = [];
    }
  }

  if (batch.length > 0) {
    await insertBatch(pgPool, insertSQL, batch);
  }

  await rs.close();
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`  ✅ ${name}: ${total} filas en ${elapsed}s`);

  if (onDone) await onDone(total);
  return total;
}

async function insertBatch(pool, insertSQL, rows) {
  if (rows.length === 0) return;
  const client = await pool.connect();
  try {
    const cols = rows[0].length;
    const valueSets = [];
    const params = [];
    let paramIdx = 1;

    for (const row of rows) {
      const placeholders = [];
      for (const val of row) {
        placeholders.push(`$${paramIdx++}`);
        params.push(val);
      }
      valueSets.push(`(${placeholders.join(',')})`);
    }

    const fullSQL = `${insertSQL} VALUES ${valueSets.join(',')} ON CONFLICT DO NOTHING`;
    await client.query(fullSQL, params);
  } finally {
    client.release();
  }
}

// ============================================================
// DEFINICIÓN DE MIGRACIONES
// ============================================================

// Cache para resolución de FKs
const divisionesMap = new Map();   // numero → id
const personasMap = new Map();     // numero_cliente → id

const MASTER_MIGRATIONS = [
  // ─────────────────────────────────────────────
  // 1. ZONAS (F59CO002) → zonas
  // ─────────────────────────────────────────────
  {
    name: 'zonas',
    query: `SELECT ZOCO, ZOZON, ZOAN8, ZO59LEGAGTE, ZO59NOMBGTE, ZO59ZNOCOM, ZOEMAIL
            FROM ${JDE_CONFIG.schema}.F59CO002
            ORDER BY ZOZON`,
    transform: (r) => {
      const zona = t(r.ZOZON);
      const an8 = toIntOrNull(r.ZOAN8);
      const responsableId = an8 ? (personasMap.get(an8) || null) : null;

      // Buscar división de esta zona via F590109 (cargado previamente)
      const divisionId = divisionesMap.get(zona) || null;

      return [
        zona,
        divisionId,
        responsableId,
        toIntOrNull(r.ZO59LEGAGTE),
        t(r.ZO59NOMBGTE),
        t(r.ZOEMAIL),
        toBool(r.ZO59ZNOCOM),
        'activa',
      ];
    },
    insertSQL: `INSERT INTO zonas (codigo, division_id, responsable_id, legajo, nombre_gerente, email_gerente, no_comisiona, estado)`,
  },

  // ─────────────────────────────────────────────
  // 2. OBJETIVOS (F59IOVTA) → objetivos_campania
  // ─────────────────────────────────────────────
  {
    name: 'objetivos_campania',
    query: `SELECT OVKCOO, OVZON, OVUPC1, OVUPC2,
                   OV59CORDNET, OV59FACNETA, OV59PORCCOB, OV59CHABZON, OV59CORDBRU,
                   OV59USOFUT1, OV59USOFUT2
            FROM ${JDE_CONFIG.schema}.F59IOVTA
            ORDER BY OVUPC2, OVUPC1, OVZON`,
    transform: (r) => {
      const campania = t(r.OVUPC1);
      const anio = t(r.OVUPC2);
      // Calcular anio_campania: 20YY * 100 + CC → ej: 2509
      const anioCamp = anio && campania ? parseInt(`20${anio}${campania.padStart(2, '0')}`) : null;

      return [
        t(r.OVKCOO),
        t(r.OVZON),
        campania,
        anio,
        anioCamp,
        toIntOrNull(r.OV59CORDNET),
        div(r.OV59FACNETA, 100),
        div(r.OV59PORCCOB, 1000),
        toIntOrNull(r.OV59CHABZON),
        toIntOrNull(r.OV59CORDBRU),
        toIntOrNull(r.OV59USOFUT1),
        toIntOrNull(r.OV59USOFUT2),
      ];
    },
    insertSQL: `INSERT INTO objetivos_campania (compania, zona, campania, anio, anio_campania,
      ordenes_netas, facturacion_neta, pct_cobrabilidad, cant_hab_zona, ordenes_brutas,
      uso_futuro_1, uso_futuro_2)`,
  },

  // ─────────────────────────────────────────────
  // 3. PROGRAMAS PUNTOS (F590106) → programas_puntos
  // ─────────────────────────────────────────────
  {
    name: 'programas_puntos',
    query: `SELECT PVKCOO, PV59NOMP, PV59TIPROG, PV59DEPROG,
                   PVALLBMIN, PVALLBMAX, PVUPC1, PVUPC2, PV59UPC1, PV59UPC2,
                   PVAA03, PVLITM, PVITM, PVXPQTY, PV59FCTPTO
            FROM ${JDE_CONFIG.schema}.F590106
            ORDER BY PV59NOMP, PVAA03, PVLITM`,
    transform: (r) => [
      t(r.PVKCOO),
      toIntOrNull(r.PV59NOMP),
      t(r.PV59TIPROG),
      t(r.PV59DEPROG),
      t(r.PVALLBMIN),
      t(r.PVALLBMAX),
      t(r.PVUPC1),
      t(r.PVUPC2),
      t(r.PV59UPC1),
      t(r.PV59UPC2),
      t(r.PVAA03),
      t(r.PVLITM),
      toIntOrNull(r.PVITM),
      r.PVXPQTY != null ? Number(r.PVXPQTY) : null,
      r.PV59FCTPTO != null ? Number(r.PV59FCTPTO) : null,
    ],
    insertSQL: `INSERT INTO programas_puntos (compania, numero_programa, tipo_programa, descripcion,
      anio_camp_inicio, anio_camp_fin, campania_inicio, anio_inicio, campania_fin, anio_fin,
      linea_producto, articulo_codigo, articulo_corto, factor_override, factor_general)`,
  },
];

const ANALYTICS_MIGRATIONS = [
  // ─────────────────────────────────────────────
  // 4. PUNTOS ACUMULADOS (F590103) → puntos_acumulados
  // ─────────────────────────────────────────────
  {
    name: 'puntos_acumulados',
    query: `SELECT CVAN8, CVSRDM, CVKCOO, CVZON, CV59PUNACU, CV59PUNCAM,
                   CVUPC1, CVUPC2, CV59NOMP
            FROM ${JDE_CONFIG.schema}.F590103
            WHERE CVSRDM >= 202501
            ORDER BY CV59NOMP, CVAN8, CVSRDM`,
    transform: (r) => [
      toIntOrNull(r.CVAN8),
      toIntOrNull(r.CVSRDM),
      t(r.CVKCOO),
      t(r.CVZON),
      toIntOrNull(r.CV59PUNACU) || 0,
      toIntOrNull(r.CV59PUNCAM) || 0,
      t(r.CVUPC1),
      t(r.CVUPC2),
      toIntOrNull(r.CV59NOMP),
    ],
    insertSQL: `INSERT INTO puntos_acumulados (revendedora_id, anio_campania, compania, zona,
      puntos_acumulados, puntos_campania, campania, anio, numero_programa)`,
  },
];

// ============================================================
// MAIN
// ============================================================

async function main() {
  console.log('='.repeat(60));
  console.log('MIGRACIÓN TABLAS NUEVAS: JDE Oracle → PostgreSQL');
  console.log('Tablas: zonas, objetivos, programas_puntos, puntos_acumulados');
  console.log('='.repeat(60));

  let oraConn;
  const pgPool = new Pool(PG_CONFIG);
  const tsdbPool = new Pool(TSDB_CONFIG);

  try {
    // Conectar
    console.log('\n🔌 Conectando...');
    oraConn = await oracledb.getConnection(JDE_CONFIG);
    console.log('  ✅ JDE Oracle conectado');

    const pgClient = await pgPool.connect();
    console.log('  ✅ PostgreSQL (vintelarg_base) conectado en 5433');
    pgClient.release();

    const tsdbClient = await tsdbPool.connect();
    console.log('  ✅ TimescaleDB (aware_analytics) conectado en 5434');
    tsdbClient.release();

    // ── PRE-PASO: Cargar caches de resolución de FKs ──
    console.log('\n🔍 Cargando caches para resolución de FKs...');

    // Cache personas: numero_cliente → id
    const persRes = await pgPool.query('SELECT id, numero_cliente FROM personas');
    for (const r of persRes.rows) {
      personasMap.set(r.numero_cliente, r.id);
    }
    console.log(`  ✅ ${personasMap.size} personas en caché`);

    // Cache divisiones: cargar relación zona → division_id desde F590109
    console.log('\n📦 Cargando relación división ↔ zona desde F590109...');
    const divResult = await oraConn.execute(
      `SELECT DI59DIV, DIZON FROM ${JDE_CONFIG.schema}.F590109 ORDER BY DI59DIV, DIZON`,
      [], { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // Primero necesitamos el id de cada división en nuestra tabla
    const divDbRes = await pgPool.query('SELECT id, numero FROM divisiones');
    const divIdMap = new Map(); // numero → id en BD
    for (const r of divDbRes.rows) {
      divIdMap.set(r.numero, r.id);
    }

    // Mapear zona → division_id
    for (const r of divResult.rows) {
      const divNum = toIntOrNull(r.DI59DIV);
      const zona = t(r.DIZON);
      const divId = divIdMap.get(divNum);
      if (zona && divId) {
        divisionesMap.set(zona, divId);
      }
    }
    console.log(`  ✅ ${divisionesMap.size} relaciones zona→división cargadas`);

    // ── TRUNCATE tablas nuevas antes de migrar ──
    console.log('\n🗑️  Limpiando tablas destino...');
    
    // Truncate en vintelarg_base (pgPool)
    for (const tbl of ['programas_puntos', 'objetivos_campania', 'zonas']) {
      await pgPool.query(`TRUNCATE TABLE ${tbl} CASCADE`);
      console.log(`  ✅ ${tbl} truncada (5433)`);
    }

    // Truncate en aware_analytics (tsdbPool)
    for (const tbl of ['puntos_acumulados']) {
      await tsdbPool.query(`TRUNCATE TABLE ${tbl} CASCADE`);
      console.log(`  ✅ ${tbl} truncada (5434)`);
    }

    // ── MIGRAR MAESTROS (5433) ──
    console.log('\n' + '='.repeat(60));
    console.log('MIGRANDO TABLAS MAESTRAS (vintelarg_base :5433)');
    console.log('='.repeat(60));

    for (const mig of MASTER_MIGRATIONS) {
      await migrateTable({
        oraConn, pgPool, name: mig.name,
        query: mig.query, transform: mig.transform, insertSQL: mig.insertSQL,
      });
    }

    // ── MIGRAR ANALYTICS (5434) ──
    console.log('\n' + '='.repeat(60));
    console.log('MIGRANDO TABLAS ANALÍTICAS (aware_analytics :5434)');
    console.log('='.repeat(60));

    for (const mig of ANALYTICS_MIGRATIONS) {
      await migrateTable({
        oraConn, pgPool: tsdbPool, name: mig.name,
        query: mig.query, transform: mig.transform, insertSQL: mig.insertSQL,
      });
    }

    // ── CONTEOS FINALES ──
    console.log('\n' + '='.repeat(60));
    console.log('CONTEOS FINALES');
    console.log('='.repeat(60));

    const finalMasterTables = ['divisiones', 'zonas', 'objetivos_campania', 'programas_puntos'];
    for (const tbl of finalMasterTables) {
      const res = await pgPool.query(`SELECT count(*) FROM ${tbl}`);
      console.log(`  vintelarg_base.${tbl}: ${res.rows[0].count} filas`);
    }

    const finalAnalyticsTables = ['cuenta_corriente', 'puntos_acumulados'];
    for (const tbl of finalAnalyticsTables) {
      const res = await tsdbPool.query(`SELECT count(*) FROM ${tbl}`);
      console.log(`  aware_analytics.${tbl}: ${res.rows[0].count} filas`);
    }

  } catch (err) {
    console.error('\n❌ ERROR:', err.message);
    console.error(err.stack);
    process.exit(1);
  } finally {
    if (oraConn) await oraConn.close();
    await pgPool.end();
    await tsdbPool.end();
    console.log('\n🔌 Conexiones cerradas.');
  }
}

main();
