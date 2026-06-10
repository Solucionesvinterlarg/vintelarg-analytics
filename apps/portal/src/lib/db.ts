import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

/**
 * Pool pg → Drizzle. Apunta a vintelarg_base (:5433) vía DATABASE_URL.
 * Singleton en dev para no agotar conexiones con el HMR de Next.
 * Mismo patrón que vintelarg-crm. Server-only.
 */
const globalForDb = globalThis as unknown as { __portalPool?: Pool };

const pool =
  globalForDb.__portalPool ??
  new Pool({ connectionString: process.env.DATABASE_URL, max: 10 });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__portalPool = pool;
}

export const db = drizzle({ client: pool });
export type DB = typeof db;
