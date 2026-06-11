"use client";

import { useState } from "react";
import { Package, TrendingUp, Users, Wallet } from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { MockBadge } from "@/components/portal/mock-badge";
import { PortalBadge } from "@/components/portal/badge";

const KPIS = [
  { label: "Pedidos", value: "124", Icon: Package, delta: "+14% vs N-1", tone: "success" as const },
  { label: "Venta grupal", value: "$845k", Icon: TrendingUp, delta: "85% del objetivo", tone: "success" as const },
  { label: "Altas", value: "12", Icon: Users, delta: "+3 vs N-1", tone: "success" as const },
  { label: "Cobrabilidad", value: "75%", Icon: Wallet, delta: "En riesgo", tone: "danger" as const, dot: true },
];
const TABS = ["Detalle de campaña", "Actividad", "Cobrabilidad"];
const CAMPS = ["Campaña N", "N-1", "N-2"];
// serie real (índices 0..6) + proyección (6..9)
const REAL = [30, 36, 44, 50, 58, 66, 74];
const PROY = [74, 80, 86, 92];

export function LciCampanaView() {
  const [tab, setTab] = useState(TABS[0]);
  const [camp, setCamp] = useState(CAMPS[0]);
  return (
    <>
      <MockBadge />
      <DesktopTopBar title="Campaña" filters={["Canal: Todos", "Zona: Zona 4"]} initials="LT" />

      <div className="px-5 pt-5 md:px-6">
        <div className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--aw-violet)" }}>Performance por campaña</div>
        <h2 className="mt-1 text-[22px] font-extrabold tracking-[-0.02em] text-foreground">Campaña</h2>
      </div>

      {/* tabs */}
      <div className="flex gap-1.5 px-5 pt-3.5 md:px-6">
        {TABS.map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className="rounded-lg px-3.5 py-2 text-[12.5px] font-semibold transition-colors" style={{ background: tab === t ? "var(--aw-violet)" : "var(--aw-chalk)", color: tab === t ? "#fff" : "var(--fg-subtle)" }}>{t}</button>
        ))}
      </div>
      {/* selector campaña */}
      <div className="mx-5 mt-3 flex gap-1.5 rounded-xl bg-card p-1 md:mx-6" style={{ border: "0.5px solid var(--aw-hairline)", width: "fit-content" }}>
        {CAMPS.map((c) => (
          <button key={c} type="button" onClick={() => setCamp(c)} className="rounded-lg px-4 py-1.5 text-[12.5px] font-bold transition-colors" style={{ background: camp === c ? "var(--aw-violet)" : "transparent", color: camp === c ? "#fff" : "var(--fg-subtle)" }}>{c}</button>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-3.5 px-5 pt-4 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
        {KPIS.map((k) => (
          <div key={k.label} className="relative rounded-2xl bg-card p-[18px]" style={{ border: "0.5px solid var(--aw-hairline)" }}>
            {k.dot && <span className="absolute right-4 top-4 size-2 rounded-full" style={{ background: "var(--aw-danger)" }} />}
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.07em] text-muted-foreground"><k.Icon size={15} strokeWidth={1.5} />{k.label}</div>
            <div className="mt-2 text-[26px] font-extrabold tracking-[-0.02em] tabular-nums text-foreground">{k.value}</div>
            <div className="mt-2"><PortalBadge tone={k.tone} dot>{k.delta}</PortalBadge></div>
          </div>
        ))}
      </div>

      {/* charts */}
      <div className="grid grid-cols-1 gap-4 px-5 pb-6 pt-5 md:px-6 lg:grid-cols-3">
        {/* evolución */}
        <div className="rounded-2xl bg-card p-5 lg:col-span-2" style={{ border: "0.5px solid var(--aw-hairline)" }}>
          <div className="text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: "var(--aw-violet)" }}>{camp}</div>
          <div className="text-[15.5px] font-bold tracking-[-0.01em] text-foreground">Evolución de venta grupal y proyección</div>
          <LineProj />
          <div className="mt-3 flex items-center justify-between text-[11.5px] text-muted-foreground">
            <span className="flex items-center gap-3"><span className="flex items-center gap-1.5"><span className="h-0.5 w-4 rounded" style={{ background: "var(--aw-violet)" }} /> Real</span><span className="flex items-center gap-1.5"><span className="h-0.5 w-4 rounded" style={{ background: "var(--aw-violet)", opacity: 0.5 }} /> Proyección</span></span>
            <span>Objetivo <b className="text-foreground">$994.000</b></span>
          </div>
        </div>

        {/* cobrabilidad */}
        <div className="rounded-2xl bg-card p-5" style={{ border: "0.5px solid var(--aw-hairline)" }}>
          <div className="text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: "var(--aw-violet)" }}>Total cobrado 75%</div>
          <div className="text-[15.5px] font-bold tracking-[-0.01em] text-foreground">Desglose de cobrabilidad</div>
          <Donut pct={75} />
          <div className="mt-4 flex flex-col gap-2.5">
            <CobRow label="EC / WOE" value="$633.900 · 75%" color="var(--aw-success)" w="75%" />
            <CobRow label="ND / NC" value="$211.300 · 25%" color="var(--aw-warning)" w="25%" />
          </div>
        </div>
      </div>
    </>
  );
}

