"use client";

import { Plus, Building2 } from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { PortalBadge } from "@/components/portal/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { AdminOrgRow } from "@/lib/queries";

const GRID = "1.7fr 1.2fr 0.8fr 1fr 1fr";

export function OrganizacionesView({ orgs }: { orgs: AdminOrgRow[] }) {
  return (
    <>
      <DesktopTopBar
        title="Organizaciones"
        initials="DA"
        right={<span className="hidden md:inline-block"><NuevaOrgButton /></span>}
      />

      {/* Acción (mobile: el botón va acá, full width) */}
      <div className="px-5 pt-4 md:hidden">
        <NuevaOrgButton full />
      </div>

      {/* Tabla (desktop) */}
      <div className="hidden flex-col px-6 pb-2 pt-5 md:flex">
        <div className="overflow-hidden rounded-2xl bg-card" style={{ border: "0.5px solid var(--aw-hairline)" }}>
          <div
            className="grid px-[18px] py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground"
            style={{ gridTemplateColumns: GRID, background: "var(--aw-app-bg)", borderBottom: "1px solid var(--aw-hairline)" }}
          >
            <span>Nombre</span><span>Slug</span><span>Usuarios</span><span>Módulos activos</span><span>Fecha de alta</span>
          </div>

          {orgs.length === 0 ? (
            <div className="grid place-items-center p-10 text-center text-sm text-muted-foreground">No hay organizaciones.</div>
          ) : (
            orgs.map((o, i) => (
              <div
                key={o.id}
                className="grid items-center px-[18px] py-3.5 text-[13px] text-foreground"
                style={{
                  gridTemplateColumns: GRID,
                  background: i % 2 === 1 ? "var(--aw-app-bg)" : "transparent",
                  borderBottom: i < orgs.length - 1 ? "0.5px solid var(--aw-hairline)" : "none",
                }}
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <span className="grid size-8 shrink-0 place-items-center rounded-[10px]" style={{ background: "var(--aw-violet-light)", color: "var(--aw-violet)" }}>
                    <Building2 size={16} strokeWidth={1.5} />
                  </span>
                  <span className="truncate font-semibold">{o.name}</span>
                </span>
                <span className="truncate pr-2 text-[12px] text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>{o.slug}</span>
                <span className="font-semibold">{o.users.toLocaleString("es-AR")}</span>
                <span><PortalBadge tone="info">{o.activeModules} {o.activeModules === 1 ? "módulo" : "módulos"}</PortalBadge></span>
                <span className="text-muted-foreground">{o.createdAt}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Cards (mobile) */}
      <div className="flex flex-col gap-2.5 px-5 pb-2 pt-4 md:hidden">
        {orgs.length === 0 ? (
          <div className="grid place-items-center p-10 text-center text-sm text-muted-foreground">No hay organizaciones.</div>
        ) : (
          orgs.map((o) => (
            <div key={o.id} className="rounded-2xl bg-card p-4" style={{ border: "0.5px solid var(--aw-hairline)" }}>
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 shrink-0 place-items-center rounded-[10px]" style={{ background: "var(--aw-violet-light)", color: "var(--aw-violet)" }}>
                  <Building2 size={18} strokeWidth={1.5} />
                </span>
                <div className="min-w-0">
                  <div className="truncate text-[14px] font-bold text-foreground">{o.name}</div>
                  <div className="truncate text-[12px] text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>{o.slug}</div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <Stat label="Usuarios" value={o.users.toLocaleString("es-AR")} />
                <Stat label="Módulos" value={String(o.activeModules)} />
                <Stat label="Alta" value={o.createdAt} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Nota al pie */}
      <p className="px-5 pb-6 pt-3 text-[12px] leading-relaxed text-muted-foreground md:px-6">
        El alta y la configuración de organizaciones las gestiona Vintelarg como parte del plan del ecosistema A-ware®.
      </p>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl px-2 py-2" style={{ background: "var(--aw-app-bg)" }}>
      <div className="text-[15px] font-extrabold tracking-tight text-foreground">{value}</div>
      <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{label}</div>
    </div>
  );
}

/** "+ Nueva organización" deshabilitado: el alta la gestiona Vintelarg. */
function NuevaOrgButton({ full }: { full?: boolean }) {
  return (
    <Tooltip>
      <TooltipTrigger render={<span className={full ? "block w-full" : "inline-block"} />}>
        <button
          type="button"
          disabled
          aria-disabled
          className={
            (full ? "w-full justify-center " : "") +
            "pointer-events-none inline-flex cursor-not-allowed items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-bold opacity-50"
          }
          style={{ border: "1.5px solid var(--aw-violet)", color: "var(--aw-violet)" }}
        >
          <Plus size={15} strokeWidth={2} />
          Nueva organización
        </button>
      </TooltipTrigger>
      <TooltipContent>Gestionado por Vintelarg</TooltipContent>
    </Tooltip>
  );
}
