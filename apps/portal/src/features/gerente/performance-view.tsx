"use client";

import { useMemo, useState } from "react";
import { FileText, Download, ChevronUp, ChevronDown, ChevronRight } from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { PortalBadge } from "@/components/portal/badge";
import { MockBadge } from "@/components/portal/mock-badge";
import { MultiTrend } from "@/components/portal/charts/multi-trend";
import { Gauge } from "@/components/portal/charts/gauge";
import { PERF_KPIS, PERF_LABELS, PERF_SERIES, PERF_GAUGES, PERF_ZONAS, type PerfZona } from "@/features/gerente/_mock/performance";

const GRID = "1.4fr 1fr 1fr 0.7fr 1fr 1fr 1.1fr 0.3fr";
type ZKey = "z" | "ob" | "vb" | "des" | "on" | "obj" | "c";
const Z_ACC: Record<ZKey, (r: PerfZona) => number | string> = {
  z: (r) => r.z, ob: (r) => r.ob, vb: (r) => r.vb, des: (r) => r.des, on: (r) => r.on, obj: (r) => r.obj, c: (r) => r.c,
};
const num = (n: number) => n.toLocaleString("es-AR");

export function PerformanceView() {
  const [sort, setSort] = useState<{ key: ZKey; dir: 1 | -1 } | null>(null);
  const zonas = useMemo(() => {
    if (!sort) return PERF_ZONAS;
    const acc = Z_ACC[sort.key];
    return [...PERF_ZONAS].sort((a, b) => (acc(a) < acc(b) ? -1 : acc(a) > acc(b) ? 1 : 0) * sort.dir);
  }, [sort]);
  const toggle = (k: ZKey) => setSort((s) => (s?.key === k ? (s.dir === 1 ? { key: k, dir: -1 } : null) : { key: k, dir: 1 }));

  return (
    <>
      <MockBadge />
      <DesktopTopBar
        title="Performance comercial"
        initials="MC"
        right={
          <div className="hidden items-center gap-2 md:flex">
            <TopBtn icon={FileText} label="Ver reporte" />
            <TopBtn icon={Download} label="Exportar" />
          </div>
        }
      />
      <p className="px-5 pt-3.5 text-[13px] text-muted-foreground md:px-6">Comparativa WOE vs Tienda Virtual y cumplimiento de objetivos · Camp. 202604</p>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-3 px-5 pt-3.5 md:grid-cols-3 md:px-6">
        {PERF_KPIS.map((k) => (
          <div key={k.title} className="rounded-2xl bg-card p-[18px]" style={{ border: "0.5px solid var(--aw-hairline)" }}>
            <div className="text-[11px] font-bold uppercase tracking-[0.07em] text-muted-foreground">{k.title}</div>
            <div className="mt-2 text-[26px] font-extrabold tracking-[-0.02em] tabular-nums">{k.value}</div>
            {k.delta && <div className="mt-2"><PortalBadge tone={k.tone} dot>{k.delta} vs ant.</PortalBadge></div>}
          </div>
        ))}
      </div>

      {/* MultiTrend */}
      <div className="px-5 pt-3 md:px-6">
        <div className="rounded-2xl bg-card p-[18px]" style={{ border: "0.5px solid var(--aw-hairline)" }}>
          <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--aw-violet)" }}>Evolución</div>
          <h3 className="text-[15px] font-bold tracking-[-0.01em]">Órdenes y Venta Neta vs Objetivo</h3>
          <p className="mb-3 text-[12px] text-muted-foreground">Últimas 6 campañas</p>
          <MultiTrend series={PERF_SERIES} labels={PERF_LABELS} height={240} />
          <div className="mt-2 flex items-center justify-center gap-5 text-[12px] text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-5" style={{ background: "var(--fg-subtle)", borderTop: "2px dashed var(--fg-subtle)" }} />Objetivo</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-5" style={{ background: "var(--aw-violet)" }} />Real</span>
          </div>
        </div>
      </div>

      {/* Gauges */}
      <div className="grid grid-cols-1 gap-3 px-5 pt-3 md:grid-cols-2 md:px-6">
        {PERF_GAUGES.map((g) => (
          <div key={g.title} className="rounded-2xl bg-card p-[18px]" style={{ border: "0.5px solid var(--aw-hairline)" }}>
            <h3 className="mb-2 text-[15px] font-bold tracking-[-0.01em]">{g.title}</h3>
            <div className="flex justify-center py-2"><Gauge value={g.value} tone={g.tone} size={160} sub={g.sub} /></div>
          </div>
        ))}
      </div>

      {/* Detalle por zona */}
      <div className="px-5 pb-6 pt-3 md:px-6">
        <div className="overflow-hidden rounded-2xl bg-card" style={{ border: "0.5px solid var(--aw-hairline)" }}>
          <div className="px-5 pt-4">
            <h3 className="text-[15px] font-bold tracking-[-0.01em]">Detalle por zona</h3>
            <p className="mt-0.5 text-[12px] text-muted-foreground">Órdenes brutas, desmantelados y cumplimiento</p>
          </div>
          {/* desktop */}
          <div className="mt-3 hidden md:block">
            <div className="grid items-center px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.07em] text-muted-foreground" style={{ gridTemplateColumns: GRID, background: "var(--aw-app-bg)", borderBottom: "1px solid var(--aw-hairline)" }}>
              <Th label="Gerente / Zona" k="z" sort={sort} onSort={toggle} />
              <Th label="Órd. bruto" k="ob" sort={sort} onSort={toggle} align="right" />
              <Th label="Venta bruta" k="vb" sort={sort} onSort={toggle} align="right" />
              <Th label="Desm." k="des" sort={sort} onSort={toggle} align="right" />
              <Th label="Órd. netas" k="on" sort={sort} onSort={toggle} align="right" />
              <Th label="vs Objetivo" k="obj" sort={sort} onSort={toggle} align="right" />
              <Th label="% Cumpl." k="c" sort={sort} onSort={toggle} align="right" />
              <span />
            </div>
            {zonas.map((r, i) => (
              <div key={r.z} className="grid items-center px-5 py-3 text-[13px]" style={{ gridTemplateColumns: GRID, background: i % 2 === 1 ? "var(--aw-app-bg)" : "transparent", borderBottom: i < zonas.length - 1 ? "0.5px solid var(--aw-hairline)" : "none" }}>
                <span><span className="font-semibold">{r.g}</span> <span className="text-[11.5px] text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>· Z{r.z}</span></span>
                <span className="text-right tabular-nums">{num(r.ob)}</span>
                <span className="text-right tabular-nums">{num(r.vb)}</span>
                <span className="text-right tabular-nums" style={{ color: "var(--aw-danger)" }}>{r.des}</span>
                <span className="text-right font-bold tabular-nums" style={{ fontFamily: "var(--font-mono)" }}>{num(r.on)}</span>
                <span className="text-right tabular-nums text-muted-foreground">{num(r.obj)}</span>
                <span className="flex justify-end"><ObjBar v={r.c} /></span>
                <span className="flex justify-end"><ChevronRight size={16} className="text-muted-foreground" /></span>
              </div>
            ))}
          </div>
          {/* mobile */}
          <div className="mt-3 md:hidden">
            {zonas.map((r) => (
              <div key={r.z} className="border-t p-4" style={{ borderColor: "var(--aw-hairline)" }}>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-bold">{r.g} <span className="text-[12px] font-normal text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>Z{r.z}</span></span>
                  <ObjBar v={r.c} />
                </div>
                <div className="mt-2.5 grid grid-cols-3 gap-2 text-center">
                  <MStat label="Órd. netas" value={num(r.on)} />
                  <MStat label="Objetivo" value={num(r.obj)} />
                  <MStat label="Desm." value={String(r.des)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function TopBtn({ icon: Icon, label }: { icon: typeof FileText; label: string }) {
  return (
    <button type="button" className="inline-flex items-center gap-1.5 rounded-lg bg-card px-3 py-2 text-[12px] font-semibold text-foreground transition-colors hover:bg-secondary" style={{ border: "1px solid var(--aw-hairline)" }}>
      <Icon size={14} strokeWidth={1.5} /> {label}
    </button>
  );
}

function Th({ label, k, sort, onSort, align = "left" }: { label: string; k: ZKey; sort: { key: ZKey; dir: 1 | -1 } | null; onSort: (k: ZKey) => void; align?: "left" | "right" }) {
  const active = sort?.key === k;
  return (
    <button type="button" onClick={() => onSort(k)} className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.07em] text-muted-foreground transition-colors hover:text-foreground" style={{ justifyContent: align === "right" ? "flex-end" : "flex-start" }}>
      {label}
      {active ? (sort!.dir === 1 ? <ChevronUp size={12} className="text-[var(--aw-violet)]" /> : <ChevronDown size={12} className="text-[var(--aw-violet)]" />) : <ChevronDown size={12} className="opacity-30" />}
    </button>
  );
}

function ObjBar({ v }: { v: number }) {
  const tone = v >= 80 ? "var(--aw-success)" : v >= 60 ? "var(--aw-warning)" : "var(--aw-danger)";
  return (
    <span className="flex items-center justify-end gap-2">
      <span className="h-1.5 w-14 overflow-hidden rounded-full" style={{ background: "var(--aw-app-bg)" }}>
        <span className="block h-full rounded-full" style={{ width: `${Math.min(Math.max(v, 2), 100)}%`, background: tone }} />
      </span>
      <span className="w-11 text-right text-[12.5px] font-bold tabular-nums">{v}%</span>
    </span>
  );
}

function MStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl px-2 py-2" style={{ background: "var(--aw-app-bg)" }}>
      <div className="text-[14px] font-extrabold tabular-nums">{value}</div>
      <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">{label}</div>
    </div>
  );
}
