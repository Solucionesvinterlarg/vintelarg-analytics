"use client";

import { MapPin } from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { MockBadge } from "@/components/portal/mock-badge";
import { COBERTURA_ZONAS, type CobTone } from "@/features/gerente/_mock/cobertura";

const TONE_COLOR: Record<CobTone, string> = {
  success: "var(--aw-success)",
  warn: "var(--aw-warning)",
  danger: "var(--aw-danger)",
};

function Semaforo({ tone, size = 10 }: { tone: CobTone; size?: number }) {
  return <span className="inline-block rounded-full" style={{ width: size, height: size, background: TONE_COLOR[tone], boxShadow: `0 0 0 3px color-mix(in srgb, ${TONE_COLOR[tone]} 22%, transparent)` }} />;
}

/** Placeholder ilustrativo (no geográfico): regiones abstractas + puntos por
 *  estado de cobertura, atados a los datos mock de las zonas. */
function MapaPlaceholder() {
  const pts = [
    { x: 160, y: 70 }, { x: 300, y: 50 }, { x: 430, y: 92 }, { x: 560, y: 58 },
    { x: 240, y: 150 }, { x: 405, y: 162 }, { x: 600, y: 150 }, { x: 685, y: 96 },
  ];
  return (
    <div className="overflow-hidden rounded-xl" style={{ background: "var(--aw-app-bg)" }}>
      <svg viewBox="0 0 800 220" className="block h-auto w-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Mapa ilustrativo de cobertura">
        <g fill="var(--aw-violet-light)" stroke="var(--aw-hairline)" strokeWidth="1.5">
          <path d="M80,40 L260,30 L320,120 L180,170 L70,120 Z" />
          <path d="M330,30 L520,50 L540,150 L360,165 L322,118 Z" />
          <path d="M530,45 L720,55 L730,160 L545,150 Z" />
        </g>
        {COBERTURA_ZONAS.map((z, i) => {
          const p = pts[i] ?? { x: 400, y: 110 };
          return (
            <g key={z.z}>
              <circle cx={p.x} cy={p.y} r="13" fill={TONE_COLOR[z.tone]} opacity="0.18" />
              <circle cx={p.x} cy={p.y} r="6" fill={TONE_COLOR[z.tone]} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function CoberturaView() {
  return (
    <>
      <MockBadge />
      <DesktopTopBar
        title="Cobertura territorial"
        initials="MC"
        right={
          <div className="hidden items-center gap-3.5 text-[12px] text-muted-foreground lg:flex">
            <span className="flex items-center gap-1.5"><Semaforo tone="success" size={8} />≥80%</span>
            <span className="flex items-center gap-1.5"><Semaforo tone="warn" size={8} />65–79%</span>
            <span className="flex items-center gap-1.5"><Semaforo tone="danger" size={8} />&lt;65%</span>
          </div>
        }
      />
      <p className="px-5 pt-3.5 text-[13px] text-muted-foreground md:px-6">Zonas activas vs potencial · División Zeus</p>

      {/* Mapa de cobertura — placeholder ilustrativo (en prod: mapa real Leaflet/Mapbox). */}
      <div className="px-5 pt-3.5 md:px-6">
        <div className="rounded-2xl bg-card p-[18px]" style={{ border: "0.5px solid var(--aw-hairline)" }}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-[15px] font-bold tracking-[-0.01em]">Mapa de cobertura</h3>
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Mapa ilustrativo · datos MOCK</span>
          </div>
          <MapaPlaceholder />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 px-5 pb-6 pt-3.5 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
        {COBERTURA_ZONAS.map((z) => (
          <div key={z.z} className="rounded-2xl bg-card p-[18px]" style={{ border: "0.5px solid var(--aw-hairline)" }}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <MapPin size={16} strokeWidth={1.5} className="text-muted-foreground" />
                <span className="text-[13.5px] font-bold">{z.z}</span>
              </div>
              <Semaforo tone={z.tone} />
            </div>
            <div className="mt-2.5 text-[28px] font-extrabold tracking-[-0.02em] tabular-nums">{z.cob}%</div>
            <div className="my-2.5 h-2 overflow-hidden rounded-full" style={{ background: "var(--aw-app-bg)" }}>
              <div className="h-full rounded-full" style={{ width: `${z.cob}%`, background: TONE_COLOR[z.tone] }} />
            </div>
            <div className="text-[12px] text-muted-foreground">
              <span className="font-bold tabular-nums text-foreground">{z.act}</span> activas de <span className="tabular-nums">{z.pot}</span> potenciales
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
