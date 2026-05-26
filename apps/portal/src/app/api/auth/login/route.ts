import { NextResponse } from "next/server";
import { getAuthorizationUrl, randomString, pkceChallenge } from "@/lib/auth";

/** Inicia el flujo OIDC: genera state/nonce/PKCE y redirige al IdP. */
export async function GET() {
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
