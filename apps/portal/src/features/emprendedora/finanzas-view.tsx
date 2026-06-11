"use client";

import { CalendarClock, Zap, ChevronRight, PieChart, ArrowDownLeft, SlidersHorizontal, FileMinus, Gift, Download, FileText, Ticket } from "lucide-react";
import { MockBadge } from "@/components/portal/mock-badge";
import { EmpBackHeader } from "@/features/emprendedora/emp-back-header";
import { useEmpStore } from "@/lib/emp-store";

export function FinanzasView() {
  const notify = useEmpStore((s) => s.notify);
  return (
    <div className="pb-6">
      <MockBadge />
      <EmpBackHeader title="Mis Finanzas" />
      <div className="px-4 pt-3.5">
        {/* saldo hero */}
        <div className="relative overflow-hidden rounded-[20px] p-5" style={{ background: "var(--foreground)", color: "var(--aw-app-bg)" }}>
          <div className="absolute -right-8 -top-8 size-[140px]" style={{ background: "var(--aw-violet)", opacity: 0.85, clipPath: "polygon(100% 0,100% 100%,0 0)" }} />
          <div className="relative">
            <div className="text-[12px] font-semibold opacity-75">Saldo a abonar · Campaña 5/2026</div>
            <div className="text-[34px] font-extrabold tracking-[-0.03em]">$ 152.400</div>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px]" style={{ background: "rgba(255,255,255,.12)" }}>
              <CalendarClock size={14} style={{ color: "var(--aw-warning)" }} /> Vencimiento: 15/04/2026
            </div>
          </div>
        </div>

        {/* pago fácil */}
        <button type="button" onClick={() => notify("Abriendo Pago Fácil…")} className="emp-press mt-3 flex w-full items-center gap-3 rounded-2xl p-4 text-white" style={{ background: "var(--aw-violet)" }}>
          <span className="grid size-10 flex-none place-items-center rounded-xl" style={{ background: "rgba(255,255,255,.16)" }}><Zap size={21} /></span>
          <span className="flex-1 text-left"><span className="block text-[14.5px] font-bold">Pago Fácil</span><span className="block text-[11.5px] opacity-85">Pagá tu factura al instante · adelantos y pagos parciales</span></span>
          <ChevronRight size={20} />
        </button>

        {/* detalle de ganancias */}
        <Head icon={<PieChart size={17} style={{ color: "var(--aw-violet)" }} />}>Detalle de Ganancias</Head>
        <div className="rounded-2xl p-4" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" }}>
          {[{ l: "Ganancia por venta directa", v: "+$38.400" }, { l: "Comisión VIP (+2%)", v: "+$4.850" }, { l: "Premio por incentivo", v: "+$2.000" }].map((r) => (
            <div key={r.l} className="mb-2.5 flex justify-between text-[13px]"><span className="text-muted-foreground">{r.l}</span><span className="font-bold" style={{ color: "var(--aw-success)" }}>{r.v}</span></div>
          ))}
          <div className="flex justify-between pt-2.5" style={{ borderTop: "1px solid var(--aw-hairline)" }}><span className="text-[13.5px] font-bold text-foreground">Total ganado</span><span className="text-[15px] font-extrabold text-foreground">$45.250</span></div>
        </div>

        {/* movimientos */}
        <Head>Últimos Movimientos</Head>
        <div className="flex flex-col gap-2">
          {[
            { n: "Pago recibido · Pago Fácil", d: "18 Mar 2026", v: "+$30.000", col: "var(--aw-success)", Icon: ArrowDownLeft },
            { n: "Ajuste Cta. Cte.", d: "15 Mar 2026", v: "−$1.200", col: "var(--aw-danger)", Icon: SlidersHorizontal },
            { n: "Nota de crédito #NC-882", d: "11 Mar 2026", v: "+$4.300", col: "var(--aw-success)", Icon: FileMinus },
          ].map((m) => (
            <div key={m.n} className="flex items-center gap-3 rounded-2xl p-3" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" }}>
              <span className="grid size-[38px] flex-none place-items-center rounded-xl" style={{ background: "var(--aw-app-bg)", color: "var(--fg-subtle)" }}><m.Icon size={18} /></span>
              <div className="min-w-0 flex-1"><div className="text-[13px] font-bold text-foreground">{m.n}</div><div className="text-[11px] text-muted-foreground">{m.d}</div></div>
              <div className="text-[14px] font-extrabold" style={{ color: m.col }}>{m.v}</div>
            </div>
          ))}
        </div>

        {/* accesos */}
        <div className="mt-[18px] grid grid-cols-2 gap-2.5">
          {[{ l: "Mis Beneficios", Icon: Gift, s: "Histórico + premios" }, { l: "Descargar boleta", Icon: Download, s: "PDF de factura" }, { l: "Detalle NC / ND", Icon: FileText, s: "Notas de crédito" }, { l: "Aplicar Cupón", Icon: Ticket, s: "Cargá tu código" }].map((a) => (
            <button key={a.l} type="button" onClick={() => notify(a.l)} className="emp-press flex flex-col gap-2 rounded-2xl p-3.5 text-left" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" }}>
              <span className="grid size-[38px] place-items-center rounded-xl" style={{ background: "var(--aw-violet-light)", color: "var(--aw-violet)" }}><a.Icon size={18} /></span>
              <span><span className="block text-[13px] font-bold text-foreground">{a.l}</span><span className="block text-[11px] text-muted-foreground">{a.s}</span></span>
            </button>
          ))}
        </div>
        <div className="mt-3 text-center text-[11px] text-muted-foreground">Vista de cuenta corriente disponible desde C N-1 hacia atrás.</div>
      </div>
    </div>
  );
}

function Head({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return <div className="mb-3 mt-[18px] flex items-center gap-1.5 text-[15.5px] font-bold tracking-[-0.01em] text-foreground">{icon}{children}</div>;
}
