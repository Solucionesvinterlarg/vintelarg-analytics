"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { MockBadge } from "@/components/portal/mock-badge";
import { PortalBadge } from "@/components/portal/badge";
import { AvatarInitials } from "@/components/portal/avatar-initials";
import { REVENDEDORAS, SEM_COLOR, RED_TOTAL } from "@/features/lci/_mock/red";

const TABS = ["Revendedoras", "Altas y seguimiento", "Bajas y reactivación"];

export function LciMiRedView() {
  const [tab, setTab] = useState(TABS[0]);
  return (
    <>
      <MockBadge />
      <DesktopTopBar
        title="Mi red"
        initials="LT"
        right={<Link href="/lci/pedido-woe" className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-bold text-white md:inline-flex" style={{ background: "var(--aw-violet)" }}><Package size={14} strokeWidth={2} /> Cargar pedido (WOE)</Link>}
      />

      <div className="px-5 pt-5 md:px-6">
        <div className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--aw-violet)" }}>Línea descendente · {RED_TOTAL} revendedoras</div>
        <h2 className="mt-1 text-[22px] font-extrabold tracking-[-0.02em] text-foreground">Mi red</h2>
      </div>

      <div className="flex gap-1.5 px-5 pt-3.5 md:px-6">
        {TABS.map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className="rounded-lg px-3.5 py-2 text-[12.5px] font-semibold transition-colors" style={{ background: tab === t ? "var(--aw-violet)" : "var(--aw-chalk)", color: tab === t ? "#fff" : "var(--fg-subtle)" }}>{t}</button>
        ))}
      </div>

      {/* search + filtro */}
      <div className="flex flex-wrap items-center gap-3 px-5 pt-4 md:px-6">
        <div className="flex flex-1 items-center gap-2.5 rounded-xl bg-card px-3.5 py-2.5" style={{ border: "1px solid var(--aw-hairline)", minWidth: 240 }}>
          <Search size={17} className="text-muted-foreground" />
          <input placeholder="Buscar por nombre o ID…" className="min-w-0 flex-1 border-0 bg-transparent text-[13.5px] outline-none placeholder:text-muted-foreground" />
        </div>
        <button type="button" className="inline-flex items-center gap-1.5 rounded-xl bg-card px-3.5 py-2.5 text-[12.5px] font-semibold text-foreground" style={{ border: "1px solid var(--aw-hairline)" }}><SlidersHorizontal size={15} /> Estado: <b>Todos</b></button>
      </div>

      {/* tabla */}
      <div className="px-5 pb-6 pt-4 md:px-6">
        <div className="overflow-x-auto rounded-2xl bg-card" style={{ border: "0.5px solid var(--aw-hairline)" }}>
          <div className="min-w-[760px]">
            <div className="grid grid-cols-[2.2fr_1fr_1fr_1.2fr_1.3fr_0.8fr_1.3fr] px-4 py-3 text-[10.5px] font-bold uppercase tracking-[0.05em] text-muted-foreground" style={{ borderBottom: "1px solid var(--aw-hairline)" }}>
              <div>Nombre / ID</div><div>Puntos</div><div>Ventas</div><div>Cobranza N+2</div><div>Estado</div><div>Semáforo</div><div>Detalle</div>
            </div>
            {REVENDEDORAS.map((r) => (
              <Link key={r.id} href="/lci/revendedora" className="grid grid-cols-[2.2fr_1fr_1fr_1.2fr_1.3fr_0.8fr_1.3fr] items-center px-4 py-3.5 transition-colors hover:bg-secondary" style={{ borderBottom: "1px solid var(--aw-hairline)" }}>
                <div className="flex items-center gap-3"><AvatarInitials name={r.name} size={36} /><div><div className="text-[13px] font-bold text-foreground">{r.name}</div><div className="text-[11px] text-muted-foreground">ID {r.idNum}</div></div></div>
                <div className="text-[13px] font-bold tabular-nums text-foreground">{r.puntos}</div>
                <div className="text-[13px] font-semibold tabular-nums text-foreground">{r.ventas}</div>
                <div className="text-[13px] font-bold tabular-nums" style={{ color: SEM_COLOR[r.sem] }}>{r.cobranza}</div>
                <div><PortalBadge tone={r.tone}>{r.estado}</PortalBadge></div>
                <div><span className="block size-2.5 rounded-full" style={{ background: SEM_COLOR[r.sem] }} /></div>
                <div className="flex gap-1.5">{r.detalle.map((d) => <span key={d} className="rounded-md px-2 py-0.5 text-[10px] font-bold" style={{ border: "1px solid var(--aw-hairline)", color: "var(--fg-subtle)" }}>{d}</span>)}</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-[12px] text-muted-foreground">Mostrando 1–5 de {RED_TOTAL} revendedoras</div>
          <div className="flex gap-2">
            <button type="button" className="inline-flex items-center gap-1 rounded-lg bg-card px-3 py-1.5 text-[12px] font-semibold text-muted-foreground" style={{ border: "1px solid var(--aw-hairline)" }}><ChevronLeft size={14} /> Anterior</button>
            <button type="button" className="inline-flex items-center gap-1 rounded-lg bg-card px-3 py-1.5 text-[12px] font-semibold text-foreground" style={{ border: "1px solid var(--aw-hairline)" }}>Siguiente <ChevronRight size={14} /></button>
          </div>
        </div>
      </div>
    </>
  );
}
