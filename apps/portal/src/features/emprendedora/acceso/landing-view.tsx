"use client";

import Link from "next/link";
import { Rocket, ShoppingBag, BarChart3, BookOpen, MessageCircle, Megaphone } from "lucide-react";
import { useEmpStore } from "@/lib/emp-store";

const ACTIONS: { l: string; Icon: typeof Rocket; href: string | null; primary?: boolean }[] = [
  { l: "QUIERO EMPRENDER", Icon: Rocket, href: "/acceso/registro", primary: true },
  { l: "QUIERO COMPRAR", Icon: ShoppingBag, href: "/acceso/login" },
  { l: "MI NEGOCIO HOY", Icon: BarChart3, href: "/acceso/login" },
  { l: "FOLLETO ONLINE", Icon: BookOpen, href: "/acceso/login" },
  { l: "CONTACTANOS", Icon: MessageCircle, href: null },
  { l: "NOVEDADES", Icon: Megaphone, href: "/acceso/login" },
];

export function LandingView() {
  const notify = useEmpStore((s) => s.notify);
  return (
    <div className="min-h-full pb-6">
      <div className="flex items-center justify-between px-5 pt-4">
        <span className="text-[15px] font-extrabold tracking-[0.02em] text-foreground">A<span style={{ color: "var(--aw-violet)" }}>·</span>WARE<sup className="text-[8px] opacity-60">®</sup></span>
        <Link href="/acceso/login" className="emp-press rounded-full px-3.5 py-2 text-[12.5px] font-bold" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", color: "var(--aw-violet)" }}>Ingresar</Link>
      </div>

      {/* banner */}
      <div className="mx-5 mt-4">
        <div className="relative overflow-hidden rounded-[20px] p-5 text-white" style={{ background: "var(--aw-violet)" }}>
          <div className="absolute -right-5 -top-5 size-[130px]" style={{ background: "rgba(255,255,255,.12)", clipPath: "polygon(100% 0,100% 100%,0 0)" }} />
          <div className="relative">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] opacity-85">Lanzamiento</div>
            <div className="mt-1 text-[24px] font-extrabold tracking-[-0.02em]">Campaña 04</div>
            <div className="mt-1.5 text-[14px] italic opacity-95" style={{ fontFamily: "var(--font-serif)" }}>Todo lo que buscás, en un solo catálogo.</div>
          </div>
        </div>
      </div>

      {/* quick access */}
      <div className="grid grid-cols-2 gap-3 px-5 pt-[18px]">
        {ACTIONS.map((a) => {
          const inner = (
            <>
              <span className="grid size-[42px] place-items-center rounded-xl" style={{ background: a.primary ? "var(--aw-violet)" : "var(--aw-violet-light)", color: a.primary ? "#fff" : "var(--aw-violet)" }}><a.Icon size={21} /></span>
              <div className="text-[13px] font-extrabold leading-tight tracking-[-0.01em]">{a.l}</div>
            </>
          );
          const cls = "emp-press flex min-h-[118px] flex-col items-start gap-3.5 rounded-[18px] p-[18px] text-left";
          const style = a.primary
            ? { background: "var(--foreground)", color: "var(--aw-app-bg)", boxShadow: "var(--shadow-sm)" }
            : { background: "var(--aw-white)", color: "var(--foreground)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" };
          return a.href
            ? <Link key={a.l} href={a.href} className={cls} style={style}>{inner}</Link>
            : <button key={a.l} type="button" onClick={() => notify(a.l)} className={cls} style={style}>{inner}</button>;
        })}
      </div>
    </div>
  );
}
