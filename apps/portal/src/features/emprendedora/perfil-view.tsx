"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Crown, Mail, Phone, MapPin, Pencil, Sun, Moon, Bell, LogOut } from "lucide-react";
import { MockBadge } from "@/components/portal/mock-badge";
import { PortalBadge } from "@/components/portal/badge";
import { EmpBackHeader } from "@/features/emprendedora/emp-back-header";
import { useEmpStore } from "@/lib/emp-store";

const DATOS = [
  { l: "Email", v: "maria.a@email.com", Icon: Mail },
  { l: "Teléfono", v: "+54 9 11 5555-2048", Icon: Phone },
  { l: "Zona", v: "Zona Norte · Campaña 03", Icon: MapPin },
];

export function PerfilView() {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  const notify = useEmpStore((s) => s.notify);

  return (
    <div className="pb-6">
      <MockBadge />
      <EmpBackHeader title="Perfil" />
      <div className="px-4 pt-4">
        {/* identity */}
        <div className="text-center">
          <span className="mx-auto grid size-[76px] place-items-center rounded-full text-[26px] font-bold text-white" style={{ background: "var(--aw-violet)", boxShadow: "0 0 0 3px var(--aw-white), 0 0 0 5px var(--aw-violet)" }}>MA</span>
          <div className="mt-3 text-[19px] font-extrabold tracking-[-0.02em] text-foreground">María Antonieta</div>
          <div className="mt-1.5 flex justify-center gap-1.5"><PortalBadge tone="violet"><Crown size={12} /> VIP · Senior</PortalBadge><PortalBadge tone="neutral">Puesto 5</PortalBadge></div>
        </div>

        {/* datos */}
        <div className="mb-3 mt-[18px] text-[15.5px] font-bold tracking-[-0.01em] text-foreground">Mis datos</div>
        <div className="rounded-2xl" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" }}>
          {DATOS.map((r, i) => (
            <div key={r.l} className="flex items-center gap-3 px-3.5 py-3.5" style={{ borderBottom: i < DATOS.length - 1 ? "1px solid var(--aw-hairline)" : "none" }}>
              <r.Icon size={18} className="text-muted-foreground" />
              <div className="flex-1"><div className="text-[11px] text-muted-foreground">{r.l}</div><div className="text-[13.5px] font-semibold text-foreground">{r.v}</div></div>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => notify("Editar datos")} className="emp-press mt-3 flex w-full items-center justify-center gap-2 rounded-full py-3 text-[14px] font-bold text-foreground" style={{ background: "var(--aw-white)", border: "1px solid var(--aw-hairline)" }}><Pencil size={17} /> Editar datos</button>

        {/* preferencias */}
        <div className="mb-3 mt-[18px] text-[15.5px] font-bold tracking-[-0.01em] text-foreground">Preferencias</div>
        <div className="rounded-2xl" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" }}>
          <div className="flex items-center gap-3 px-3.5 py-3">
            {dark ? <Moon size={19} style={{ color: "var(--aw-violet)" }} /> : <Sun size={19} style={{ color: "var(--aw-violet)" }} />}
            <div className="flex-1 text-[13.5px] font-semibold text-foreground">Modo {dark ? "oscuro" : "claro"}</div>
            <button type="button" onClick={() => setTheme(dark ? "light" : "dark")} aria-label="Cambiar tema" className="emp-press relative h-7 w-12 rounded-full" style={{ background: dark ? "var(--aw-violet)" : "var(--aw-hairline)" }}><span className="absolute top-[3px] size-[22px] rounded-full bg-white transition-all" style={{ left: dark ? 23 : 3 }} /></button>
          </div>
          <div className="flex items-center gap-3 px-3.5 py-3" style={{ borderTop: "1px solid var(--aw-hairline)" }}>
            <Bell size={19} className="text-muted-foreground" />
            <div className="flex-1 text-[13.5px] font-semibold text-foreground">Notificaciones push</div>
            <span className="relative h-7 w-12 rounded-full" style={{ background: "var(--aw-violet)" }}><span className="absolute left-[23px] top-[3px] size-[22px] rounded-full bg-white" /></span>
          </div>
        </div>

        <Link href="/api/auth/logout" className="emp-press mt-[18px] flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-bold" style={{ border: "1.5px solid var(--aw-danger)", color: "var(--aw-danger)" }}><LogOut size={18} /> Cerrar sesión</Link>
      </div>
    </div>
  );
}
