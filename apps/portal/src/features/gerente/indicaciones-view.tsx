"use client";

import { Share2, ArrowRight } from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { PortalBadge } from "@/components/portal/badge";
import { MockBadge } from "@/components/portal/mock-badge";
import { AvatarInitials } from "@/components/portal/avatar-initials";
import { IND_STATS, PATROCINIOS } from "@/features/gerente/_mock/indicaciones";

export function IndicacionesView() {
  return (
    <>
      <MockBadge />
      <DesktopTopBar
        title="Indicaciones y red"
        initials="MC"
        right={
          <button type="button" className="inline-flex items-center gap-1.5 rounded-lg bg-card px-3 py-2 text-[12px] font-semibold text-foreground transition-colors hover:bg-secondary" style={{ border: "1px solid var(--aw-hairline)" }}>
            <Share2 size={14} strokeWidth={1.5} />
            <span className="hidden sm:inline">Compartir link</span>
          </button>
        }
      />
      <p className="px-5 pt-3.5 text-[13px] text-muted-foreground md:px-6">Patrocinios y crecimiento de la red · 202608</p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 px-5 pt-3.5 md:px-6 lg:grid-cols-4">
        {IND_STATS.map((s) => (
          <div key={s.label} className="rounded-2xl bg-card p-[18px]" style={{ border: "0.5px solid var(--aw-hairline)" }}>
            <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">{s.label}</div>
            <div className="mt-2 text-[26px] font-extrabold tracking-[-0.02em] tabular-nums">{s.value}</div>
            {s.delta && <div className="mt-2"><PortalBadge tone={s.tone}>{s.delta}</PortalBadge></div>}
          </div>
        ))}
      </div>

      {/* Patrocinios */}
      <div className="px-5 pb-6 pt-4 md:px-6">
        <div className="overflow-hidden rounded-2xl bg-card" style={{ border: "0.5px solid var(--aw-hairline)" }}>
          <div className="px-5 pt-4">
            <div className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--aw-violet)" }}>Red</div>
            <h3 className="mt-1 text-[16px] font-bold tracking-[-0.01em] text-foreground">Patrocinios recientes</h3>
            <p className="mt-0.5 text-[12px] text-muted-foreground">Quién indicó a quién este mes</p>
          </div>

          {/* desktop */}
          <div className="mt-3 hidden md:block">
            <div className="grid items-center px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.07em] text-muted-foreground" style={{ gridTemplateColumns: "1.4fr 0.3fr 1.4fr 0.7fr 1fr", background: "var(--aw-app-bg)", borderBottom: "1px solid var(--aw-hairline)" }}>
              <span>Padrino / Madrina</span><span /><span>Nueva revendedora</span><span>Fecha</span><span className="text-right">Estado del alta</span>
            </div>
            {PATROCINIOS.map((p, i) => (
              <div key={i} className="grid items-center px-5 py-3 text-[13px]" style={{ gridTemplateColumns: "1.4fr 0.3fr 1.4fr 0.7fr 1fr", background: i % 2 === 1 ? "var(--aw-app-bg)" : "transparent", borderBottom: i < PATROCINIOS.length - 1 ? "0.5px solid var(--aw-hairline)" : "none" }}>
                <span className="flex items-center gap-2.5"><AvatarInitials name={p.padr} size={28} /><span className="font-semibold">{p.padr}</span></span>
                <span className="grid place-items-center"><ArrowRight size={16} strokeWidth={1.5} className="text-muted-foreground" /></span>
                <span className="flex items-center gap-2.5"><AvatarInitials name={p.nuevo} size={28} tone="teal" /><span className="font-semibold">{p.nuevo}</span></span>
                <span className="text-muted-foreground">{p.fecha}</span>
                <span className="text-right"><PortalBadge tone={p.tone} dot>{p.estado}</PortalBadge></span>
              </div>
            ))}
          </div>

          {/* mobile */}
          <div className="mt-3 md:hidden">
            {PATROCINIOS.map((p, i) => (
              <div key={i} className="border-t p-4" style={{ borderColor: "var(--aw-hairline)" }}>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2"><AvatarInitials name={p.padr} size={26} /><span className="text-[13px] font-semibold">{p.padr}</span></span>
                  <ArrowRight size={15} strokeWidth={1.5} className="shrink-0 text-muted-foreground" />
                  <span className="flex items-center gap-2"><AvatarInitials name={p.nuevo} size={26} tone="teal" /><span className="text-[13px] font-semibold">{p.nuevo}</span></span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[12px]">
                  <span className="text-muted-foreground">{p.fecha}</span>
                  <PortalBadge tone={p.tone} dot>{p.estado}</PortalBadge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
