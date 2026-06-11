"use client";

import Link from "next/link";
import { Timer, Package, ChevronRight } from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { MockBadge } from "@/components/portal/mock-badge";
import { PortalBadge } from "@/components/portal/badge";
import { CIERRE, LCI_CAMPAIGNS, type LciCampaign } from "@/features/lci/_mock/inicio";

/** Inicio del Líder Comercial — "Resumen de tu equipo / Performance consolidada"
 *  (MOCK, Lote 2). Desktop, render en AppShell sidebar. La vista no mira el rol. */
export function LciInicioView() {
  return (
    <>
      <MockBadge />
      <DesktopTopBar
        title="Inicio"
        initials="LT"
        right={
          <Link href="/lci/pedido-woe" className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-bold text-white md:inline-flex" style={{ background: "var(--aw-violet)" }}>
            <Package size={14} strokeWidth={2} /> Cargar pedido
          </Link>
        }
      />

      {/* Cierre de campaña */}
      <div className="mx-5 mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-card px-4 py-3.5 md:mx-6" style={{ border: "0.5px solid var(--aw-hairline)" }}>
        <span className="grid size-11 place-items-center rounded-xl" style={{ background: "var(--aw-violet-light)", color: "var(--aw-violet)" }}><Timer size={22} strokeWidth={1.5} /></span>
        <div className="flex-1">
          <div className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-muted-foreground">Cierre de campaña</div>
          <div className="text-[20px] font-extrabold tracking-[-0.02em] text-foreground">{CIERRE.dias}</div>
        </div>
        <PortalBadge tone="success" dot>{CIERRE.estado}</PortalBadge>
      </div>

      {/* Performance consolidada */}
      <div className="px-5 pt-5 md:px-6">
        <div className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--aw-violet)" }}>Inicio · 3 campañas en curso</div>
        <h2 className="mt-1 text-[22px] font-extrabold tracking-[-0.02em] text-foreground">Performance consolidada</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 px-5 pb-6 pt-4 md:px-6 lg:grid-cols-3">
        {LCI_CAMPAIGNS.map((c) => <CampaignCard key={c.cod} c={c} />)}
      </div>
    </>
  );
}

function CampaignCard({ c }: { c: LciCampaign }) {
  return (
    <div className="flex flex-col rounded-2xl bg-card p-5" style={{ border: "0.5px solid var(--aw-hairline)" }}>
      <div className="flex items-start justify-between">
        <div><div className="text-[15px] font-bold text-foreground">{c.camp}</div><div className="text-[11px] text-muted-foreground">{c.cod}</div></div>
        <PortalBadge tone={c.tone}>{c.estado}</PortalBadge>
      </div>
      <div className="mt-3 text-[26px] font-extrabold tracking-[-0.02em] tabular-nums text-foreground">{c.ventaGrupal}</div>
      <div className="text-[12px] text-muted-foreground">Venta grupal</div>
      <MiniSpark data={c.spark} active={c.active} />

      <div className="mt-4 grid grid-cols-2 gap-y-3" style={{ borderTop: "1px solid var(--aw-hairline)", paddingTop: 14 }}>
        <Cell label="Pedidos" value={c.pedidos} />
        <Cell label="Altas" value={c.altas} />
        <Cell label="Pedido personal" value={c.pedidoPersonal} />
        <Cell label="Cobrabilidad" value={c.cobrabilidad} />
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl px-3.5 py-2.5" style={{ background: "var(--aw-violet-light)" }}>
        <div><div className="text-[10px] font-bold uppercase tracking-[0.06em]" style={{ color: "var(--aw-violet-deep)" }}>Título simulado</div><div className="text-[13.5px] font-bold text-foreground">{c.titulo}</div></div>
        <div className="text-[15px] font-extrabold tabular-nums" style={{ color: "var(--aw-violet-deep)" }}>{c.tituloMonto}</div>
      </div>

      <Link href="/lci/campana" className="mt-3 inline-flex items-center justify-center gap-1 text-[12.5px] font-bold" style={{ color: "var(--aw-violet)" }}>Ver detalle <ChevronRight size={15} /></Link>
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return <div><div className="text-[10px] font-semibold uppercase tracking-[0.05em] text-muted-foreground">{label}</div><div className="mt-0.5 text-[15px] font-bold tabular-nums text-foreground">{value}</div></div>;
}

function MiniSpark({ data, active }: { data: number[]; active: boolean }) {
  const w = 240, h = 48, max = Math.max(...data), min = Math.min(...data), span = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / span) * (h - 6) - 3}`).join(" ");
  const stroke = active ? "var(--aw-violet)" : "var(--aw-slate, #94a3b8)";
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="mt-3 h-12 w-full" aria-hidden>
      <polyline points={pts} fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={w} cy={h - ((data[data.length - 1] - min) / span) * (h - 6) - 3} r={3} fill={stroke} />
    </svg>
  );
}
