import "server-only";
import { cookies } from "next/headers";
import { ACCESS_TOKEN_COOKIE } from "./session-token";

/** App-módulo resuelta por el IdP para el usuario/org actual. */
export interface ModuleAppLink {
  /** Home de la app (oauth_client.uri). Se usa como href del ítem del menú. */
  uri: string;
  /** abrir la app (true) vs "Próximamente" (false). */
  available: boolean;
  status: "available" | "proximamente";
}

/** Origin del IdP, derivado de AUTH_OIDC_BASE (la env que ya usa el login). */
function idpOrigin(): string {
  for (const c of [process.env.AUTH_OIDC_BASE, process.env.AUTH_ISSUER]) {
    if (!c) continue;
    try {
      return new URL(c).origin;
    } catch {
      // formato inesperado → probar el siguiente
    }
  }
  return "http://localhost:3000";
}

/**
 * Apps-módulo disponibles para el usuario logueado, vía `GET /api/portal/apps`
 * del IdP (Bearer = access_token guardado en el callback). Devuelve un map
 * `moduleKey → ModuleAppLink`.
 *
 * Falla SUAVE: sin token / endpoint caído / error → Map vacío. El menú nunca se
 * rompe por esto (los ítems quedan con su href original).
 *
 * FOLLOW-UP (anotado, NO optimizar aún): hoy se llama por render del menú. Falta
 * una cache corta para evitar el round-trip por navegación.
 */
export async function getModuleAppLinks(): Promise<Map<string, ModuleAppLink>> {
  try {
    const token = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
    if (!token) return new Map();
    const res = await fetch(`${idpOrigin()}/api/portal/apps`, {
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return new Map();
    const data = (await res.json()) as {
      apps?: { moduleKey: string; uri: string; available: boolean; status: ModuleAppLink["status"] }[];
    };
    const map = new Map<string, ModuleAppLink>();
    for (const a of data.apps ?? []) {
      if (a.moduleKey && a.uri) map.set(a.moduleKey, { uri: a.uri, available: a.available, status: a.status });
    }
    return map;
  } catch {
    return new Map();
  }
}
