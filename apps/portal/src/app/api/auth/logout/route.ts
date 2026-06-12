import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, ID_TOKEN_COOKIE } from "@/lib/session-token";
import { oidc } from "@/lib/auth";

const APP_URL = process.env.APP_URL ?? "http://localhost:3002";

/**
 * RP-Initiated Logout (OIDC). Limpia la sesión LOCAL del Portal y manda al
 * end_session_endpoint del IdP (Better Auth oauth-provider) para cerrar la
 * sesión GLOBAL y volver al Portal vía post_logout_redirect_uri. Sin esto, el
 * usuario quedaba logueado en el IdP y al re-loguearse aterrizaba en la UI de
 * auth en vez del Portal.
 *
 * El endpoint del plugin (`${oidcBase}/oauth2/end-session`) exige:
 *  - id_token_hint: el id_token del IdP (lo guardamos en el callback).
 *  - post_logout_redirect_uri: debe estar en los post_logout_redirect_uris del
 *    client (registrado: https://principal.vintelarg.com.ar).
 *  - client_id: requerido si va post_logout_redirect_uri sin más contexto.
 *  - El client debe tener enable_end_session=true en la DB.
 */
export async function GET(req: NextRequest) {
  const idToken = req.cookies.get(ID_TOKEN_COOKIE)?.value;

  let target: string;
  if (idToken) {
    const u = new URL(`${oidc.oidcBase}/oauth2/end-session`);
    u.searchParams.set("id_token_hint", idToken);
    if (oidc.clientId) u.searchParams.set("client_id", oidc.clientId);
    u.searchParams.set("post_logout_redirect_uri", APP_URL);
    target = u.toString();
  } else {
    // Sesión vieja sin id_token (previa a este cambio): solo logout local.
    target = APP_URL;
  }

  const res = NextResponse.redirect(target);
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  res.cookies.set(ID_TOKEN_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
