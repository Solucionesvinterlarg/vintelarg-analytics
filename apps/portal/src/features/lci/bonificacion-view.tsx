"use client";

import { useState } from "react";
import { Award, FileText, SlidersHorizontal, Download, Plus, Minus } from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { MockBadge } from "@/components/portal/mock-badge";
import { PortalBadge } from "@/components/portal/badge";

const KPIS = [
  { label: "Título simulado", value: "Diamante 3", Icon: Award, badge: "Campaña N", tone: "violet" as const },
  { label: "Bonificación bruta", value: "$36k", Icon: FileText, badge: "6%", tone: "neutral" as const },
  { label: "Ajustes", value: "−$2k", Icon: SlidersHorizontal, badge: "Devoluciones + mora", tone: "danger" as const },
  { label: "Neto a cobrar", value: "$34k", Icon: FileText, badge: "Listo", tone: "success" as const, dot: true },
];
const TABS = ["Liquidación", "Talón de pago", "Campañas cerradas"];
const ITEMS = [
  { sign: "+", t: "Bonificación por venta grupal", s: "6% sobre base bonificable", v: "$32.270" },
  { sign: "+", t: "Premio actividad (80 activas)", s: "Escalón 70-80%", v: "$2.400" },
  { sign: "+", t: "Plan Lucero — incentivo", s: "1 candidata casi lista", v: "$1.500" },
  { sign: "-", t: "Ajuste devolución N-1", s: "WOE-2980", v: "−$900" },
  { sign: "-", t: "Retención por mora", s: "Carolina Diaz · N-2", v: "−$1.200" },
];

export function LciBonificacionView() {
  const [tab, setTab] = useState(TABS[0]);
  return (
    <>
      <MockBadge />
      <DesktopTopBar
        title="Bonificación"
        initials="LT"
        right={<button type="button" className="hidden items-center gap-1.5 rounded-lg bg-card px-3 py-2 text-[12px] font-semibold text-foreground transition-colors hover:bg-secondary md:inline-flex" style={{ border: "1px solid var(--aw-hairline)" }}><SlidersHorizontal size={14} /> Simulador</button>}
      />

      <div className="px-5 pt-5 md:px-6">
        <div className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--aw-violet)" }}>Liquidación · Campaña N</div>
        <h2 className="mt-1 text-[22px] font-extrabold tracking-[-0.02em] text-foreground">Bonificación</h2>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-3.5 px-5 pt-4 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
        {KPIS.map((k) => (
          <div key={k.label} className="relative rounded-2xl bg-card p-[18px]" style={{ border: "0.5px solid var(--aw-hairline)" }}>
            {k.dot && <span className="absolute right-4 top-4 size-2 rounded-full" style={{ background: "var(--aw-success)" }} />}
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.07em] text-muted-foreground"><k.Icon size={15} strokeWidth={1.5} />{k.label}</div>
            <div className="mt-2 text-[24px] font-extrabold tracking-[-0.02em] tabular-nums text-foreground">{k.value}</div>
            <div className="mt-2"><PortalBadge tone={k.tone}>{k.badge}</PortalBadge></div>
          </div>
        ))}
      </div>

      <div className="flex gap-1.5 px-5 pt-4 md:px-6">
        {TABS.map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className="rounded-lg px-3.5 py-2 text-[12.5px] font-semibold transition-colors" style={{ background: tab === t ? "var(--aw-violet)" : "var(--aw-chalk)", color: tab === t ? "#fff" : "var(--fg-subtle)" }}>{t}</button>
        ))}
      </div>

      {/* detalle de liquidación */}
      <div className="px-5 pb-6 pt-4 md:px-6">
        <div className="rounded-2xl bg-card p-5" style={{ border: "0.5px solid var(--aw-hairline)" }}>
          <div className="flex items-center justify-between">
            <div><div className="text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: "var(--aw-violet)" }}>Título Diamante 3</div><div className="text-[15.5px] font-bold tracking-[-0.01em] text-foreground">Detalle de liquidación</div></div>
            <button type="button" className="inline-flex items-center gap-1.5 rounded-lg bg-card px-3 py-2 text-[12px] font-semibold text-foreground" style={{ border: "1px solid var(--aw-hairline)" }}><Download size={14} /> PDF</button>
          </div>
          <div className="mt-4 flex flex-col">
            {ITEMS.map((it) => {
              const neg = it.sign === "-";
              return (
                <div key={it.t} className="flex items-center gap-3 py-3" style={{ borderTop: "1px solid var(--aw-hairline)" }}>
                  <span className="grid size-7 flex-none place-items-center rounded-md" style={{ background: neg ? "var(--aw-danger-light)" : "var(--aw-success-light)", color: neg ? "#7C2F35" : "#236A40" }}>{neg ? <Minus size={15} /> : <Plus size={15} />}</span>
                  <div className="flex-1"><div className="text-[13.5px] font-semibold text-foreground">{it.t}</div><div className="text-[11.5px] text-muted-foreground">{it.s}</div></div>
                  <div className="text-[14px] font-bold tabular-nums" style={{ color: neg ? "var(--aw-danger)" : "var(--foreground)" }}>{it.v}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex items-center justify-between pt-4" style={{ borderTop: "2px solid var(--aw-hairline)" }}>
            <span className="text-[15px] font-bold text-foreground">Neto a cobrar</span>
            <span className="text-[22px] font-extrabold tabular-nums" style={{ color: "var(--aw-violet)" }}>$34.070</span>
          </div>
        </div>
      </div>
    </>
  );
}
