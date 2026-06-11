"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, User, Minus, Plus, Info, Trash2 } from "lucide-react";
import { MockBadge } from "@/components/portal/mock-badge";
import { PortalBadge } from "@/components/portal/badge";
import { LucideIcon } from "@/components/portal/lucide-icon";
import { EmpBackHeader } from "@/features/emprendedora/emp-back-header";
import { useEmpStore } from "@/lib/emp-store";
import { PRODUCTS, CAT_ICON, catSoft, catAccent, type Product } from "@/features/emprendedora/_mock/products";

interface CartItem extends Product { q: number; promo: string | null; cli: string | null }

const INIT: CartItem[] = [
  { ...PRODUCTS[0], q: 2, promo: "2x1", cli: "Mariela F." },
  { ...PRODUCTS[2], q: 1, promo: null, cli: "Silvia R." },
  { ...PRODUCTS[1], q: 1, promo: null, cli: null },
];

export function CarritoView() {
  const router = useRouter();
  const notify = useEmpStore((s) => s.notify);
  const [items, setItems] = useState<CartItem[]>(INIT);
  const setQ = (i: number, d: number) => setItems((prev) => prev.map((it, ix) => (ix === i ? { ...it, q: Math.max(1, it.q + d) } : it)));

  return (
    <div className="pb-[150px]">
      <MockBadge />
      <EmpBackHeader title="Tu pedido" sub="Cierre de venta · Campaña 03" back="/emp/catalogo" right={<PortalBadge tone="success" dot>Guardado</PortalBadge>} />

      <div className="flex flex-col gap-2.5 px-4 pt-3.5">
        {items.length === 0 ? (
          <div className="py-16 text-center text-[13px] text-muted-foreground">Tu pedido está vacío.</div>
        ) : (
          items.map((it, i) => (
            <div key={it.id} className="flex items-center gap-3 rounded-2xl p-3" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" }}>
              <span className="grid size-[58px] flex-none place-items-center rounded-xl" style={{ background: catSoft(it.cat), color: catAccent(it.cat) }}><LucideIcon name={CAT_ICON[it.cat]} size={26} strokeWidth={1.4} /></span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <div className="truncate text-[13px] font-bold text-foreground">{it.n}</div>
                  {it.promo && <PortalBadge tone="violet">{it.promo}</PortalBadge>}
                </div>
                <div className="mt-0.5 text-[14px] font-extrabold text-foreground">${it.price}</div>
                <button type="button" onClick={() => notify("Asignar a cliente")} className="emp-press mt-1 flex items-center gap-1 text-[11px] font-semibold" style={{ color: it.cli ? "var(--aw-violet)" : "var(--fg-subtle)" }}>
                  <User size={12} /> {it.cli ?? "Asignar a cliente"}
                </button>
              </div>
              <div className="flex items-center gap-1.5 rounded-full p-1" style={{ background: "var(--aw-app-bg)" }}>
                <button type="button" onClick={() => setQ(i, -1)} aria-label="Menos" className="emp-press grid size-6 place-items-center rounded-full text-foreground" style={{ background: "var(--aw-white)" }}><Minus size={13} /></button>
                <div className="w-4 text-center text-[13px] font-extrabold text-foreground">{it.q}</div>
                <button type="button" onClick={() => setQ(i, 1)} aria-label="Más" className="emp-press grid size-6 place-items-center rounded-full text-white" style={{ background: "var(--aw-violet)" }}><Plus size={13} /></button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* resumen */}
      {items.length > 0 && (
        <div className="px-4 pt-3.5">
          <div className="rounded-2xl p-4" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" }}>
            {[
              { l: "Subtotal Productos", v: "$100.000", col: undefined },
              { l: "Descuentos Emprendedor VIP", v: "−$25.000", col: "var(--aw-success)" },
              { l: "Cargo Administrativo", v: "$0", col: undefined },
            ].map((r) => (
              <div key={r.l} className="mb-2.5 flex justify-between text-[13px]">
                <span className="text-muted-foreground">{r.l}</span>
                <span style={{ color: r.col ?? "var(--foreground)", fontWeight: r.col ? 700 : 600 }}>{r.v}</span>
              </div>
            ))}
            <div className="mt-0.5 flex items-baseline justify-between pt-2.5" style={{ borderTop: "1px solid var(--aw-hairline)" }}>
              <span className="text-[14px] font-bold text-foreground">Total a Pagar</span>
              <span className="text-[22px] font-extrabold tracking-[-0.03em] text-foreground">$ 75.000</span>
            </div>
            <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-muted-foreground"><Info size={13} /> Los descuentos WAO / 2x1 se aplican automáticamente.</div>
          </div>
        </div>
      )}

      {/* sticky bar */}
      <div className="absolute bottom-[62px] left-0 right-0 flex gap-2.5 px-4 pb-3.5 pt-2.5" style={{ background: "linear-gradient(transparent, var(--aw-app-bg) 30%)" }}>
        <button type="button" onClick={() => { setItems([]); notify("Pedido vaciado"); }} className="emp-press flex items-center justify-center gap-1.5 rounded-full px-5 py-3.5 text-[15px] font-bold text-foreground" style={{ background: "var(--aw-white)", border: "1px solid var(--aw-hairline)" }}><Trash2 size={18} /> Vaciar</button>
        <button type="button" onClick={() => { notify("Pedido guardado"); router.push("/emp/seguimiento"); }} className="emp-press flex flex-1 items-center justify-center gap-1.5 rounded-full py-3.5 text-[15px] font-bold text-white" style={{ background: "var(--aw-violet)", boxShadow: "var(--shadow-violet)" }}><Check size={18} /> Guardar pedido</button>
      </div>
    </div>
  );
}
