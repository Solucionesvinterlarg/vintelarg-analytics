import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/session-token";

/** Rutas públicas (no requieren sesión). `/acceso` = maquetas pre-auth de la
 *  red comercial (Login/Landing/Registro de la emprendedora). */
const PUBLIC_PREFIXES = ["/api/auth", "/auth-error", "/acceso"];

// Next 16: el convention `middleware` fue renombrado a `proxy`.
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const user = token ? await verifySessionToken(token) : null;

  if (!user) {
    return NextResponse.redirect(new URL("/api/auth/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  // Protege todo salvo assets estáticos y recursos internos de Next.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
