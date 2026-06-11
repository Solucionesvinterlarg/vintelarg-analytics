"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, ShoppingCart, Search, Camera, Sparkles, Plus } from "lucide-react";
import { MockBadge } from "@/components/portal/mock-badge";
import { PortalBadge } from "@/components/portal/badge";
import { LucideIcon } from "@/components/portal/lucide-icon";
import { useEmpStore } from "@/lib/emp-store";
import { PRODUCTS, QUICK_FILTERS, CAT_ICON, catSoft, catAccent, type Product } from "@/features/emprendedora/_mock/products";

export function CatalogoView() {
  const [filter, setFilter] = useState("WAO");
  const setDrawer = useEmpStore((s) => s.setDrawer);
  const cartCount = useEmpStore((s) => s.cartCount);

  return (
    <>
      <MockBadge />
      {/* sticky header */}
      <div className="sticky top-0 z-[6] px-4 pb-2.5 pt-3" style={{ background: "var(--aw-app-bg)" }}>
        <div className="mb-3 flex items-center gap-2.5">
          <button type="button" onClick={() => setDrawer(true)} aria-label="Menú" className="emp-press grid size-[38px] flex-none place-items-center rounded-xl text-foreground" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)" }}>
            <Menu size={20} />
          </button>
          <div className="flex-1 text-[18px] font-extrabold tracking-[-0.02em] text-foreground">Carga tu Pedido</div>
          <Link href="/emp/carrito" aria-label="Carrito" className="emp-press relative grid size-[38px] flex-none place-items-center rounded-xl text-white" style={{ background: "var(--aw-violet)" }}>
            <ShoppingCart size={19} />
            {cartCount > 0 && <span className="absolute -right-1.5 -top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full px-1 text-[10.5px] font-extrabold text-white" style={{ background: "var(--aw-danger)", border: "2px solid var(--aw-app-bg)" }}>{cartCount}</span>}
          </Link>
        </div>
        <div className="flex items-center gap-2.5 rounded-xl px-3.5 py-3" style={{ background: "var(--aw-white)", border: "1px solid var(--aw-hairline)" }}>
          <Search size={18} className="text-muted-foreground" />
          <input placeholder="Buscar por productos, códigos, foto…" className="min-w-0 flex-1 border-0 bg-transparent text-[14.5px] outline-none placeholder:text-muted-foreground" />
          <Camera size={18} style={{ color: "var(--aw-violet)" }} />
        </div>
        <div className="no-scrollbar mt-2.5 flex gap-1.5 overflow-x-auto">
          {QUICK_FILTERS.map((q) => {
            const on = filter === q;
            return (
              <button key={q} type="button" onClick={() => setFilter(q)} className="emp-press flex-none rounded-full px-3.5 py-2 text-[12.5px] font-semibold" style={{ border: `1px solid ${on ? "var(--aw-violet)" : "var(--aw-hairline)"}`, background: on ? "var(--aw-violet)" : "var(--aw-white)", color: on ? "#fff" : "var(--fg-subtle)" }}>{q}</button>
            );
          })}
        </div>
      </div>

      {/* smart suggestion */}
      <div className="px-4 pt-3">
        <div className="flex items-center gap-3 rounded-2xl p-3.5" style={{ background: "var(--aw-violet-light)", border: "1px solid var(--aw-violet-light)" }}>
          <span className="grid size-10 flex-none place-items-center rounded-xl text-white" style={{ background: "var(--aw-violet)" }}><Sparkles size={20} /></span>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-bold text-foreground">Sugerencia Smart</div>
            <div className="text-[11.5px] leading-snug text-muted-foreground">Armá el combo Cocina + Bowl y <b style={{ color: "var(--aw-violet-deep)" }}>ganás $2.500 extra</b>.</div>
          </div>
          <button type="button" className="emp-press flex-none rounded-full px-3.5 py-1.5 text-[13px] font-bold text-white" style={{ background: "var(--aw-violet)" }}>Ver</button>
        </div>
      </div>

      {/* grid */}
      <div className="grid grid-cols-2 gap-3 px-4 pb-6 pt-3">
        {PRODUCTS.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
    </>
  );
}

function ProductCard({ p }: { p: Product }) {
  const addToCart = useEmpStore((s) => s.addToCart);
  return (
    <Link href={`/emp/producto/${p.id}`} className="emp-press flex flex-col overflow-hidden rounded-2xl" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" }}>
      <div className="relative grid aspect-square place-items-center" style={{ background: catSoft(p.cat), color: catAccent(p.cat) }}>
        <LucideIcon name={CAT_ICON[p.cat]} size={36} strokeWidth={1.4} />
        {p.tag && <span className="absolute left-2 top-2"><PortalBadge tone={p.tag === "Outlet" ? "warn" : "violet"}>{p.tag}</PortalBadge></span>}
        {p.stock <= 5 && <span className="absolute right-2 top-2"><PortalBadge tone="danger">Quedan {p.stock}</PortalBadge></span>}
      </div>
      <div className="flex flex-1 flex-col p-3 pt-2.5">
        <div className="min-h-[33px] text-[13px] font-bold leading-tight text-foreground">{p.n}</div>
        <div className="mt-0.5 text-[10px] text-muted-foreground">{p.by}</div>
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <div className="text-[15px] font-extrabold text-foreground">${p.price}</div>
          {p.old && <div className="text-[11px] text-muted-foreground line-through">${p.old}</div>}
        </div>
        <div className="mt-0.5 text-[11.5px] font-bold" style={{ color: "var(--aw-success)" }}>Ganás: ${p.gain}</div>
        <button type="button" onClick={(e) => { e.preventDefault(); addToCart(p.n); }} className="emp-press mt-2 flex items-center justify-center gap-1.5 rounded-full py-2 text-[12.5px] font-bold text-white" style={{ background: "var(--aw-violet)" }}>
          <Plus size={15} /> Agregar
        </button>
      </div>
    </Link>
  );
}
