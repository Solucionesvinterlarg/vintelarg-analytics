-- ============================================================
-- DDL: Tablas nuevas para vintelarg_base (PostgreSQL :5433)
-- Ejecutar en: postgres-b (100.106.74.8:5433 / vintelarg_base)
-- Fecha: 21 mayo 2026
-- ============================================================

-- 1. DIVISIONES
-- Fuente: F590109 + seed manual (nombres y responsables)
CREATE TABLE IF NOT EXISTS divisiones (
  id              SERIAL PRIMARY KEY,
  numero          INTEGER NOT NULL UNIQUE,
  nombre          VARCHAR(50) NOT NULL,
  responsable_id  INTEGER REFERENCES personas(id),
  estado          VARCHAR(10) DEFAULT 'activa',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ZONAS
-- Fuente: F59CO002
CREATE TABLE IF NOT EXISTS zonas (
  id              SERIAL PRIMARY KEY,
  codigo          VARCHAR(3) NOT NULL UNIQUE,
  division_id     INTEGER REFERENCES divisiones(id),
  responsable_id  INTEGER REFERENCES personas(id),
  legajo          INTEGER,
  nombre_gerente  VARCHAR(50),
  email_gerente   VARCHAR(75),
  no_comisiona    BOOLEAN DEFAULT FALSE,
  estado          VARCHAR(10) DEFAULT 'activa',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_zonas_division ON zonas(division_id);
CREATE INDEX IF NOT EXISTS idx_zonas_responsable ON zonas(responsable_id);

-- 3. OBJETIVOS_CAMPANIA
-- Fuente: F59IOVTA
CREATE TABLE IF NOT EXISTS objetivos_campania (
  id                    SERIAL PRIMARY KEY,
  compania              VARCHAR(5),
  zona                  VARCHAR(3) NOT NULL,
  campania              VARCHAR(2) NOT NULL,
  anio                  VARCHAR(2) NOT NULL,
  anio_campania         INTEGER,
  ordenes_netas         INTEGER,
  facturacion_neta      DECIMAL(15,2),
  pct_cobrabilidad      DECIMAL(8,3),
  cant_hab_zona         INTEGER,
  ordenes_brutas        INTEGER,
  uso_futuro_1          INTEGER,
  uso_futuro_2          INTEGER,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(compania, zona, campania, anio)
);

CREATE INDEX IF NOT EXISTS idx_objetivos_zona_camp ON objetivos_campania(zona, anio_campania);

-- 4. CUENTA_CORRIENTE
-- Fuente: F5947B11 (tabla nueva de JDE) o transformación de F5903B
CREATE TABLE IF NOT EXISTS cuenta_corriente (
  id                BIGSERIAL PRIMARY KEY,
  revendedora_id    INTEGER NOT NULL,
  campania_id       INTEGER,
  numero_documento  VARCHAR(20),
  tipo_documento    VARCHAR(15) NOT NULL,
  importe           DECIMAL(15,2) NOT NULL,
  fecha             DATE,
  observacion       TEXT,
  zona              VARCHAR(3),
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cc_revendedora ON cuenta_corriente(revendedora_id);
CREATE INDEX IF NOT EXISTS idx_cc_campania ON cuenta_corriente(campania_id);
CREATE INDEX IF NOT EXISTS idx_cc_revendedora_camp ON cuenta_corriente(revendedora_id, campania_id);
CREATE INDEX IF NOT EXISTS idx_cc_fecha ON cuenta_corriente(fecha);
CREATE INDEX IF NOT EXISTS idx_cc_tipo ON cuenta_corriente(tipo_documento);

-- 5. PROGRAMAS_PUNTOS
-- Fuente: F590106
CREATE TABLE IF NOT EXISTS programas_puntos (
  id                    SERIAL PRIMARY KEY,
  compania              VARCHAR(5),
  numero_programa       INTEGER NOT NULL,
  tipo_programa         VARCHAR(1),
  descripcion           VARCHAR(60),
  anio_camp_inicio      VARCHAR(4),
  anio_camp_fin         VARCHAR(4),
  campania_inicio       VARCHAR(2),
  anio_inicio           VARCHAR(2),
  campania_fin          VARCHAR(2),
  anio_fin              VARCHAR(2),
  linea_producto        VARCHAR(3),
  articulo_codigo       VARCHAR(25),
  articulo_corto        INTEGER,
  factor_override       DECIMAL(10,4),
  factor_general        DECIMAL(10,4),
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pp_programa ON programas_puntos(numero_programa);
CREATE INDEX IF NOT EXISTS idx_pp_tipo ON programas_puntos(tipo_programa);

-- 6. PUNTOS_ACUMULADOS
-- Fuente: F590103
CREATE TABLE IF NOT EXISTS puntos_acumulados (
  id                    SERIAL PRIMARY KEY,
  revendedora_id        INTEGER NOT NULL,
  anio_campania         INTEGER NOT NULL,
  compania              VARCHAR(5),
  zona                  VARCHAR(3),
  puntos_acumulados     INTEGER DEFAULT 0,
  puntos_campania       INTEGER DEFAULT 0,
  campania              VARCHAR(2),
  anio                  VARCHAR(2),
  numero_programa       INTEGER NOT NULL,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(revendedora_id, anio_campania, numero_programa)
);

CREATE INDEX IF NOT EXISTS idx_pa_revendedora ON puntos_acumulados(revendedora_id);
CREATE INDEX IF NOT EXISTS idx_pa_campania ON puntos_acumulados(anio_campania);
CREATE INDEX IF NOT EXISTS idx_pa_programa ON puntos_acumulados(numero_programa);

-- ============================================================
-- SEED: Divisiones (datos manuales)
-- ============================================================
INSERT INTO divisiones (numero, nombre) VALUES
  (1, 'Venus'),
  (2, 'Athenea'),
  (3, 'Afrodita'),
  (7, 'Zeus'),
  (8, 'Olimpo')
ON CONFLICT (numero) DO NOTHING;

-- ============================================================
-- NOTA: Ejecutar migrate-new-tables.cjs después de crear las tablas.
-- Para cuenta_corriente, esperar a que Diego cree F5947B11 en JDE.
-- Mientras tanto se migra desde F5903B con transformación.
-- ============================================================