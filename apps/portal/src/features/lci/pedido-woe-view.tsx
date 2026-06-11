"use client";

import { useState } from "react";
import { Lock, ArrowRight, ArrowLeft, Check, Plus, Minus, Package, CheckCircle2 } from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { MockBadge } from "@/components/portal/mock-badge";
import { PortalBadge } from "@/components/portal/badge";
import { AvatarInitials } from "@/components/portal/avatar-initials";
import { REVENDEDORAS } from "@/features/lci/_mock/red";

const STEPS = ["Revendedora", "Productos", "Confirmar"];
const PRODS = [
  { id: "p1", n: "Bowl Creativa 3L", price: 8900 },
  { id: "p2", n: "Organizador Modular", price: 15200 },
  { id: "p3", n: "Crema hidratante 200ml", price: 9450 },
];
const fmt = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export function LciPedidoWoeView() {
  const [step, setStep] = useState(0);
  const [rev, setRev] = useState<string | null>(null);
  const [qty, setQty] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);

  const revName = REVENDEDORAS.find((r) => r.id === rev)?.name ?? "";
  const units = Object.values(qty).reduce((a, b) => a + b, 0);
  const total = PRODS.reduce((a, p) => a + (qty[p.id] ?? 0) * p.price, 0);
  const setQ = (id: string, d: number) => setQty((q) => ({ ...q, [id]: Math.max(0, (q[id] ?? 0) + d) }));

  if (done) {
    return (
      <>
        <MockBadge />
        <DesktopTopBar title="Pedido WOE" initials="LT" />
        <div className="grid place-items-center px-6 py-24 text-center">
          <span className="grid size-16 place-items-center rounded-full" style={{ background: "var(--aw-success-light)", color: "#236A40" }}><CheckCircle2 size={32} /></span>
          <div className="mt-4 text-[18px] font-bold text-foreground">Pedido WOE cargado</div>
          <p className="mt-1.5 text-[13px] text-muted-foreground">{units} unidades para {revName} · ${fmt(total)}</p>
          <button type="button" onClick={() => { setStep(0); setRev(null); setQty({}); setDone(false); }} className="mt-5 rounded-lg px-4 py-2.5 text-[13px] font-bold text-white" style={{ background: "var(--aw-violet)" }}>Cargar otro pedido</button>
        </div>
      </>
    );
  }

  return (
    <>
      <MockBadge />
      <DesktopTopBar title="Pedido WOE" initials="LT" />

      <div className="px-5 pt-5 md:px-6">
        <div className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--aw-violet)" }}>Pedido en nombre de tu red</div>
        <h2 className="mt-1 text-[22px] font-extrabold tracking-[-0.02em] text-foreground">Cargar pedido WOE</h2>
      </div>

      {/* stepper */}
      <div className="mx-5 mt-4 flex items-center rounded-2xl bg-card px-5 py-4 md:mx-6" style={{ border: "0.5px solid var(--aw-hairline)" }}>
        {STEPS.map((s, i) => (
          <div key={s} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-2.5">
              <span className="grid size-7 flex-none place-items-center rounded-full text-[12px] font-bold" style={{ background: i < step ? "var(--aw-success)" : i === step ? "var(--aw-violet)" : "var(--aw-chalk)", color: i <= step ? "#fff" : "var(--fg-subtle)" }}>{i < step ? <Check size={14} strokeWidth={3} /> : i + 1}</span>
              <span className="text-[13px] font-bold" style={{ color: i === step ? "var(--aw-violet-deep)" : i < step ? "var(--foreground)" : "var(--fg-subtle)" }}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className="mx-3 h-px flex-1" style={{ background: i < step ? "var(--aw-success)" : "var(--aw-hairline)" }} />}
          </div>
        ))}
      </div>

      {/* step content */}
      <div className="px-5 pb-6 pt-4 md:px-6">
        <div className="rounded-2xl bg-card p-5" style={{ border: "0.5px solid var(--aw-hairline)" }}>
          {step === 0 && (
            <>
              <div className="text-[10.5px] font-bold uppercase tracking-[0.06em] text-muted-foreground">Paso 1</div>
              <div className="text-[16px] font-bold text-foreground">¿Para quién es el pedido?</div>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {REVENDEDORAS.map((r) => {
                  const locked = r.tone === "danger";
                  const sel = rev === r.id;
                  return (
                    <button key={r.id} type="button" disabled={locked} onClick={() => setRev(r.id)} className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-left transition-colors disabled:opacity-55" style={{ border: `1.5px solid ${sel ? "var(--aw-violet)" : "var(--aw-hairline)"}`, background: sel ? "var(--aw-violet-light)" : "transparent" }}>
                      <AvatarInitials name={r.name} size={36} />
                      <div className="min-w-0 flex-1"><div className="text-[13px] font-bold text-foreground">{r.name}</div><div className="text-[11px]" style={{ color: locked ? "var(--aw-danger)" : "var(--aw-success)" }}>{locked ? "Deuda N-2" : "Habilitada"}</div></div>
                      {locked && <Lock size={15} className="flex-none text-muted-foreground" />}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="text-[10.5px] font-bold uppercase tracking-[0.06em] text-muted-foreground">Paso 2</div>
              <div className="text-[16px] font-bold text-foreground">Agregá productos</div>
              <div className="mt-4 flex flex-col gap-2.5">
                {PRODS.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 rounded-xl px-3.5 py-3" style={{ border: "1px solid var(--aw-hairline)" }}>
                    <span className="grid size-10 flex-none place-items-center rounded-lg" style={{ background: "var(--aw-violet-light)", color: "var(--aw-violet)" }}><Package size={18} /></span>
                    <div className="flex-1"><div className="text-[13.5px] font-semibold text-foreground">{p.n}</div><div className="text-[12px] text-muted-foreground tabular-nums">${fmt(p.price)}</div></div>
                    <div className="flex items-center gap-2.5 rounded-full p-1" style={{ background: "var(--aw-app-bg)" }}>
                      <button type="button" onClick={() => setQ(p.id, -1)} className="grid size-6 place-items-center rounded-full text-foreground" style={{ background: "var(--aw-white)" }}><Minus size={13} /></button>
                      <span className="w-5 text-center text-[13px] font-bold tabular-nums">{qty[p.id] ?? 0}</span>
                      <button type="button" onClick={() => setQ(p.id, 1)} className="grid size-6 place-items-center rounded-full text-white" style={{ background: "var(--aw-violet)" }}><Plus size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="text-[10.5px] font-bold uppercase tracking-[0.06em] text-muted-foreground">Paso 3</div>
              <div className="text-[16px] font-bold text-foreground">Confirmar pedido</div>
              <div className="mt-4 flex flex-col gap-2.5 text-[13.5px]">
                <Row k="Revendedora" v={revName} />
                <Row k="Unidades" v={`${units}`} />
                <Row k="Total" v={`$${fmt(total)}`} strong />
              </div>
            </>
          )}

          {/* nav */}
          <div className="mt-6 flex justify-between">
            <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="inline-flex items-center gap-1.5 rounded-lg bg-card px-4 py-2.5 text-[13px] font-semibold text-foreground transition-colors hover:bg-secondary disabled:opacity-40" style={{ border: "1px solid var(--aw-hairline)" }}><ArrowLeft size={15} /> Atrás</button>
            {step < 2 ? (
              <button type="button" onClick={() => setStep((s) => s + 1)} disabled={(step === 0 && !rev) || (step === 1 && units === 0)} className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-[13px] font-bold text-white transition-opacity disabled:opacity-40" style={{ background: "var(--aw-violet)" }}>Siguiente <ArrowRight size={15} /></button>
            ) : (
              <button type="button" onClick={() => setDone(true)} className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-[13px] font-bold text-white" style={{ background: "var(--aw-violet)" }}><Check size={15} /> Cargar pedido</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className="font-bold tabular-nums text-foreground" style={strong ? { fontSize: 16, color: "var(--aw-violet)" } : undefined}>{v}</span></div>;
}
