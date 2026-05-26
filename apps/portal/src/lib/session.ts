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
  if (!token) return null;
  return verifySessionToken(token);
}
