-- ============================================================
-- 01-vintelarg-base.sql
-- Base: vintelarg_base (PostgreSQL 16, puerto 5432)
-- 14 tablas maestro/operativas + índices + seed data
-- ============================================================
-- Ejecutar con:
-- PGPASSWORD='Vintelarg013' psql -h 136.248.103.210 -p 5432 -U pgadmin -d vintelarg_base -f 01-vintelarg-base.sql
-- ============================================================

BEGIN;

-- ===================
-- TABLAS MAESTRO
-- ===================

CREATE TABLE IF NOT EXISTS rubros (
    rubro          SMALLINT    PRIMARY KEY,
    descripcion    VARCHAR(50) NOT NULL,
    agrupamiento   CHAR(2),
    agrup_nombre   VARCHAR(20),
    weekly         BOOLEAN     NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS tipos_documento (
    id             SERIAL      PRIMARY KEY,
    compania       CHAR(5)     NOT NULL,
    tipo_documento CHAR(2)     NOT NULL,
    descripcion    VARCHAR(50) NOT NULL,
    naturaleza     CHAR(1)     NOT NULL,
    origen_registro CHAR(1),
    clasificacion  CHAR(2),
    UNIQUE (compania, tipo_documento)
);

CREATE TABLE IF NOT EXISTS campanias (
    id             SERIAL      PRIMARY KEY,
    compania       CHAR(5)     NOT NULL,
    anio_campania  INTEGER     NOT NULL,
    campania       CHAR(2)     NOT NULL,
    anio_2d        CHAR(2)     NOT NULL,
    anio_4d        INTEGER     NOT NULL,
    fecha_inicio   DATE        NOT NULL,
    fecha_fin      DATE        NOT NULL,
    UNIQUE (compania, anio_campania)
);

-- ===================
-- ARTÍCULOS Y CUBICAJE
-- ===================

CREATE TABLE IF NOT EXISTS articulos (
    id                   SERIAL       PRIMARY KEY,
    codigo_corto         INTEGER      NOT NULL UNIQUE,
    codigo               VARCHAR(25)  NOT NULL UNIQUE,
    descripcion          VARCHAR(30)  NOT NULL,
    descripcion_2        VARCHAR(30),
    seccion_catalogo     CHAR(3),
    sub_seccion          CHAR(3),
    categoria_ventas_3   CHAR(3),
    categoria_ventas_4   CHAR(3),
    categoria_ventas_5   CHAR(3),
    tipo_producto        VARCHAR(6),
    categoria_ventas_7   VARCHAR(6),
    tipo_picking         VARCHAR(6),
    categoria_ventas_9   VARCHAR(6),
    categoria_ventas_10  VARCHAR(6),
    clase_commodity      CHAR(3),
    sub_clase_commodity  CHAR(3),
    codigo_rebaja_prov   CHAR(3),
    familia_planif       CHAR(3),
    categoria_compras_5  CHAR(3),
    unidad_medida        CHAR(2),
    categoria_contable   CHAR(4),
    volumen_cubico       NUMERIC(15,2),
    tipo_componente      CHAR(1),
    categoria_comision   VARCHAR(8),
    grupo_producto       CHAR(3),
    grupo_despacho       CHAR(3),
    dias_vida_util       INTEGER,
    tipo_almacenamiento  VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS articulos_dimensiones (
    id                SERIAL       PRIMARY KEY,
    articulo_id       INTEGER      NOT NULL REFERENCES articulos(id),
    codigo_corto      INTEGER      NOT NULL,
    unidad_medida     CHAR(2),
    ancho             NUMERIC(15,2),
    profundidad       NUMERIC(15,2),
    alto              NUMERIC(15,2),
    um_dimension      CHAR(2),
    volumen_cubico    NUMERIC(15,2),
    um_volumen        CHAR(2),
    peso_bruto        NUMERIC(15,2),
    um_peso           CHAR(2),
    caja_especial     BOOLEAN      DEFAULT FALSE,
    caja_minima       VARCHAR(5),
    codigo_barras     SMALLINT     DEFAULT 0,
    forma_picking     SMALLINT     DEFAULT 0,
    UNIQUE (codigo_corto, unidad_medida)
);

CREATE TABLE IF NOT EXISTS kits (
    id                SERIAL       PRIMARY KEY,
    tipo_bom          CHAR(3),
    padre_corto       INTEGER      NOT NULL,
    padre_codigo      VARCHAR(25),
    componente_corto  INTEGER      NOT NULL,
    componente_codigo VARCHAR(25),
    nro_linea         NUMERIC(4,1),
    cantidad          NUMERIC(15,4) NOT NULL DEFAULT 1,
    unidad_medida     CHAR(2),
    vigencia_desde    DATE,
    vigencia_hasta    DATE,
    componente_opcional BOOLEAN    DEFAULT FALSE,
    tipo_componente   CHAR(1),
    UNIQUE (padre_corto, componente_corto, vigencia_desde)
);

CREATE TABLE IF NOT EXISTS cajas (
    id                SERIAL       PRIMARY KEY,
    deposito          VARCHAR(12),
    codigo_caja       VARCHAR(5)   NOT NULL,
    ancho             NUMERIC(15,2),
    profundidad       NUMERIC(15,2),
    alto              NUMERIC(15,2),
    um_dimension      CHAR(2),
    volumen_cubico    NUMERIC(15,2),
    um_volumen        CHAR(2),
    peso_vacia        NUMERIC(15,2),
    um_peso           CHAR(2),
    tipo_contenedor   CHAR(1),
    disponible        BOOLEAN      DEFAULT TRUE,
    prioridad         INTEGER,
    pct_llenado_min   NUMERIC(5,2),
    pct_llenado_max   NUMERIC(5,2),
    UNIQUE (deposito, codigo_caja)
);

-- ===================
-- CATÁLOGO Y CALENDARIO
-- ===================

CREATE TABLE IF NOT EXISTS catalogo_campania (
    id                SERIAL       PRIMARY KEY,
    anio_campania     INTEGER      NOT NULL,
    codigo_articulo   VARCHAR(25)  NOT NULL,
    descripcion       VARCHAR(30),
    precio            NUMERIC(15,4),
    linea_negocio     VARCHAR(10),
    pagina_folleto    VARCHAR(25),
    cuotas            SMALLINT     DEFAULT 0,
    deposito          VARCHAR(12),
    version           INTEGER,
    factor_mult_unid  NUMERIC(8,2),
    factor_mult_imp   NUMERIC(8,2),
    UNIQUE (anio_campania, codigo_articulo)
);

CREATE TABLE IF NOT EXISTS calendario_operativo (
    id                    SERIAL       PRIMARY KEY,
    anio_campania         INTEGER      NOT NULL,
    campania              CHAR(2)      NOT NULL,
    anio_2d               CHAR(2)      NOT NULL,
    zona                  CHAR(3)      NOT NULL,
    deposito              VARCHAR(12),
    fecha_pre_facturacion  DATE,
    fecha_picking          DATE,
    fecha_salida_troncal   DATE,
    localidad              VARCHAR(25),
    distribuidor           VARCHAR(25),
    fin_pedidos_consultoras DATE,
    fin_pedidos_lideres     DATE,
    fin_pedidos_gerentes    DATE,
    UNIQUE (anio_campania, zona)
);

-- ===================
-- PERSONAS (de F5901012)
-- ===================

CREATE TABLE IF NOT EXISTS personas (
    id                SERIAL       PRIMARY KEY,
    numero_cliente    INTEGER      NOT NULL UNIQUE,
    tipo_documento    VARCHAR(10),
    numero_documento  VARCHAR(50),
    nombre_1          VARCHAR(100),
    nombre_2          VARCHAR(100),
    apellido_1        VARCHAR(100),
    apellido_2        VARCHAR(100),
    email             VARCHAR(255),
    fecha_nacimiento  DATE,
    genero            VARCHAR(10),
    compania          CHAR(5),
    seccion           VARCHAR(20),
    activo            BOOLEAN      DEFAULT TRUE,
    created_at        TIMESTAMPTZ  DEFAULT NOW(),
    updated_at        TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS personas_telefonos (
    id                SERIAL       PRIMARY KEY,
    persona_id        INTEGER      NOT NULL REFERENCES personas(id),
    tipo              VARCHAR(20),
    codigo_area       VARCHAR(20),
    numero            VARCHAR(50)  NOT NULL,
    principal         BOOLEAN      DEFAULT FALSE,
    created_at        TIMESTAMPTZ  DEFAULT NOW(),
    updated_at        TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS personas_direcciones (
    id                    SERIAL       PRIMARY KEY,
    persona_id            INTEGER      NOT NULL REFERENCES personas(id),
    tipo                  VARCHAR(20)  NOT NULL DEFAULT 'entrega',
    pais                  VARCHAR(10),
    provincia             VARCHAR(100),
    calle                 VARCHAR(200),
    direccion_2           VARCHAR(200),
    codigo_postal         VARCHAR(20),
    localidad             VARCHAR(200),
    partido               VARCHAR(200),
    barrio                VARCHAR(200),
    entre_calles_1        VARCHAR(200),
    entre_calles_2        VARCHAR(200),
    instrucciones_1       VARCHAR(200),
    instrucciones_2       VARCHAR(200),
    principal             BOOLEAN      DEFAULT FALSE,
    created_at            TIMESTAMPTZ  DEFAULT NOW(),
    updated_at            TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS personas_fiscal (
    id                SERIAL       PRIMARY KEY,
    persona_id        INTEGER      NOT NULL REFERENCES personas(id) UNIQUE,
    cuit              VARCHAR(20),
    condicion_iva     VARCHAR(50),
    categoria_16      CHAR(3),
    categoria_17      CHAR(3),
    categoria_18      CHAR(3),
    created_at        TIMESTAMPTZ  DEFAULT NOW(),
    updated_at        TIMESTAMPTZ  DEFAULT NOW()
);

-- ===================
-- FUERZA DE VENTA
-- ===================

CREATE TABLE IF NOT EXISTS fv_revendedora (
    id                    SERIAL       PRIMARY KEY,
    persona_id            INTEGER      NOT NULL REFERENCES personas(id) UNIQUE,
    numero_cliente        INTEGER      NOT NULL UNIQUE,
    estado                VARCHAR(5)   NOT NULL DEFAULT 'AI',
    estado_descripcion    VARCHAR(30),
    stencial              BOOLEAN      DEFAULT FALSE,
    campania_alta         CHAR(2),
    anio_alta             VARCHAR(10),
    fecha_alta            DATE,
    campania_baja         CHAR(2),
    anio_baja             VARCHAR(10),
    fecha_baja            DATE,
    fecha_reincorporacion DATE,
    zona                  CHAR(3),
    deposito              VARCHAR(12),
    um_numero             INTEGER,
    um_estado             VARCHAR(5),
    indicante_numero      INTEGER,
    indicante_doc         VARCHAR(50),
    indicante_tipo_doc    VARCHAR(10),
    patrocinante_numero   INTEGER,
    gz_ei_numero          INTEGER,
    gz_ei_tipo            VARCHAR(5),
    divisional_numero     INTEGER,
    limite_credito        NUMERIC(12,2) DEFAULT 0,
    secuencia_entrega     INTEGER,
    puntos_acumulados     NUMERIC(12,2) DEFAULT 0,
    grupo_numero          INTEGER,
    premio_a              BOOLEAN DEFAULT FALSE,
    premio_b              BOOLEAN DEFAULT FALSE,
    premio_c              BOOLEAN DEFAULT FALSE,
    premio_d              BOOLEAN DEFAULT FALSE,
    premio_e              BOOLEAN DEFAULT FALSE,
    ui_estado             VARCHAR(20),
    ui_fecha_ingreso      DATE,
    ui_fecha_graduacion   DATE,
    ui_fecha_reincorporacion DATE,
    ui_fecha_baja         DATE,
    retencion_motivo      VARCHAR(10),
    retencion_texto       VARCHAR(200),
    aval_tiene            BOOLEAN DEFAULT FALSE,
    aval_nombre           VARCHAR(200),
    aval_documento        VARCHAR(50),
    created_at            TIMESTAMPTZ  DEFAULT NOW(),
    updated_at            TIMESTAMPTZ  DEFAULT NOW()
);

-- ===================
-- ÍNDICES
-- ===================

CREATE INDEX IF NOT EXISTS idx_campanias_anio ON campanias (anio_campania);
CREATE INDEX IF NOT EXISTS idx_articulos_tipo_producto ON articulos (tipo_producto);
CREATE INDEX IF NOT EXISTS idx_articulos_cat_contable ON articulos (categoria_contable);
CREATE INDEX IF NOT EXISTS idx_kits_padre ON kits (padre_corto);
CREATE INDEX IF NOT EXISTS idx_kits_componente ON kits (componente_corto);
CREATE INDEX IF NOT EXISTS idx_catalogo_campania ON catalogo_campania (anio_campania);
CREATE INDEX IF NOT EXISTS idx_calendario_campania ON calendario_operativo (anio_campania);
CREATE INDEX IF NOT EXISTS idx_calendario_zona ON calendario_operativo (zona);
CREATE INDEX IF NOT EXISTS idx_personas_documento ON personas (tipo_documento, numero_documento);
CREATE INDEX IF NOT EXISTS idx_personas_email ON personas (email);
CREATE INDEX IF NOT EXISTS idx_telefonos_persona ON personas_telefonos (persona_id);
CREATE INDEX IF NOT EXISTS idx_direcciones_persona ON personas_direcciones (persona_id);
CREATE INDEX IF NOT EXISTS idx_fv_estado ON fv_revendedora (estado);
CREATE INDEX IF NOT EXISTS idx_fv_zona ON fv_revendedora (zona);
CREATE INDEX IF NOT EXISTS idx_fv_um ON fv_revendedora (um_numero);
CREATE INDEX IF NOT EXISTS idx_fv_stencial ON fv_revendedora (stencial) WHERE stencial = TRUE;

-- ===================
-- SEED DATA — RUBROS
-- ===================

INSERT INTO rubros (rubro, descripcion, agrupamiento, agrup_nombre, weekly) VALUES
(1,  'COSMETICO',                    'CO', 'Cosméticos',  TRUE),
(4,  'FULL HOME',                    'HO', 'Home',        TRUE),
(5,  'OTROS FOLLETOS',               'SR', 'No Weekly',   FALSE),
(8,  'CAMA MESA',                    'HO', 'Home',        TRUE),
(11, 'AUXILIARES',                    'DM', 'Demos',       TRUE),
(13, 'FOLLETOS',                     'FO', 'Folletos',    TRUE),
(16, 'FRAGANCIAS FEMENINAS',         'CO', 'Cosméticos',  TRUE),
(17, 'FRAGANCIA MASCULINA',          'CO', 'Cosméticos',  TRUE),
(18, 'CUIDADO DE PIEL',              'CO', 'Cosméticos',  TRUE),
(19, 'CUIDADO DE CABELLO',           'CO', 'Cosméticos',  TRUE),
(20, 'TOILETRIES',                   'CO', 'Cosméticos',  TRUE),
(21, 'NO DISPONIBLES',               NULL, NULL,          TRUE),
(22, 'OTHER CFT',                    'CO', 'Cosméticos',  TRUE),
(23, 'PRODUCTOS PERSONALES',         'OT', 'Otros',       TRUE),
(25, 'OTROS NUVO MODA',              'OT', 'Otros',       TRUE),
(27, 'LIBROS',                       'OT', 'Otros',       TRUE),
(31, 'VALOR AGREGADO',               'SR', 'No Weekly',   FALSE),
(33, 'TUPPER',                       'TU', 'Tupperware',  TRUE),
(35, 'CARGO DE PEDIDO MINIMO',       'OT', 'Otros',       TRUE),
(37, 'MATERIAL PROMOCIONAL',         'OU', 'Out',         TRUE),
(38, 'NOTA DE CREDITO UNIT MANAGER', 'OT', 'Otros',       TRUE),
(54, 'MATERIAL APOYO LANZAMIENTO',   'SR', 'No Weekly',   FALSE),
(55, 'MALETIN',                      'OU', 'Out',         TRUE),
(61, 'PREMIOS',                      'OT', 'Otros',       TRUE),
(94, 'MATERIAL DE EMPAQUE',          'SR', 'No Weekly',   FALSE)
ON CONFLICT (rubro) DO NOTHING;

-- ===================
-- SEED DATA — TIPOS DE DOCUMENTO
-- ===================

INSERT INTO tipos_documento (compania, tipo_documento, descripcion, naturaleza) VALUES
('00028', 'SO', 'Orden Revendedora (CRP/Escaneo)',     '1'),
('00028', 'SC', 'Cambios y Reclamos (envío)',          '1'),
('00028', 'SJ', 'Entrega Campaña Anterior',            '1'),
('00028', 'SV', 'Orden Ecommerce',                     '1'),
('00028', 'SY', 'Punto de Venta B2B',                  '1'),
('00028', 'CR', 'Crédito Cambios y Reclamos',          '3'),
('00028', 'CO', 'Crédito Desmantelado',                '3'),
('00028', 'CC', 'Comisión IPS',                        '3'),
('00028', 'CN', 'Comisión Manual Ventas',              '3'),
('00028', 'CI', 'Interés',                             '3'),
('00028', 'CK', 'Ajuste de Precio',                    '3'),
('00028', 'CT', 'Cuotas Onboarding',                   '3'),
('00028', 'CV', 'Ecommerce',                           '3'),
('00028', 'CY', 'Punto de Venta B2B',                  '3'),
('00028', 'DR', 'Débito Reversa Cambios/Reclamos',     '2'),
('00028', 'DO', 'Débito Reversa Desmantelado',         '2'),
('00028', 'DC', 'Débito Comisión IPS',                 '2'),
('00028', 'DN', 'Débito Comisión Manual Reversa',      '2'),
('00028', 'DI', 'Débito Interés',                      '2'),
('00028', 'DK', 'Débito Ajuste de Precio',             '2'),
('00028', 'DT', 'Débito Cuotas Onboarding',            '2'),
('00028', 'DV', 'Débito Ecommerce',                    '2'),
('00028', 'DY', 'Débito Punto de Venta B2B',           '2')
ON CONFLICT (compania, tipo_documento) DO NOTHING;

COMMIT;

-- ===================
-- VALIDACIÓN
-- ===================
SELECT 'TABLAS' as check, count(*) as total FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
SELECT 'INDICES' as check, count(*) as total FROM pg_indexes WHERE schemaname = 'public';
SELECT 'RUBROS' as check, count(*) as total FROM rubros;
SELECT 'TIPOS_DOC' as check, count(*) as total FROM tipos_documento;
