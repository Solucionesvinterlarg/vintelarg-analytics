-- ============================================================
-- DDL: Tablas transaccionales para aware_analytics (TimescaleDB :5434)
-- Ejecutar en: aware_analytics (100.106.74.8:5434)
-- ============================================================

BEGIN;

-- 1. CUENTA_CORRIENTE
-- Fuente: F5947B11 (tabla nueva de JDE)
CREATE TABLE IF NOT EXISTS cuenta_corriente (
  id                BIGSERIAL,
  revendedora_id    INTEGER NOT NULL,                 -- B1AN8 / BPAN8
  campania_id       INTEGER,                          -- B1SRDM / BPSRDM (YYYYMM)
  numero_documento  VARCHAR(20),                      -- B1DOCO / BPDOCO
  tipo_documento    VARCHAR(15) NOT NULL,             -- factura, debito, credito, pago, adelanto
  importe           DECIMAL(15,2) NOT NULL,           -- B1AG÷100 / BPAG÷100 (+debita, −acredita)
  fecha             DATE NOT NULL,                    -- B1DIVJ / BPDIVJ (convertido de Julian)
  observacion       TEXT,                             -- B1DL01 / BPDL01 + medio pago
  zona              VARCHAR(3),                       -- B1ZON / BPZON (desnormalizado para filtros)
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id, fecha)
);

-- Convertir a hypertable
SELECT create_hypertable('cuenta_corriente', 'fecha', if_not_exists => TRUE);

-- Índices para cuenta_corriente
CREATE INDEX IF NOT EXISTS idx_cc_revendedora ON cuenta_corriente(revendedora_id, fecha);
CREATE INDEX IF NOT EXISTS idx_cc_campania ON cuenta_corriente(campania_id, fecha);
CREATE INDEX IF NOT EXISTS idx_cc_revendedora_camp ON cuenta_corriente(revendedora_id, campania_id, fecha);
CREATE INDEX IF NOT EXISTS idx_cc_tipo ON cuenta_corriente(tipo_documento, fecha);


-- 2. PUNTOS_ACUMULADOS
-- Fuente: F590103
-- No requiere hypertable porque es de menor volumen.
CREATE TABLE IF NOT EXISTS puntos_acumulados (
  id                    SERIAL PRIMARY KEY,
  revendedora_id        INTEGER NOT NULL,             -- CVAN8
  anio_campania         INTEGER NOT NULL,             -- CVSRDM (YYYYMM)
  compania              VARCHAR(5),                   -- CVKCOO
  zona                  VARCHAR(3),                   -- CVZON
  puntos_acumulados     INTEGER DEFAULT 0,            -- CV59PUNACU
  puntos_campania       INTEGER DEFAULT 0,            -- CV59PUNCAM
  campania              VARCHAR(2),                   -- CVUPC1
  anio                  VARCHAR(2),                   -- CVUPC2
  numero_programa       INTEGER NOT NULL,             -- CV59NOMP (FK lógica → programas_puntos)
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(revendedora_id, anio_campania, numero_programa)
);

-- Índices para puntos_acumulados
CREATE INDEX IF NOT EXISTS idx_pa_revendedora ON puntos_acumulados(revendedora_id);
CREATE INDEX IF NOT EXISTS idx_pa_campania ON puntos_acumulados(anio_campania);
CREATE INDEX IF NOT EXISTS idx_pa_programa ON puntos_acumulados(numero_programa);

COMMIT;
