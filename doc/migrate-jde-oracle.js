/**
 * migrate-jde-oracle.js
 * Migración streaming JDE Oracle → PostgreSQL/TimescaleDB
 * 
 * Ejecutar:
 *   npm install oracledb pg
 *   node migrate-jde-oracle.js
 * 
 * Requiere Oracle Instant Client instalado en Antigravity.
 * 
 * FILTRO TRANSACCIONAL: Solo campañas >= 202501 (campaña 01 del año 2025)
 */

const oracledb = require('oracledb');
const { Pool } = require('pg');

// ============================================================
// CONFIGURACIÓN — COMPLETAR ANTES DE EJECUTAR
// ============================================================

const JDE_CONFIG = {
  user:            'PRODDTA',
  password:        'PRODDTA',
  connectString:   '10.96.4.85:1521/jde91prd.global.company.domain',
  schema:          'PRODDTA',
};

const PG_CONFIG = {
  host:     '100.106.74.8',
  port:     5432,
  database: 'vintelarg_base',
  user:     'pgadmin',
  password: 'Vintelarg013',
  max:      5,
};

const TSDB_CONFIG = {
  host:     '100.106.74.8',
  port:     5434, // Puerto corregido para TimescaleDB
  database: 'aware_analytics',
  user:     'postgres',
  password: 'NovaDB2026!Segura#',
  max:      5,
};

// Campaña mínima para tablas transaccionales
const CAMPANIA_MINIMA = 202501;

// Tamaño de batch para inserts
const BATCH_SIZE = 1000;

// Mapa global para mapear código_corto -> id de artículos
const articulosMap = new Map();

// ============================================================
// UTILIDADES DE CONVERSIÓN JDE → PostgreSQL
// ============================================================

/**
 * Fecha juliana JDE (CYYDDD) → Date ISO o null
 * C = siglo (0=19xx, 1=20xx), YY = año, DDD = día del año
 */
function julianToDate(julianNum) {
  if (!julianNum || julianNum === 0) return null;
  const s = String(julianNum).padStart(6, '0');
  const century = parseInt(s[0]) + 19;  // 0→19, 1→20
  const year = century * 100 + parseInt(s.substring(1, 3));
  const dayOfYear = parseInt(s.substring(3, 6));
  if (dayOfYear === 0 || dayOfYear > 366) return null;
  const d = new Date(year, 0, dayOfYear);
  return d.toISOString().split('T')[0];
}

/** Dividir por factor, retornar null si es 0/null/undefined */
function div(value, factor) {
  if (value == null || value === 0) return null;
  return Number((value / factor).toFixed(factor >= 10000 ? 4 : 2));
}

/** Trim de strings JDE (vienen con espacios) */
function t(value) {
  if (value == null) return null;
  const trimmed = String(value).trim();
  return trimmed === '' ? null : trimmed;
}

/** Boolean: 'S'→true, 'Y'→true, '1'→true, resto→false */
function toBool(value) {
  if (value == null) return false;
  const v = String(value).trim().toUpperCase();
  return v === 'S' || v === 'Y' || v === '1';
}

/** Tipo documento JDE → nuestro tipo */
function tipoDocumento(code) {
  const map = { '085': 'DNI', '086': 'CUIL' };
  return map[String(code).trim()] || 'DNI';
}

/** Género JDE → nuestro género */
function genero(code) {
  const map = { '1': 'masculino', '2': 'femenino' };
  return map[String(code).trim()] || null;
}

// ============================================================
// MIGRACIÓN STREAMING — HELPERS
// ============================================================

/**
 * Migra una tabla JDE completa a PostgreSQL usando streaming.
 * No carga todo en memoria: lee de a fetchArraySize filas.
 */
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
    if (transformed === null) continue;  // filtrado por transform

    batch.push(transformed);
    total++;

    if (batch.length >= BATCH_SIZE) {
      await insertBatch(pgPool, insertSQL, batch);
      process.stdout.write(`  → ${total} filas...\r`);
      batch = [];
    }
  }

  // Último batch parcial
  if (batch.length > 0) {
    await insertBatch(pgPool, insertSQL, batch);
  }

  await rs.close();

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`  ✅ ${name}: ${total} filas en ${elapsed}s`);

  if (onDone) await onDone(total);
  return total;
}

