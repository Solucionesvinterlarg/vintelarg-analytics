"use client";

import { useMemo, useState } from "react";
import { Users, DollarSign, Clock, BellRing, Search, Star, Zap, Download, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { PortalBadge } from "@/components/portal/badge";
import { MockBadge } from "@/components/portal/mock-badge";
import {
  FUERZA_ROWS, FUERZA_SUMMARY, FUERZA_FILTERS, FUERZA_TOTAL, ESTADO_TONE, DEUDA,
  type RevRow, type SummaryDatum,
} from "@/features/gerente/_mock/fuerza-ventas";

const SUMMARY_ICON: Record<string, typeof Users> = { users: Users, "dollar-sign": DollarSign, clock: Clock, "bell-ring": BellRing };
const GRID = "0.85fr 1.9fr 0.95fr 0.5fr 1.1fr 0.95fr 0.7fr 0.95fr 1fr 0.95fr";
const money = (n: number) => "$" + n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

type SortKey = "estado" | "nombre" | "wao" | "uds" | "total" | "score" | "deuda" | "actDays";
const SORT_VAL: Record<SortKey, (r: RevRow) => string | number> = {
  estado: (r) => r.estado,
  nombre: (r) => r.nombre,
  wao: (r) => (r.wao ? 1 : 0),
  uds: (r) => r.uds,
  total: (r) => r.total,
  score: (r) => r.score,
  deuda: (r) => r.deuda,
  actDays: (r) => r.actDays,
};

export function FuerzaVentasView() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 } | null>(null);

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    let out = t ? FUERZA_ROWS.filter((r) => r.nombre.toLowerCase().includes(t) || r.id.includes(t)) : [...FUERZA_ROWS];
    if (sort) {
      const acc = SORT_VAL[sort.key];
      out = [...out].sort((a, b) => {
        const va = acc(a), vb = acc(b);
        if (va < vb) return -1 * sort.dir;
        if (va > vb) return 1 * sort.dir;
        return 0;
      });
    }
    return out;
  }, [q, sort]);

  const toggleSort = (key: SortKey) =>
    setSort((s) => (s?.key === key ? (s.dir === 1 ? { key, dir: -1 } : null) : { key, dir: 1 }));

  return (
    <>
      <MockBadge />
      <DesktopTopBar
        title="Fuerza de ventas"
        filters={FUERZA_FILTERS}
        initials="MC"
        right={
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-card px-3 py-2 text-[12px] font-semibold text-foreground transition-colors hover:bg-secondary"
            style={{ border: "1px solid var(--aw-hairline)" }}
          >
            <Download size={14} strokeWidth={1.5} />
            <span className="hidden sm:inline">Exportar</span>
          </button>
        }
      />

      <p className="px-5 pt-3.5 text-[13px] text-muted-foreground md:px-6">Monitoreo de rendimiento y estado de la red</p>

      {/* SummaryCards */}
      <div className="grid grid-cols-1 gap-3 px-5 pt-3.5 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
        {FUERZA_SUMMARY.map((c) => <SummaryCard key={c.label} {...c} />)}
      </div>

      {/* Detalle de revendedoras */}
      <div className="flex flex-1 flex-col px-5 pb-6 pt-4 md:px-6">
        <div className="flex flex-col overflow-hidden rounded-2xl bg-card" style={{ border: "0.5px solid var(--aw-hairline)" }}>
          {/* header card: título + buscador */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5" style={{ borderBottom: "1px solid var(--aw-hairline)" }}>
            <h3 className="text-[16px] font-bold tracking-[-0.01em] text-foreground">Detalle de revendedoras</h3>
            <div className="flex min-w-[200px] items-center gap-2 rounded-full px-3 py-[7px]" style={{ background: "var(--aw-chalk)" }}>
              <Search size={15} strokeWidth={1.5} className="shrink-0 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar revendedora..."
                className="min-w-0 flex-1 border-0 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* tabla desktop */}
          <div className="hidden md:block">
            <div
              className="grid items-center px-[18px] py-2.5 text-[11px] font-bold uppercase tracking-[0.07em] text-muted-foreground"
              style={{ gridTemplateColumns: GRID, background: "var(--aw-app-bg)", borderBottom: "1px solid var(--aw-hairline)" }}
            >
              <SortTh label="Estado" k="estado" sort={sort} onSort={toggleSort} />
              <SortTh label="ID / Nombre (Grupo)" k="nombre" sort={sort} onSort={toggleSort} />
              <SortTh label="WAO $" k="wao" sort={sort} onSort={toggleSort} align="right" />
              <SortTh label="Uds." k="uds" sort={sort} onSort={toggleSort} align="right" />
              <SortTh label="Importe Total" k="total" sort={sort} onSort={toggleSort} align="right" />
              <span className="text-center">Comp. B/H/T</span>
              <SortTh label="Score" k="score" sort={sort} onSort={toggleSort} align="right" />
              <SortTh label="Deuda" k="deuda" sort={sort} onSort={toggleSort} align="center" />
              <SortTh label="Últ. act." k="actDays" sort={sort} onSort={toggleSort} align="right" />
              <span className="text-right">Acción</span>
            </div>

            {rows.map((r, i) => (
              <div
                key={r.id}
                className="grid items-center px-[18px] py-3 text-[12px] text-foreground"
                style={{ gridTemplateColumns: GRID, background: i % 2 === 1 ? "var(--aw-app-bg)" : "transparent", borderBottom: i < rows.length - 1 ? "0.5px solid var(--aw-hairline)" : "none" }}
              >
                <span><PortalBadge tone={ESTADO_TONE[r.estado]} dot>{r.estado}</PortalBadge></span>
                <span className="flex min-w-0 items-center gap-2.5">
                  <Avatar name={r.nombre} warm={r.deuda === "danger"} />
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">{r.nombre}</span>
                    <span className="text-[11px] text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>ID {r.id} · Gpo {r.gpo}</span>
                  </span>
                </span>
                <span className="text-right">
                  {r.wao ? <PortalBadge tone="success">SÍ {r.wao}</PortalBadge> : <span className="text-muted-foreground">NO</span>}
                </span>
                <span className="text-right tabular-nums">{r.uds}</span>
                <span className="text-right font-bold tabular-nums" style={{ fontFamily: "var(--font-mono)" }}>{money(r.total)}</span>
                <span className="text-center text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>{r.comp}</span>
                <span className="flex items-center justify-end gap-1">
                  <Star size={13} className="text-[var(--aw-warning)]" style={{ fill: "var(--aw-warning)" }} />
                  <span className="font-bold tabular-nums">{r.score.toFixed(1)}</span>
                </span>
                <span className="text-center"><PortalBadge tone={DEUDA[r.deuda].tone}>{DEUDA[r.deuda].label}</PortalBadge></span>
                <span className="text-right text-[11px]" style={{ color: r.actDays > 30 ? "var(--aw-danger)" : "var(--fg-subtle)" }}>{r.act}</span>
                <span className="text-right">
                  {r.ganaMas ? (
                    <button type="button" className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-bold text-white" style={{ background: "var(--aw-violet)" }}>
                      <Zap size={12} strokeWidth={2} /> Ganá más
                    </button>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </span>
              </div>
            ))}
          </div>

          {/* cards mobile */}
          <div className="md:hidden">
            {rows.map((r) => (
              <div key={r.id} className="border-b p-4 last:border-b-0" style={{ borderColor: "var(--aw-hairline)" }}>
                <div className="flex items-start justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-2.5">
                    <Avatar name={r.nombre} warm={r.deuda === "danger"} />
                    <span className="min-w-0">
                      <span className="block truncate text-[14px] font-bold">{r.nombre}</span>
                      <span className="text-[11px] text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>ID {r.id} · Gpo {r.gpo}</span>
                    </span>
                  </span>
                  <PortalBadge tone={ESTADO_TONE[r.estado]} dot>{r.estado}</PortalBadge>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <Stat label="Uds." value={String(r.uds)} />
                  <Stat label="Importe" value={money(r.total)} mono />
                  <Stat label="Score" value={`★ ${r.score.toFixed(1)}`} />
                </div>
                <div className="mt-2.5 flex items-center justify-between text-[12px]">
                  <PortalBadge tone={DEUDA[r.deuda].tone}>{DEUDA[r.deuda].label}</PortalBadge>
                  <span style={{ color: r.actDays > 30 ? "var(--aw-danger)" : "var(--fg-subtle)" }}>{r.act}</span>
                </div>
              </div>
            ))}
          </div>

          {/* paginación */}
          <div className="flex items-center justify-between gap-2 px-[18px] py-2.5 text-[12px] text-muted-foreground" style={{ borderTop: "1px solid var(--aw-hairline)" }}>
            <span className="hidden sm:inline">Mostrando 1–{rows.length} de {FUERZA_TOTAL} revendedoras</span>
            <div className="flex flex-1 items-center justify-end gap-2 sm:flex-none">
              <PagerBtn dir="prev" disabled />
              <PagerBtn dir="next" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function SummaryCard({ label, value, sub, tone, icon, breakdown }: SummaryDatum) {
  const Icon = SUMMARY_ICON[icon] ?? Users;
  const toneColor = tone ? `var(--aw-${tone === "warn" ? "warning" : tone === "success" ? "success" : tone === "danger" ? "danger" : "info"})` : "var(--fg-subtle)";
  return (
    <div className="rounded-2xl bg-card p-4" style={{ border: "0.5px solid var(--aw-hairline)" }}>
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">{label}</span>
        <Icon size={16} strokeWidth={1.5} style={{ color: toneColor }} />
      </div>
      <div className="mt-2 text-[23px] font-extrabold tracking-[-0.02em] tabular-nums">{value}</div>
      {sub && <div className="mt-1 text-[11.5px]" style={{ color: toneColor }}>{sub}</div>}
      {breakdown && (
        <div className="mt-2 flex flex-wrap gap-2.5">
          {breakdown.map((b) => (
            <span key={b.l} className="text-[11px] text-muted-foreground">
              <span className="font-bold tabular-nums" style={{ color: toneOf(b.tone) }}>{b.v}</span> {b.l}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function toneOf(t: string) {
  return t === "warn" ? "var(--aw-warning)" : t === "success" ? "var(--aw-success)" : t === "danger" ? "var(--aw-danger)" : "var(--aw-violet)";
}

function SortTh({ label, k, sort, onSort, align = "left" }: { label: string; k: SortKey; sort: { key: SortKey; dir: 1 | -1 } | null; onSort: (k: SortKey) => void; align?: "left" | "right" | "center" }) {
  const active = sort?.key === k;
  return (
    <button
      type="button"
      onClick={() => onSort(k)}
      className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.07em] text-muted-foreground transition-colors hover:text-foreground"
      style={{ justifyContent: align === "right" ? "flex-end" : align === "center" ? "center" : "flex-start" }}
    >
      {label}
      {active ? (sort!.dir === 1 ? <ChevronUp size={12} className="text-[var(--aw-violet)]" /> : <ChevronDown size={12} className="text-[var(--aw-violet)]" />) : <ChevronDown size={12} className="opacity-30" />}
    </button>
  );
}

function Avatar({ name, warm }: { name: string; warm?: boolean }) {
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
  return (
    <span
      className="grid size-[30px] shrink-0 place-items-center rounded-full text-[11px] font-bold"
      style={{ background: warm ? "#FFF1D6" : "var(--aw-violet-light)", color: warm ? "#84541A" : "var(--aw-violet)" }}
    >
      {initials}
    </span>
  );
}

function Stat({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-xl px-2 py-2" style={{ background: "var(--aw-app-bg)" }}>
      <div className="text-[13px] font-extrabold tracking-tight tabular-nums" style={mono ? { fontFamily: "var(--font-mono)" } : undefined}>{value}</div>
      <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">{label}</div>
    </div>
  );
}

function PagerBtn({ dir, disabled }: { dir: "prev" | "next"; disabled?: boolean }) {
  const Icon = dir === "prev" ? ChevronLeft : ChevronRight;
  const text = dir === "prev" ? "Anterior" : "Siguiente";
  return (
    <button
      type="button"
      disabled={disabled}
      className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-card px-3 py-1.5 text-[12px] font-semibold text-foreground transition disabled:opacity-40 sm:flex-none"
      style={{ border: "1px solid var(--aw-hairline)" }}
    >
      {dir === "prev" && <Icon size={14} strokeWidth={1.5} />}
      {text}
      {dir === "next" && <Icon size={14} strokeWidth={1.5} />}
    </button>
  );
}
