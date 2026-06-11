"use client";

import { Download } from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { MockBadge } from "@/components/portal/mock-badge";
import { Donut } from "@/components/portal/charts/donut";
import { MIX_DATA, MIX_TOTAL, MIX_MAX } from "@/features/gerente/_mock/mix";

export function MixView() {
  return (
    <>
      <MockBadge />
      <DesktopTopBar
        title="Mix de productos"
        initials="MC"
        right={
          <button type="button" className="inline-flex items-center gap-1.5 rounded-lg bg-card px-3 py-2 text-[12px] font-semibold text-foreground transition-colors hover:bg-secondary" style={{ border: "1px solid var(--aw-hairline)" }}>
            <Download size={14} strokeWidth={1.5} /><span className="hidden sm:inline">Exportar</span>
          </button>
        }
      />
      <p className="px-5 pt-3.5 text-[13px] text-muted-foreground md:px-6">Distribución de facturación por rubro · 202608</p>

      <div className="grid grid-cols-1 gap-3 px-5 pb-6 pt-3.5 md:px-6 lg:grid-cols-[1fr_1.3fr]">
        {/* Donut + leyenda */}
        <div className="rounded-2xl bg-card p-[18px]" style={{ border: "0.5px solid var(--aw-hairline)" }}>
          <div className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--aw-violet)" }}>Participación</div>
          <h3 className="text-[15px] font-bold tracking-[-0.01em]">Por rubro</h3>
          <div className="relative mx-auto my-2 grid place-items-center" style={{ width: 190, height: 190 }}>
            <Donut data={MIX_DATA} size={190} thickness={28} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-[22px] font-extrabold tabular-nums">{MIX_TOTAL}</div>
              <div className="text-[11px] text-muted-foreground">total camp.</div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {MIX_DATA.map((d) => (
              <div key={d.label} className="flex items-center gap-2.5 text-[13px]">
                <span className="size-2.5 rounded-[3px]" style={{ background: d.color }} />
                <span className="flex-1 font-medium">{d.label}</span>
                <span className="font-bold tabular-nums">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detalle */}
        <div className="overflow-hidden rounded-2xl bg-card" style={{ border: "0.5px solid var(--aw-hairline)" }}>
          <div className="px-5 pt-4">
            <h3 className="text-[15px] font-bold tracking-[-0.01em]">Detalle por rubro</h3>
            <p className="mt-0.5 text-[12px] text-muted-foreground">Facturación y participación</p>
          </div>
          <div className="mt-3 hidden md:block">
            <div className="grid items-center px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.07em] text-muted-foreground" style={{ gridTemplateColumns: "1.4fr 1fr 1.4fr", background: "var(--aw-app-bg)", borderBottom: "1px solid var(--aw-hairline)" }}>
              <span>Rubro</span><span className="text-right">Facturación</span><span className="text-right">Participación</span>
            </div>
            {MIX_DATA.map((d, i) => (
              <div key={d.label} className="grid items-center px-5 py-3 text-[13px]" style={{ gridTemplateColumns: "1.4fr 1fr 1.4fr", background: i % 2 === 1 ? "var(--aw-app-bg)" : "transparent", borderBottom: i < MIX_DATA.length - 1 ? "0.5px solid var(--aw-hairline)" : "none" }}>
                <span className="flex items-center gap-2.5"><span className="size-2.5 rounded-[3px]" style={{ background: d.color }} /><span className="font-semibold">{d.label}</span></span>
                <span className="text-right font-bold tabular-nums" style={{ fontFamily: "var(--font-mono)" }}>{d.amt}</span>
                <ParticipBar value={d.value} color={d.color} />
              </div>
            ))}
          </div>
          {/* mobile */}
          <div className="mt-3 md:hidden">
            {MIX_DATA.map((d) => (
              <div key={d.label} className="flex items-center gap-3 border-t px-4 py-3" style={{ borderColor: "var(--aw-hairline)" }}>
                <span className="size-2.5 shrink-0 rounded-[3px]" style={{ background: d.color }} />
                <span className="flex-1 text-[13px] font-semibold">{d.label}</span>
                <span className="text-[13px] font-bold tabular-nums" style={{ fontFamily: "var(--font-mono)" }}>{d.amt}</span>
                <span className="w-10 text-right text-[13px] font-bold tabular-nums">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function ParticipBar({ value, color }: { value: number; color: string }) {
  return (
    <span className="flex items-center justify-end gap-2">
      <span className="h-1.5 w-[70px] overflow-hidden rounded-full" style={{ background: "var(--aw-app-bg)" }}>
        <span className="block h-full rounded-full" style={{ width: `${(value / MIX_MAX) * 100}%`, background: color }} />
      </span>
      <span className="w-9 text-right text-[12.5px] font-bold tabular-nums">{value}%</span>
    </span>
  );
}
