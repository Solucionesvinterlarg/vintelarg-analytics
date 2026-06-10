// TEMP dev-only: mint a portal_session for visual QA without the IdP. Removed before commit.
import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/session-token";
import { landingForRole, normalizeRole, ROLE_LABEL } from "@/lib/portal-config";

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "production") return new NextResponse("not found", { status: 404 });
  const url = new URL(req.url);
  const role = normalizeRole(url.searchParams.get("role") ?? "gerente_comercial");
  const name = url.searchParams.get("name") ?? ROLE_LABEL[role] + " Demo";
  // Org real de A-ware para que el QA lea el menú desde la matriz de permisos.
  // Override-able con ?org= por si se prueba otra organización.
  const orgId = url.searchParams.get("org") ?? "368ec3a1-b7fb-401f-bbac-fa1bd6cfa526";
  const session = await createSessionToken({
    id: "dev-" + role, name, email: "dev@aware.com.ar", role,
    orgId, orgName: "Aware S.A.", userType: role === "lci" || role === "emprendedor" ? "external" : "internal",
  });
  const res = NextResponse.redirect(`${url.origin}${landingForRole(role)}`);
  res.cookies.set(SESSION_COOKIE, session, { httpOnly: true, sameSite: "lax", path: "/", maxAge: SESSION_MAX_AGE });
  return res;
}
