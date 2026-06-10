import { ExternalLink, ArrowUpRight } from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";

/**
 * Pantalla puente para secciones servidas por el módulo CRM (@vintelarg/crm):
 * Gestión de reclamos y Tickets. NO lleva badge MOCK ni barra de filtros: no es
 * una maqueta con dato de ejemplo, es un enlace al módulo externo.
 */
export function CrmPlaceholder({ title }: { title: string }) {
  return (
    <>
      <DesktopTopBar title={title} initials="MC" />
      <div className="grid flex-1 place-items-center px-6 py-16">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-5 grid size-[72px] place-items-center rounded-[20px]" style={{ background: "var(--aw-violet-light)", color: "var(--aw-violet)" }}>
            <ExternalLink size={32} strokeWidth={1.5} />
          </div>
          <h2 className="text-[20px] font-bold tracking-[-0.02em] text-foreground">Esta sección se sirve desde el módulo CRM</h2>
          <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-muted-foreground">
            Contactos / Leads / Tickets / Red — gestionados por la app CRM.
          </p>
          <button type="button" className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-card px-4 py-2 text-[13px] font-semibold text-foreground transition-colors hover:bg-secondary" style={{ border: "1px solid var(--aw-hairline)" }}>
            Abrir módulo CRM <ArrowUpRight size={15} strokeWidth={1.75} />
          </button>
          <div className="mt-4 text-[11.5px] text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>@vintelarg/crm</div>
        </div>
      </div>
    </>
  );
}
