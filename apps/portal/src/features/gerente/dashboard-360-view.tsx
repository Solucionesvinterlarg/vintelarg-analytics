"use client";

import Link from "next/link";
import { AlertTriangle, Download, ChevronDown } from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { PortalBadge } from "@/components/portal/badge";
import { MockBadge } from "@/components/portal/mock-badge";
import { DESKTOP_FILTERS } from "@/lib/portal-config";
import { EXEC_KPIS, MINI_STATS, ALERT_360, SUB_360, type ExecKpi, type MiniStat, type ExecTone } from "@/features/gerente/_mock/dashboard-360";

const TONE_COLOR: Record<ExecTone, string> = { warning: "var(--aw-warning)", success: "var(--aw-success)", danger: "var(--aw-danger)" };

/** Dashboard 360° — vista única (MOCK, Lote 2). Los chips de filtro llegan por
 *  prop (resueltos por rol en la page); la vista no mira el rol. */
export function Dashboard360View({ filters = DESKTOP_FILTERS }: { filters?: string[] }) {
  return (
    <>
      <MockBadge />
      <DesktopTopBar
        title="Dashboard 360°"
        filters={filters}
        initials="MC"
        right={
          <div className="hidden items-center gap-2 md:flex">
            <span className="inline-flex items-center gap-1.5 rounded-lg px-3 py-[7px] text-[12px] font-semibold text-muted-foreground" style={{ background: "var(--aw-chalk)" }}>Vista: Neta <ChevronDown size={13} strokeWidth={1.5} /></span>
            <button type="button" className="inline-flex items-center gap-1.5 rounded-lg bg-card px-3 py-2 text-[12px] font-semibold text-foreground transition-colors hover:bg-secondary" style={{ border: "1px solid var(--aw-hairline)" }}><Download size={14} strokeWidth={1.5} />Exportar</button>
          </div>
        }
      />

      {/* Alerta prioritaria */}
      <div className="mx-5 mt-4 flex items-center gap-3 rounded-xl px-4 py-3 md:mx-6" style={{ background: "var(--tint-red)", border: "1px solid color-mix(in srgb, var(--aw-danger) 30%, transparent)" }}>
        <AlertTriangle size={20} strokeWidth={1.5} className="shrink-0" style={{ color: "var(--aw-danger)" }} />
        <span className="flex-1 text-[13.5px]" style={{ color: "var(--tint-red-fg)" }}><strong className="font-bold">ALERTA:</strong> {ALERT_360}</span>
        <Link href="/dashboard/alertas" className="shrink-0 whitespace-nowrap text-[13px] font-bold underline" style={{ color: "var(--tint-red-fg)" }}>Ver Centro de Alertas</Link>
      </div>

      <p className="px-5 pt-3.5 text-[13px] text-muted-foreground md:px-6">{SUB_360}</p>

      {/* ExecKpis */}
      <div className="grid grid-cols-1 gap-3.5 px-5 pt-3.5 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
        {EXEC_KPIS.map((k) => <ExecCard key={k.title} {...k} />)}
      </div>

      {/* Métricas secundarias */}
      <div className="px-5 pb-6 pt-5 md:px-6">
        <div className="mb-3 px-0.5 text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Métricas secundarias</div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {MINI_STATS.map((m) => <MiniCard key={m.label} {...m} />)}
        </div>
      </div>
    </>
  );
}

function ExecCard({ title, scope, value, delta, deltaLabel, meta, cumpl, tone, ref1 }: ExecKpi) {
  const deltaDanger = !!delta && (delta.trim().startsWith("−") || delta.trim().startsWith("-"));
  return (
    <div className="relative rounded-2xl bg-card p-[18px]" style={{ border: "0.5px solid var(--aw-hairline)" }}>
      {tone && <span className="absolute right-4 top-4 size-2 rounded-full" style={{ background: TONE_COLOR[tone], boxShadow: `0 0 0 3px color-mix(in srgb, ${TONE_COLOR[tone]} 22%, transparent)` }} />}
      <div className="pr-5 text-[11px] font-bold uppercase tracking-[0.07em] text-muted-foreground">{title}</div>
      {scope && <div className="mt-px text-[10.5px]" style={{ color: "var(--fg-subtle)" }}>{scope}</div>}
      <div className="mt-2 text-[26px] font-extrabold tracking-[-0.02em] tabular-nums">{value}</div>
      {delta && (
        <div className="mt-2 flex items-center gap-1.5">
          <PortalBadge tone={deltaDanger ? "danger" : "success"} dot>{delta}</PortalBadge>
          <span className="text-[11.5px] text-muted-foreground">{deltaLabel}</span>
        </div>
      )}
      {meta && (
        <div className="mt-2.5 flex items-center justify-between gap-2 whitespace-nowrap pt-2.5 text-[11.5px] text-muted-foreground" style={{ borderTop: "1px solid var(--aw-hairline)" }}>
          <span>{meta}</span>
          <span className="font-bold" style={{ color: tone ? TONE_COLOR[tone] : "var(--foreground)" }}>{cumpl}</span>
        </div>
      )}
      {ref1 && <div className="mt-2 text-[11px]" style={{ color: "var(--fg-subtle)" }}>{ref1}</div>}
    </div>
  );
}

function MiniCard({ label, value, sub, tone }: MiniStat) {
  return (
    <div className="rounded-2xl bg-card p-3.5" style={{ border: "0.5px solid var(--aw-hairline)" }}>
      <div className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.05em] text-muted-foreground">
        {tone && <span className="size-[7px] rounded-full" style={{ background: TONE_COLOR[tone] }} />}
        {label}
      </div>
      <div className="mt-1.5 text-[20px] font-extrabold tracking-[-0.02em] tabular-nums">{value}</div>
      {sub && <div className="mt-1 text-[11px]" style={{ color: tone === "warning" ? "var(--aw-warning)" : "var(--fg-subtle)" }}>{sub}</div>}
    </div>
  );
}
