import { GraduationCap, ArrowUpRight } from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";

/**
 * Academia A·ware como APP EXTERNA para el líder (mismo criterio que CRM y que
 * la emprendedora): ingreso/redirect, NO se maqueta el grid. Sin badge MOCK.
 * El override shared:academia -> /lci/academia trae acá.
 */
export function LciAcademiaView() {
  return (
    <>
      <DesktopTopBar title="Academia A·ware" initials="LT" />
      <div className="grid place-items-center px-6 py-24 text-center">
        <div className="mb-5 grid size-[72px] place-items-center rounded-[20px]" style={{ background: "var(--aw-violet-light)", color: "var(--aw-violet)" }}>
          <GraduationCap size={32} strokeWidth={1.5} />
        </div>
        <h2 className="text-[20px] font-bold tracking-[-0.02em] text-foreground">Academia se abre como app externa</h2>
        <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-muted-foreground">Formación de líderes, certificaciones y badges — gestionados por la plataforma de formación A·ware.</p>
        <button type="button" className="mt-5 inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[13.5px] font-semibold text-white" style={{ background: "var(--aw-violet)" }}>
          Abrir Academia <ArrowUpRight size={15} strokeWidth={2} />
        </button>
        <div className="mt-4 text-[11.5px] text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>academia.a-ware</div>
      </div>
    </>
  );
}
