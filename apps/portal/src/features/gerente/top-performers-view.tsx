"use client";

import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { PortalBadge, type BadgeTone } from "@/components/portal/badge";
import { MockBadge } from "@/components/portal/mock-badge";
import { AvatarInitials } from "@/components/portal/avatar-initials";
import { Sparkline } from "@/components/portal/sparkline";
import { TOP_PODIO, TOP_REST, MEDALS, TOP_FILTERS, type Performer } from "@/features/gerente/_mock/top-performers";

const STROKE: Record<string, string> = {
  success: "var(--aw-success)",
  violet: "var(--aw-violet)",
  info: "#3B82F6",
  warn: "var(--aw-warning)",
  danger: "var(--aw-danger)",
};
const strokeFor = (tone: BadgeTone) => STROKE[tone] ?? "var(--aw-violet)";

export function TopPerformersView() {
  return (
    <>
      <MockBadge />
      <DesktopTopBar title="Top performers" filters={TOP_FILTERS} initials="MC" />
      <p className="px-5 pt-3.5 text-[13px] text-muted-foreground md:px-6">Campaña 202605/1 — Reconociendo resultados excepcionales</p>

      {/* Podio */}
      <div className="grid grid-cols-1 gap-4 px-5 pt-4 md:px-6 lg:grid-cols-3">
        {TOP_PODIO.map((p) => (
          <div key={p.pos} className="relative rounded-2xl bg-card p-5 text-center" style={{ border: "0.5px solid var(--aw-hairline)", borderTop: `3px solid ${MEDALS[p.pos - 1]}` }}>
            <div className="mx-auto mb-3 grid size-[30px] place-items-center rounded-full text-[13px] font-extrabold text-white" style={{ background: MEDALS[p.pos - 1] }}>{p.pos}°</div>
            <div className="mb-2.5 flex justify-center"><AvatarInitials name={p.n} size={56} /></div>
            <div className="text-[15px] font-bold">{p.n}</div>
            <div className="mt-0.5 text-[11.5px] text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>ID {p.id} · ★ {p.score.toFixed(1)}</div>
            <div className="my-2.5 flex flex-wrap justify-center gap-1.5">
              {p.badges.map((b, i) => <PortalBadge key={i} tone={b[1]}>{b[0]}</PortalBadge>)}
            </div>
            <div className="flex justify-center gap-4 py-2">
              {([["Facturado", p.fact], ["Uds.", String(p.uds)], ["Crecim.", p.cre]] as const).map(([l, v]) => (
                <div key={l}><div className="text-[15px] font-extrabold tabular-nums">{v}</div><div className="text-[10.5px] text-muted-foreground">{l}</div></div>
              ))}
            </div>
            <div className="mt-1.5"><Sparkline values={p.sp} width={150} height={36} color={strokeFor(p.badges[0][1])} /></div>
          </div>
        ))}
      </div>

      {/* Resto (4°, 5°) */}
      <div className="px-5 pb-6 pt-4 md:px-6">
        <div className="overflow-hidden rounded-2xl bg-card" style={{ border: "0.5px solid var(--aw-hairline)" }}>
          {/* desktop */}
          <div className="hidden md:block">
            <div className="grid items-center px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.07em] text-muted-foreground" style={{ gridTemplateColumns: "0.4fr 1.6fr 1.6fr 0.9fr 0.5fr 0.8fr 0.9fr", background: "var(--aw-app-bg)", borderBottom: "1px solid var(--aw-hairline)" }}>
              <span>#</span><span>Revendedora</span><span>Logros</span><span className="text-right">Facturado</span><span className="text-right">Uds.</span><span className="text-right">Crecim.</span><span className="text-right">Tendencia</span>
            </div>
            {TOP_REST.map((r, i) => <RestRow key={r.pos} r={r} zebra={i % 2 === 1} last={i === TOP_REST.length - 1} />)}
          </div>
          {/* mobile */}
          <div className="md:hidden">
            {TOP_REST.map((r) => (
              <div key={r.pos} className="border-b p-4 last:border-b-0" style={{ borderColor: "var(--aw-hairline)" }}>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2.5">
                    <AvatarInitials name={r.n} size={28} />
                    <span><span className="block text-[14px] font-bold">{r.n}</span><span className="text-[11px] text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>{r.pos}° · ★ {r.score.toFixed(1)}</span></span>
                  </span>
                  <span className="font-bold tabular-nums" style={{ fontFamily: "var(--font-mono)" }}>{r.fact}</span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  {r.badges.map((b, i) => <PortalBadge key={i} tone={b[1]}>{b[0]}</PortalBadge>)}
                  <PortalBadge tone="success" dot>{r.cre}</PortalBadge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function RestRow({ r, zebra, last }: { r: Performer; zebra: boolean; last: boolean }) {
  return (
    <div className="grid items-center px-5 py-3 text-[13px]" style={{ gridTemplateColumns: "0.4fr 1.6fr 1.6fr 0.9fr 0.5fr 0.8fr 0.9fr", background: zebra ? "var(--aw-app-bg)" : "transparent", borderBottom: last ? "none" : "0.5px solid var(--aw-hairline)" }}>
      <span className="font-bold text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>{r.pos}°</span>
      <span className="flex items-center gap-2.5"><AvatarInitials name={r.n} size={28} /><span><span className="block font-semibold">{r.n}</span><span className="text-[11px] text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>★ {r.score.toFixed(1)}</span></span></span>
      <span className="flex flex-wrap gap-1.5">{r.badges.map((b, i) => <PortalBadge key={i} tone={b[1]}>{b[0]}</PortalBadge>)}</span>
      <span className="text-right font-bold tabular-nums" style={{ fontFamily: "var(--font-mono)" }}>{r.fact}</span>
      <span className="text-right tabular-nums">{r.uds}</span>
      <span className="flex justify-end"><PortalBadge tone="success" dot>{r.cre}</PortalBadge></span>
      <span className="flex justify-end"><Sparkline values={r.sp} width={90} height={28} fill={false} color="var(--aw-violet)" /></span>
    </div>
  );
}
