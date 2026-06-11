import { Check, Gift, Lock, Flame } from "lucide-react";
import { MockBadge } from "@/components/portal/mock-badge";
import { PortalBadge, type BadgeTone } from "@/components/portal/badge";
import { EmpBackHeader } from "@/features/emprendedora/emp-back-header";
import { toneTile } from "@/features/emprendedora/_mock/logros";

const ETAPAS: { t: string; s: string; st: string; tone: BadgeTone; prize: string; done?: boolean; active?: boolean; locked?: boolean; note?: string; pct?: number }[] = [
  { t: "ETAPA 1", s: "Pedidos 1–2", st: "Hecho", tone: "success", prize: "Set Tupperware", done: true },
  { t: "ETAPA 2", s: "Pedidos 3–4", st: "En Curso", tone: "warn", prize: "Set de Belleza", active: true, note: "Te faltan 7 unidades", pct: 75 },
  { t: "ETAPA 3", s: "Pedidos 5–6", st: "Bloqueado", tone: "neutral", prize: "Premio sorpresa", locked: true },
];

export function OnboardingView() {
  return (
    <div className="pb-6">
      <MockBadge />
      <EmpBackHeader title="Programa Onboarding" sub="Campaña 6/2026 · primeras 7 campañas" />
      <div className="px-4 pt-3.5">
        <div className="rounded-2xl p-4" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" }}>
          <div className="mb-2.5 flex items-center justify-between"><div className="text-[13px] font-bold text-foreground">Acompañamiento general</div><PortalBadge tone="violet">ETAPA 2 DE 3</PortalBadge></div>
          <div className="h-2 overflow-hidden rounded-full" style={{ background: "var(--aw-violet-light)" }}><div className="h-full rounded-full" style={{ width: "66%", background: "var(--aw-violet)" }} /></div>
          <div className="mt-2 text-[12px] text-muted-foreground">Progreso <b className="text-foreground">66%</b> completado</div>
        </div>

        <div className="mt-3.5 flex flex-col gap-2.5">
          {ETAPAS.map((e) => {
            const t = toneTile(e.tone);
            return (
              <div key={e.t} className="rounded-2xl p-3.5" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: `1px solid ${e.active ? "var(--aw-violet-light)" : "var(--aw-hairline)"}`, opacity: e.locked ? 0.6 : 1 }}>
                <div className="flex items-center gap-3">
                  <span className="grid size-[42px] flex-none place-items-center rounded-xl" style={{ background: t.bg, color: t.fg }}>{e.done ? <Check size={20} /> : e.locked ? <Lock size={20} /> : <Gift size={20} />}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5"><span className="text-[13.5px] font-extrabold text-foreground">{e.t}</span><span className="text-[11px] text-muted-foreground">{e.s}</span></div>
                    <div className="mt-px text-[11.5px] text-muted-foreground">Premio: <b className="text-foreground">{e.prize}</b></div>
                  </div>
                  <PortalBadge tone={e.tone}>{e.st}</PortalBadge>
                </div>
                {e.note && <div className="mt-2.5"><div className="h-2 overflow-hidden rounded-full" style={{ background: "var(--aw-warning-light)" }}><div className="h-full rounded-full" style={{ width: `${e.pct}%`, background: "var(--aw-warning)" }} /></div><div className="mt-1.5 text-[11.5px] text-muted-foreground">{e.note} para completar la etapa.</div></div>}
              </div>
            );
          })}
        </div>

        {/* banda 5 pedidos */}
        <div className="mt-4 rounded-2xl p-4" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" }}>
          <div className="mb-3 flex items-center gap-2"><Flame size={18} style={{ color: "var(--aw-violet)" }} /><div className="text-[13.5px] font-bold text-foreground">5 pedidos seguidos → Premio Exclusivo</div></div>
          <div className="flex items-center justify-between">
            {["P1", "P2", "P3", "P4", "P5"].map((p, i) => (
              <div key={p} className="flex flex-1 items-center" style={{ flex: i < 4 ? 1 : "none" }}>
                <span className="grid size-[34px] flex-none place-items-center rounded-full text-[12px] font-extrabold" style={{ background: i < 3 ? "var(--aw-success)" : i === 3 ? "var(--aw-violet-light)" : "var(--aw-app-bg)", color: i < 3 ? "#fff" : i === 3 ? "var(--aw-violet-deep)" : "var(--fg-subtle)" }}>{i < 3 ? <Check size={15} strokeWidth={3} /> : p}</span>
                {i < 4 && <span className="mx-1 h-0.5 flex-1" style={{ background: i < 2 ? "var(--aw-success)" : "var(--aw-hairline)" }} />}
              </div>
            ))}
          </div>
          <div className="mt-2.5 text-[11px] text-muted-foreground">Detalle de unidades por pedido, descontando devoluciones.</div>
        </div>
      </div>
    </div>
  );
}
