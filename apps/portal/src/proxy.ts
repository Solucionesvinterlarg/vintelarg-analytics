import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/session-token";

/** Rutas públicas (no requieren sesión). `/acceso` = maquetas pre-auth de la
 *  red comercial (Login/Landing/Registro de la emprendedora). `/api/version` =
 *  endpoint de diagnóstico que reporta el commit deployado. */
const PUBLIC_PREFIXES = ["/api/auth", "/api/version", "/auth-error", "/acceso"];

// Next 16: el convention `middleware` fue renombrado a `proxy`.
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const user = token ? await verifySessionToken(token) : null;

  if (!user) {
    // [DIAG temporal] confirma si el proxy CORRE y es quien redirige a login
    // (explicaría la ausencia de logs de session/render). hasCookie distingue
    // "cookie no viajó" de "cookie presente pero JWT inválido en el proxy".
    console.error("[diag][proxy] redirect→login", {
      path: pathname,
      hasCookie: !!token,
      rsc: req.headers.get("rsc") ?? null,
      prefetch: req.headers.get("next-router-prefetch") ?? null,
    });
    return NextResponse.redirect(new URL("/api/auth/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  // Protege todo salvo assets estáticos y recursos internos de Next.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
