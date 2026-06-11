"use client";

import { useState } from "react";
import { ChevronDown, Gift, CheckCircle2, Loader, Lock } from "lucide-react";
import { MockBadge } from "@/components/portal/mock-badge";
import { PortalBadge, type BadgeTone } from "@/components/portal/badge";
import { AvatarInitials } from "@/components/portal/avatar-initials";
import { EmpBackHeader } from "@/features/emprendedora/emp-back-header";
import { useEmpStore } from "@/lib/emp-store";
import { toneTile } from "@/features/emprendedora/_mock/logros";

const PEOPLE = [
  { n: "Carla Giménez", z: "Zona Norte", active: true, ped: "3 Pedidos Consec." },
  { n: "Romina Díaz", z: "Zona Oeste", active: true, ped: "2 Pedidos Consec." },
  { n: "Vanesa López", z: "Zona Sur", active: false, ped: "Sin actividad" },
  { n: "Paula Sosa", z: "Zona Centro", active: true, ped: "5 Pedidos Consec." },
];
const ETAPAS: { e: string; s: string; st: string; tone: BadgeTone; Icon: typeof Gift }[] = [
  { e: "Etapa 1", s: "1 indicada activa", st: "CUMPLIÓ", tone: "success", Icon: CheckCircle2 },
  { e: "Etapa 2", s: "3 indicadas activas", st: "PROCESO", tone: "warn", Icon: Loader },
  { e: "Etapa 3", s: "5 indicadas activas", st: "BLOQUEADA", tone: "neutral", Icon: Lock },
];

export function IndicacionesView() {
  const [view, setView] = useState<"lista" | "programa">("lista");
  const notify = useEmpStore((s) => s.notify);

  return (
    <div className="pb-6">
      <MockBadge />
      <EmpBackHeader title="Mis Indicaciones" />
      <div className="px-4 pt-3.5">
        <div className="flex gap-2.5">
          {[{ n: "8", l: "Total Referidas", col: undefined }, { n: "6", l: "Activas", col: "var(--aw-success)" }].map((s) => (
            <div key={s.l} className="flex-1 rounded-2xl p-3.5 text-center" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" }}>
              <div className="text-[26px] font-extrabold" style={{ color: s.col ?? "var(--foreground)" }}>{s.n}</div>
              <div className="text-[11.5px] font-semibold text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex gap-1.5">
          {(["lista", "programa"] as const).map((v) => (
            <button key={v} type="button" onClick={() => setView(v)} className="emp-press rounded-full px-3.5 py-2 text-[12.5px] font-semibold" style={{ border: `1px solid ${view === v ? "var(--aw-violet)" : "var(--aw-hairline)"}`, background: view === v ? "var(--aw-violet)" : "var(--aw-white)", color: view === v ? "#fff" : "var(--fg-subtle)" }}>{v === "lista" ? "Lista" : "Programa de Indicaciones"}</button>
          ))}
        </div>

        {view === "lista" ? (
          <div className="mt-3.5">
            <div className="mb-2.5 flex items-center justify-between">
              <div className="text-[13px] font-bold text-foreground">Campaña 03 · 2026</div>
              <button type="button" onClick={() => notify("Seleccionar campaña")} className="emp-press flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-semibold text-foreground" style={{ border: "1px solid var(--aw-hairline)", background: "var(--aw-white)" }}>Cambiar <ChevronDown size={13} /></button>
            </div>
            <div className="flex flex-col gap-2.5">
              {PEOPLE.map((p) => (
                <button key={p.n} type="button" onClick={() => notify("Detalle por campaña de " + p.n)} className="emp-press flex items-center gap-3 rounded-2xl p-3 text-left" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" }}>
                  <AvatarInitials name={p.n} size={40} />
                  <div className="min-w-0 flex-1"><div className="text-[13.5px] font-bold text-foreground">{p.n}</div><div className="text-[11px] text-muted-foreground">{p.z} · {p.ped}</div></div>
                  <PortalBadge tone={p.active ? "success" : "neutral"}>{p.active ? "ACTIVA" : "INACTIVA"}</PortalBadge>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-3.5">
            <div className="mb-3 flex gap-2.5">
              {[{ n: "8", l: "Indicadas", col: undefined }, { n: "5", l: "Cumplieron", col: "var(--aw-success)" }, { n: "62.5%", l: "Tasa Éxito", col: "var(--aw-violet-deep)" }].map((s) => (
                <div key={s.l} className="flex-1 rounded-2xl p-3 text-center" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" }}>
                  <div className="text-[20px] font-extrabold" style={{ color: s.col ?? "var(--foreground)" }}>{s.n}</div>
                  <div className="text-[10.5px] font-semibold text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
            <div className="mb-3 flex items-center gap-1.5 text-[15.5px] font-bold tracking-[-0.01em] text-foreground"><Gift size={17} style={{ color: "var(--aw-violet)" }} /> Premios por etapa</div>
            <div className="flex flex-col gap-2.5">
              {ETAPAS.map((r) => {
                const t = toneTile(r.tone);
                return (
                  <div key={r.e} className="flex items-center gap-3 rounded-2xl p-3.5" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" }}>
                    <span className="grid size-[38px] flex-none place-items-center rounded-xl" style={{ background: t.bg, color: t.fg }}><r.Icon size={18} /></span>
                    <div className="flex-1"><div className="text-[13.5px] font-bold text-foreground">{r.e}</div><div className="text-[11px] text-muted-foreground">{r.s}</div></div>
                    <PortalBadge tone={r.tone}>{r.st}</PortalBadge>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
