-- ============================================================
-- 02-aware-analytics.sql
-- Base: aware_analytics (TimescaleDB / PG16, puerto 5435)
-- 3 tablas transaccionales con hypertables
-- ============================================================
-- Ejecutar con:
-- PGPASSWORD='NovaDB2026!Segura#' psql -h 136.248.103.210 -p 5435 -U postgres -d aware_analytics -f 02-aware-analytics.sql
-- ============================================================

BEGIN;

-- Verificar extensión TimescaleDB
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- ===================
-- DOCUMENTOS CABECERA (Facturas + NC/ND unificados)
-- Fuente: F59IHF01 + F59IHN01
-- Campo naturaleza: 1=Factura, 2=Débito (ND), 3=Crédito (NC)
-- ===================

CREATE TABLE IF NOT EXISTS documentos_cabecera (
    id                    BIGSERIAL,
    anio_campania         INTEGER      NOT NULL,           -- SRDM (ej: 202509) — hypertable key
    campania              CHAR(2)      NOT NULL,
    anio_2d               CHAR(2)      NOT NULL,
    anio_4d               CHAR(4),
    zona                  CHAR(3),
    numero_cliente        INTEGER      NOT NULL,
    -- Tipo y naturaleza
    naturaleza            CHAR(1)      NOT NULL,           -- 1=Factura, 2=Débito, 3=Crédito
    tipo_pedido           CHAR(2),                         -- SO,SC,SJ,SV,SY,CR,CO,CC,CN,CI,CK,CT,CV,CY,DR,DO,DC,DN,DI,DK,DT,DV,DY
    tipo_doc_interno      CHAR(2),                         -- FA,FV,FY,NC,ND
    nro_doc_crp           BIGINT,
    nro_pedido            BIGINT,
    nro_doc_interno       BIGINT,
    nro_legal             VARCHAR(25),
    orden_compra_crp      VARCHAR(25),
    -- Importes (ya divididos ÷100 en migración)
    importe_con_imp       NUMERIC(15,2),
    importe_sin_imp       NUMERIC(15,2),
    precio_retail         NUMERIC(15,2),
    -- Unidades (ya divididas ÷10.000 en migración)
    unidades_facturadas   NUMERIC(15,4),
    unidades_fisicas      NUMERIC(15,4),
    unidades              NUMERIC(15,4),
    -- Campos exclusivos NC/ND (NULL en facturas)
    origen_nota           SMALLINT,                        -- 1=desm,2=rev,3=mas,5=rearm,7=recl,8=com,9=crp
    anulado               BOOLEAN      DEFAULT FALSE,
    total_unidades_ncnd   NUMERIC(15,4),
    -- Estructura y clasificación
    compania              CHAR(5),
    canal                 CHAR(3),                         -- vacío=trad, 2=B2C, 3=B2B, 4=B2B2C
    gerente_cliente       INTEGER,
    um_numero             INTEGER,
    codigo_fiscal         CHAR(2),
    area_fiscal           VARCHAR(10),
    categoria_16          CHAR(3),
    categoria_17          CHAR(3),
    categoria_18          CHAR(3),
    provincia             CHAR(3),
    atrib_zona_export     CHAR(1),
    atrib_zona_ecommerce  CHAR(1),
    -- Fechas
    fecha_factura         TIMESTAMPTZ,
    fecha_factura_juliana DATE,
    -- PK compuesta para hypertable
    PRIMARY KEY (id, anio_campania)
);

-- Hypertable: 1 chunk por campaña (entero)
SELECT create_hypertable('documentos_cabecera', 'anio_campania',
    chunk_time_interval => 1,
    if_not_exists => TRUE,
    migrate_data => TRUE
);

