import { GraduationCap, ArrowUpRight } from "lucide-react";
import { EmpBackHeader } from "@/features/emprendedora/emp-back-header";

/**
 * Ingreso a Academia A·ware como APP EXTERNA (mismo patrón que CRM Contactos):
 * no es maqueta con dato mock, es un enlace al módulo externo. Sin badge MOCK.
 * El contenido de Academia NO se construye en el portal.
 */
export function EmpAcademiaView() {
  return (
    <div className="pb-6">
      <EmpBackHeader title="Academia A·ware" />
      <div className="grid place-items-center px-6 py-16 text-center">
        <div className="mb-5 grid size-[72px] place-items-center rounded-[20px]" style={{ background: "var(--aw-violet-light)", color: "var(--aw-violet)" }}>
          <GraduationCap size={32} strokeWidth={1.5} />
        </div>
        <h2 className="text-[19px] font-bold tracking-[-0.02em] text-foreground">Academia se abre como app externa</h2>
        <p className="mx-auto mt-2 max-w-[280px] text-[13.5px] leading-relaxed text-muted-foreground">Cursos, certificaciones e insignias — gestionados por la plataforma de formación A·ware.</p>
        <button type="button" className="emp-press mt-5 inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[13.5px] font-semibold text-white" style={{ background: "var(--aw-violet)" }}>
          Abrir Academia <ArrowUpRight size={15} strokeWidth={2} />
        </button>
        <div className="mt-4 text-[11.5px] text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>academia.a-ware</div>
      </div>
    </div>
  );
}
