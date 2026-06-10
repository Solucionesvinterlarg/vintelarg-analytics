"use client";

import { useState } from "react";
import { UserPlus, Package, ShoppingBag, Repeat, Clock } from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { PortalBadge } from "@/components/portal/badge";
import { MockBadge } from "@/components/portal/mock-badge";
import { AvatarInitials } from "@/components/portal/avatar-initials";
import { TabBar } from "@/components/portal/tab-bar";
import { ONB_ALTAS, ONB_CONTINUIDAD, ONB_SEGUIMIENTO, ONB_GEO } from "@/features/gerente/_mock/onboarding";

const STEP_ICONS: Record<string, typeof Clock> = { "user-plus": UserPlus, package: Package, "shopping-bag": ShoppingBag, repeat: Repeat, clock: Clock };
type Tab = "admin" | "continuidad" | "seguimiento" | "geografico";
const TABS: { id: Tab; label: string }[] = [
  { id: "admin", label: "Administración" },
  { id: "continuidad", label: "Continuidad" },
  { id: "seguimiento", label: "Seguimiento individual" },
  { id: "geografico", label: "Geográfico" },
];

export function OnboardingView() {
  const [tab, setTab] = useState<Tab>("admin");
  return (
    <>
      <MockBadge />
      <DesktopTopBar title="Onboarding" initials="MC" />
      <p className="px-5 pt-3.5 text-[13px] text-muted-foreground md:px-6">Altas y continuidad de nuevas revendedoras</p>

      <div className="px-5 pb-6 pt-3.5 md:px-6">
        <div className="overflow-hidden rounded-2xl bg-card" style={{ border: "0.5px solid var(--aw-hairline)" }}>
          <div className="px-4 pt-1"><TabBar tabs={TABS} active={tab} onChange={setTab} /></div>
          <div className="p-5">
            {tab === "admin" && <Admin />}
            {tab === "continuidad" && <Continuidad />}
            {tab === "seguimiento" && <Seguimiento />}
            {tab === "geografico" && <Geo />}
          </div>
        </div>
      </div>
    </>
  );
}

function Admin() {
  const GRID = "1.6fr 1.2fr 1.2fr 0.7fr 0.9fr";
  return (
    <>
      <div className="hidden md:block">
        <div className="grid items-center pb-2.5 text-[11px] font-bold uppercase tracking-[0.07em] text-muted-foreground" style={{ gridTemplateColumns: GRID, borderBottom: "1px solid var(--aw-hairline)" }}>
          <span>Nueva revendedora</span><span>Zona</span><span>Patrocinó</span><span>Fecha</span><span className="text-right">Estado</span>
        </div>
        {ONB_ALTAS.map((r, i) => (
          <div key={i} className="grid items-center py-3 text-[13px]" style={{ gridTemplateColumns: GRID, borderBottom: i < ONB_ALTAS.length - 1 ? "0.5px solid var(--aw-hairline)" : "none" }}>
            <span className="flex items-center gap-2.5"><AvatarInitials name={r.n} size={28} /><span className="font-semibold">{r.n}</span></span>
            <span className="text-muted-foreground">{r.z}</span>
            <span className="text-muted-foreground">{r.padr}</span>
            <span className="text-muted-foreground">{r.fecha}</span>
            <span className="text-right"><PortalBadge tone={r.tone} dot>{r.estado}</PortalBadge></span>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2.5 md:hidden">
        {ONB_ALTAS.map((r, i) => (
          <div key={i} className="rounded-xl p-3" style={{ background: "var(--aw-app-bg)" }}>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2.5"><AvatarInitials name={r.n} size={26} /><span className="text-[13px] font-semibold">{r.n}</span></span>
              <PortalBadge tone={r.tone} dot>{r.estado}</PortalBadge>
            </div>
            <div className="mt-1.5 text-[12px] text-muted-foreground">{r.z} · patrocinó {r.padr} · {r.fecha}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function Continuidad() {
  const { data, labels } = ONB_CONTINUIDAD;
  return (
    <div>
      <h4 className="text-[15px] font-bold tracking-[-0.01em]">Continuidad de pedido</h4>
      <p className="mb-5 text-[12px] text-muted-foreground">% de revendedoras nuevas que repiten pedido</p>
      <div className="flex h-[200px] items-end gap-[min(4%,28px)] px-1">
        {data.map((v, i) => (
          <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <span className="text-[12px] font-bold tabular-nums">{v}%</span>
            <div className="w-full max-w-[54px] rounded-t-lg" style={{ height: `${v}%`, background: i === data.length - 1 ? "var(--aw-violet)" : "var(--aw-violet-light)" }} />
            <span className="text-[11px] text-muted-foreground">{labels[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Seguimiento() {
  const { persona, steps } = ONB_SEGUIMIENTO;
  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <AvatarInitials name={persona.n} size={44} />
        <div className="min-w-0">
          <div className="text-[15px] font-bold">{persona.n}</div>
          <div className="text-[12.5px] text-muted-foreground">{persona.info}</div>
        </div>
        <PortalBadge tone="success" dot className="ml-auto">En continuidad</PortalBadge>
      </div>
      <div className="relative pl-2">
        {steps.map((s, i) => {
          const Icon = STEP_ICONS[s.icon] ?? Clock;
          return (
            <div key={i} className="relative flex gap-4" style={{ paddingBottom: i < steps.length - 1 ? 24 : 0 }}>
              {i < steps.length - 1 && <div className="absolute" style={{ left: 17, top: 36, bottom: 0, width: 2, background: s.done ? "var(--aw-violet)" : "var(--aw-hairline)" }} />}
              <div className="z-[1] grid size-9 shrink-0 place-items-center rounded-full" style={s.done ? { background: "var(--aw-violet)", color: "#fff" } : { background: "var(--aw-app-bg)", color: "var(--fg-subtle)", border: "1px solid var(--aw-hairline)" }}>
                <Icon size={17} strokeWidth={1.5} />
              </div>
              <div className="pt-1">
                <div className="text-[14px] font-semibold">{s.t}</div>
                <div className="text-[12px] text-muted-foreground">{s.d}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Geo() {
  const max = Math.max(...ONB_GEO.map((z) => z.v));
  return (
    <div>
      <h4 className="text-[15px] font-bold tracking-[-0.01em]">Distribución de altas por zona</h4>
      <p className="mb-5 text-[12px] text-muted-foreground">63 altas en la campaña 202608</p>
      <div className="flex flex-col gap-3.5">
        {ONB_GEO.map((z) => (
          <div key={z.z} className="flex flex-col gap-1.5">
            <div className="flex justify-between text-[13px]">
              <span className="font-semibold">{z.z}</span>
              <span className="font-bold tabular-nums" style={{ fontFamily: "var(--font-mono)" }}>{z.v}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full" style={{ background: "var(--aw-app-bg)" }}>
              <div className="h-full rounded-full" style={{ width: `${(z.v / max) * 100}%`, background: "var(--aw-violet)" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
