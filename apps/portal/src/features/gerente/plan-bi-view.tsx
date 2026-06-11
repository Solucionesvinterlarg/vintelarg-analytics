"use client";

import { useState } from "react";
import { Percent, Gift, Plane, GraduationCap, BadgeCheck, Coins } from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { PortalBadge } from "@/components/portal/badge";
import { MockBadge } from "@/components/portal/mock-badge";
import { AvatarInitials } from "@/components/portal/avatar-initials";
import { TabBar } from "@/components/portal/tab-bar";
import { Sparkline } from "@/components/portal/sparkline";
import { PLAN_NIVEL, PLAN_HISTORIAL, PLAN_BENEFICIOS, PLAN_ELITE, ELITE_SPARK } from "@/features/gerente/_mock/plan-bi";

const BEN_ICONS: Record<string, typeof Gift> = { percent: Percent, gift: Gift, plane: Plane, "graduation-cap": GraduationCap, "badge-check": BadgeCheck, coins: Coins };
type Tab = "nivel" | "historial" | "beneficios" | "elite";
const TABS: { id: Tab; label: string }[] = [
  { id: "nivel", label: "Plan por nivel UI" },
  { id: "historial", label: "Historial por cliente" },
  { id: "beneficios", label: "Beneficios de graduación" },
  { id: "elite", label: "Círculo Elite" },
];

export function PlanBiView() {
  const [tab, setTab] = useState<Tab>("nivel");
  return (
    <>
      <MockBadge />
      <DesktopTopBar title="Plan comercial BI" initials="MC" />
      <p className="px-5 pt-3.5 text-[13px] text-muted-foreground md:px-6">Plan de carrera y beneficios · A·WARE</p>

      <div className="px-5 pb-6 pt-3.5 md:px-6">
        <div className="overflow-hidden rounded-2xl bg-card" style={{ border: "0.5px solid var(--aw-hairline)" }}>
          <div className="px-4 pt-1"><TabBar tabs={TABS} active={tab} onChange={setTab} /></div>
          <div className="p-5">
            {tab === "nivel" && <Nivel />}
            {tab === "historial" && <Historial />}
            {tab === "beneficios" && <Beneficios />}
            {tab === "elite" && <Elite />}
          </div>
        </div>
      </div>
    </>
  );
}

function Nivel() {
  const GRID = "1.4fr 1.2fr 0.9fr 0.8fr 1fr";
  return (
    <div>
      <div className="hidden items-center pb-2.5 text-[11px] font-bold uppercase tracking-[0.07em] text-muted-foreground md:grid" style={{ gridTemplateColumns: GRID, borderBottom: "1px solid var(--aw-hairline)" }}>
        <span>Nivel UI</span><span className="text-right">Facturación req.</span><span className="text-right">Descuento</span><span className="text-right">Rebate</span><span className="text-right">UI en nivel</span>
      </div>
      {PLAN_NIVEL.map((r, i) => (
        <div key={r.n} className="flex flex-wrap items-center justify-between gap-2 py-3 md:grid" style={{ gridTemplateColumns: GRID, borderBottom: i < PLAN_NIVEL.length - 1 ? "0.5px solid var(--aw-hairline)" : "none" }}>
          <span><PortalBadge tone="violet">{r.n}</PortalBadge></span>
          <span className="text-right font-bold tabular-nums max-md:hidden" style={{ fontFamily: "var(--font-mono)" }}>{r.req}</span>
          <span className="text-right tabular-nums max-md:hidden">{r.desc}</span>
          <span className="text-right tabular-nums max-md:hidden">{r.rebate}</span>
          <span className="text-right font-bold tabular-nums" style={{ fontFamily: "var(--font-mono)" }}>{r.ui.toLocaleString("es-AR")}<span className="text-[11px] font-normal text-muted-foreground md:hidden"> UI · {r.desc} · req {r.req}</span></span>
        </div>
      ))}
    </div>
  );
}

