"use client";

import { Plus, Check, MessageSquareWarning } from "lucide-react";
import { MockBadge } from "@/components/portal/mock-badge";
import { PortalBadge, type BadgeTone } from "@/components/portal/badge";
import { EmpBackHeader } from "@/features/emprendedora/emp-back-header";
import { useEmpStore } from "@/lib/emp-store";

const TRACK = ["Registrado", "Revisión GZ", "Aprobado", "Reposición"];
const HIST: { id: string; t: string; st: string; tone: BadgeTone; d: string }[] = [
  { id: "#3981", t: "Faltante en pedido", st: "Resuelto", tone: "success", d: "12 Feb 2026" },
  { id: "#3820", t: "Demora en entrega", st: "Resuelto", tone: "success", d: "28 Ene 2026" },
  { id: "#3744", t: "Producto incorrecto", st: "Rechazado", tone: "danger", d: "09 Ene 2026" },
];

export function ReclamosView() {
  const notify = useEmpStore((s) => s.notify);
  return (
    <div className="pb-6">
      <MockBadge />
      <EmpBackHeader title="Reclamos" right={<button type="button" onClick={() => notify("Nuevo reclamo iniciado")} className="emp-press flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-bold text-white" style={{ background: "var(--aw-violet)" }}><Plus size={15} /> Nuevo</button>} />
      <div className="px-4 pt-3.5">
        <div className="mb-3.5 text-[12.5px] leading-snug text-muted-foreground">Sistema de Reclamos · resolución y seguimiento transparente.</div>

        {/* active claim */}
        <div className="rounded-2xl p-4" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" }}>
          <div className="flex items-center justify-between">
            <div><div className="text-[14px] font-extrabold text-foreground">Reclamo #4029</div><div className="text-[11.5px] text-muted-foreground">Producto dañado · Bowl Creativa 3L</div></div>
            <PortalBadge tone="success"><Check size={12} /> Aprobado GZ</PortalBadge>
          </div>
          <div className="mt-3.5 flex items-center">
            {TRACK.map((s, i) => (
              <div key={s} className="flex-1 text-center">
                <span className="mx-auto grid size-[26px] place-items-center rounded-full" style={{ background: i < 3 ? "var(--aw-success)" : "var(--aw-app-bg)", color: i < 3 ? "#fff" : "var(--fg-subtle)" }}>{i < 3 ? <Check size={13} strokeWidth={3} /> : <span className="text-[11px] font-extrabold">{i + 1}</span>}</span>
                <div className="mt-1.5 text-[9.5px] font-semibold text-muted-foreground">{s}</div>
              </div>
            ))}
          </div>
        </div>

        {/* historial */}
        <div className="mb-3 mt-[18px] text-[15.5px] font-bold tracking-[-0.01em] text-foreground">Historial de incidencias</div>
        <div className="flex flex-col gap-2.5">
          {HIST.map((r) => (
            <div key={r.id} className="flex items-center gap-3 rounded-2xl p-3" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" }}>
              <span className="grid size-[38px] flex-none place-items-center rounded-xl" style={{ background: "var(--aw-app-bg)", color: "var(--fg-subtle)" }}><MessageSquareWarning size={18} /></span>
              <div className="min-w-0 flex-1"><div className="text-[13px] font-bold text-foreground">{r.t}</div><div className="text-[11px] text-muted-foreground">{r.id} · {r.d}</div></div>
              <PortalBadge tone={r.tone}>{r.st}</PortalBadge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
