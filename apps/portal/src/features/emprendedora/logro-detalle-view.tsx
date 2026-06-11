"use client";

import { Gift, ListChecks, Percent, Crown, Check, Share2 } from "lucide-react";
import { MockBadge } from "@/components/portal/mock-badge";
import { LucideIcon } from "@/components/portal/lucide-icon";
import { EmpBackHeader } from "@/features/emprendedora/emp-back-header";
import { useEmpStore } from "@/lib/emp-store";
import { toneTile, type Medal } from "@/features/emprendedora/_mock/logros";

export function LogroDetalleView({ medal: m }: { medal: Medal }) {
  const notify = useEmpStore((s) => s.notify);
  const t = toneTile(m.tone);
  return (
    <div className="pb-6">
      <MockBadge />
      <EmpBackHeader title="Detalle de Logro" back="/emp/logros" />

      <div className="px-4 pt-5 text-center">
        <span className="mx-auto grid size-[88px] place-items-center rounded-full" style={{ background: t.bg, color: t.fg, animation: "emp-pop .5s var(--ease-spring)" }}><LucideIcon name={m.ic} size={42} strokeWidth={2} /></span>
        <div className="mt-3.5 text-[20px] font-extrabold tracking-[-0.02em] text-foreground">{m.n}</div>
        <div className="mt-1 text-[12.5px] text-muted-foreground">Conseguido en Campaña 03 · Marzo 2026</div>
      </div>

      <div className="px-4 pt-[18px]">
        <Head icon={<Gift size={17} style={{ color: "var(--aw-violet)" }} />}>Recompensas</Head>
        <div className="flex flex-col gap-2.5">
          {[{ Icon: Percent, l: "Comisión extra +2%", s: "Sobre todas tus ventas de la campaña" }, { Icon: Crown, l: "Acceso Zona VIP", s: "Outlet exclusivo y precios preferenciales" }].map((r) => (
            <div key={r.l} className="flex items-center gap-3 rounded-2xl p-3.5" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" }}>
              <span className="grid size-[38px] flex-none place-items-center rounded-xl" style={{ background: "var(--aw-violet-light)", color: "var(--aw-violet)" }}><r.Icon size={18} /></span>
              <div><div className="text-[13.5px] font-bold text-foreground">{r.l}</div><div className="text-[11.5px] text-muted-foreground">{r.s}</div></div>
            </div>
          ))}
        </div>

        <Head icon={<ListChecks size={17} style={{ color: "var(--aw-violet)" }} />}>Requisitos cumplidos</Head>
        <div className="rounded-2xl p-4" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" }}>
          {["Vender 50 unidades en la campaña", "Mantener 3 pedidos consecutivos", "Alcanzar pedido mínimo"].map((r) => (
            <div key={r} className="flex items-center gap-2.5 py-2">
              <span className="grid size-[22px] flex-none place-items-center rounded-full" style={{ background: "var(--aw-success-light)", color: "#236A40" }}><Check size={14} strokeWidth={3} /></span>
              <span className="text-[13px] font-medium text-foreground">{r}</span>
            </div>
          ))}
        </div>

        <button type="button" onClick={() => notify("Compartiendo logro…")} className="emp-press mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-bold text-white" style={{ background: "var(--aw-violet)", boxShadow: "var(--shadow-violet)" }}><Share2 size={18} /> Compartir Logro</button>
      </div>
    </div>
  );
}

function Head({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return <div className="mb-3 mt-[18px] flex items-center gap-1.5 text-[15.5px] font-bold tracking-[-0.01em] text-foreground">{icon}{children}</div>;
}
