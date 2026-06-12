import { NextRequest, NextResponse } from "next/server";
import { getAuthorizationUrl, randomString, pkceChallenge } from "@/lib/auth";

/** Inicia el flujo OIDC: genera state/nonce/PKCE y redirige al IdP. */
export async function GET(req: NextRequest) {
  // El login OIDC es una navegación de DOCUMENTO. Un prefetch del router o un
  // fetch RSC NO debe iniciar OIDC ni setear oidc_state: Next prefetchea los
  // links protegidos del sidebar y cada prefetch pisaría el state del login
  // real → stateMatch mismatch → invalid_state. Se ignoran (204, sin tocar
  // cookies); el login real procede como navegación de documento.
  const h = req.headers;
  if (h.get("next-router-prefetch") === "1" || h.get("rsc") === "1") {
    return new NextResponse(null, { status: 204 });
  }

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