/** Inserta un batch de filas con un solo query multi-value */
async function insertBatch(pool, insertSQL, rows) {
  if (rows.length === 0) return;

  const client = await pool.connect();
  try {
    // Construir multi-value INSERT
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
// DEFINICIÓN DE CADA MIGRACIÓN
// ============================================================

// --- TABLAS MAESTRO (→ vintelarg_base) ---

const MAESTRO_MIGRATIONS = [
  // 1. CAMPAÑAS
  {
    name: 'campanias',
    query: `SELECT AAKCOO, AASRDM, AAUPC1, AAUPC2, AAFYEAR, AADTFR, AATODATE
            FROM ${JDE_CONFIG.schema}.F5900001
            ORDER BY AASRDM`,
    transform: (r) => [
      t(r.AAKCOO), r.AASRDM, t(r.AAUPC1), t(r.AAUPC2), r.AAFYEAR,
      julianToDate(r.AADTFR), julianToDate(r.AATODATE),
    ],
    insertSQL: `INSERT INTO campanias (compania, anio_campania, campania, anio_2d, anio_4d, fecha_inicio, fecha_fin)`,
  },

  // 2. ARTÍCULOS (excluir obsoletos)
  {
    name: 'articulos',
    query: `SELECT IMITM, IMLITM, IMDSC1, IMDSC2, IMSRP1, IMSRP2, IMSRP3, IMSRP4, IMSRP5,
                   IMSRP6, IMSRP7, IMSRP8, IMSRP9, IMSRP0,
                   IMPRP1, IMPRP2, IMPRP3, IMPRP4, IMPRP5,
                   IMUOM1, IMGLPT, IMVCUD, IMCOTY, IMCMCG, IMPDGR, IMDSGP, IMSLD, IMSTKT
            FROM ${JDE_CONFIG.schema}.F4101
            WHERE IMSTKT <> 'O'
            ORDER BY IMITM`,
    transform: (r) => [
      r.IMITM, t(r.IMLITM), t(r.IMDSC1), t(r.IMDSC2),
      t(r.IMSRP1), t(r.IMSRP2), t(r.IMSRP3), t(r.IMSRP4), t(r.IMSRP5),
      t(r.IMSRP6), t(r.IMSRP7), t(r.IMSRP8), t(r.IMSRP9), t(r.IMSRP0),
      t(r.IMPRP1), t(r.IMPRP2), t(r.IMPRP3), t(r.IMPRP4), t(r.IMPRP5),
      t(r.IMUOM1), t(r.IMGLPT), r.IMVCUD, t(r.IMCOTY), t(r.IMCMCG),
      t(r.IMPDGR), t(r.IMDSGP), r.IMSLD,
      t(r.IMSTKT),  // tipo_almacenamiento = STKT como referencia
    ],
    insertSQL: `INSERT INTO articulos (codigo_corto, codigo, descripcion, descripcion_2,
      seccion_catalogo, sub_seccion, categoria_ventas_3, categoria_ventas_4, categoria_ventas_5,
      tipo_producto, categoria_ventas_7, tipo_picking, categoria_ventas_9, categoria_ventas_10,
      clase_commodity, sub_clase_commodity, codigo_rebaja_prov, familia_planif, categoria_compras_5,
      unidad_medida, categoria_contable, volumen_cubico, tipo_componente, categoria_comision,
      grupo_producto, grupo_despacho, dias_vida_util, tipo_almacenamiento)`,
  },

  // 3. DIMENSIONES
  {
    name: 'articulos_dimensiones',
    query: `SELECT d.IQITM, d.IQUOM, d.IQGWID, d.IQGDEP, d.IQGHET, d.IQWIUM,
                   d.IQGCUB, d.IQVUMD, d.IQGWEI, d.IQUWUM,
                   d.IQPACK, d.IQEQTY, d.IQPPTG, d.IQPKTG
            FROM ${JDE_CONFIG.schema}.F46011 d
            INNER JOIN ${JDE_CONFIG.schema}.F4101 a ON d.IQITM = a.IMITM AND a.IMSTKT <> 'O'
            ORDER BY d.IQITM`,
    transform: (r) => {
      const artId = articulosMap.get(r.IQITM);
      if (!artId) return null; // Saltear si el artículo padre no fue migrado
      return [
        artId, r.IQITM, t(r.IQUOM),
        r.IQGWID, r.IQGDEP, r.IQGHET, t(r.IQWIUM),
        r.IQGCUB, t(r.IQVUMD), r.IQGWEI, t(r.IQUWUM),
        toBool(r.IQPACK), t(r.IQEQTY),
        r.IQPPTG || 0, r.IQPKTG || 0,
      ];
    },
    insertSQL: `INSERT INTO articulos_dimensiones (articulo_id, codigo_corto, unidad_medida,
      ancho, profundidad, alto, um_dimension, volumen_cubico, um_volumen,
      peso_bruto, um_peso, caja_especial, caja_minima, codigo_barras, forma_picking)`,
    customInsert: false,
  },

  // 4. KITS (solo depósito principal)
  {
    name: 'kits',
    query: `SELECT IXTBM, IXKIT, IXKITL, IXITM, IXLITM, IXCPNT,
                   IXQNTY, IXUM, IXEFFF, IXEFFT, IXOPTK, IXCOTY
            FROM ${JDE_CONFIG.schema}.F3002
            WHERE IXMMCU = '      280002'
            ORDER BY IXKIT, IXCPNT`,
    transform: (r) => [
      t(r.IXTBM), r.IXKIT, t(r.IXKITL), r.IXITM, t(r.IXLITM),
      r.IXCPNT, r.IXQNTY, t(r.IXUM),
      julianToDate(r.IXEFFF), julianToDate(r.IXEFFT),
      toBool(r.IXOPTK), t(r.IXCOTY),
    ],
    insertSQL: `INSERT INTO kits (tipo_bom, padre_corto, padre_codigo, componente_corto, componente_codigo,
      nro_linea, cantidad, unidad_medida, vigencia_desde, vigencia_hasta,
      componente_opcional, tipo_componente)`,
  },

  // 5. CAJAS
  {
    name: 'cajas',
    query: `SELECT IDMCU, IDEQTY, IDGWID, IDGDEP, IDGHET, IDWIUM,
                   IDGCUB, IDVUMD, IDGWEI, IDUWUM,
                   IDSHCT, IDAVCT, IDPRSH, IDCTPR, IDCTPM
            FROM ${JDE_CONFIG.schema}.F46091
            ORDER BY IDEQTY`,
    transform: (r) => [
      t(r.IDMCU), t(r.IDEQTY),
      r.IDGWID, r.IDGDEP, r.IDGHET, t(r.IDWIUM),
      r.IDGCUB, t(r.IDVUMD), r.IDGWEI, t(r.IDUWUM),
      t(r.IDSHCT), toBool(r.IDAVCT), r.IDPRSH,
      r.IDCTPR, r.IDCTPM,
    ],
    insertSQL: `INSERT INTO cajas (deposito, codigo_caja, ancho, profundidad, alto, um_dimension,
      volumen_cubico, um_volumen, peso_vacia, um_peso,
      tipo_contenedor, disponible, prioridad, pct_llenado_min, pct_llenado_max)`,
  },

  // 6. CATÁLOGO CAMPAÑA
  {
    name: 'catalogo_campania',
    query: `SELECT ACSRDM, ACLITM, ACDSC1, ACUPRC, AC59KY, ACVR01,
                   ACMATH08, ACMCU, ACMATH09, ACMATH04, ACMATH05
            FROM ${JDE_CONFIG.schema}.F5942002
            ORDER BY ACSRDM, ACLITM`,
    transform: (r) => [
      r.ACSRDM, t(r.ACLITM), t(r.ACDSC1),
      div(r.ACUPRC, 10000),   // precio ÷10.000
      t(r.AC59KY), t(r.ACVR01), r.ACMATH08 || 0, t(r.ACMCU),
      r.ACMATH09,
      div(r.ACMATH04, 100),   // factor ÷100
      div(r.ACMATH05, 100),   // factor ÷100
    ],
    insertSQL: `INSERT INTO catalogo_campania (anio_campania, codigo_articulo, descripcion,
      precio, linea_negocio, pagina_folleto, cuotas, deposito,
      version, factor_mult_unid, factor_mult_imp)`,
  },

  // 7. CALENDARIO OPERATIVO
  {
    name: 'calendario_operativo',
    query: `SELECT CCSRDM, CCUPC1, CCUPC2, CCZON, CCMCU,
                   CCAVDJ, CCBPDJ, CCBXDJ, CCVR01, CC59VR01,
                   CC59FFPCNS, CC59FFPLDR, CC59FFPGTE
            FROM ${JDE_CONFIG.schema}.F5942004
            ORDER BY CCSRDM, CCZON`,
    transform: (r) => [
      r.CCSRDM, t(r.CCUPC1), t(r.CCUPC2), t(r.CCZON), t(r.CCMCU),
      julianToDate(r.CCAVDJ), julianToDate(r.CCBPDJ), julianToDate(r.CCBXDJ),
      t(r.CCVR01), t(r.CC59VR01),
      julianToDate(r.CC59FFPCNS), julianToDate(r.CC59FFPLDR), julianToDate(r.CC59FFPGTE),
    ],
    insertSQL: `INSERT INTO calendario_operativo (anio_campania, campania, anio_2d, zona, deposito,
      fecha_pre_facturacion, fecha_picking, fecha_salida_troncal, localidad, distribuidor,
      fin_pedidos_consultoras, fin_pedidos_lideres, fin_pedidos_gerentes)`,
  },
];

// --- TABLAS PERSONAS / FV (→ vintelarg_base, pero requiere lógica especial) ---

async function migratePersonas(oraConn, pgPool) {
  console.log('\n📦 Migrando: personas + telefonos + direcciones + fiscal + fv_revendedora (F5901012)');
  const startTime = Date.now();

  const query = `SELECT TRAN8, TRCO, TRSEC, TREMAL, TRGEND, TRDOB,
    TR59TDOC, TR59NDOC, TR59NMB1, TR59NMB2, TR59APE1, TR59APE2,
    TRPH1, TRPH2, TRAR1,
    TRCTR, TRADDS, TRADD1, TRADD2, TRADDC, TRCTY1,
    TRADD4, TRADD5, TRADD6, TRDEL1, TRDEL2,
    TRTXA1, TRAC16, TRAC17, TRAC18,
    TRUPC1, TRYEARSTAR, TRDAOJ,
    TRAN82, TRAN84, TR59NDOCPATR, TR59TDOCPATR,
    TRAAQ3, TR59SECENT, TR59PUNACU, TRZON
    FROM ${JDE_CONFIG.schema}.F5901012
    ORDER BY TRAN8`;

  const result = await oraConn.execute(query, [], {
    resultSet: true,
    fetchArraySize: BATCH_SIZE,
    outFormat: oracledb.OUT_FORMAT_OBJECT,
  });

  const rs = result.resultSet;
  let row;
  let total = 0;
  const seenDocs = new Set();
  const seenEmails = new Set();
  const client = await pgPool.connect();

  let batch = [];

  async function processPersonasBatch(rowsBatch) {
    if (rowsBatch.length === 0) return;
    await client.query('BEGIN');
    try {
      // 1. Insertar Personas en lote
      const valSets = [];
      const params = [];
      let pIdx = 1;
      for (const r of rowsBatch) {
        const placeholders = [];
        const vals = [
          r.an8, r.tipoDoc, r.numDoc,
          r.nombre_1, r.nombre_2, r.apellido_1, r.apellido_2,
          r.email, r.dob, r.gen, r.compania, r.seccion
        ];
        for (const v of vals) {
          placeholders.push(`$${pIdx++}`);
          params.push(v);
        }
        valSets.push(`(${placeholders.join(',')})`);
      }

      const personasSQL = `
        INSERT INTO personas (numero_cliente, tipo_documento, numero_documento,
          nombre_1, nombre_2, apellido_1, apellido_2, email,
          fecha_nacimiento, genero, compania, seccion)
        VALUES ${valSets.join(',')}
        ON CONFLICT (numero_cliente) DO UPDATE SET numero_cliente = EXCLUDED.numero_cliente
        RETURNING id, numero_cliente
      `;
      const personaRes = await client.query(personasSQL, params);

      // Crear mapa numero_cliente -> personaId
      const personaIdMap = new Map();
      for (const r of personaRes.rows) {
        personaIdMap.set(r.numero_cliente, r.id);
      }

      // 2. Insertar Telefonos en lote
      const telValSets = [];
      const telParams = [];
      let telIdx = 1;
      for (const r of rowsBatch) {
        const personaId = personaIdMap.get(r.an8);
        if (!personaId) continue;
        if (r.tel1) {
          telValSets.push(`($${telIdx++}, 'principal', $${telIdx++}, TRUE)`);
          telParams.push(personaId, r.tel1);
        }
        if (r.tel2 && r.tel2 !== r.tel1) {
          telValSets.push(`($${telIdx++}, 'secundario', $${telIdx++}, FALSE)`);
          telParams.push(personaId, r.tel2);
        }
      }
      if (telValSets.length > 0) {
        const telSQL = `INSERT INTO personas_telefonos (persona_id, tipo, numero, principal) VALUES ${telValSets.join(',')}`;
        await client.query(telSQL, telParams);
      }

      // 3. Insertar Direcciones en lote
      const dirValSets = [];
      const dirParams = [];
      let dirIdx = 1;
      for (const r of rowsBatch) {
        const personaId = personaIdMap.get(r.an8);
        if (!personaId || !r.calle) continue;

        const placeholders = [];
        const vals = [
          personaId, 'entrega', r.pais, r.provincia, r.calle,
          r.direccion_2, r.codigo_postal, r.localidad, r.entre_calles_1, r.entre_calles_2,
          r.barrio, r.instrucciones_1, r.instrucciones_2, true
        ];
        for (const v of vals) {
          placeholders.push(`$${dirIdx++}`);
          dirParams.push(v);
        }
        dirValSets.push(`(${placeholders.join(',')})`);
      }
      if (dirValSets.length > 0) {
        const dirSQL = `INSERT INTO personas_direcciones (persona_id, tipo, pais, provincia, calle,
          direccion_2, codigo_postal, localidad, entre_calles_1, entre_calles_2,
          barrio, instrucciones_1, instrucciones_2, principal) VALUES ${dirValSets.join(',')}`;
        await client.query(dirSQL, dirParams);
      }

      // 4. Insertar Fiscal en lote
      const fisValSets = [];
      const fisParams = [];
      let fisIdx = 1;
      for (const r of rowsBatch) {
        const personaId = personaIdMap.get(r.an8);
        if (!personaId) continue;

        const placeholders = [];
        const vals = [personaId, r.numDoc, r.condicion_iva, r.categoria_16, r.categoria_17, r.categoria_18];
        for (const v of vals) {
          placeholders.push(`$${fisIdx++}`);
          fisParams.push(v);
        }
        fisValSets.push(`(${placeholders.join(',')})`);
      }
      if (fisValSets.length > 0) {
        const fisSQL = `INSERT INTO personas_fiscal (persona_id, cuit, condicion_iva, categoria_16, categoria_17, categoria_18)
          VALUES ${fisValSets.join(',')} ON CONFLICT (persona_id) DO NOTHING`;
        await client.query(fisSQL, fisParams);
      }

      // 5. Insertar fv_revendedora en lote
      const fvValSets = [];
      const fvParams = [];
      let fvIdx = 1;
      for (const r of rowsBatch) {
        const personaId = personaIdMap.get(r.an8);
        if (!personaId) continue;

        const placeholders = [];
        const vals = [
          personaId, r.an8, r.zona,
          r.campania_alta, r.anio_alta, r.fecha_alta,
          r.um_numero, r.indicante_numero, r.indicante_doc, r.indicante_tipo_doc, r.patrocinante_numero,
          r.limite_credito, r.secuencia_entrega, r.puntos_acumulados
        ];
        for (const v of vals) {
          placeholders.push(`$${fvIdx++}`);
          fvParams.push(v);
        }
        fvValSets.push(`(${placeholders.join(',')})`);
      }
      if (fvValSets.length > 0) {
        const fvSQL = `INSERT INTO fv_revendedora (persona_id, numero_cliente, zona,
          campania_alta, anio_alta, fecha_alta,
          um_numero, indicante_numero, indicante_doc, indicante_tipo_doc, patrocinante_numero,
          limite_credito, secuencia_entrega, puntos_acumulados)
          VALUES ${fvValSets.join(',')} ON CONFLICT (numero_cliente) DO NOTHING`;
        await client.query(fvSQL, fvParams);
      }

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    }
  }

  try {
    while ((row = await rs.getRow())) {
      const an8 = row.TRAN8;
      const tipoDoc = tipoDocumento(row.TR59TDOC);
      const numDoc = t(row.TR59NDOC);
      const dedupKey = `${tipoDoc}:${numDoc}`;

      // Dedup por tipo_doc + numero_doc
      if (numDoc && seenDocs.has(dedupKey)) continue;
      if (numDoc) seenDocs.add(dedupKey);

      // Email dedup
      let email = t(row.TREMAL);
      if (email && seenEmails.has(email.toLowerCase())) {
        email = `rev_${an8}@aware.com.ar`;
      }
      if (email) seenEmails.add(email.toLowerCase());

      const transformed = {
        an8,
        tipoDoc,
        numDoc,
        nombre_1: t(row.TR59NMB1),
        nombre_2: t(row.TR59NMB2),
        apellido_1: t(row.TR59APE1),
        apellido_2: t(row.TR59APE2),
        email,
        dob: julianToDate(row.TRDOB),
        gen: genero(row.TRGEND),
        compania: t(row.TRCO),
        seccion: t(row.TRSEC),
        tel1: t(row.TRPH1),
        tel2: t(row.TRPH2),
        calle: t(row.TRADD1),
        pais: t(row.TRCTR),
        provincia: t(row.TRADDS),
        direccion_2: t(row.TRADD2),
        codigo_postal: t(row.TRADDC),
        localidad: t(row.TRCTY1),
        entre_calles_1: t(row.TRADD4),
        entre_calles_2: t(row.TRADD5),
        barrio: t(row.TRADD6),
        instrucciones_1: t(row.TRDEL1),
        instrucciones_2: t(row.TRDEL2),
        condicion_iva: t(row.TRTXA1),
        categoria_16: t(row.TRAC16),
        categoria_17: t(row.TRAC17),
        categoria_18: t(row.TRAC18),
        zona: t(row.TRZON),
        campania_alta: t(row.TRUPC1),
        anio_alta: t(row.TRYEARSTAR),
        fecha_alta: julianToDate(row.TRDAOJ),
        um_numero: row.TRAN82,
        indicante_numero: row.TRAN84,
        indicante_doc: t(row.TR59NDOCPATR),
        indicante_tipo_doc: t(row.TR59TDOCPATR),
        patrocinante_numero: row.TRAN82,
        limite_credito: div(row.TRAAQ3, 100),
        secuencia_entrega: row.TR59SECENT,
        puntos_acumulados: row.TR59PUNACU || 0
      };

      batch.push(transformed);
      total++;

      if (batch.length >= BATCH_SIZE) {
        await processPersonasBatch(batch);
        process.stdout.write(`  → ${total} personas...\r`);
        batch = [];
      }
    }

    // Último lote parcial
    if (batch.length > 0) {
      await processPersonasBatch(batch);
    }

  } catch (err) {
    throw err;
  } finally {
    client.release();
  }

  await rs.close();
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`  ✅ personas + dependencias: ${total} registros en ${elapsed}s`);
}

// --- TABLAS TRANSACCIONALES (→ aware_analytics / TimescaleDB) ---
// FILTRO: solo campañas >= 202501

const TRANSACCIONAL_MIGRATIONS = [
  // FACTURAS CABECERA
  {
    name: 'documentos_cabecera (facturas)',
    query: `SELECT HFASYEAR, HFUPC1, HFUPC2, HFZON, HFAN8, HFEV01,
                   HFDOC1, HFDATETIME, HFAEXP, HFAOPN, HFVR01, HFKCOO,
                   HFDCTO, HFDOCO, HFVR02, HFDCT, HFDOC, HF59CANAL, HFSRDM,
                   HFPA8, HFEXR1, HFTXA1, HFAC16, HFAC17, HFAC18,
                   HFAN82, HFIVD, HFADDS, HF59ATZON01, HF59ATZON02,
                   HF59UNIFAC, HF59UNIFIS, HFUORG, HF59PRERET
            FROM ${JDE_CONFIG.schema}.F59IHF01
            WHERE HFSRDM >= ${CAMPANIA_MINIMA}
            ORDER BY HFSRDM, HFDOC1`,
    transform: (r) => [
      r.HFSRDM, t(r.HFUPC1), t(r.HFUPC2), t(r.HFASYEAR), t(r.HFZON), r.HFAN8,
      t(r.HFEV01) || '1',  // naturaleza: facturas = 1
      t(r.HFDCTO), t(r.HFDCT), r.HFDOC1, r.HFDOCO, r.HFDOC,
      t(r.HFVR02), t(r.HFVR01),
      div(r.HFAEXP, 100), div(r.HFAOPN, 100), div(r.HF59PRERET, 100),
      div(r.HF59UNIFAC, 10000), div(r.HF59UNIFIS, 10000), div(r.HFUORG, 10000),
      null, false, null,  // origen_nota, anulado, total_unidades (solo NC/ND)
      t(r.HFKCOO), t(r.HF59CANAL), r.HFPA8, r.HFAN82,
      t(r.HFEXR1), t(r.HFTXA1), t(r.HFAC16), t(r.HFAC17), t(r.HFAC18),
      t(r.HFADDS), t(r.HF59ATZON01), t(r.HF59ATZON02),
      r.HFDATETIME ? new Date(r.HFDATETIME) : null,
      julianToDate(r.HFIVD),
    ],
    insertSQL: `INSERT INTO documentos_cabecera (anio_campania, campania, anio_2d, anio_4d, zona, numero_cliente,
      naturaleza, tipo_pedido, tipo_doc_interno, nro_doc_crp, nro_pedido, nro_doc_interno,
      nro_legal, orden_compra_crp,
      importe_con_imp, importe_sin_imp, precio_retail,
      unidades_facturadas, unidades_fisicas, unidades,
      origen_nota, anulado, total_unidades_ncnd,
      compania, canal, gerente_cliente, um_numero,
      codigo_fiscal, area_fiscal, categoria_16, categoria_17, categoria_18,
      provincia, atrib_zona_export, atrib_zona_ecommerce,
      fecha_factura, fecha_factura_juliana)`,
  },

  // NC/ND CABECERA
  {
    name: 'documentos_cabecera (NC/ND)',
    query: `SELECT HNASYEAR, HNUPC1, HNUPC2, HNZON, HNAN8, HNEV01,
                   HNDOC1, HNDATETIME, HNMATH07, HNMATH09,
                   HNAEXP, HNAOPN, HNACTU, HNVR01, HNKCOO,
                   HNDCTO, HNDOCO, HNVR02, HNDCT, HNDOC, HN59CANAL, HNSRDM,
                   HNPA8, HNEXR1, HNTXA1, HNAC16, HNAC17, HNAC18,
                   HNAN82, HNADDS, HN59ATZON01, HN59ATZON02,
                   HN59UNIFAC, HN59UNIFIS, HN59PRERET
            FROM ${JDE_CONFIG.schema}.F59IHN01
            WHERE HNSRDM >= ${CAMPANIA_MINIMA}
            ORDER BY HNSRDM, HNDOC1`,
    transform: (r) => [
      r.HNSRDM, t(r.HNUPC1), t(r.HNUPC2), t(r.HNASYEAR), t(r.HNZON), r.HNAN8,
      t(r.HNEV01),  // naturaleza: 2=Déb, 3=Créd
      t(r.HNDCTO), t(r.HNDCT), r.HNDOC1, r.HNDOCO, r.HNDOC,
      t(r.HNVR02), t(r.HNVR01),
      div(r.HNAEXP, 100), div(r.HNAOPN, 100), div(r.HN59PRERET, 100),
      div(r.HN59UNIFAC, 10000), div(r.HN59UNIFIS, 10000), null,
      r.HNMATH07,                        // origen_nota
      r.HNMATH09 === 1,                  // anulado
      r.HNACTU,                          // total_unidades_ncnd
      t(r.HNKCOO), t(r.HN59CANAL), r.HNPA8, r.HNAN82,
      t(r.HNEXR1), t(r.HNTXA1), t(r.HNAC16), t(r.HNAC17), t(r.HNAC18),
      t(r.HNADDS), t(r.HN59ATZON01), t(r.HN59ATZON02),
      r.HNDATETIME ? new Date(r.HNDATETIME) : null,
      null,  // fecha juliana no disponible directo en NC/ND cab
    ],
    insertSQL: `INSERT INTO documentos_cabecera (anio_campania, campania, anio_2d, anio_4d, zona, numero_cliente,
      naturaleza, tipo_pedido, tipo_doc_interno, nro_doc_crp, nro_pedido, nro_doc_interno,
      nro_legal, orden_compra_crp,
      importe_con_imp, importe_sin_imp, precio_retail,
      unidades_facturadas, unidades_fisicas, unidades,
      origen_nota, anulado, total_unidades_ncnd,
      compania, canal, gerente_cliente, um_numero,
      codigo_fiscal, area_fiscal, categoria_16, categoria_17, categoria_18,
      provincia, atrib_zona_export, atrib_zona_ecommerce,
      fecha_factura, fecha_factura_juliana)`,
  },

  // FACTURAS DETALLE
  {
    name: 'documentos_detalle (facturas)',
    query: `SELECT DFSRDM, DFUPC1, DFUPC2, DF59DIV, DFZON, DFEV01,
                   DFDOC1, DFAN8, DFKCOO, DFDCTO, DFDOCO, DFLNID, DFDOC,
                   DFLITM, DFAITM, DFITM, DFUPC,
                   DFMATH08, DFAEXP, DFAA, DFAAFC, DFMATH06,
                   DFSRP1, DFAAPI, DFEUSE, DFDTYS, DFVR01, DFEV03, DFRLLN, DF59TIPROD,
                   DFEV06, DFEV07, DFEV08, DFEV09,
                   DFLITMSUS, DFITMSUS, DFRLLNSUS, DF59MCUSUS,
                   DFAN82, DFIVD, DFADDS, DFVR02,
                   DF59IMPTOCI, DF59IMPTOSI, DF59FNDISOSI, DF59IMPTONDC,
                   DF59UNIFAC, DF59UNIFIS, DF59PRERET, DFUNCS, DFECST
            FROM ${JDE_CONFIG.schema}.F59IDF11
            WHERE DFSRDM >= ${CAMPANIA_MINIMA}
            ORDER BY DFSRDM, DFDOC1, DFLNID`,
    transform: (r) => [
      r.DFSRDM, t(r.DFUPC1), t(r.DFUPC2), r.DF59DIV, t(r.DFZON),
      t(r.DFEV01) || '1', r.DFDOC1, r.DFAN8, t(r.DFKCOO), t(r.DFDCTO),
      r.DFDOCO, div(r.DFLNID, 1000), r.DFDOC,
      t(r.DFLITM), t(r.DFAITM), r.DFITM, r.DFUPC,
      r.DFMATH08, div(r.DFAEXP, 100), div(r.DFAA, 100), div(r.DFAAFC, 100), r.DFMATH06,
      t(r.DFSRP1), r.DFAAPI, t(r.DFEUSE), t(r.DFDTYS), t(r.DFVR01),
      t(r.DFEV03), div(r.DFRLLN, 1000), t(r.DF59TIPROD),
      t(r.DFEV06), t(r.DFEV07), t(r.DFEV08), t(r.DFEV09),
      t(r.DFLITMSUS), r.DFITMSUS, div(r.DFRLLNSUS, 1000), t(r.DF59MCUSUS),
      r.DFAN82, julianToDate(r.DFIVD), t(r.DFADDS), t(r.DFVR02),
      null, null,  // campania_afectada (solo NC/ND)
      div(r.DF59IMPTOCI, 100), div(r.DF59IMPTOSI, 100),
      div(r.DF59FNDISOSI, 100), div(r.DF59IMPTONDC, 100),
      div(r.DF59UNIFAC, 10000), div(r.DF59UNIFIS, 10000), div(r.DF59PRERET, 100),
      div(r.DFUNCS, 10000), div(r.DFECST, 100),
    ],
    insertSQL: `INSERT INTO documentos_detalle (anio_campania, campania, anio_2d, division, zona,
      naturaleza, nro_doc_crp, numero_cliente, compania, tipo_pedido,
      nro_pedido, nro_linea, nro_doc_interno,
      codigo_articulo, codigo_articulo_3, codigo_articulo_corto, cantidad_kit,
      unidades, precio_unit_sin_imp, precio_unit_con_imp, precio_folleto, pct_iva,
      categoria_ventas_1, rubro, tipo_politica, politica, orden_compra_art,
      tipo_linea, nro_cuota, tipo_producto,
      no_disponible, entrega_camp_ant, sustitucion, es_kit,
      sustituto_codigo, sustituto_corto, sustituto_linea, sustituto_deposito,
      um_numero, fecha_factura, provincia, nro_legal,
      campania_afectada, anio_campania_afectada,
      importe_linea_con_imp, importe_linea_sin_imp,
      imp_no_disp_sin_imp, imp_no_disp_con_imp,
      unidades_facturadas, unidades_fisicas, precio_retail,
      costo_unitario, costo_total)`,
  },

  // NC/ND DETALLE
  {
    name: 'documentos_detalle (NC/ND)',
    query: `SELECT DNSRDM, DNUPC1, DNUPC2, DN59DIV, DNZON, DNEV01,
                   DNDOC1, DNAN8, DNKCOO, DNDCTO, DNDOCO, DNLNID, DNDOC,
                   DNLITM, DNAITM, DNUPC,
                   DNMATH08, DNAEXP, DNAA, DNAAFC, DNMATH06,
                   DNSRP1, DNAAPI, DNEUSE, DNDTYS, DNVR01, DN59TIPROD,
                   DNEV06, DNEV07, DNEV08, DNEV09,
                   DNAN82, DNIVD, DNADDS, DNVR02,
                   DN59AFECA, DN59AFEAN,
                   DN59IMPTOCI, DN59IMPTOSI,
                   DN59UNIFAC, DN59UNIFIS, DN59PRERET
            FROM ${JDE_CONFIG.schema}.F59IDN11
            WHERE DNSRDM >= ${CAMPANIA_MINIMA}
            ORDER BY DNSRDM, DNDOC1, DNLNID`,
    transform: (r) => [
      r.DNSRDM, t(r.DNUPC1), t(r.DNUPC2), r.DN59DIV, t(r.DNZON),
      t(r.DNEV01), r.DNDOC1, r.DNAN8, t(r.DNKCOO), t(r.DNDCTO),
      r.DNDOCO, div(r.DNLNID, 1000), r.DNDOC,
      t(r.DNLITM), t(r.DNAITM), null, r.DNUPC,  // codigo_articulo_corto no existe en NC/ND
      r.DNMATH08, div(r.DNAEXP, 100), div(r.DNAA, 100), div(r.DNAAFC, 100), r.DNMATH06,
      t(r.DNSRP1), r.DNAAPI, t(r.DNEUSE), t(r.DNDTYS), t(r.DNVR01),
      null, null, t(r.DN59TIPROD),  // tipo_linea y nro_cuota no en NC/ND
      t(r.DNEV06), t(r.DNEV07), t(r.DNEV08), t(r.DNEV09),
      null, null, null, null,  // sustitución no en NC/ND
      r.DNAN82, julianToDate(r.DNIVD), t(r.DNADDS), t(r.DNVR02),
      r.DN59AFECA, t(r.DN59AFEAN),  // campaña afectada
      div(r.DN59IMPTOCI, 100), div(r.DN59IMPTOSI, 100),
      null, null,  // imp_no_disp no en NC/ND
      div(r.DN59UNIFAC, 10000), div(r.DN59UNIFIS, 10000), div(r.DN59PRERET, 100),
      null, null,  // costos no en NC/ND
    ],
    insertSQL: `INSERT INTO documentos_detalle (anio_campania, campania, anio_2d, division, zona,
      naturaleza, nro_doc_crp, numero_cliente, compania, tipo_pedido,
      nro_pedido, nro_linea, nro_doc_interno,
      codigo_articulo, codigo_articulo_3, codigo_articulo_corto, cantidad_kit,
      unidades, precio_unit_sin_imp, precio_unit_con_imp, precio_folleto, pct_iva,
      categoria_ventas_1, rubro, tipo_politica, politica, orden_compra_art,
      tipo_linea, nro_cuota, tipo_producto,
      no_disponible, entrega_camp_ant, sustitucion, es_kit,
      sustituto_codigo, sustituto_corto, sustituto_linea, sustituto_deposito,
      um_numero, fecha_factura, provincia, nro_legal,
      campania_afectada, anio_campania_afectada,
      importe_linea_con_imp, importe_linea_sin_imp,
      imp_no_disp_sin_imp, imp_no_disp_con_imp,
      unidades_facturadas, unidades_fisicas, precio_retail,
      costo_unitario, costo_total)`,
  },

  // FV_EVENTOS (solo diffs — estado != vigencia)
  {
    name: 'fv_eventos',
    query: `SELECT HECO, HESRDM, HEUPC1, HEUPC2, HEAN8,
                   HEGPDP, HEA76ST, HE59VIGENCIA, HEDSC1,
                   HEZON, HE59UMACT, HE59UMESTACT, HE59ORREGE
            FROM ${JDE_CONFIG.schema}.F5901015
            WHERE HESRDM >= ${CAMPANIA_MINIMA}
              AND HEA76ST <> HE59VIGENCIA
            ORDER BY HESRDM, HEAN8`,
    transform: (r) => {
      const estadoNuevo = t(r.HEA76ST);
      const vigencia = t(r.HE59VIGENCIA);

      // Determinar tipo de evento (simplificado — se refina con registro previo)
      let tipoEvento = 'cambio_estado';
      if (!vigencia || vigencia === '') tipoEvento = 'alta';

      return [
        r.HESRDM, r.HEAN8, tipoEvento,
        estadoNuevo, vigencia,  // estado_anterior = vigencia en F5901015
        t(r.HEDSC1), vigencia,
        t(r.HEUPC1), t(r.HEUPC2), r.HECO,
        t(r.HEZON), null,  // zona_anterior se llena en post-proceso
        r.HE59UMACT, t(r.HE59UMESTACT), null,  // um_anterior
        null, null,  // gz_ei, divisional (futuro: tabla estructura)
        t(r.HE59ORREGE), t(r.HEGPDP),
      ];
    },
    insertSQL: `INSERT INTO fv_eventos (campana_srdm, numero_cliente, tipo_evento,
      estado_nuevo, estado_anterior, estado_descripcion, vigencia,
      campania, anio_2d, anio_campania_eco,
      zona_nueva, zona_anterior,
      um_nueva, um_estado_nuevo, um_anterior,
      gz_ei_nuevo, divisional_nuevo,
      origen_registro, grupo_producto)`,
  },
];


// ============================================================
// MAIN
// ============================================================

async function main() {
  console.log('='.repeat(60));
  console.log('MIGRACIÓN JDE Oracle → PostgreSQL/TimescaleDB');
  console.log(`Campaña mínima transaccional: ${CAMPANIA_MINIMA}`);
  console.log('='.repeat(60));

  // Validar config
  if (JDE_CONFIG.user === 'PENDIENTE') {
    console.error('\n❌ ERROR: Completar JDE_CONFIG con los datos de conexión Oracle antes de ejecutar.');
    process.exit(1);
  }

  let oraConn;
  const pgPool = new Pool(PG_CONFIG);
  const tsdbPool = new Pool(TSDB_CONFIG);

  try {
    // Conectar a JDE Oracle
    console.log('\n🔌 Conectando a JDE Oracle...');
    oraConn = await oracledb.getConnection(JDE_CONFIG);
    console.log('  ✅ JDE Oracle conectado');

    // Verificar conexión PG
    const pgClient = await pgPool.connect();
    console.log('  ✅ PostgreSQL (vintelarg_base) conectado');
    pgClient.release();

    // Verificar conexión TSDB
    const tsdbClient = await tsdbPool.connect();
    console.log('  ✅ TimescaleDB (aware_analytics) conectado');
    tsdbClient.release();

    // ---- FASE 1: Tablas maestro → vintelarg_base ----
    console.log('\n' + '='.repeat(60));
    console.log('FASE 1: Tablas maestro → vintelarg_base');
    console.log('='.repeat(60));

    for (const mig of MAESTRO_MIGRATIONS) {
      if (mig.name === 'articulos_dimensiones') {
        console.log(`\n🔍 Cargando articulos en cache para resolución de clave foránea...`);
        const artRes = await pgPool.query('SELECT id, codigo_corto FROM articulos');
        articulosMap.clear();
        for (const r of artRes.rows) {
          articulosMap.set(r.codigo_corto, r.id);
        }
        console.log(`  ✅ ${articulosMap.size} artículos cargados en caché.`);
      }
      await migrateTable({
        oraConn, pgPool, name: mig.name,
        query: mig.query, transform: mig.transform, insertSQL: mig.insertSQL,
      });
    }

    // Personas (migración especial)
    await migratePersonas(oraConn, pgPool);

    // ---- FASE 2: Tablas transaccionales → aware_analytics (TimescaleDB) ----
    console.log('\n' + '='.repeat(60));
    console.log(`FASE 2: Tablas transaccionales → aware_analytics (>= ${CAMPANIA_MINIMA})`);
    console.log('='.repeat(60));

    for (const mig of TRANSACCIONAL_MIGRATIONS) {
      await migrateTable({
        oraConn, pgPool: tsdbPool, name: mig.name,
        query: mig.query, transform: mig.transform, insertSQL: mig.insertSQL,
      });
    }

    // ---- FASE 3: Post-proceso ----
    console.log('\n' + '='.repeat(60));
    console.log('FASE 3: Post-proceso');
    console.log('='.repeat(60));

    // Actualizar stencial en fv_revendedora basado en último estado
    console.log('\n📦 Actualizando stencial en fv_revendedora...');
    await pgPool.query(`
      UPDATE fv_revendedora SET stencial = TRUE
      WHERE estado IN ('AC', 'IN', 'RI')
    `);
    const stRes = await pgPool.query(`SELECT count(*) FROM fv_revendedora WHERE stencial = TRUE`);
    console.log(`  ✅ Stencial: ${stRes.rows[0].count} revendedoras activas`);

    // Resumen final
    console.log('\n' + '='.repeat(60));
    console.log('MIGRACIÓN COMPLETADA');
    console.log('='.repeat(60));

    // Conteos finales
    const tables = [
      { pool: pgPool, name: 'campanias' },
      { pool: pgPool, name: 'articulos' },
      { pool: pgPool, name: 'kits' },
      { pool: pgPool, name: 'cajas' },
      { pool: pgPool, name: 'catalogo_campania' },
      { pool: pgPool, name: 'calendario_operativo' },
      { pool: pgPool, name: 'personas' },
      { pool: pgPool, name: 'personas_telefonos' },
      { pool: pgPool, name: 'personas_direcciones' },
      { pool: pgPool, name: 'personas_fiscal' },
      { pool: pgPool, name: 'fv_revendedora' },
      { pool: tsdbPool, name: 'documentos_cabecera' },
      { pool: tsdbPool, name: 'documentos_detalle' },
      { pool: tsdbPool, name: 'fv_eventos' },
    ];

    for (const tbl of tables) {
      const res = await tbl.pool.query(`SELECT count(*) FROM ${tbl.name}`);
      console.log(`  ${tbl.name}: ${res.rows[0].count} filas`);
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
