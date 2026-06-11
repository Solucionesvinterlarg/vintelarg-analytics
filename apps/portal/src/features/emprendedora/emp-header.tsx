"use client";

import Link from "next/link";
import { Menu, Bell } from "lucide-react";
import { useEmpStore } from "@/lib/emp-store";

/** Header "home" de la app emprendedora: menú (drawer), wordmark, bell, avatar. */
export function EmpHeader({ greeting, name, sub, quote }: { greeting: string; name: string; sub?: string; quote?: string }) {
  const setDrawer = useEmpStore((s) => s.setDrawer);
  return (
    <div className="px-5 pb-4 pt-3">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => setDrawer(true)} aria-label="Menú" className="emp-press grid size-[38px] place-items-center rounded-xl text-foreground" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)" }}>
          <Menu size={20} />
        </button>
        <span className="text-[15px] font-extrabold tracking-[0.02em] text-foreground">
          A<span style={{ color: "var(--aw-violet)" }}>·</span>WARE<sup className="text-[8px] opacity-60">®</sup>
        </span>
        <div className="flex items-center gap-2">
          <Link href="/emp/novedades" aria-label="Novedades" className="emp-press relative grid size-[38px] place-items-center rounded-xl text-foreground" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)" }}>
            <Bell size={19} />
            <span className="absolute right-2.5 top-2 size-2 rounded-full" style={{ background: "var(--aw-danger)", border: "2px solid var(--aw-white)" }} />
          </Link>
          <Link href="/emp/perfil" aria-label="Mi perfil" className="emp-press grid size-[38px] place-items-center rounded-full text-[13px] font-bold text-white" style={{ background: "var(--aw-violet)" }}>MA</Link>
        </div>
      </div>
      <div className="mt-4">
        <div className="text-[13px] font-medium text-muted-foreground">{greeting}</div>
        <div className="text-[22px] font-extrabold leading-tight tracking-[-0.02em] text-foreground">{name}</div>
        {sub && <div className="mt-0.5 text-[12px] font-semibold text-muted-foreground">{sub}</div>}
      </div>
      {quote && <div className="mt-3 text-[14.5px] italic leading-snug" style={{ fontFamily: "var(--font-serif)", color: "var(--aw-violet-deep)" }}>{quote}</div>}
    </div>
  );
}
