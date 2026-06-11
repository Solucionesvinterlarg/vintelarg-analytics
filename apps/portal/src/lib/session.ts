/**
 * Sesión del Portal (SERVER-ONLY). Lee la cookie de sesión (JWT propio) creada
 * en el callback OIDC. Importa next/headers → solo Server Components / route
 * handlers. Para helpers client-safe usar @/lib/session-token.
 */
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE, type PortalUser } from "@/lib/session-token";

export type { PortalUser };

export async function getCurrentUser(): Promise<PortalUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) {
    // [DIAG temporal] distingue "no llegó la cookie" de "cookie inválida".
    console.error("[diag][session] sin cookie portal_session en el request");
    return null;
  }
  const u = await verifySessionToken(token);
  if (!u) {
    console.error("[diag][session] portal_session PRESENTE pero JWT inválido (¿SESSION_SECRET distinto entre callback y este proceso?)");
  }
  return u;
}
