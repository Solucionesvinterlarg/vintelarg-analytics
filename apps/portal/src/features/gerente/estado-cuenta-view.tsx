"use client";

import { Wallet, AlertTriangle, CalendarClock, CheckCircle2, Download } from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { MockBadge } from "@/components/portal/mock-badge";
import { CUENTA_KPIS, MOVIMIENTOS, type CuentaTone } from "@/features/gerente/_mock/estado-cuenta";

const ICONS: Record<string, typeof Wallet> = { wallet: Wallet, "alert-triangle": AlertTriangle, "calendar-clock": CalendarClock, "check-circle-2": CheckCircle2 };
const TONE: Record<CuentaTone, string> = { violet: "var(--aw-violet)", danger: "var(--aw-danger)", warning: "var(--aw-warning)", success: "var(--aw-success)" };
const GRID = "0.7fr 1.4fr 1.4fr 1fr 1fr 1fr";

export function EstadoCuentaView() {
  return (
    <>
      <MockBadge />
      <DesktopTopBar
        title="Estado de cuenta"
        initials="MC"
        right={
          <button type="button" className="inline-flex items-center gap-1.5 rounded-lg bg-card px-3 py-2 text-[12px] font-semibold text-foreground transition-colors hover:bg-secondary" style={{ border: "1px solid var(--aw-hairline)" }}>
            <Download size={14} strokeWidth={1.5} /><span className="hidden sm:inline">Exportar</span>
          </button>
        }
      />
      <p className="px-5 pt-3.5 text-[13px] text-muted-foreground md:px-6">Cuenta corriente agregada · División Zeus</p>

      <div className="grid grid-cols-1 gap-3 px-5 pt-3.5 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
        {CUENTA_KPIS.map((k) => {
          const Icon = ICONS[k.icon] ?? Wallet;
          return (
            <div key={k.label} className="rounded-2xl bg-card p-[18px]" style={{ border: "0.5px solid var(--aw-hairline)" }}>
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">{k.label}</span>
                <Icon size={18} strokeWidth={1.5} style={{ color: TONE[k.tone] }} />
              </div>
              <div className="mt-2.5 text-[24px] font-extrabold tracking-[-0.02em] tabular-nums" style={{ color: k.tone === "danger" ? "var(--aw-danger)" : "var(--foreground)" }}>{k.value}</div>
            </div>
          );
        })}
      </div>

      <div className="px-5 pb-6 pt-3 md:px-6">
        <div className="overflow-hidden rounded-2xl bg-card" style={{ border: "0.5px solid var(--aw-hairline)" }}>
          <div className="px-5 pt-4">
            <h3 className="text-[15px] font-bold tracking-[-0.01em]">Movimientos recientes</h3>
            <p className="mt-0.5 text-[12px] text-muted-foreground">Últimos asientos de la cuenta corriente</p>
          </div>
          {/* desktop */}
          <div className="mt-3 hidden md:block">
            <div className="grid items-center px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.07em] text-muted-foreground" style={{ gridTemplateColumns: GRID, background: "var(--aw-app-bg)", borderBottom: "1px solid var(--aw-hairline)" }}>
              <span>Fecha</span><span>Revendedora</span><span>Concepto</span><span className="text-right">Debe</span><span className="text-right">Haber</span><span className="text-right">Saldo</span>
            </div>
            {MOVIMIENTOS.map((m, i) => (
              <div key={i} className="grid items-center px-5 py-3 text-[13px]" style={{ gridTemplateColumns: GRID, background: i % 2 === 1 ? "var(--aw-app-bg)" : "transparent", borderBottom: i < MOVIMIENTOS.length - 1 ? "0.5px solid var(--aw-hairline)" : "none" }}>
                <span className="text-muted-foreground">{m.f}</span>
                <span className="font-semibold">{m.rev}</span>
                <span className="text-muted-foreground">{m.concepto}</span>
                <span className="text-right tabular-nums" style={{ fontFamily: "var(--font-mono)", color: m.debe ? "var(--aw-danger)" : "var(--fg-subtle)" }}>{m.debe || "—"}</span>
                <span className="text-right tabular-nums" style={{ fontFamily: "var(--font-mono)", color: m.haber ? "var(--aw-success)" : "var(--fg-subtle)" }}>{m.haber || "—"}</span>
                <span className="text-right font-bold tabular-nums" style={{ fontFamily: "var(--font-mono)" }}>{m.saldo}</span>
              </div>
            ))}
          </div>
          {/* mobile */}
          <div className="mt-3 md:hidden">
            {MOVIMIENTOS.map((m, i) => (
              <div key={i} className="border-t p-4" style={{ borderColor: "var(--aw-hairline)" }}>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold">{m.rev}</span>
                  <span className="text-[11px] text-muted-foreground">{m.f}</span>
                </div>
                <div className="mt-0.5 text-[12px] text-muted-foreground">{m.concepto}</div>
                <div className="mt-2 flex items-center justify-between text-[12px]">
                  <span style={{ fontFamily: "var(--font-mono)" }}>
                    {m.debe && <span style={{ color: "var(--aw-danger)" }}>−{m.debe} </span>}
                    {m.haber && <span style={{ color: "var(--aw-success)" }}>+{m.haber}</span>}
                  </span>
                  <span className="font-bold tabular-nums" style={{ fontFamily: "var(--font-mono)" }}>Saldo {m.saldo}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