CREATE INDEX IF NOT EXISTS idx_doc_cab_cliente ON documentos_cabecera (numero_cliente, anio_campania);
CREATE INDEX IF NOT EXISTS idx_doc_cab_naturaleza ON documentos_cabecera (naturaleza, anio_campania);
CREATE INDEX IF NOT EXISTS idx_doc_cab_tipo_pedido ON documentos_cabecera (tipo_pedido, anio_campania);
CREATE INDEX IF NOT EXISTS idx_doc_cab_zona ON documentos_cabecera (zona, anio_campania);
CREATE INDEX IF NOT EXISTS idx_doc_cab_nro_doc ON documentos_cabecera (nro_doc_crp, anio_campania);

-- ===================
-- DOCUMENTOS DETALLE (Detalle Facturas + NC/ND unificados)
-- Fuente: F59IDF11 + F59IDN11
-- ===================

CREATE TABLE IF NOT EXISTS documentos_detalle (
    id                    BIGSERIAL,
    anio_campania         INTEGER      NOT NULL,           -- hypertable key
    campania              CHAR(2),
    anio_2d               CHAR(2),
    division              INTEGER,
    zona                  CHAR(3),
    naturaleza            CHAR(1)      NOT NULL,
    nro_doc_crp           BIGINT       NOT NULL,           -- FK lógica a documentos_cabecera
    numero_cliente        INTEGER      NOT NULL,
    compania              CHAR(5),
    tipo_pedido           CHAR(2),
    nro_pedido            BIGINT,
    nro_linea             NUMERIC(10,3),                   -- LNID ÷1.000
    nro_doc_interno       BIGINT,
    -- Artículo
    codigo_articulo       VARCHAR(25),
    codigo_articulo_3     VARCHAR(25),
    codigo_articulo_corto INTEGER,
    cantidad_kit          INTEGER,
    -- Cantidades y precios unitarios (÷100 en migración)
    unidades              NUMERIC(15,4),
    precio_unit_sin_imp   NUMERIC(15,2),
    precio_unit_con_imp   NUMERIC(15,2),
    precio_folleto        NUMERIC(15,2),
    pct_iva               NUMERIC(5,2),
    -- Clasificación comercial
    categoria_ventas_1    CHAR(3),                         -- TU/CO/HO/FO/PM/OT
    rubro                 SMALLINT,                        -- FK lógica a vintelarg_base.rubros
    tipo_politica         CHAR(3),
    politica              CHAR(2),
    orden_compra_art      VARCHAR(25),
    tipo_linea            CHAR(1),                         -- S=stock (solo facturas)
    nro_cuota             NUMERIC(10,3),                   -- ÷1.000 (solo facturas)
    tipo_producto         CHAR(3),
    -- Flags de estado
    no_disponible         CHAR(1),                         -- P=premio, N=normal
    entrega_camp_ant      CHAR(1),
    sustitucion           CHAR(1),
    es_kit                CHAR(1),                         -- K o vacío
    -- Sustitución detallada (solo facturas)
    sustituto_codigo      VARCHAR(25),
    sustituto_corto       INTEGER,
    sustituto_linea       NUMERIC(10,3),
    sustituto_deposito    VARCHAR(12),
    -- Estructura
    um_numero             INTEGER,
    fecha_factura         DATE,
    provincia             CHAR(3),
    nro_legal             VARCHAR(25),
    -- NC/ND exclusivos (NULL en facturas)
    campania_afectada     INTEGER,
    anio_campania_afectada VARCHAR(4),
    -- Totales de línea (÷100 y ÷10.000 en migración)
    importe_linea_con_imp NUMERIC(15,2),
    importe_linea_sin_imp NUMERIC(15,2),
    imp_no_disp_sin_imp   NUMERIC(15,2),                   -- solo facturas
    imp_no_disp_con_imp   NUMERIC(15,2),                   -- solo facturas
    unidades_facturadas   NUMERIC(15,4),
    unidades_fisicas      NUMERIC(15,4),
    precio_retail         NUMERIC(15,2),
    -- Costos (solo facturas)
    costo_unitario        NUMERIC(15,4),                   -- ÷10.000
    costo_total           NUMERIC(15,2),                   -- ÷100
    -- PK compuesta
    PRIMARY KEY (id, anio_campania)
);

