"use client";

import { useState } from "react";
import { ArrowRight, Flag, Save } from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { MockBadge } from "@/components/portal/mock-badge";

const fmt = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export function LciSimuladorView() {
  const [venta, setVenta] = useState(1850000);
  const [altas, setAltas] = useState(12);
  const [pedidos, setPedidos] = useState(85);
  const [cobr, setCobr] = useState(92);
  const bonif = Math.round(venta * 0.06); // mock: 6% de la venta grupal

  return (
    <>
      <MockBadge />
      <DesktopTopBar title="Simulador de títulos" initials="LT" />

      <div className="px-5 pt-5 md:px-6">
        <div className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--aw-violet)" }}>Proyección</div>
        <h2 className="mt-1 text-[22px] font-extrabold tracking-[-0.02em] text-foreground">Simulación de títulos y bonificaciones</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 px-5 pb-6 pt-5 md:px-6 lg:grid-cols-2">
        {/* sliders */}
        <div className="rounded-2xl bg-card p-5" style={{ border: "0.5px solid var(--aw-hairline)" }}>
          <div className="text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: "var(--aw-violet)" }}>Editable</div>
          <div className="text-[15.5px] font-bold tracking-[-0.01em] text-foreground">Ajustar KPIs del simulador</div>
          <div className="mt-5 flex flex-col gap-5">
            <Slider label="Venta grupal" value={`$${fmt(venta)}`} min={500000} max={3000000} step={50000} raw={venta} onChange={setVenta} />
            <Slider label="Altas generadas" value={String(altas)} min={0} max={30} step={1} raw={altas} onChange={setAltas} />
            <Slider label="Pedidos personales" value={String(pedidos)} min={0} max={150} step={5} raw={pedidos} onChange={setPedidos} />
            <Slider label="Cobrabilidad" value={`${cobr}%`} min={0} max={100} step={1} raw={cobr} onChange={setCobr} />
          </div>
        </div>

        {/* resultado */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl bg-card p-5" style={{ border: "0.5px solid var(--aw-hairline)" }}>
            <div className="text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: "var(--aw-violet)" }}>Resultado</div>
            <div className="text-[15.5px] font-bold tracking-[-0.01em] text-foreground">Proyección en tiempo real</div>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1 rounded-xl px-3.5 py-3 text-center" style={{ background: "var(--aw-chalk)" }}><div className="text-[10px] font-bold uppercase tracking-[0.05em] text-muted-foreground">Título actual (N-1)</div><div className="text-[16px] font-extrabold text-foreground">Oro 3</div></div>
              <ArrowRight size={18} className="flex-none text-muted-foreground" />
              <div className="flex-1 rounded-xl px-3.5 py-3 text-center" style={{ background: "var(--aw-violet-light)" }}><div className="text-[10px] font-bold uppercase tracking-[0.05em]" style={{ color: "var(--aw-violet-deep)" }}>Título alcanzable</div><div className="text-[16px] font-extrabold" style={{ color: "var(--aw-violet-deep)" }}>Diamante 1</div></div>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-[12px]" style={{ background: "var(--aw-warning-light)", color: "#84541A" }}><Flag size={15} /> Brecha para <b>Diamante 1</b>: $150.000 de venta grupal + 3 altas.</div>
          </div>

          <div className="rounded-2xl bg-card p-5" style={{ border: "0.5px solid var(--aw-hairline)" }}>
            <div className="text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: "var(--aw-violet)" }}>Diamante 1</div>
            <div className="text-[15.5px] font-bold tracking-[-0.01em] text-foreground">Bonificación estimada</div>
            <div className="mt-3 flex items-baseline gap-2"><span className="text-[34px] font-extrabold tracking-[-0.03em] tabular-nums" style={{ color: "var(--aw-violet)" }}>${fmt(bonif)}</span><span className="text-[13px] text-muted-foreground">(6%)</span></div>
            <div className="mt-2 inline-block rounded-full px-2.5 py-1 text-[11.5px] font-bold" style={{ background: "var(--aw-success-light)", color: "#236A40" }}>+$34.500 vs título actual</div>
            <button type="button" className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-bold text-foreground transition-colors hover:bg-secondary" style={{ border: "1px solid var(--aw-hairline)" }}><Save size={15} /> Guardar simulación</button>
          </div>
        </div>
      </div>
    </>
  );
}

function Slider({ label, value, min, max, step, raw, onChange }: { label: string; value: string; min: number; max: number; step: number; raw: number; onChange: (n: number) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between"><span className="text-[13px] font-semibold text-foreground">{label}</span><span className="text-[14px] font-bold tabular-nums" style={{ color: "var(--aw-violet)" }}>{value}</span></div>
      <input type="range" min={min} max={max} step={step} value={raw} onChange={(e) => onChange(Number(e.target.value))} className="mt-2 w-full" style={{ accentColor: "var(--aw-violet)" }} />
    </div>
  );
}
