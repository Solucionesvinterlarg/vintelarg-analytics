import { Clock } from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";

/**
 * Pantalla "Próximamente" genérica. Se muestra cuando:
 *  - un módulo-APP del menú no está disponible (inactivo en la org / app
 *    deshabilitada / el rol no puede abrirla por allowed_roles), o
 *  - un módulo INTERNO todavía no tiene su pantalla desarrollada (ej. returns).
 * Reemplaza al antiguo crm-placeholder (específico de CRM).
 */
export function Proximamente({ title = "Próximamente" }: { title?: string }) {
  return (
    <>
      <DesktopTopBar title={title} initials="AW" />
      <div className="grid flex-1 place-items-center px-6 py-16">
        <div className="flex max-w-sm flex-col items-center text-center">
          <div className="grid size-16 place-items-center rounded-2xl" style={{ background: "var(--aw-violet-light)", color: "var(--aw-violet)" }}>
            <Clock size={30} strokeWidth={1.5} />
          </div>
          <span
            className="mt-5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em]"
            style={{ background: "var(--aw-violet-light)", color: "var(--aw-violet-ink)" }}
          >
            Próximamente
          </span>
          <h2 className="mt-3 text-[20px] font-extrabold tracking-[-0.02em] text-foreground">{title}</h2>
          <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
            Esta sección todavía no está disponible para tu organización. Cuando se habilite, aparece acá.
          </p>
        </div>
      </div>
    </>
  );
}
