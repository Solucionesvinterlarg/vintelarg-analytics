"use client";

import { HelpCircle, Minus, Equal, Layers, Package, History, ChevronRight } from "lucide-react";
import { MockBadge } from "@/components/portal/mock-badge";
import { PortalBadge } from "@/components/portal/badge";
import { EmpBackHeader } from "@/features/emprendedora/emp-back-header";
import { useEmpStore } from "@/lib/emp-store";

export function IncentivosView() {
  const notify = useEmpStore((s) => s.notify);
  return (
    <div className="pb-6">
      <MockBadge />
      <EmpBackHeader
        title="Mis Incentivos"
        sub="Programa Campañas 3 y 4 · 2026"
        back="/emp/programas"
        right={<button type="button" onClick={() => notify("Bases y Condiciones")} aria-label="Ayuda" className="emp-press grid size-9 place-items-center rounded-full text-foreground" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)" }}><HelpCircle size={19} /></button>}
      />
      <div className="px-4 pt-3.5">
        {/* unidades computables */}
        <div className="rounded-2xl p-4" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" }}>
          <div className="mb-3 text-[12px] font-bold uppercase tracking-[0.06em] text-muted-foreground">Unidades Computables</div>
          <div className="flex items-center justify-between text-center">
            <div><div className="text-[22px] font-extrabold text-foreground">142</div><div className="text-[10.5px] text-muted-foreground">C3 un.</div></div>
            <Minus size={18} className="text-muted-foreground" />
            <div><div className="text-[22px] font-extrabold" style={{ color: "var(--aw-danger)" }}>8</div><div className="text-[10.5px] text-muted-foreground">Devol.</div></div>
            <Equal size={18} className="text-muted-foreground" />
            <div><div className="text-[22px] font-extrabold" style={{ color: "var(--aw-success)" }}>134</div><div className="text-[10.5px] text-muted-foreground">Finales</div></div>
          </div>
          <div className="mt-2.5 text-center text-[11px] text-muted-foreground">Unidades finales computables para premios.</div>
        </div>

        {/* nivel */}
        <div className="mt-3 rounded-2xl p-4" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" }}>
          <div className="mb-2.5 flex items-center justify-between"><PortalBadge tone="violet"><Layers size={12} /> NIVEL 3 alcanzado</PortalBadge><span className="text-[13px] font-extrabold text-foreground">89%</span></div>
          <div className="h-2 overflow-hidden rounded-full" style={{ background: "var(--aw-violet-light)" }}><div className="h-full rounded-full" style={{ width: "89%", background: "var(--aw-violet)" }} /></div>
          <div className="mt-2.5 text-[12px] text-muted-foreground">Objetivo <b className="text-foreground">250 un.</b> · Te faltan <b style={{ color: "var(--aw-violet-deep)" }}>16 unidades</b> para NIVEL 4.</div>
        </div>

        {/* envío de premio */}
        <div className="mt-3 flex items-center gap-3 rounded-2xl p-4" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" }}>
          <span className="grid size-[46px] flex-none place-items-center rounded-xl" style={{ background: "var(--aw-warning-light)", color: "#84541A" }}><Package size={22} /></span>
          <div className="flex-1"><div className="text-[13.5px] font-bold text-foreground">Envío de Premio</div><div className="text-[11.5px] text-muted-foreground">En Proceso · Estimado C15 2026</div></div>
          <PortalBadge tone="warn">En Proceso</PortalBadge>
        </div>

        <button type="button" onClick={() => notify("Programas anteriores")} className="emp-press mt-3.5 flex w-full items-center gap-3 rounded-2xl p-3.5 text-foreground" style={{ background: "var(--aw-white)", border: "1px solid var(--aw-hairline)" }}>
          <History size={19} style={{ color: "var(--aw-violet)" }} />
          <span className="flex-1 text-left text-[13.5px] font-bold">Programas anteriores</span>
          <ChevronRight size={18} className="text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
