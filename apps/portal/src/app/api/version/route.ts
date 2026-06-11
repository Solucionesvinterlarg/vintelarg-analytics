import { NextResponse } from "next/server";

// Endpoint público de diagnóstico: confirma QUÉ commit corre en prod.
// El SHA y el build time se bakean en la imagen (Dockerfile, build-args
// GIT_SHA/BUILD_TIME). Ruta pública (ver PUBLIC_PREFIXES en src/proxy.ts):
// no requiere sesión.
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    commit: process.env.GIT_SHA ?? "unknown",
    buildTime: process.env.BUILD_TIME ?? "unknown",
    now: new Date().toISOString(),
  });
}
