import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/session-token";

const ISSUER = process.env.AUTH_ISSUER ?? "http://localhost:3000";

/** Cierra la sesión local del Portal y vuelve al IdP. */
export async function GET() {
  const res = NextResponse.redirect(ISSUER);
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
