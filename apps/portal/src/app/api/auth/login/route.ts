import { NextRequest, NextResponse } from "next/server";
import { getAuthorizationUrl, randomString, pkceChallenge } from "@/lib/auth";

/** Inicia el flujo OIDC: genera state/nonce/PKCE y redirige al IdP. */
export async function GET(req: NextRequest) {
  // [DIAG temporal] quién dispara cada flujo de login. Si viene con prefetch/RSC,
  // es Next prefetcheando un link protegido y pisando el state del login real.
  const h = req.headers;
  console.error("[diag][login] flujo OIDC iniciado", {
    referer: h.get("referer") ?? null,
    rsc: h.get("rsc") ?? null,
    prefetch: h.get("next-router-prefetch") ?? null,
    nextUrl: h.get("next-url") ?? null,
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
