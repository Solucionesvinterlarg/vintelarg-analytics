/**
 * Cascada de ventas (regla de negocio). Para una campaña (anio + campania),
 * decide DE DÓNDE sale el dato de ventas:
 *   1) FACTURADA → hay documentos en aware_analytics (04_facturacion_documentos_*).
 *   2) EN_CURSO  → no hay facturación todavía, pero hay órdenes cargadas en
 *                  vintelarg_base (03_campania_ordenes). Hoy estas tablas están
 *                  vacías, así que en la práctica las campañas en curso caen a NA.
 *   3) NA        → no hay nada en ninguna base. Mostrar "NA" (no inventar, no 0).
 *
 * Este helper solo RESUELVE la fuente; cada pantalla de ventas usa el `kind`
 * para decidir contra qué tabla consultar (y mostrar NA elegante si corresponde).
 * Es defensivo: si la conexión a analytics falla (p. ej. ANALYTICS_DATABASE_URL
 * todavía sin setear), captura el error y sigue — nunca rompe la página.
 */
import "server-only";
import { and, eq, sql } from "drizzle-orm";
import { db, analyticsDb } from "./db";
import { campaniaOrdenes } from "./schema";
import { documentosCabecera } from "./schema-analytics";

export type VentasSourceKind = "facturada" | "en_curso" | "na";

export interface VentasSource {
  kind: VentasSourceKind;
  anioCampania: number;
  /** campania normalizada (trim — la columna es CHAR y viene con padding). */
  campania: string;
}

/** ¿Es una fuente sin dato? Azúcar para las queries/vistas. */
export function isNA(s: VentasSource): boolean {
  return s.kind === "na";
}

export async function resolveVentasSource(anioCampania: number, campania: string): Promise<VentasSource> {
  const camp = campania.trim();

  // 1) FACTURADA: ¿hay documentos en aware_analytics para esta campaña?
  try {
    const [r] = await analyticsDb
      .select({ n: sql<number>`count(*)`.mapWith(Number) })
      .from(documentosCabecera)
      .where(and(eq(documentosCabecera.anioCampania, anioCampania), eq(sql`trim(${documentosCabecera.campania})`, camp)));
    if ((r?.n ?? 0) > 0) return { kind: "facturada", anioCampania, campania: camp };
  } catch (e) {
    // Analytics no disponible (conexión/env) → no rompemos: seguimos a en_curso/na.
    console.error("[ventas-cascada] aware_analytics no disponible:", e instanceof Error ? e.message : e);
  }

  // 2) EN_CURSO: ¿hay órdenes cargadas en vintelarg_base?
  try {
    const [o] = await db
      .select({ n: sql<number>`count(*)`.mapWith(Number) })
      .from(campaniaOrdenes)
      .where(and(eq(campaniaOrdenes.anioCampania, anioCampania), eq(sql`trim(${campaniaOrdenes.campania})`, camp)));
    if ((o?.n ?? 0) > 0) return { kind: "en_curso", anioCampania, campania: camp };
  } catch (e) {
    console.error("[ventas-cascada] 03_campania_ordenes no disponible:", e instanceof Error ? e.message : e);
  }

  // 3) NA
  return { kind: "na", anioCampania, campania: camp };
}
