"use client";

import { Monitor, MapPin } from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { PortalBadge } from "@/components/portal/badge";
import { MockBadge } from "@/components/portal/mock-badge";
import { CURSOS, ACADEMIA_DONE } from "@/features/gerente/_mock/academia";

export function AcademiaView() {
  return (
    <>
      <MockBadge />
      <DesktopTopBar title="Academia" initials="MC" right={<div className="hidden sm:block"><PortalBadge tone="success">{ACADEMIA_DONE}</PortalBadge></div>} />
      <p className="px-5 pt-3.5 text-[13px] text-muted-foreground md:px-6">Formación para tu equipo comercial</p>

      <div className="grid grid-cols-1 gap-3 px-5 pb-6 pt-3.5 sm:grid-cols-2 md:px-6 lg:grid-cols-3">
        {CURSOS.map((c, i) => {
          const ModIcon = c.mod === "Online" ? Monitor : MapPin;
          const done = c.prog === 100;
          const cta = done ? "Repasar" : c.prog > 0 ? "Continuar" : "Inscribir";
          const status = done ? "Completado" : c.prog > 0 ? `${c.prog}% completado` : c.d;
          return (
            <div key={i} className="flex flex-col rounded-2xl bg-card p-[18px]" style={{ border: "0.5px solid var(--aw-hairline)" }}>
              <div className="mb-3 flex items-center justify-between">
                <PortalBadge tone="violet">{c.cat}</PortalBadge>
                <span className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground"><ModIcon size={13} strokeWidth={1.5} />{c.mod}</span>
              </div>
              <div className="min-h-[40px] text-[15px] font-bold leading-tight">{c.t}</div>
              <div className="mb-2 mt-3.5 h-1.5 overflow-hidden rounded-full" style={{ background: "var(--aw-app-bg)" }}>
                <div className="h-full rounded-full" style={{ width: `${c.prog}%`, background: done ? "var(--aw-success)" : "var(--aw-violet)" }} />
              </div>
              <div className="mt-auto flex items-center justify-between pt-1">
                <span className="text-[11.5px] text-muted-foreground">{status}</span>
                <button type="button" className="rounded-full px-3.5 py-1.5 text-[12px] font-bold" style={done ? { border: "1px solid var(--aw-hairline)", color: "var(--foreground)" } : { background: "var(--aw-violet)", color: "#fff" }}>{cta}</button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
