import Link from "next/link";
import { TrendingUp, Tag, Users, BellRing, ChevronRight } from "lucide-react";
import { MockBadge } from "@/components/portal/mock-badge";
import { EmpBackHeader } from "@/features/emprendedora/emp-back-header";

const CARDS = [
  { t: "Ventas y Metas", s: "Venta real, monto a pagar vs. programas y objetivos de campaña.", Icon: TrendingUp, bg: "var(--cat-bienestar-light)", col: "var(--cat-bienestar)", href: "/emp/incentivos" },
  { t: "Categoría y Zona Outlet", s: "Nivel VIP, estado de cuenta y ofertas outlet.", Icon: Tag, bg: "var(--cat-belleza-light)", col: "var(--cat-belleza)", href: "/emp/programas" },
  { t: "Clientes", s: "Base de clientes, historial de compras e indicaciones.", Icon: Users, bg: "var(--cat-hogar-light)", col: "var(--cat-hogar)", href: "/emp/indicaciones" },
  { t: "Reportes y alertas", s: "Informes de deuda, alerta de pedido mínimo y cargo administrativo.", Icon: BellRing, bg: "var(--cat-deportes-light)", col: "var(--cat-deportes)", href: "/emp/finanzas" },
];

export function NegocioView() {
  return (
    <div className="pb-6">
      <MockBadge />
      <EmpBackHeader title="Mi Negocio" />
      <div className="flex flex-col gap-3 px-4 pt-3.5">
        {CARDS.map((c) => (
          <Link key={c.t} href={c.href} className="emp-press flex items-center gap-3.5 rounded-2xl p-4" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" }}>
            <span className="grid size-12 flex-none place-items-center rounded-xl" style={{ background: c.bg, color: c.col }}><c.Icon size={23} /></span>
            <div className="min-w-0 flex-1"><div className="text-[15px] font-bold text-foreground">{c.t}</div><div className="mt-0.5 text-[12px] leading-snug text-muted-foreground">{c.s}</div></div>
            <ChevronRight size={20} className="text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  );
}
