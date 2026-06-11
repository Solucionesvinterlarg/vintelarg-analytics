"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Flame, ZoomIn, PlayCircle, Video, FileText, Download, Star, ShoppingBasket, BadgeDollarSign, Plus } from "lucide-react";
import { MockBadge } from "@/components/portal/mock-badge";
import { PortalBadge } from "@/components/portal/badge";
import { LucideIcon } from "@/components/portal/lucide-icon";
import { EmpBackHeader } from "@/features/emprendedora/emp-back-header";
import { useEmpStore } from "@/lib/emp-store";
import { PRODUCTS, CAT_ICON, catSoft, catAccent, type Product } from "@/features/emprendedora/_mock/products";

export function ProductoView({ product: p }: { product: Product }) {
  const [thumb, setThumb] = useState(0);
  const [tab, setTab] = useState("Todas");
  const addToCart = useEmpStore((s) => s.addToCart);
  const cartCount = useEmpStore((s) => s.cartCount);

  return (
    <div className="pb-[88px]">
      <MockBadge />
      <EmpBackHeader
        title="Detalle"
        back="/emp/catalogo"
        right={
          <Link href="/emp/carrito" aria-label="Carrito" className="emp-press relative grid size-[38px] place-items-center rounded-xl text-foreground" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)" }}>
            <ShoppingCart size={18} />
            {cartCount > 0 && <span className="absolute -right-1.5 -top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full px-1 text-[10.5px] font-extrabold text-white" style={{ background: "var(--aw-danger)", border: "2px solid var(--aw-app-bg)" }}>{cartCount}</span>}
          </Link>
        }
      />
      <div className="px-4 pt-3">
        <div className="mb-2.5 text-[11.5px] text-muted-foreground">Hogar <span className="opacity-50">›</span> Cocina <span className="opacity-50">›</span> Preparación</div>

        {/* gallery */}
        <div className="relative grid aspect-[4/3] place-items-center rounded-[18px]" style={{ background: catSoft(p.cat), color: catAccent(p.cat) }}>
          <LucideIcon name={CAT_ICON[p.cat]} size={72} strokeWidth={1.2} />
          <span className="absolute left-3 top-3"><PortalBadge tone="violet"><Flame size={12} /> MÁS VENDIDO</PortalBadge></span>
          <span className="absolute bottom-3 right-3 grid size-[34px] place-items-center rounded-full text-foreground" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)" }}><ZoomIn size={17} /></span>
        </div>
        <div className="mt-2.5 flex gap-2">
          {[0, 1, 2, 3].map((i) => (
            <button key={i} type="button" onClick={() => setThumb(i)} className="emp-press grid size-[54px] place-items-center rounded-xl" style={{ background: catSoft(p.cat), color: catAccent(p.cat), border: thumb === i ? "2px solid var(--aw-violet)" : "1px solid var(--aw-hairline)" }}>
              <LucideIcon name={CAT_ICON[p.cat]} size={22} strokeWidth={1.4} />
            </button>
          ))}
        </div>

        {/* title + price */}
        <div className="mt-4">
          <div className="text-[11px] text-muted-foreground">{p.by}</div>
          <div className="mt-0.5 text-[21px] font-extrabold leading-tight tracking-[-0.02em] text-foreground">{p.n}</div>
          <div className="mt-2 flex items-center gap-2.5">
            {p.old && <div className="text-[14px] text-muted-foreground line-through">${p.old}</div>}
            <span className="text-[24px] font-extrabold tracking-[-0.03em] text-foreground">$ {p.price}</span>
            {p.stock <= 5 && <PortalBadge tone="danger">Quedan {p.stock}</PortalBadge>}
          </div>
          <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[14px] font-bold" style={{ background: "var(--aw-success-light)", color: "#236A40" }}>
            <BadgeDollarSign size={17} /> Ganás: $ {p.gain}
          </div>
        </div>

        {/* recetas y tips */}
        <Section title="Recetas y Tips" icon={<PlayCircle size={17} style={{ color: "var(--aw-violet)" }} />}>
          <div className="flex flex-col gap-2">
            {[{ Icon: Video, n: "Demostración de uso", m: "1:30 min · MP4" }, { Icon: FileText, n: "Recetario: Aguas Saborizadas", m: "2.4 MB · PDF" }].map((r) => (
              <div key={r.n} className="emp-press flex items-center gap-3 rounded-2xl p-3" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" }}>
                <span className="grid size-[38px] place-items-center rounded-xl" style={{ background: "var(--aw-violet-light)", color: "var(--aw-violet)" }}><r.Icon size={18} /></span>
                <div className="min-w-0 flex-1"><div className="text-[13px] font-bold text-foreground">{r.n}</div><div className="text-[11px] text-muted-foreground">{r.m}</div></div>
                <Download size={18} style={{ color: "var(--aw-violet)" }} />
              </div>
            ))}
          </div>
        </Section>

        {/* valoraciones */}
        <Section title="Preguntas & Valoraciones" icon={<Star size={17} style={{ color: "var(--aw-violet)" }} />}>
          <div className="rounded-2xl p-4" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" }}>
            <div className="flex items-center gap-3.5">
              <div className="text-center">
                <div className="text-[30px] font-extrabold leading-none tracking-[-0.02em] text-foreground">4.5</div>
                <div className="mt-1 flex gap-0.5" style={{ color: "var(--aw-warning)" }}>{[1, 1, 1, 1, 0].map((s, i) => <Star key={i} size={13} fill={s ? "var(--aw-warning)" : "transparent"} stroke="var(--aw-warning)" />)}</div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">45 opiniones</div>
              </div>
              <div className="flex flex-1 flex-wrap gap-1.5">
                {["Todas", "Positivas", "Con fotos"].map((t) => (
                  <button key={t} type="button" onClick={() => setTab(t)} className="emp-press flex-none rounded-full px-3 py-1.5 text-[12px] font-semibold" style={{ border: `1px solid ${tab === t ? "var(--aw-violet)" : "var(--aw-hairline)"}`, background: tab === t ? "var(--aw-violet)" : "var(--aw-white)", color: tab === t ? "#fff" : "var(--fg-subtle)" }}>{t}</button>
                ))}
              </div>
            </div>
            <div className="mt-3.5 flex flex-col gap-3 pt-3" style={{ borderTop: "1px solid var(--aw-hairline)" }}>
              {[{ n: "Silvia R.", d: "12 Mar 2026", t: "Excelente calidad, mis clientas lo aman. Se vende solo." }, { n: "Nora S.", d: "08 Mar 2026", t: "Muy buen tamaño y resistente. Volví a pedir." }].map((o) => (
                <div key={o.n} className="flex gap-2.5">
                  <span className="grid size-8 flex-none place-items-center rounded-full text-[12px] font-bold" style={{ background: "var(--aw-violet-light)", color: "var(--aw-violet-ink)" }}>{o.n[0]}</span>
                  <div>
                    <div className="flex items-baseline gap-1.5"><span className="text-[12.5px] font-bold text-foreground">{o.n}</span><span className="text-[10.5px] text-muted-foreground">{o.d}</span></div>
                    <div className="text-[12px] leading-snug text-muted-foreground">{o.t}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* cross-sell */}
        <Section title="También compraron" icon={<ShoppingBasket size={17} style={{ color: "var(--aw-violet)" }} />}>
          <div className="no-scrollbar flex gap-2.5 overflow-x-auto">
            {PRODUCTS.filter((x) => x.id !== p.id).slice(0, 4).map((x) => (
              <Link key={x.id} href={`/emp/producto/${x.id}`} className="emp-press w-[120px] flex-none overflow-hidden rounded-2xl" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" }}>
                <div className="grid aspect-square place-items-center" style={{ background: catSoft(x.cat), color: catAccent(x.cat) }}><LucideIcon name={CAT_ICON[x.cat]} size={28} strokeWidth={1.4} /></div>
                <div className="p-2.5"><div className="h-7 overflow-hidden text-[11.5px] font-bold leading-tight text-foreground">{x.n}</div><div className="mt-0.5 text-[12px] font-extrabold text-foreground">${x.price}</div></div>
              </Link>
            ))}
          </div>
        </Section>
      </div>

      {/* sticky add */}
      <div className="absolute bottom-[62px] left-0 right-0 px-4 py-3" style={{ background: "linear-gradient(transparent, var(--aw-app-bg) 40%)" }}>
        <button type="button" onClick={() => addToCart(p.n)} className="emp-press flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-bold text-white" style={{ background: "var(--aw-violet)", boxShadow: "var(--shadow-violet)" }}>
          <Plus size={19} /> Agregar al pedido · ${p.price}
        </button>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mt-[18px]">
      <div className="mb-3 flex items-center gap-1.5 text-[15.5px] font-bold tracking-[-0.01em] text-foreground">{icon}{title}</div>
      {children}
    </div>
  );
}