SELECT create_hypertable('documentos_detalle', 'anio_campania',
    chunk_time_interval => 1,
    if_not_exists => TRUE,
    migrate_data => TRUE
);

CREATE INDEX IF NOT EXISTS idx_doc_det_cabecera ON documentos_detalle (nro_doc_crp, naturaleza, anio_campania);
CREATE INDEX IF NOT EXISTS idx_doc_det_cliente ON documentos_detalle (numero_cliente, anio_campania);
CREATE INDEX IF NOT EXISTS idx_doc_det_articulo ON documentos_detalle (codigo_articulo, anio_campania);
CREATE INDEX IF NOT EXISTS idx_doc_det_rubro ON documentos_detalle (rubro, anio_campania);
CREATE INDEX IF NOT EXISTS idx_doc_det_zona ON documentos_detalle (zona, anio_campania);

-- ===================
-- FV_EVENTOS (Event log fuerza de venta, solo transiciones)
-- Fuente: F5901015 WHERE estado != vigencia (solo cambios reales)
-- ===================

CREATE TABLE IF NOT EXISTS fv_eventos (
    id                    BIGSERIAL,
    campana_srdm          INTEGER      NOT NULL,           -- HESRDM — hypertable key
    numero_cliente        INTEGER      NOT NULL,           -- HEAN8
    -- Tipo de evento (columnas explícitas, no JSONB, para queries de bot)
    tipo_evento           VARCHAR(20)  NOT NULL,           -- alta, cambio_estado, mudanza_zona, cambio_um, cambio_gz_ei, cambio_divisional
    -- Estado
    estado_nuevo          VARCHAR(5),                      -- HEA76ST
    estado_anterior       VARCHAR(5),                      -- derivado del registro previo en fv_eventos
    estado_descripcion    VARCHAR(30),                     -- HEDSC1
    vigencia              VARCHAR(5),                      -- HE59VIGENCIA
    -- Campaña (desglose)
    campania              CHAR(2),                         -- HEUPC1
    anio_2d               CHAR(2),                         -- HEUPC2
    anio_campania_eco     INTEGER      NOT NULL,           -- HECO (año contable)
    -- Zona
    zona_nueva            CHAR(3),                         -- HEZON
    zona_anterior         CHAR(3),                         -- derivado
    -- Estructura comercial
    um_nueva              INTEGER,                         -- HE59UMACT
    um_estado_nuevo       VARCHAR(5),                      -- HE59UMESTACT
    um_anterior           INTEGER,                         -- derivado
    gz_ei_nuevo           INTEGER,                         -- derivado de tabla estructura
    divisional_nuevo      INTEGER,                         -- derivado de tabla estructura
    -- Origen
    origen_registro       CHAR(1),                         -- HE59ORREGE
    grupo_producto        CHAR(3),                         -- HEGPDP
    -- PK compuesta
    PRIMARY KEY (id, campana_srdm)
);

SELECT create_hypertable('fv_eventos', 'campana_srdm',
    chunk_time_interval => 1,
    if_not_exists => TRUE,
    migrate_data => TRUE
);

CREATE INDEX IF NOT EXISTS idx_fv_ev_cliente ON fv_eventos (numero_cliente, campana_srdm);
CREATE INDEX IF NOT EXISTS idx_fv_ev_tipo ON fv_eventos (tipo_evento, campana_srdm);
CREATE INDEX IF NOT EXISTS idx_fv_ev_estado ON fv_eventos (estado_nuevo, campana_srdm);
CREATE INDEX IF NOT EXISTS idx_fv_ev_zona ON fv_eventos (zona_nueva, campana_srdm);

COMMIT;

-- ===================
-- VALIDACIÓN
-- ===================
SELECT 'TABLAS' as check, count(*) as total FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
SELECT 'HYPERTABLES' as check, count(*) as total FROM timescaledb_information.hypertables WHERE hypertable_schema = 'public';
SELECT h.hypertable_name, h.num_dimensions
FROM timescaledb_information.hypertables h
WHERE h.hypertable_schema = 'public'
ORDER BY h.hypertable_name;
