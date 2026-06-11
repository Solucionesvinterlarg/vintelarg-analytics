"use client";

import { Star, SlidersHorizontal, Eye } from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { MockBadge } from "@/components/portal/mock-badge";
import { PortalBadge, type BadgeTone } from "@/components/portal/badge";
import { AvatarInitials } from "@/components/portal/avatar-initials";

const STATS = [
  { v: "24", l: "Luceros activas" },
  { v: "8 (33%)", l: "Próximas a graduarse" },
  { v: "4 camp.", l: "Tiempo prom. graduación" },
];
interface Cand { name: string; idNum: string; estado: string; tone: BadgeTone; color: string; pct: number; altas: string; ventas: string; grad: string; primary?: boolean }
const CANDS: Cand[] = [
  { name: "Martina Torres", idNum: "74839201", estado: "Casi lista", tone: "success", color: "var(--aw-success)", pct: 95, altas: "15/10", ventas: "$80k/$50k", grad: "Campaña N", primary: true },
  { name: "Camila Rojas", idNum: "59384721", estado: "En camino", tone: "warn", color: "var(--aw-warning)", pct: 60, altas: "10/10", ventas: "$30k/$50k", grad: "Campaña N+1" },
  { name: "Valeria Silva", idNum: "28475910", estado: "Iniciando", tone: "danger", color: "var(--aw-danger)", pct: 25, altas: "2/10", ventas: "$15k/$50k", grad: "Campaña N+3" },
];

export function LciPlanLuceroView() {
  return (
    <>
      <MockBadge />
      <DesktopTopBar title="Plan Lucero" initials="LT" />

      <div className="px-5 pt-5 md:px-6">
        <div className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--aw-violet)" }}>Desarrollo de líderes</div>
        <h2 className="mt-1 text-[22px] font-extrabold tracking-[-0.02em] text-foreground">Plan Lucero</h2>
      </div>

      {/* banner */}
      <div className="mx-5 mt-4 grid grid-cols-1 gap-4 rounded-2xl px-6 py-5 text-white sm:grid-cols-3 md:mx-6" style={{ background: "var(--aw-violet)" }}>
        {STATS.map((s) => (
          <div key={s.l} className="flex items-center gap-3">
            <Star size={22} strokeWidth={1.5} className="opacity-80" />
            <div><div className="text-[22px] font-extrabold tracking-[-0.02em]">{s.v}</div><div className="text-[11.5px] opacity-85">{s.l}</div></div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between px-5 pt-5 md:px-6">
        <div><div className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--aw-violet)" }}>Candidatas</div><h3 className="mt-0.5 text-[17px] font-extrabold tracking-[-0.02em] text-foreground">Progreso individual destacado</h3></div>
        <button type="button" className="inline-flex items-center gap-1.5 rounded-lg bg-card px-3 py-2 text-[12px] font-semibold text-foreground" style={{ border: "1px solid var(--aw-hairline)" }}><SlidersHorizontal size={14} /> Estado: <b>Todas</b></button>
      </div>

      <div className="grid grid-cols-1 gap-4 px-5 pb-6 pt-4 md:px-6 lg:grid-cols-3">
        {CANDS.map((c) => (
          <div key={c.name} className="flex flex-col rounded-2xl bg-card p-5" style={{ border: "0.5px solid var(--aw-hairline)" }}>
            <div className="flex items-center gap-3">
              <AvatarInitials name={c.name} size={40} />
              <div className="flex-1"><div className="text-[14px] font-bold text-foreground">{c.name}</div><div className="text-[11px] text-muted-foreground">ID {c.idNum}</div></div>
              <PortalBadge tone={c.tone}>{c.estado}</PortalBadge>
            </div>
            <div className="mb-1.5 mt-4 flex justify-between text-[12px]"><span className="text-muted-foreground">Progreso al plan</span><span className="font-bold tabular-nums text-foreground">{c.pct}%</span></div>
            <div className="h-2 overflow-hidden rounded-full" style={{ background: "var(--aw-chalk)" }}><div className="h-full rounded-full" style={{ width: `${c.pct}%`, background: c.color }} /></div>
            <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl px-3 py-2.5" style={{ background: "var(--aw-app-bg)" }}>
              <div><div className="text-[10px] font-semibold uppercase tracking-[0.05em] text-muted-foreground">Altas</div><div className="text-[13.5px] font-bold tabular-nums text-foreground">{c.altas}</div></div>
              <div><div className="text-[10px] font-semibold uppercase tracking-[0.05em] text-muted-foreground">Ventas</div><div className="text-[13.5px] font-bold tabular-nums text-foreground">{c.ventas}</div></div>
            </div>
            <div className="mt-3 text-[11.5px] text-muted-foreground">Estimación de graduación: <b className="text-foreground">{c.grad}</b></div>
            {c.primary ? (
              <button type="button" className="mt-4 flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-[13px] font-bold text-white" style={{ background: "var(--aw-violet)" }}><Star size={15} /> Incluir en Plan Lucero</button>
            ) : (
              <button type="button" className="mt-4 flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-[13px] font-bold text-foreground transition-colors hover:bg-secondary" style={{ border: "1px solid var(--aw-hairline)" }}><Eye size={15} /> Ver seguimiento</button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
