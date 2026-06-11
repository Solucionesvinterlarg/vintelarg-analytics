"use client";

import { useState } from "react";
import Link from "next/link";
import { RefreshCw, Lock, Info, CheckCircle2, ShoppingBag, Receipt, Plus, Users, PackageCheck, Flag } from "lucide-react";
import { MockBadge } from "@/components/portal/mock-badge";
import { PortalBadge } from "@/components/portal/badge";
import { EmpHeader } from "@/features/emprendedora/emp-header";

/**
 * Inicio "Mi Negocio Hoy" — recurso único (MOCK, Lote 2). La REGLA DE NEGOCIO:
 * la ganancia está oculta ("Te faltan $X") con candado hasta alcanzar el pedido
 * mínimo. El pill "demo" alterna ambos estados (en real lo maneja el estado de
 * pedido). La vista no mira el rol.
 */
export function InicioView() {
  const [reached, setReached] = useState(false);

  return (
    <>
      <MockBadge />
      <EmpHeader greeting="Buenas tardes," name="María Antonieta" sub="Campaña 03 · Marzo 2026" quote="¡Tu esfuerzo de hoy es tu éxito de mañana!" />

      {/* Hero — ganancia (spotlight inverso) */}
      <div className="px-5">
        <div className="relative overflow-hidden rounded-[20px] px-5 pb-[18px] pt-5" style={{ background: "var(--foreground)", color: "var(--aw-app-bg)" }}>
          <div className="absolute -right-8 -top-8 size-[150px]" style={{ background: "var(--aw-violet)", opacity: 0.85, clipPath: "polygon(100% 0, 100% 100%, 0 0)" }} />
          <div className="relative">
            <div className="flex items-start justify-between">
              <div className="text-[12.5px] font-semibold opacity-75">{reached ? "Llevás ganado hoy" : "Tu ganancia de hoy"}</div>
              <button type="button" onClick={() => setReached((v) => !v)} className="emp-press inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-bold" style={{ background: "rgba(255,255,255,.14)" }}>
                <RefreshCw size={11} /> demo
              </button>
            </div>
            {reached ? (
              <div className="mt-1.5">
                <span className="text-[34px] font-extrabold tracking-[-0.03em]">$ 45.250</span>
                <div className="mt-1 flex items-center gap-1.5 text-[11.5px] opacity-70"><Info size={12} /> Tocá para ver el detalle por negocio</div>
              </div>
            ) : (
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <Lock size={18} style={{ color: "var(--aw-warning)" }} />
                  <div className="text-[16px] font-bold">Te faltan <span style={{ color: "var(--aw-warning)" }}>$ 450</span></div>
                </div>
                <div className="mt-1.5 text-[12.5px] leading-snug opacity-75">Alcanzá el pedido mínimo para empezar a ver tu ganancia.</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* mini chips */}
      <div className="grid grid-cols-2 gap-2.5 px-5 pt-3">
        {[
          { l: "Pedido Mínimo", v: reached ? "Alcanzado" : "Te faltan $ 450", Icon: ShoppingBag },
          { l: "Cargo Administrativo", v: reached ? "Cubierto" : "Te faltan $ 200", Icon: Receipt },
        ].map((c) => (
          <div key={c.l} className="flex items-center gap-2.5 rounded-2xl p-[11px]" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" }}>
            {reached ? <CheckCircle2 size={18} style={{ color: "var(--aw-success)" }} /> : <c.Icon size={18} style={{ color: "var(--aw-warning)" }} />}
            <div className="min-w-0">
              <div className="text-[10.5px] font-semibold text-muted-foreground">{c.l}</div>
              <div className="whitespace-nowrap text-[12.5px] font-bold text-foreground">{c.v}</div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="px-5 pb-1 pt-4">
        <Link href="/emp/catalogo" className="emp-press flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-bold tracking-[0.02em] text-white" style={{ background: "var(--aw-violet)", boxShadow: "var(--shadow-violet)" }}>
          <Plus size={19} /> CARGAR NUEVO PEDIDO
        </Link>
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-2 gap-2.5 px-5 pt-3">
        {[
          { n: "8", l: "Clientes activos", Icon: Users, href: "/emp/indicaciones", bg: "var(--cat-bienestar-light)", col: "var(--cat-bienestar)" },
          { n: "47", l: "Productos vendidos", Icon: PackageCheck, href: "/emp/negocio", bg: "var(--cat-belleza-light)", col: "var(--cat-belleza)" },
        ].map((s) => (
          <Link key={s.l} href={s.href} className="emp-press flex flex-col gap-2 rounded-2xl p-[15px]" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" }}>
            <span className="grid size-[38px] place-items-center rounded-xl" style={{ background: s.bg, color: s.col }}><s.Icon size={18} /></span>
            <div>
              <div className="text-[24px] font-extrabold tracking-[-0.03em] text-foreground">{s.n}</div>
              <div className="text-[12px] font-semibold text-muted-foreground">{s.l}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* desafío personal */}
      <div className="px-5 pb-6 pt-3.5">
        <div className="rounded-2xl p-4" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" }}>
          <div className="mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-xl" style={{ background: "var(--aw-violet-light)", color: "var(--aw-violet)" }}><Flag size={16} /></span>
              <div>
                <div className="text-[13.5px] font-bold text-foreground">Desafío Personal</div>
                <div className="text-[11.5px] text-muted-foreground">Meta fijada al inicio de campaña</div>
              </div>
            </div>
            <PortalBadge tone="violet">36/50</PortalBadge>
          </div>
          <div className="mb-2 text-[13px] font-semibold text-foreground">Vender 50 unidades</div>
          <div className="h-2 overflow-hidden rounded-full" style={{ background: "var(--aw-violet-light)" }}>
            <div className="h-full rounded-full" style={{ width: "72%", background: "var(--aw-violet)" }} />
          </div>
          <div className="mt-1.5 text-[11.5px] text-muted-foreground">Te faltan <b className="text-foreground">14 unidades</b> para cumplir tu meta.</div>
        </div>
      </div>
    </>
  );
}
