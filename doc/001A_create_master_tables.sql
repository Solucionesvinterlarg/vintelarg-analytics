-- ============================================================
-- DDL: Tablas maestras/configuración para vintelarg_base (PostgreSQL :5433)
-- Ejecutar en: postgres-b (100.106.74.8:5433 / vintelarg_base)
-- ============================================================

BEGIN;

-- 1. DIVISIONES
-- Fuente: F590109 + seed manual (nombres y responsables)
CREATE TABLE IF NOT EXISTS divisiones (
  id              SERIAL PRIMARY KEY,
  numero          INTEGER NOT NULL UNIQUE,          -- DI59DIV (01, 02, 03, 07, 08)
  nombre          VARCHAR(50) NOT NULL,             -- Manual: Venus, Athenea, etc.
  responsable_id  INTEGER REFERENCES personas(id),  -- Gerente Divisional (a cargar)
  estado          VARCHAR(10) DEFAULT 'activa',     -- activa / inactiva
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ZONAS
-- Fuente: F59CO002
CREATE TABLE IF NOT EXISTS zonas (
  id              SERIAL PRIMARY KEY,
  codigo          VARCHAR(3) NOT NULL UNIQUE,       -- ZOZON
  division_id     INTEGER REFERENCES divisiones(id), -- FK → divisiones (via F590109)
  responsable_id  INTEGER REFERENCES personas(id),  -- ZOAN8 → personas.numero_cliente
  legajo          INTEGER,                          -- ZO59LEGAGTE
  nombre_gerente  VARCHAR(50),                      -- ZO59NOMBGTE
  email_gerente   VARCHAR(75),                      -- ZOEMAIL
  no_comisiona    BOOLEAN DEFAULT FALSE,            -- ZO59ZNOCOM = 'S'
  estado          VARCHAR(10) DEFAULT 'activa',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para zonas
CREATE INDEX IF NOT EXISTS idx_zonas_division ON zonas(division_id);
CREATE INDEX IF NOT EXISTS idx_zonas_responsable ON zonas(responsable_id);

-- 3. OBJETIVOS_CAMPANIA
-- Fuente: F59IOVTA
CREATE TABLE IF NOT EXISTS objetivos_campania (
  id                    SERIAL PRIMARY KEY,
  compania              VARCHAR(5),                   -- OVKCOO
  zona                  VARCHAR(3) NOT NULL,           -- OVZON
  campania              VARCHAR(2) NOT NULL,           -- OVUPC1
  anio                  VARCHAR(2) NOT NULL,           -- OVUPC2
  anio_campania         INTEGER,                       -- Calculado: OVUPC2*100 + OVUPC1 → 2509
  ordenes_netas         INTEGER,                       -- OV59CORDNET
  facturacion_neta      DECIMAL(15,2),                -- OV59FACNETA (÷100)
  pct_cobrabilidad      DECIMAL(8,3),                 -- OV59PORCCOB (÷1000)
  cant_hab_zona         INTEGER,                       -- OV59CHABZON
  ordenes_brutas        INTEGER,                       -- OV59CORDBRU
  uso_futuro_1          INTEGER,                       -- OV59USOFUT1
  uso_futuro_2          INTEGER,                       -- OV59USOFUT2
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(compania, zona, campania, anio)
);

CREATE INDEX IF NOT EXISTS idx_objetivos_zona_camp ON objetivos_campania(zona, anio_campania);

-- 4. PROGRAMAS_PUNTOS
-- Fuente: F590106
DROP TABLE IF EXISTS programas_puntos CASCADE;
CREATE TABLE IF NOT EXISTS programas_puntos (
  id                    SERIAL PRIMARY KEY,
  compania              VARCHAR(5),                   -- PVKCOO
  numero_programa       INTEGER NOT NULL,             -- PV59NOMP (55=VIP, 56=Senior)
  tipo_programa         VARCHAR(1),                   -- PV59TIPROG: S=Senior, V=VIP, E=Elite
  descripcion           VARCHAR(60),                  -- PV59DEPROG
  anio_camp_inicio      VARCHAR(4),                   -- PVALLBMIN (YYCC)
  anio_camp_fin         VARCHAR(4),                   -- PVALLBMAX (YYCC)
  campania_inicio       VARCHAR(2),                   -- PVUPC1
  anio_inicio           VARCHAR(2),                   -- PVUPC2
  campania_fin          VARCHAR(2),                   -- PV59UPC1
  anio_fin              VARCHAR(2),                   -- PV59UPC2
  linea_producto        VARCHAR(3),                   -- PVAA03 (** = todas)
  articulo_codigo       VARCHAR(25),                  -- PVLITM (** = todos)
  articulo_corto        INTEGER,                      -- PVITM
  factor_override       DECIMAL(15,4),                -- PVXPQTY (factor por art/línea)
  factor_general        DECIMAL(15,4),                -- PV59FCTPTO (factor general del programa)
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pp_programa ON programas_puntos(numero_programa);
CREATE INDEX IF NOT EXISTS idx_pp_tipo ON programas_puntos(tipo_programa);

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

COMMIT;
