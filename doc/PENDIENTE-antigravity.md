# Instrucciones para Antigravity — Pendientes de ejecución

> **IP:** Siempre usar `100.106.74.8` (Tailscale). NO usar la IP pública.
> **vintelarg_base:** Puerto **5433** (postgres-b). NO usar 5432 (postgres-a = producción Aware).
> **aware_analytics:** Puerto **5434** (timescaledb).

## TAREA 1: Seed data en vintelarg_base (puerto 5433)

Conectar a vintelarg_base y ejecutar los INSERTs. Las tablas ya existen, solo falta la data:

```bash
PGPASSWORD='Vintelarg013' psql -h 100.106.74.8 -p 5433 -U pgadmin -d vintelarg_base
```

Una vez conectado, ejecutar:

```sql
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
```

Validar:
```sql
SELECT 'rubros' as t, count(*) FROM rubros UNION ALL SELECT 'tipos_documento', count(*) FROM tipos_documento;
-- Esperado: rubros=25, tipos_documento=23
```

---

## TAREA 2: Crear 3 tablas en aware_analytics (TimescaleDB, puerto 5434)

Conectar a aware_analytics:

```bash
PGPASSWORD='Vintelarg013' psql -h 100.106.74.8 -p 5434 -U pgadmin -d aware_analytics
```

Ejecutar `02-aware-analytics.sql` o el SQL inline del archivo original.

Validar:
```sql
SELECT hypertable_name FROM timescaledb_information.hypertables WHERE hypertable_schema = 'public';
-- Esperado: documentos_cabecera, documentos_detalle, fv_eventos
```
