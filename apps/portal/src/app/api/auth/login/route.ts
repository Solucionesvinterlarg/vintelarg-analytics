import { NextRequest, NextResponse } from "next/server";
import { getAuthorizationUrl, randomString, pkceChallenge } from "@/lib/auth";

/** Inicia el flujo OIDC: genera state/nonce/PKCE y redirige al IdP. */
export async function GET(req: NextRequest) {
  const h = req.headers;
  // FIX: el login OIDC es una operación de navegación de DOCUMENTO. Un prefetch
  // del router o un fetch RSC NO debe iniciar OIDC ni setear oidc_state: Next
  // prefetchea los links protegidos del sidebar y cada uno disparaba un
  // /api/auth/login que pisaba el state del login real → stateMatch:false →
  // invalid_state. Se ignoran (204, sin tocar cookies); el login real es un
  // document-nav y procede normal (failover de Next si hacía falta).
  const isPrefetch = h.get("next-router-prefetch") === "1";
  const isRsc = h.get("rsc") === "1";
  if (isPrefetch || isRsc) {
    // [DIAG temporal] verificar que el ruido quedó bloqueado.
    console.error("[diag][login] IGNORADO prefetch/rsc", { prefetch: isPrefetch, rsc: isRsc, referer: h.get("referer") ?? null });
    return new NextResponse(null, { status: 204 });
  }

  // [DIAG temporal] el login real (document nav). Debería verse UNO solo.
  console.error("[diag][login] flujo OIDC iniciado (document nav)", {
    referer: h.get("referer") ?? null,
    secFetchDest: h.get("sec-fetch-dest") ?? null,
    secFetchMode: h.get("sec-fetch-mode") ?? null,
  });

  const state = randomString(16);
  const nonce = randomString(16);
  const verifier = randomString(32);
  const codeChallenge = pkceChallenge(verifier);

  const url = getAuthorizationUrl({ state, nonce, codeChallenge });
  const res = NextResponse.redirect(url);

  const opts = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600, // 10 min para completar el login
  };
  res.cookies.set("oidc_state", state, opts);
  res.cookies.set("oidc_nonce", nonce, opts);
  res.cookies.set("oidc_verifier", verifier, opts);
  return res;
}
