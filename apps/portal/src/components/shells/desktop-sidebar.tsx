"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { LucideIcon } from "@/components/portal/lucide-icon";
import { AwareMark } from "@/components/portal/aware-mark";
import { useShellStore } from "@/lib/shell-store";
import type { NavEntry } from "@/lib/portal-config";
import { cn } from "@/lib/utils";

function hrefBase(href: string) {
  return href.split("#")[0];
}

export function DesktopSidebar({
  items,
  user,
}: {
  items: NavEntry[];
  user: { name: string; role: string; initials: string };
}) {
  const pathname = usePathname();
  const collapsed = useShellStore((s) => s.collapsed);

  return (
    <aside
      className="flex h-dvh flex-col text-white transition-[width] duration-[240ms] ease-[var(--ease-out)]"
      style={{ width: collapsed ? 68 : 260, minWidth: collapsed ? 68 : 260, background: "var(--aw-purple-900)" }}
    >
      {/* Logo */}
      <div className={cn("flex items-center gap-2.5 px-[18px] pb-[18px] pt-5", collapsed && "justify-center px-0")}>
        <AwareMark size={26} />
        {!collapsed && (
          <div className="leading-tight">
            <div className="text-sm font-extrabold tracking-[0.02em]">
              A·WARE<sup className="text-[7px] opacity-70">®</sup>
            </div>
            <div className="mt-px text-[9px] italic text-[var(--aw-purple-300)]">todo es posible.</div>
          </div>
        )}
      </div>

      {/* Items */}
      <nav className={cn("flex flex-1 flex-col gap-px overflow-y-auto", collapsed ? "px-2" : "px-3")}>
        {items.map((it, i) => {
          if ("divider" in it) return <div key={`d${i}`} className="mx-2 my-2 h-px bg-white/[0.08]" />;
          if ("label" in it)
            return (
              <div key={`l${i}`} className={cn("pt-3 pb-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white/40", collapsed ? "px-0 text-center" : "px-3")}>
                {collapsed ? "·" : it.label}
              </div>
            );
          // Solo el ítem-ruta (sin ancla #) cuya ruta coincide queda activo;
          // los ítems con #ancla apuntan a secciones de la misma página y no se marcan.
          const active = !it.href.includes("#") && hrefBase(it.href) === pathname;
          const link = (
            <Link
              href={it.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex items-center gap-3 rounded-lg text-[13px] transition-colors",
                collapsed ? "justify-center p-2.5" : "px-3 py-2.5",
                active ? "font-semibold text-white" : "font-medium text-white/70 hover:bg-white/[0.08]"
              )}
              style={active ? { background: "var(--aw-violet)" } : undefined}
            >
              <span className="shrink-0" style={{ color: active ? "#fff" : "rgba(255,255,255,0.62)" }}>
                <LucideIcon name={it.icon} size={18} />
              </span>
              {!collapsed && <span className="flex-1 whitespace-nowrap">{it.name}</span>}
              {!collapsed && it.badge && (
                <span
                  className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-white"
                  style={{ background: it.badgeTone === "warn" ? "#E5A53C" : "#E5484D" }}
                >
                  {it.badge}
                </span>
              )}
              {collapsed && it.badge && (
                <span className="absolute right-2 top-1 size-2 rounded-full" style={{ background: it.badgeTone === "warn" ? "#E5A53C" : "#E5484D" }} />
              )}
            </Link>
          );
          return collapsed ? (
            <Tooltip key={it.id}>
              <TooltipTrigger render={link} />
              <TooltipContent side="right">{it.name}</TooltipContent>
            </Tooltip>
          ) : (
            <div key={it.id}>{link}</div>
          );
        })}
      </nav>

      {/* User footer */}
      <div className={cn("border-t border-white/[0.08]", collapsed ? "px-2 py-3" : "p-3")}>
        <div className={cn("flex items-center gap-2.5 px-1 py-1.5", collapsed && "justify-center")}>
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold text-white" style={{ background: "var(--aw-violet)" }}>
            {user.initials}
          </div>
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-bold">{user.name}</div>
                <div className="text-[10px] text-[var(--aw-purple-300)]">{user.role}</div>
              </div>
              <Link href="/api/auth/logout" aria-label="Configuración / salir" className="text-white/50 hover:text-white">
                <Settings size={14} strokeWidth={1.5} />
              </Link>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