function Historial() {
  const GRID = "1.6fr 1.4fr 0.7fr 0.8fr 1fr";
  return (
    <div>
      <div className="hidden items-center pb-2.5 text-[11px] font-bold uppercase tracking-[0.07em] text-muted-foreground md:grid" style={{ gridTemplateColumns: GRID, borderBottom: "1px solid var(--aw-hairline)" }}>
        <span>Cliente / UI</span><span>Nivel actual</span><span>Desde</span><span className="text-right">Campañas</span><span className="text-right">Acumulado</span>
      </div>
      {PLAN_HISTORIAL.map((r, i) => (
        <div key={r.c} className="flex flex-wrap items-center justify-between gap-2 py-3 md:grid" style={{ gridTemplateColumns: GRID, borderBottom: i < PLAN_HISTORIAL.length - 1 ? "0.5px solid var(--aw-hairline)" : "none" }}>
          <span className="flex items-center gap-2.5"><AvatarInitials name={r.c} size={28} /><span className="font-semibold">{r.c}</span></span>
          <span className="max-md:hidden"><PortalBadge tone="violet">{r.nivel}</PortalBadge></span>
          <span className="text-muted-foreground max-md:hidden">{r.desde}</span>
          <span className="text-right tabular-nums max-md:hidden">{r.camp}</span>
          <span className="text-right font-bold tabular-nums" style={{ fontFamily: "var(--font-mono)" }}>{r.acum}</span>
        </div>
      ))}
    </div>
  );
}

function Beneficios() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {PLAN_BENEFICIOS.map((b) => {
        const Icon = BEN_ICONS[b.icon] ?? Gift;
        return (
          <div key={b.t} className="flex gap-3 rounded-xl p-4" style={{ background: "var(--aw-app-bg)", border: "1px solid var(--aw-hairline)" }}>
            <div className="grid size-[42px] shrink-0 place-items-center rounded-xl" style={{ background: "var(--aw-violet-light)", color: "var(--aw-violet)" }}><Icon size={20} strokeWidth={1.5} /></div>
            <div>
              <div className="text-[14px] font-bold">{b.t}</div>
              <div className="mt-0.5 text-[12.5px] text-muted-foreground">{b.d}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Elite() {
  const [sel, setSel] = useState(0);
  const c = PLAN_ELITE[sel];
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div>
        <h4 className="text-[15px] font-bold tracking-[-0.01em]">Ranking Círculo Elite</h4>
        <p className="mb-3.5 text-[12px] text-muted-foreground">12 UI en el nivel · top 4</p>
        <div className="flex flex-col gap-2">
          {PLAN_ELITE.map((e, i) => (
            <button key={e.n} type="button" onClick={() => setSel(i)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left" style={{ border: `1px solid ${sel === i ? "var(--aw-violet)" : "var(--aw-hairline)"}`, background: sel === i ? "var(--aw-violet-light)" : "transparent" }}>
              <span className="w-[18px] font-extrabold text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>{i + 1}</span>
              <AvatarInitials name={e.n} size={32} />
              <span className="min-w-0 flex-1"><span className="block text-[13.5px] font-semibold">{e.n}</span><span className="text-[11.5px] text-muted-foreground">{e.z}</span></span>
              <span className="font-bold tabular-nums" style={{ fontFamily: "var(--font-mono)" }}>{e.amt}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-2xl p-[18px]" style={{ background: "var(--aw-app-bg)", border: "1px solid var(--aw-hairline)" }}>
        <div className="mb-4 flex items-center gap-3">
          <AvatarInitials name={c.n} size={52} />
          <div><div className="text-[16px] font-bold">{c.n}</div><div className="mt-1"><PortalBadge tone="violet">Círculo Elite</PortalBadge></div></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {([["Acumulado", c.amt], ["Campañas en nivel", String(c.camp)], ["Zona", c.z], ["Rebate", "9%"]] as const).map(([l, v]) => (
            <div key={l} className="rounded-xl bg-card px-3.5 py-3" style={{ border: "0.5px solid var(--aw-hairline)" }}>
              <div className="text-[11px] font-semibold text-muted-foreground">{l}</div>
              <div className="mt-1 text-[15px] font-bold tabular-nums">{v}</div>
            </div>
          ))}
        </div>
        <div className="mt-4"><Sparkline values={ELITE_SPARK} width={260} height={48} color="var(--aw-violet)" /></div>
      </div>
    </div>
  );
}
