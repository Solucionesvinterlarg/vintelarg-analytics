"use client";

import { useState } from "react";
import { DollarSign, Zap, MapPin, Receipt, Info, Check } from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { PortalBadge } from "@/components/portal/badge";
import { MockBadge } from "@/components/portal/mock-badge";
import { OBJ_KPIS, OBJ_ZONAS, OBJ_REPARTIDO } from "@/features/gerente/_mock/objetivos";

const ICONS: Record<string, typeof Zap> = { "dollar-sign": DollarSign, zap: Zap, "map-pin": MapPin, receipt: Receipt };

export function ObjetivosView() {
  const [kpis, setKpis] = useState(OBJ_KPIS);
  const [zonas, setZonas] = useState(OBJ_ZONAS);
  const setKpi = (i: number, v: string) => setKpis((ks) => ks.map((k, j) => (j === i ? { ...k, value: v } : k)));
  const setZona = (i: number, v: string) => setZonas((zs) => zs.map((z, j) => (j === i ? { ...z, meta: v } : z)));

  return (
    <>
      <MockBadge />
      <DesktopTopBar
        title="Config. objetivos"
        initials="MC"
        right={
          <div className="hidden items-center gap-2 md:flex">
            <button type="button" onClick={() => { setKpis(OBJ_KPIS); setZonas(OBJ_ZONAS); }} className="rounded-lg px-3 py-2 text-[12px] font-semibold text-muted-foreground">Restablecer</button>
            <button type="button" className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-bold text-white" style={{ background: "var(--aw-violet)" }}><Check size={14} strokeWidth={2} />Guardar cambios</button>
          </div>
        }
      />
      <p className="px-5 pt-3.5 text-[13px] text-muted-foreground md:px-6">Metas por KPI y por zona · Campaña 202608</p>

      <div className="grid grid-cols-1 gap-3 px-5 pb-6 pt-3.5 md:px-6 lg:grid-cols-[1.1fr_1fr]">
        {/* Metas por KPI */}
        <div className="rounded-2xl bg-card p-[18px]" style={{ border: "0.5px solid var(--aw-hairline)" }}>
          <div className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--aw-violet)" }}>Metas globales</div>
          <h3 className="mb-4 text-[15px] font-bold tracking-[-0.01em]">Objetivos por KPI</h3>
          <div className="flex flex-col gap-4">
            {kpis.map((k, i) => {
              const Icon = ICONS[k.icon] ?? Zap;
              return (
                <label key={k.label} className="block">
                  <span className="mb-1.5 flex items-center gap-1.5 text-[12.5px] font-semibold text-muted-foreground"><Icon size={15} strokeWidth={1.5} style={{ color: "var(--aw-violet)" }} />{k.label}</span>
                  <span className="flex items-stretch overflow-hidden rounded-xl" style={{ border: "1px solid var(--aw-hairline)" }}>
                    <span className="grid place-items-center px-3 font-semibold text-muted-foreground" style={{ background: "var(--aw-app-bg)", borderRight: "1px solid var(--aw-hairline)" }}>{k.unit}</span>
                    <input value={k.value} onChange={(e) => setKpi(i, e.target.value)} className="min-w-0 flex-1 bg-transparent px-3.5 py-3 text-[14px] font-semibold tabular-nums outline-none" />
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Metas por zona */}
        <div className="rounded-2xl bg-card p-[18px]" style={{ border: "0.5px solid var(--aw-hairline)" }}>
          <div className="mb-4 flex items-start justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--aw-violet)" }}>Distribución</div>
              <h3 className="text-[15px] font-bold tracking-[-0.01em]">Meta de facturación por zona</h3>
            </div>
            <PortalBadge tone="violet">{OBJ_REPARTIDO}</PortalBadge>
          </div>
          <div className="flex flex-col gap-3">
            {zonas.map((z, i) => (
              <div key={z.z} className="flex items-center gap-3">
                <span className="flex-1 text-[13.5px] font-semibold">{z.z}</span>
                <span className="flex w-[170px] items-stretch overflow-hidden rounded-[10px]" style={{ border: "1px solid var(--aw-hairline)" }}>
                  <span className="grid place-items-center px-2.5 font-semibold text-muted-foreground" style={{ background: "var(--aw-app-bg)" }}>$</span>
                  <input value={z.meta} onChange={(e) => setZona(i, e.target.value)} className="min-w-0 flex-1 bg-transparent px-2.5 py-2 text-[13px] font-semibold tabular-nums outline-none" />
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-start gap-2.5 rounded-xl px-3.5 py-3 text-[12.5px]" style={{ background: "var(--aw-violet-light)", color: "var(--aw-violet-ink)" }}>
            <Info size={16} strokeWidth={1.75} className="mt-px shrink-0" />
            <span>Las zonas y divisiones se cargan desde la base. Estos valores son de ejemplo.</span>
          </div>
        </div>
      </div>
    </>
  );
}
