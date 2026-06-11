import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

/**
 * Dos conexiones Drizzle (server-only), una por base:
 *  - `db`          → vintelarg_base (:5433, DATABASE_URL): red, campañas, auth,
 *                    CRM. Es la base principal del portal.
 *  - `analyticsDb` → aware_analytics (:5434, ANALYTICS_DATABASE_URL): facturación
 *                    real (04_facturacion_documentos_*). Las queries de ventas
 *                    cruzan ambas vía la cascada (ver lib/ventas-cascada.ts).
 *
 * Pools singleton en dev para no agotar conexiones con el HMR de Next. La
 * credencial vive SOLO en .env.local (no se commitea); acá solo se referencia
 * la env var. El Pool no conecta hasta la primera query: si ANALYTICS_DATABASE_URL
 * todavía no está seteada, construir el pool no rompe nada — falla al consultar,
 * y la cascada captura ese error y cae a NA.
 */
const globalForDb = globalThis as unknown as {
  __portalPool?: Pool;
  __analyticsPool?: Pool;
};

const pool =
  globalForDb.__portalPool ?? new Pool({ connectionString: process.env.DATABASE_URL, max: 10 });

const analyticsPool =
  globalForDb.__analyticsPool ??
  new Pool({ connectionString: process.env.ANALYTICS_DATABASE_URL, max: 10 });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__portalPool = pool;
  globalForDb.__analyticsPool = analyticsPool;
}

export const db = drizzle({ client: pool });
export const analyticsDb = drizzle({ client: analyticsPool });
export type DB = typeof db;
