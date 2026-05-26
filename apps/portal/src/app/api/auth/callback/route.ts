import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens, verifyIdToken, claimsToUser } from "@/lib/auth";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/session-token";
import { landingForRole } from "@/lib/portal-config";

const APP_URL = process.env.APP_URL ?? "http://localhost:3002";

function errorRedirect(reason: string) {
  return NextResponse.redirect(`${APP_URL}/auth-error?reason=${encodeURIComponent(reason)}`);
}

/** Callback OIDC: valida state, intercambia code por tokens, verifica id_token. */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const oauthError = url.searchParams.get("error");

  if (oauthError) return errorRedirect(oauthError);

  const stateCookie = req.cookies.get("oidc_state")?.value;
  const nonce = req.cookies.get("oidc_nonce")?.value;
  const verifier = req.cookies.get("oidc_verifier")?.value;

  if (!code || !state || !stateCookie || state !== stateCookie || !verifier) {
    return errorRedirect("invalid_state");
  }

  try {
    const tokens = await exchangeCodeForTokens(code, verifier);
    const claims = await verifyIdToken(tokens.id_token, nonce);
    const user = claimsToUser(claims);
    const session = await createSessionToken(user);

    // Aterrizaje según rol (desktop dashboard/admin/atencion · mobile home).
    const res = NextResponse.redirect(`${APP_URL}${landingForRole(user.role)}`);
    res.cookies.set(SESSION_COOKIE, session, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
    for (const c of ["oidc_state", "oidc_nonce", "oidc_verifier"]) {
      res.cookies.set(c, "", { path: "/", maxAge: 0 });
    }
    return res;
  } catch (err) {
    console.error("[oidc] callback error:", err);
    return errorRedirect("callback_failed");
  }
}
