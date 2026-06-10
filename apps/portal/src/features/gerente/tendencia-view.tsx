"use client";

import { Download } from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { MockBadge } from "@/components/portal/mock-badge";
import { Sparkline } from "@/components/portal/sparkline";
import { TENDENCIA, sparkFor, type TendTone } from "@/features/gerente/_mock/tendencia";

const COLOR: Record<TendTone, string> = { s: "var(--aw-success)", w: "var(--aw-warning)", d: "var(--aw-danger)" };

export function TendenciaView() {
  return (
    <>
      <MockBadge />
      <DesktopTopBar
        title="Tendencia"
        initials="MC"
        right={
          <button type="button" className="inline-flex items-center gap-1.5 rounded-lg bg-card px-3 py-2 text-[12px] font-semibold text-foreground transition-colors hover:bg-secondary" style={{ border: "1px solid var(--aw-hairline)" }}>
            <Download size={14} strokeWidth={1.5} /><span className="hidden sm:inline">Exportar</span>
          </button>
        }
      />
      <p className="px-5 pt-3.5 text-[13px] text-muted-foreground md:px-6">29 métricas ejecutivas · Campaña 202608 vs anterior</p>

      <div className="grid grid-cols-2 gap-2.5 px-5 pb-6 pt-3.5 md:grid-cols-3 md:px-6 lg:grid-cols-4">
        {TENDENCIA.map((m, i) => (
          <div key={m.label} className="rounded-2xl bg-card p-3.5" style={{ border: "0.5px solid var(--aw-hairline)" }}>
            <div className="truncate text-[10.5px] font-bold uppercase tracking-[0.06em] text-muted-foreground">{m.label}</div>
            <div className="mt-1.5 text-[19px] font-extrabold tracking-[-0.02em] tabular-nums">{m.value}</div>
            <div className="mt-1.5 flex items-end justify-between gap-1.5">
              <span className="text-[11px] font-bold" style={{ color: COLOR[m.tone] }}>{m.delta}</span>
              <Sparkline values={sparkFor(i + 5)} width={56} height={22} fill={false} color={COLOR[m.tone]} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
