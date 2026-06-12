/**
 * Sesión del Portal como JWT propio (HS256, firmado con SESSION_SECRET).
 * Edge/node-safe: solo usa `jose`, para poder verificar en proxy.ts.
 *
 * Los claims vienen del id_token del IdP (OIDC) y se re-empaquetan en esta
 * cookie para no depender del token del IdP en cada request.
 */
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "portal_session";
/** id_token del IdP, guardado para el RP-initiated logout (id_token_hint). */
export const ID_TOKEN_COOKIE = "portal_id_token";
/** access_token del IdP, guardado para consultar /api/portal/apps (Bearer). */
export const ACCESS_TOKEN_COOKIE = "portal_access_token";
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 horas

export interface PortalUser {
  id: string;
  name: string;
  email: string;
  role: string;
  orgId: string;
  orgName: string;
  userType: string;
}

function secretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET no está definido");
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(user: PortalUser): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secretKey());
}

export async function verifySessionToken(token: string): Promise<PortalUser | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return {
      id: String(payload.id ?? ""),
      name: String(payload.name ?? ""),
      email: String(payload.email ?? ""),
      role: String(payload.role ?? ""),
      orgId: String(payload.orgId ?? ""),
      orgName: String(payload.orgName ?? ""),
      userType: String(payload.userType ?? ""),
    };
  } catch {
    return null;
  }
}

export const SESSION_MAX_AGE = SESSION_TTL_SECONDS;

/** Iniciales para el avatar (client-safe). */
export function userInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}
