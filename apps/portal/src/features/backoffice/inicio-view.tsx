import { Sparkles } from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { MockBadge } from "@/components/portal/mock-badge";
import { AwareMark } from "@/components/portal/aware-mark";
import type { BoTeaser } from "@/lib/portal-config";

/**
 * Inicio / Próximamente — teaser de "acceso mínimo" del back-office interno.
 * Recurso ÚNICO: la vista NO mira el rol. El encuadre por rol (roleLabel + chips
 * + hint) llega por prop, resuelto server-side en la page.
 */
export function InicioView({ roleLabel, teaser }: { roleLabel: string; teaser: BoTeaser }) {
  return (
    <>
      <MockBadge />
      <DesktopTopBar title="Inicio" initials="CR" />

      <div className="grid flex-1 place-items-center px-6 py-12">
        <div className="w-full max-w-[520px] text-center">
          <div className="mx-auto grid size-[72px] place-items-center rounded-2xl" style={{ background: "var(--aw-violet)" }}>
            <AwareMark size={36} />
          </div>

          <span className="mt-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em]" style={{ background: "var(--aw-violet-light)", color: "var(--aw-violet-ink)" }}>
            <Sparkles size={13} strokeWidth={2} /> Próximamente
          </span>

          <h2 className="mt-3 text-[24px] font-extrabold tracking-[-0.02em] text-foreground">Estamos preparando tu espacio</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            Las pantallas específicas de este perfil se definen en la próxima etapa.
          </p>

          {/* Panel con el encuadre del rol */}
          <div className="mt-6 rounded-2xl p-5 text-left" style={{ background: "var(--aw-app-bg)", border: "0.5px solid var(--aw-hairline)" }}>
            <div className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--aw-violet)" }}>{roleLabel} · próximas funciones</div>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {teaser.chips.map((ch) => (
                <span key={ch} className="rounded-full px-3 py-1 text-[12px] font-semibold" style={{ background: "var(--aw-violet-light)", color: "var(--aw-violet-ink)" }}>{ch}</span>
              ))}
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{teaser.hint}</p>
          </div>
        </div>
      </div>
    </>
  );
}
