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
    // [DIAG temporal] qué condición exacta disparó el invalid_state.
    console.error("[diag][oidc] invalid_state", {
      hasCode: !!code,
      hasState: !!state,
      hasStateCookie: !!stateCookie,
      stateMatch: state === stateCookie,
      hasVerifier: !!verifier,
    });
    return errorRedirect("invalid_state");
  }

  try {
    const tokens = await exchangeCodeForTokens(code, verifier);
    const claims = await verifyIdToken(tokens.id_token, nonce);
    const user = claimsToUser(claims);
    const session = await createSessionToken(user);

    // Aterrizaje según rol (desktop dashboard/admin/atencion · mobile home).
    const target = `${APP_URL}${landingForRole(user.role)}`;
    const cookieOpts = {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    };
    // [DIAG temporal] confirma que se setea portal_session y A QUÉ HOST redirige.
    // Si redirectTo apunta a un host ≠ al que ve el browser, la cookie (host-only)
    // queda en otro dominio → el proxy no la ve. tokenLen detecta cookie >4KB.
    console.error("[diag][callback] set portal_session", {
      reqHost: req.headers.get("host") ?? null,
      xfHost: req.headers.get("x-forwarded-host") ?? null,
      xfProto: req.headers.get("x-forwarded-proto") ?? null,
      appUrl: APP_URL,
      redirectTo: target,
      tokenLen: session.length,
      opts: { ...cookieOpts, maxAge: undefined },
    });
    const res = NextResponse.redirect(target);
    res.cookies.set(SESSION_COOKIE, session, cookieOpts);
    for (const c of ["oidc_state", "oidc_nonce", "oidc_verifier"]) {
      res.cookies.set(c, "", { path: "/", maxAge: 0 });
    }
    return res;
  } catch (err) {
    console.error("[oidc] callback error:", err);
    return errorRedirect("callback_failed");
  }
}
