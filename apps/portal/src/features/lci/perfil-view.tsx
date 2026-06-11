"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Pencil, Sun, Moon, Bell, Shield, Globe, ChevronRight, LogOut } from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { MockBadge } from "@/components/portal/mock-badge";
import { PortalBadge } from "@/components/portal/badge";
import { AvatarInitials } from "@/components/portal/avatar-initials";

const PREFS = [
  { Icon: Bell, t: "Notificaciones y alertas", s: "Canales push / email por tipo" },
  { Icon: Shield, t: "Seguridad", s: "Contraseña y acceso" },
  { Icon: Globe, t: "Idioma", s: "Español (Argentina)" },
];

export function LciPerfilView() {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  return (
    <>
      <MockBadge />
      <DesktopTopBar title="Mi perfil" initials="LT" />

      <div className="px-5 pt-5 md:px-6">
        <div className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--aw-violet)" }}>Cuenta</div>
        <h2 className="mt-1 text-[22px] font-extrabold tracking-[-0.02em] text-foreground">Mi perfil</h2>
      </div>

      <div className="mx-auto max-w-[760px] px-5 pb-6 pt-4 md:px-6">
        {/* identidad */}
        <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-card p-5" style={{ border: "0.5px solid var(--aw-hairline)" }}>
          <AvatarInitials name="Laura Torres" size={56} />
          <div className="flex-1">
            <div className="text-[19px] font-extrabold tracking-[-0.02em] text-foreground">Laura Torres</div>
            <div className="text-[12.5px] text-muted-foreground">Líder Comercial · LCI-0427</div>
            <div className="mt-2 flex flex-wrap gap-1.5"><PortalBadge tone="violet">Zona 4 · Oeste</PortalBadge><PortalBadge tone="neutral">GNV 12</PortalBadge><PortalBadge tone="success">Título Oro 2</PortalBadge></div>
          </div>
          <button type="button" className="inline-flex items-center gap-1.5 rounded-lg bg-card px-3.5 py-2 text-[12.5px] font-semibold text-foreground" style={{ border: "1px solid var(--aw-hairline)" }}><Pencil size={14} /> Editar</button>
        </div>

        {/* preferencias */}
        <div className="mt-5 text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--aw-violet)" }}>Ajustes</div>
        <h3 className="mt-0.5 text-[17px] font-extrabold tracking-[-0.02em] text-foreground">Preferencias</h3>
        <div className="mt-3 rounded-2xl bg-card" style={{ border: "0.5px solid var(--aw-hairline)" }}>
          <div className="flex items-center gap-3 px-4 py-3.5">
            {dark ? <Moon size={19} className="text-muted-foreground" /> : <Sun size={19} className="text-muted-foreground" />}
            <div className="flex-1"><div className="text-[13.5px] font-semibold text-foreground">Tema {dark ? "oscuro" : "claro"}</div><div className="text-[11.5px] text-muted-foreground">Cambia la apariencia del portal</div></div>
            <button type="button" onClick={() => setTheme(dark ? "light" : "dark")} aria-label="Cambiar tema" className="relative h-7 w-12 rounded-full transition-colors" style={{ background: dark ? "var(--aw-violet)" : "var(--aw-mist)" }}><span className="absolute top-[3px] size-[22px] rounded-full bg-white transition-all" style={{ left: dark ? 23 : 3 }} /></button>
          </div>
          {PREFS.map((p) => (
            <button key={p.t} type="button" className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-secondary" style={{ borderTop: "1px solid var(--aw-hairline)" }}>
              <p.Icon size={19} className="text-muted-foreground" />
              <div className="flex-1"><div className="text-[13.5px] font-semibold text-foreground">{p.t}</div><div className="text-[11.5px] text-muted-foreground">{p.s}</div></div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </button>
          ))}
          <Link href="/api/auth/logout" className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-secondary" style={{ borderTop: "1px solid var(--aw-hairline)", color: "var(--aw-danger)" }}>
            <LogOut size={19} /><span className="text-[13.5px] font-bold">Cerrar sesión</span>
          </Link>
        </div>
      </div>
    </>
  );
}
