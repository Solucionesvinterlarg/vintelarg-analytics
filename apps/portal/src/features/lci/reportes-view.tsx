"use client";

import { useState } from "react";
import { TrendingUp, Award, BarChart3, Users, FileSpreadsheet } from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { MockBadge } from "@/components/portal/mock-badge";
import { PortalBadge } from "@/components/portal/badge";

const KPIS = [
  { label: "Beneficio promedio", value: "$39k", Icon: TrendingUp, badge: "+15% histórico", tone: "success" as const },
  { label: "Título máximo", value: "Diamante 2", Icon: Award, badge: "Campaña N-3", tone: "violet" as const },
  { label: "Prom. venta grupal", value: "$485k", Icon: BarChart3 },
  { label: "Prom. altas / camp.", value: "19", Icon: Users },
];
const TABS = ["Histórico (18 campañas)", "Reportes descargables"];
const VENTA = [40, 44, 48, 46, 50, 47, 44, 48, 52, 58, 62, 70, 74, 72, 66, 92];
const ALTAS = [30, 34, 38, 36, 42, 40, 38, 44, 52, 56, 60, 48, 40, 44, 48, 52, 58, 88];

export function LciReportesView() {
  const [tab, setTab] = useState(TABS[0]);
  return (
    <>
      <MockBadge />
      <DesktopTopBar
        title="Reportes de líder"
        initials="LT"
        right={<button type="button" className="hidden items-center gap-1.5 rounded-lg bg-card px-3 py-2 text-[12px] font-semibold text-foreground transition-colors hover:bg-secondary md:inline-flex" style={{ border: "1px solid var(--aw-hairline)" }}><FileSpreadsheet size={14} strokeWidth={1.5} /> Export Excel</button>}
      />

      <div className="px-5 pt-5 md:px-6">
        <div className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--aw-violet)" }}>Estadísticas e histórico</div>
        <h2 className="mt-1 text-[22px] font-extrabold tracking-[-0.02em] text-foreground">Reportes de líder</h2>
      </div>

      <div className="flex gap-1.5 px-5 pt-3.5 md:px-6">
        {TABS.map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className="rounded-lg px-3.5 py-2 text-[12.5px] font-semibold transition-colors" style={{ background: tab === t ? "var(--aw-violet)" : "var(--aw-chalk)", color: tab === t ? "#fff" : "var(--fg-subtle)" }}>{t}</button>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-3.5 px-5 pt-4 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
        {KPIS.map((k) => (
          <div key={k.label} className="rounded-2xl bg-card p-[18px]" style={{ border: "0.5px solid var(--aw-hairline)" }}>
            <div className="flex items-center justify-between"><span className="text-[11px] font-bold uppercase tracking-[0.07em] text-muted-foreground">{k.label}</span><k.Icon size={16} strokeWidth={1.5} className="text-muted-foreground" /></div>
            <div className="mt-2 text-[24px] font-extrabold tracking-[-0.02em] tabular-nums text-foreground">{k.value}</div>
            {k.badge && <div className="mt-2"><PortalBadge tone={k.tone} dot>{k.badge}</PortalBadge></div>}
          </div>
        ))}
      </div>

      {/* charts */}
      <div className="grid grid-cols-1 gap-4 px-5 pt-5 md:px-6 lg:grid-cols-2">
        <ChartCard eyebrow="18 campañas" title="Evolución de venta grupal y bonificaciones"><Bars data={VENTA} color="var(--aw-violet)" /></ChartCard>
        <ChartCard eyebrow="18 campañas" title="Tendencia de pedidos"><LineChart data={[40, 45, 50, 56, 62, 70, 78, 74, 82, 90]} /></ChartCard>
      </div>
      <div className="px-5 pb-6 pt-4 md:px-6">
        <ChartCard eyebrow="18 campañas" title="Histórico de altas"><Bars data={ALTAS} color="var(--aw-success)" /></ChartCard>
      </div>
    </>
  );
}

function ChartCard({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-card p-5" style={{ border: "0.5px solid var(--aw-hairline)" }}>
      <div className="text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: "var(--aw-violet)" }}>{eyebrow}</div>
      <div className="text-[15.5px] font-bold tracking-[-0.01em] text-foreground">{title}</div>
      {children}
    </div>
  );
}

function Bars({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  return (
    <div className="mt-5 flex h-[180px] items-end gap-[3px]">
      {data.map((v, i) => (
        <div key={i} className="flex-1 rounded-t" style={{ height: `${(v / max) * 100}%`, background: i === data.length - 1 ? color : "color-mix(in srgb, " + color + " 22%, transparent)" }} />
      ))}
    </div>
  );
}

function LineChart({ data }: { data: number[] }) {
  const w = 480, h = 180, max = Math.max(...data), min = Math.min(...data), span = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / span) * (h - 16) - 8}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="mt-5 h-[180px] w-full" aria-hidden>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill="var(--aw-violet)" opacity={0.08} />
      <polyline points={pts} fill="none" stroke="var(--aw-violet)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
