import { NextResponse } from "next/server";

/**
 * "Mi perfil": redirige a la pantalla de perfil del IdP.
 *
 * Fuente de verdad: AUTH_OIDC_BASE (la MISMA env que usa el login, garantizada
 * en prod). Tomamos su `origin` con la URL API → robusto ante barra final o
 * paths distintos (NO asume que termina exactamente en "/api/auth"). Si
 * AUTH_OIDC_BASE no fuera una URL válida, cae a AUTH_ISSUER y por último a
 * localhost — sin romper. Así "Mi perfil" NO depende de que AUTH_ISSUER esté
 * seteada (es una sola fuente de verdad, la que el login ya usa).
 */
function idpRoot(): string {
  for (const candidate of [process.env.AUTH_OIDC_BASE, process.env.AUTH_ISSUER]) {
    if (!candidate) continue;
    try {
      return new URL(candidate).origin;
    } catch {
      // Formato inesperado → probar el siguiente candidato.
    }
  }
  return "http://localhost:3000";
}

export async function GET() {
  return NextResponse.redirect(`${idpRoot()}/perfil`);
}
