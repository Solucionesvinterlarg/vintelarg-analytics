"use client";

import Link from "next/link";
import { Award, Target, Users, Ticket, CreditCard, Gift } from "lucide-react";
import { MockBadge } from "@/components/portal/mock-badge";
import { EmpBackHeader } from "@/features/emprendedora/emp-back-header";
import { useEmpStore } from "@/lib/emp-store";

const ITEMS = [
  { t: "Círculo VIP", s: "Puntos acumulados + estatus", Icon: Award, href: "/emp/logros" },
  { t: "Incentivos en Curso", s: "Unidades alcanzadas / faltantes", Icon: Target, href: "/emp/incentivos" },
  { t: "Indicaciones", s: "Rastreo en cualquier zona", Icon: Users, href: "/emp/indicaciones" },
  { t: "Cupones Activos", s: "3 cupones disponibles", Icon: Ticket, href: null },
  { t: "Gift Cards", s: "Canjeá puntos por tarjetas", Icon: CreditCard, href: null },
  { t: "Catálogo de Premios", s: "Elegí tu recompensa", Icon: Gift, href: null },
];

export function ProgramasView() {
  const notify = useEmpStore((s) => s.notify);
  return (
    <div className="pb-6">
      <MockBadge />
      <EmpBackHeader title="Programas & Beneficios" />
      <div className="grid grid-cols-2 gap-2.5 px-4 pt-3.5">
        {ITEMS.map((it) => {
          const inner = (
            <>
              <span className="grid size-[42px] place-items-center rounded-xl" style={{ background: "var(--aw-violet-light)", color: "var(--aw-violet)" }}><it.Icon size={20} /></span>
              <div className="mt-auto"><div className="text-[13.5px] font-bold leading-tight text-foreground">{it.t}</div><div className="mt-0.5 text-[11px] text-muted-foreground">{it.s}</div></div>
            </>
          );
          const cls = "emp-press flex min-h-[118px] flex-col gap-2 rounded-2xl p-3.5 text-left";
          const style = { background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" } as const;
          return it.href
            ? <Link key={it.t} href={it.href} className={cls} style={style}>{inner}</Link>
            : <button key={it.t} type="button" onClick={() => notify(it.t)} className={cls} style={style}>{inner}</button>;
        })}
      </div>
    </div>
  );
}
