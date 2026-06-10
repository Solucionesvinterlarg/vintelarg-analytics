"use client";

import { useMemo, useState } from "react";
import { Search, ChevronDown, AlertCircle, Loader, CheckCircle2, Clock } from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { PortalBadge } from "@/components/portal/badge";
import { cn } from "@/lib/utils";
import type { TicketRow, TicketMetrics } from "@/lib/queries";

const FILTERS = ["Estado: Todos", "Prioridad: Todas", "Zona: Todas", "Motivo: Todos"];
const GRID = "90px 100px 1.6fr 1.4fr 1fr 90px 110px 120px";

export function AtencionView({ tickets, metrics }: { tickets: TicketRow[]; metrics: TicketMetrics }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tickets;
    return tickets.filter(
      (t) =>
        t.id.toLowerCase().includes(q) ||
        t.asunto.toLowerCase().includes(q) ||
        t.emp.toLowerCase().includes(q)
    );
  }, [search, tickets]);

  const cards = [
    { label: "Abiertos", value: String(metrics.abiertos), bg: "var(--tint-red)", fg: "var(--tint-red-fg)", Icon: AlertCircle },
    { label: "En curso", value: String(metrics.enCurso), bg: "var(--tint-amber)", fg: "var(--tint-amber-fg)", Icon: Loader },
    { label: "Resueltos hoy", value: String(metrics.resueltosHoy), bg: "var(--tint-green)", fg: "var(--tint-green-fg)", Icon: CheckCircle2 },
    { label: "Tiempo prom. resp.", value: metrics.tiempoProm, bg: "var(--tint-blue)", fg: "var(--tint-blue-fg)", Icon: Clock },
  ];

  return (
    <>
      <DesktopTopBar
        title="Tickets"
        initials="LR"
        right={
          <div className="flex w-60 items-center gap-2 rounded-full px-3 py-[7px]" style={{ background: "var(--aw-chalk)" }}>
            <Search size={14} strokeWidth={1.5} className="shrink-0 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar ticket, emprendedora..."
              className="min-w-0 flex-1 border-0 bg-transparent text-[12px] text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
        }
      />

      {/* Filtros */}
      <div className="flex items-center gap-2.5 px-6 pt-3.5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Filtros</span>
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-card px-3 py-1.5 text-[12px] font-semibold text-muted-foreground"
            style={{ border: "1px solid var(--aw-hairline)" }}
          >
            {f}
            <ChevronDown size={13} strokeWidth={1.5} className="text-muted-foreground" />
          </button>
        ))}
      </div>

      {/* Métricas (reales) */}
      <div className="grid grid-cols-4 gap-3 px-6 pt-3.5">
        {cards.map(({ label, value, bg, fg, Icon }) => (
          <div key={label} className="flex items-center gap-3 rounded-xl px-4 py-3.5" style={{ background: bg }}>
            <div className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-white" style={{ color: fg }}>
              <Icon size={18} strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-[11px] font-semibold" style={{ color: fg }}>{label}</div>
              <div className="mt-px text-[20px] font-extrabold leading-none tracking-tight" style={{ color: fg }}>{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div className="flex flex-1 flex-col overflow-hidden px-6 pb-4 pt-4">
        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-card" style={{ border: "0.5px solid var(--aw-hairline)" }}>
          <div
            className="grid shrink-0 px-[18px] py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground"
            style={{ gridTemplateColumns: GRID, background: "var(--aw-app-bg)", borderBottom: "1px solid var(--aw-hairline)" }}
          >
            <span>#</span><span>Estado</span><span>Asunto</span><span>Emprendedora</span><span>Motivo</span><span>Prioridad</span><span>Creado</span><span>Asignado a</span>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="grid h-full place-items-center p-10 text-center text-sm text-muted-foreground">
                {tickets.length === 0 ? "Todavía no hay tickets." : "Sin resultados para tu búsqueda."}
              </div>
            ) : (
              filtered.map((t, i) => (
                <div
                  key={t.id}
                  className="grid items-center px-[18px] py-[11px] text-[12px] text-foreground"
                  style={{
                    gridTemplateColumns: GRID,
                    background: i % 2 === 1 ? "var(--aw-app-bg)" : "transparent",
                    borderBottom: i < filtered.length - 1 ? "0.5px solid var(--aw-hairline)" : "none",
                  }}
                >
                  <span className="text-[11px] text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>{t.id}</span>
                  <span><PortalBadge tone={t.statusTone} dot>{t.status}</PortalBadge></span>
                  <span className="truncate pr-2 font-semibold">{t.asunto}</span>
                  <span className="min-w-0"><div className="truncate">{t.emp}</div><div className="text-[10px] text-muted-foreground">{t.zona}</div></span>
                  <span className="text-muted-foreground">{t.motivo}</span>
                  <span><PortalBadge tone={t.prioTone}>{t.prio}</PortalBadge></span>
                  <span className="text-[11px] text-muted-foreground">{t.creado}</span>
                  <span className={cn("text-[12px]", t.asignado ? "text-muted-foreground" : "italic text-[var(--aw-stone)]")}>
                    {t.asignado ?? "Sin asignar"}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="flex flex-none items-center justify-between border-t px-[18px] py-2.5 text-[12px] text-muted-foreground" style={{ borderColor: "var(--aw-hairline)" }}>
            <span>Mostrando {filtered.length} de {tickets.length}</span>
          </div>
        </div>
      </div>
    </>
  );
}
