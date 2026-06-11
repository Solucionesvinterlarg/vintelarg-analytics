"use client";

import Link from "next/link";
import { TrendingUp, Receipt, Users, ArrowUpRight, BarChart3, Star, FileText, ChevronRight } from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { MockBadge } from "@/components/portal/mock-badge";
import { PortalBadge } from "@/components/portal/badge";

const KPIS = [
  { label: "Venta grupal N", value: "$845k", Icon: TrendingUp, badge: "85% obj.", tone: "success" as const },
  { label: "Bonificación sim.", value: "$32k", Icon: Receipt, badge: "Diamante 3", tone: "violet" as const },
  { label: "Activas / red", value: "80/80", Icon: Users, badge: "Con pedido en N", tone: "success" as const, dot: true },
  { label: "Próximo rank", value: "Diamante 1", Icon: ArrowUpRight, badge: "76% de avance", tone: "violet" as const },
];
const BARS = [
  { c: "C11", v: 62 }, { c: "C12", v: 66 }, { c: "C13", v: 74 }, { c: "C14", v: 80 },
  { c: "C15", v: 82 }, { c: "C16", v: 70 }, { c: "C17", v: 64 }, { c: "C18", v: 92 },
];
const ATAJOS = [
  { t: "Detalle de campaña", s: "Venta grupal, actividad y cobrabilidad", Icon: BarChart3, href: "/lci/campana" },
  { t: "Mi red", s: "Revendedoras, altas y bajas", Icon: Users, href: "/lci/red" },
  { t: "Plan Lucero", s: "Candidatas a graduarse", Icon: Star, href: "/lci/plan-lucero" },
  { t: "Reportes", s: "Histórico y descargables", Icon: FileText, href: "/lci/reportes" },
];

export function LciDashboardView() {
  return (
    <>
      <MockBadge />
      <DesktopTopBar title="Dashboard líderes" filters={["Período: 8 campañas", "Zona: Zona 4"]} initials="LT" />

      <div className="px-5 pt-5 md:px-6">
        <div className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--aw-violet)" }}>Resumen ejecutivo</div>
        <h2 className="mt-1 text-[22px] font-extrabold tracking-[-0.02em] text-foreground">Dashboard líderes</h2>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-3.5 px-5 pt-4 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
        {KPIS.map((k) => (
          <div key={k.label} className="rounded-2xl bg-card p-[18px]" style={{ border: "0.5px solid var(--aw-hairline)" }}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-[0.07em] text-muted-foreground">{k.label}</span>
              <k.Icon size={16} strokeWidth={1.5} className="text-muted-foreground" />
            </div>
            <div className="mt-2 text-[24px] font-extrabold tracking-[-0.02em] tabular-nums text-foreground">{k.value}</div>
            <div className="mt-2"><PortalBadge tone={k.tone} dot={k.dot}>{k.badge}</PortalBadge></div>
          </div>
        ))}
      </div>

      {/* chart + atajos */}
      <div className="grid grid-cols-1 gap-4 px-5 pb-6 pt-5 md:px-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-card p-5 lg:col-span-2" style={{ border: "0.5px solid var(--aw-hairline)" }}>
          <div className="text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: "var(--aw-violet)" }}>Últimas 8 campañas</div>
          <div className="text-[15.5px] font-bold tracking-[-0.01em] text-foreground">Evolución de venta grupal y bonificaciones</div>
          <div className="mt-5 flex h-[200px] gap-3">
            {BARS.map((b, i) => (
              <div key={b.c} className="flex flex-1 flex-col items-center">
                <div className="flex w-full flex-1 items-end">
                  <div className="w-full rounded-t-md" style={{ height: `${b.v}%`, background: i === BARS.length - 1 ? "var(--aw-violet)" : "var(--aw-violet-light)" }} />
                </div>
                <span className="mt-2 text-[10.5px] text-muted-foreground">{b.c}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-card p-5" style={{ border: "0.5px solid var(--aw-hairline)" }}>
          <div className="text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: "var(--aw-violet)" }}>Ir a</div>
          <div className="text-[15.5px] font-bold tracking-[-0.01em] text-foreground">Atajos</div>
          <div className="mt-4 flex flex-col gap-2.5">
            {ATAJOS.map((a) => (
              <Link key={a.t} href={a.href} className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-secondary" style={{ border: "1px solid var(--aw-hairline)" }}>
                <span className="grid size-9 flex-none place-items-center rounded-lg" style={{ background: "var(--aw-violet-light)", color: "var(--aw-violet)" }}><a.Icon size={18} strokeWidth={1.5} /></span>
                <div className="min-w-0 flex-1"><div className="text-[13px] font-bold text-foreground">{a.t}</div><div className="text-[11px] text-muted-foreground">{a.s}</div></div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
