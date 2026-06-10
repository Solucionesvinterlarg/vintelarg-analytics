/**
 * Schema Drizzle (subset) de aware_analytics (:5434) — facturación REAL.
 * Se consulta vía `analyticsDb` (lib/db.ts). Read-only desde el portal.
 *
 * La factura real vive en 04_facturacion_documentos_cabecera/_detalle
 * (NO en 04_facturacion_facturas_*, que están vacías).
 *
 * Columnas de `documentos_cabecera`: verificadas por Diego. Los TIPOS son
 * best-effort; confirmar contra la base (introspección) cuando ANALYTICS_DATABASE_URL
 * esté seteada en .env.local. `documentos_detalle` se agrega en la Etapa 2 (Mix),
 * introspeccionando sus columnas una vez que la conexión esté disponible.
 */
import { pgTable, text, integer, numeric, timestamp, bigint } from "drizzle-orm/pg-core";

export const documentosCabecera = pgTable("04_facturacion_documentos_cabecera", {
  // Identificación de campaña (claves de la cascada de ventas).
  anioCampania: integer("anio_campania"),
  campania: text("campania"),
  // Importes y unidades facturadas.
  importeConImp: numeric("importe_con_imp"),
  importeSinImp: numeric("importe_sin_imp"),
  precioRetail: numeric("precio_retail"),
  unidadesFacturadas: numeric("unidades_facturadas"),
  // Dimensiones.
  zona: text("zona"),
  canal: text("canal"),
  gerenteCliente: text("gerente_cliente"),
  naturaleza: text("naturaleza"),
  tipoPedido: text("tipo_pedido"),
  // Trazabilidad.
  fechaFactura: timestamp("fecha_factura"),
  numeroOrdenOrigen: bigint("numero_orden_origen", { mode: "number" }),
});

// TODO(Etapa 2 · Mix de productos): agregar 04_facturacion_documentos_detalle
// (6.577.219 filas) introspeccionando columnas reales con ANALYTICS_DATABASE_URL
// ya puesta. Esperar el OK de Diego para correr la introspección.
