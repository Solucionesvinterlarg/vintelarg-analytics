"use client";

import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

/**
 * Menú de usuario unificado (avatar arriba-derecha). Dropdown con:
 *  - Mi perfil → IdP (deshabilitado hasta que el IdP tenga pantalla de perfil).
 *  - Cerrar sesión → /api/auth/logout (RP-initiated logout). Es un <a href> —
 *    navegación de DOCUMENTO, no Link/RSC, para no chocar con el guard de
 *    prefetch del login ni romper el end_session del IdP.
 *
 * Se usa en el shell interno (desktop-topbar). En el phone-shell (emprendedora)
 * el menú de usuario vive en el drawer (no hay avatar top-right consistente).
 */
export function UserMenu({ initials }: { initials: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Menú de usuario"
        className="grid size-[34px] cursor-pointer place-items-center rounded-full text-[11px] font-extrabold text-white outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--aw-violet)] focus-visible:ring-offset-1"
        style={{ background: "var(--aw-violet)" }}
      >
        {initials}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={6} className="min-w-44">
        <DropdownMenuItem disabled>
          <User /> Mi perfil
          <span className="ml-auto text-[10px] font-medium text-muted-foreground">Pronto</span>
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" render={<a href="/api/auth/logout" />}>
          <LogOut /> Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
