import Link from "next/link";
import { ClipboardCheck, Package, Receipt, Truck, Check, Clock, Bell, TriangleAlert } from "lucide-react";
import { MockBadge } from "@/components/portal/mock-badge";
import { EmpBackHeader } from "@/features/emprendedora/emp-back-header";

const STEPS = [
  { n: "Validación", d: "Pedido confirmado", state: "done" as const, Icon: ClipboardCheck },
  { n: "Preparación", d: "Armando tu paquete", state: "done" as const, Icon: Package },
  { n: "Facturación", d: "Generando factura", state: "active" as const, Icon: Receipt },
  { n: "Entrega", d: "En camino a destino", state: "pending" as const, Icon: Truck },
];
const INFO = [
  { l: "Guía / Transportista", v: "Andreani · #AR-77 2049 118", Icon: Truck },
  { l: "Tiempo estimado", v: "14/04/2026 · franja 14–18 h", Icon: Clock },
  { l: "Notificaciones", v: "App + SMS activadas", Icon: Bell },
];

export function SeguimientoView() {
  return (
    <div className="pb-6">
      <MockBadge />
      <EmpBackHeader title="Seguimiento de Pedido" sub="#A-10294 · Mariela F." back="/emp/catalogo" />
      <div className="px-4 pt-4">
        {/* stepper */}
        <div className="rounded-2xl p-[18px]" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" }}>
          {STEPS.map((s, i) => {
            const done = s.state === "done", active = s.state === "active";
            return (
              <div key={s.n} className="flex gap-3.5">
                <div className="flex flex-col items-center">
                  <span className="grid size-9 flex-none place-items-center rounded-full" style={{ background: done ? "var(--aw-success)" : active ? "var(--aw-violet)" : "var(--aw-app-bg)", color: done || active ? "#fff" : "var(--fg-subtle)", boxShadow: active ? "0 0 0 4px var(--aw-violet-light)" : "none" }}>
                    {done ? <Check size={18} strokeWidth={3} /> : <s.Icon size={18} />}
                  </span>
                  {i < STEPS.length - 1 && <span className="min-h-[26px] w-0.5 flex-1" style={{ background: done ? "var(--aw-success)" : "var(--aw-hairline)" }} />}
                </div>
                <div style={{ paddingBottom: i < STEPS.length - 1 ? 18 : 0 }}>
                  <div className="text-[14px] font-bold" style={{ color: active ? "var(--aw-violet-deep)" : "var(--foreground)" }}>{s.n}{active && <span className="text-[11px] font-semibold" style={{ color: "var(--aw-violet)" }}> · en curso</span>}</div>
                  <div className="text-[12px] text-muted-foreground">{s.d}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* info */}
        <div className="mt-3.5 flex flex-col gap-2.5">
          {INFO.map((r) => (
            <div key={r.l} className="flex items-center gap-3 rounded-2xl p-3" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" }}>
              <span className="grid size-[38px] flex-none place-items-center rounded-xl" style={{ background: "var(--aw-violet-light)", color: "var(--aw-violet)" }}><r.Icon size={18} /></span>
              <div className="flex-1"><div className="text-[11.5px] text-muted-foreground">{r.l}</div><div className="text-[13px] font-bold text-foreground">{r.v}</div></div>
            </div>
          ))}
        </div>

        <Link href="/emp/reclamos" className="emp-press mt-3.5 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-bold" style={{ border: "1.5px solid var(--aw-violet)", color: "var(--aw-violet)" }}><TriangleAlert size={18} /> Registrar Incidencia</Link>
      </div>
    </div>
  );
}
