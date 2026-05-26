import Link from "next/link";

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--aw-violet)]">
        Portal A-ware®
      </div>
      <h1 className="text-2xl font-extrabold tracking-tight">No pudimos iniciar tu sesión</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Hubo un problema durante el ingreso
        {reason ? <> (motivo: <code className="text-xs">{reason}</code>)</> : null}. Probá de
        nuevo; si persiste, avisá al equipo.
      </p>
      <Link
        href="/api/auth/login"
        className="mt-2 inline-flex items-center rounded-full bg-[var(--aw-violet)] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[var(--aw-violet-deep)]"
      >
        Volver a intentar
      </Link>
    </div>
  );
}