function CobRow({ label, value, color, w }: { label: string; value: string; color: string; w: string }) {
  return (
    <div>
      <div className="flex justify-between text-[12px]"><span className="font-semibold text-foreground">{label}</span><span className="text-muted-foreground">{value}</span></div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full" style={{ background: "var(--aw-chalk)" }}><div className="h-full rounded-full" style={{ width: w, background: color }} /></div>
    </div>
  );
}

function LineProj() {
  const w = 480, h = 150, all = [...REAL, ...PROY], max = Math.max(...all), min = 20, span = max - min || 1;
  const x = (i: number, n: number) => (i / (n - 1)) * w;
  const y = (v: number) => h - ((v - min) / span) * (h - 12) - 6;
  const realPts = REAL.map((v, i) => `${(i / (all.length - 1)) * w},${y(v)}`).join(" ");
  const proyPts = PROY.map((v, i) => `${((i + REAL.length - 1) / (all.length - 1)) * w},${y(v)}`).join(" ");
  const areaPts = `0,${h} ${realPts} ${(REAL.length - 1) / (all.length - 1) * w},${h}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="mt-4 h-[150px] w-full" aria-hidden>
      <polygon points={areaPts} fill="var(--aw-violet)" opacity={0.08} />
      <polyline points={realPts} fill="none" stroke="var(--aw-violet)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={proyPts} fill="none" stroke="var(--aw-violet)" strokeWidth={2.5} strokeDasharray="6 5" opacity={0.5} strokeLinecap="round" />
      <circle cx={(REAL.length - 1) / (all.length - 1) * w} cy={y(REAL[REAL.length - 1])} r={3.5} fill="var(--aw-violet)" />
    </svg>
  );
}

function Donut({ pct }: { pct: number }) {
  const r = 52, c = 2 * Math.PI * r, off = c * (1 - pct / 100);
  return (
    <div className="relative mx-auto mt-4 grid size-[140px] place-items-center">
      <svg viewBox="0 0 140 140" className="size-full -rotate-90">
        <circle cx="70" cy="70" r={r} fill="none" stroke="var(--aw-chalk)" strokeWidth={16} />
        <circle cx="70" cy="70" r={r} fill="none" stroke="var(--aw-danger)" strokeWidth={16} strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" />
      </svg>
      <div className="absolute text-center"><div className="text-[24px] font-extrabold tracking-[-0.02em] text-foreground">{pct}%</div><div className="text-[10.5px] text-muted-foreground">cobrado</div></div>
    </div>
  );
}
