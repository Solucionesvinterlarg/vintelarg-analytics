"use client";

import { useState } from "react";
import { Search, ChevronDown, AlertCircle, Loader, CheckCircle2, Clock } from "lucide-react";

import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { PortalBadge } from "@/components/portal/badge";
import { cn } from "@/lib/utils";
import { TICKETS, estadoTone, prioTone } from "@/lib/mock/tickets";

/* ------------------------------------------------------------------ */
/* Metric card data                                                      */
/* ------------------------------------------------------------------ */
const METRICS = [
  {
    label: "Abiertos",
    value: "12",
    bg: "#FEF2F2",
    fg: "#7C2F35",
    Icon: AlertCircle,
  },
  {
    label: "En curso",
    value: "8",
    bg: "#FFFBEB",
    fg: "#84541A",
    Icon: Loader,
  },
  {
    label: "Resueltos hoy",
    value: "15",
    bg: "#F0FDF4",
    fg: "#236A40",
    Icon: CheckCircle2,
  },
  {
    label: "Tiempo prom. resp.",
    value: "2.4 hs",
    bg: "#EFF6FF",
    fg: "#1E448F",
    Icon: Clock,
  },
] as const;

const FILTERS = ["Estado: Todos", "Prioridad: Todas", "Zona: Todas", "Motivo: Todos"] as const;

const GRID_COLS = "90px 100px 1.6fr 1.4fr 1fr 90px 110px 110px 70px";
const PAGE_PILLS = ["<", "1", "2", "3", "4", ">"] as const;

/* ------------------------------------------------------------------ */
/* Page                                                                  */
/* ------------------------------------------------------------------ */
export default function AtencionPage() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      {/* ── Topbar ───────────────────────────────────────────────── */}
      <DesktopTopBar
        title="Tickets"
        initials="LR"
        right={
          <div
            className="flex items-center gap-2"
            style={{
              background: "var(--aw-chalk)",
              padding: "7px 12px",
              borderRadius: 100,
              width: 240,
            }}
          >
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

      {/* ── Filters row ──────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 px-6 pt-[14px]">
        <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          Filtros
        </span>
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-[6px] text-[12px] font-semibold text-muted-foreground"
            style={{ background: "#fff", border: "1px solid var(--aw-hairline)" }}
          >
            {f}
            <ChevronDown size={13} strokeWidth={1.5} className="text-muted-foreground" />
          </button>
        ))}
      </div>

      {/* ── Metric cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-3 px-6 pt-[14px]">
        {METRICS.map(({ label, value, bg, fg, Icon }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-xl"
            style={{ background: bg, padding: "14px 16px" }}
          >
            <div
              className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-white"
              style={{ color: fg }}
            >
              <Icon size={18} strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-[11px] font-semibold" style={{ color: fg }}>
                {label}
              </div>
              <div
                className="mt-px text-[20px] font-extrabold leading-none tracking-tight"
                style={{ color: fg }}
              >
                {value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Table card ───────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden p-4 px-6 pb-4 pt-4">
        <div
          className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-card"
          style={{ border: "0.5px solid var(--aw-hairline)" }}
        >
          {/* Table header */}
          <div
            className="grid shrink-0 text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground"
            style={{
              gridTemplateColumns: GRID_COLS,
              padding: "12px 18px",
              background: "var(--aw-app-bg)",
              borderBottom: "1px solid var(--aw-hairline)",
            }}
          >
            <span>#</span>
            <span>Estado</span>
            <span>Asunto</span>
            <span>Emprendedora</span>
            <span>Motivo</span>
            <span>Prioridad</span>
            <span>Creado</span>
            <span>Asignado a</span>
            <span />
          </div>

          {/* Table body */}
          <div className="flex-1 overflow-y-auto">
            {TICKETS.map((ticket, i) => (
              <div
                key={ticket.id}
                onClick={() => setSelectedId(ticket.id === selectedId ? null : ticket.id)}
                className="grid cursor-pointer items-center text-[12px] text-foreground transition-colors hover:brightness-95"
                style={{
                  gridTemplateColumns: GRID_COLS,
                  padding: "11px 18px",
                  background: i % 2 === 1 ? "var(--aw-app-bg)" : "#fff",
                  borderBottom:
                    i < TICKETS.length - 1 ? "0.5px solid var(--aw-hairline)" : "none",
                }}
              >
                {/* # */}
                <span
                  className="text-[11px] text-muted-foreground"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {ticket.id}
                </span>

                {/* Estado */}
                <span>
                  <PortalBadge tone={estadoTone[ticket.estado]} dot>
                    {ticket.estado}
                  </PortalBadge>
                </span>

                {/* Asunto */}
                <span className="font-semibold">{ticket.asunto}</span>

                {/* Emprendedora + zona */}
                <span>
                  <div>{ticket.emp}</div>
                  <div className="text-[10px] text-muted-foreground">{ticket.zona}</div>
                </span>

                {/* Motivo */}
                <span className="text-muted-foreground">{ticket.motivo}</span>

                {/* Prioridad */}
                <span>
                  <PortalBadge tone={prioTone[ticket.prio]}>{ticket.prio}</PortalBadge>
                </span>

                {/* Creado */}
                <span className="text-[11px] text-muted-foreground">{ticket.creado}</span>

                {/* Asignado a */}
                <span
                  className={cn(
                    "text-[12px]",
                    ticket.asig === "Sin asignar"
                      ? "italic text-muted-foreground/50"
                      : "text-muted-foreground"
                  )}
                >
                  {ticket.asig}
                </span>

                {/* Ver */}
                <span>
                  <button
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-full px-[10px] py-1 text-[11px] font-bold text-white transition-opacity hover:opacity-80"
                    style={{ background: "var(--aw-violet)", border: 0, cursor: "pointer" }}
                  >
                    Ver
                  </button>
                </span>
              </div>
            ))}
          </div>

          {/* Pagination footer */}
          <div
            className="flex shrink-0 items-center justify-between bg-card px-[18px] py-[10px] text-[12px] text-muted-foreground"
            style={{ borderTop: "0.5px solid var(--aw-hairline)" }}
          >
            <span>Mostrando 1–10 de 35</span>

            <div className="flex items-center gap-1.5">
              {PAGE_PILLS.map((p) => (
                <div
                  key={p}
                  className="flex h-[26px] min-w-[26px] items-center justify-center rounded-lg px-2 text-[12px] font-semibold"
                  style={
                    p === "1"
                      ? { background: "var(--aw-violet)", color: "#fff", border: "none" }
                      : {
                          background: "transparent",
                          color: "var(--fg-muted)",
                          border: "1px solid var(--aw-hairline)",
                        }
                  }
                >
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
