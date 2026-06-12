"use client";

import { Bell, ChevronDown, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useShellStore } from "@/lib/shell-store";
import { UserMenu } from "@/components/portal/user-menu";

/** Topbar desktop 64px: toggle colapsar + título + filtros + bell + avatar. */
export function DesktopTopBar({
  title,
  filters = [],
  right,
  initials = "PG",
}: {
  title: string;
  filters?: string[];
  right?: React.ReactNode;
  initials?: string;
}) {
  const { collapsed, toggleCollapsed } = useShellStore();
  return (
    <header
      className="flex min-h-16 flex-none items-center gap-4 bg-card px-7 py-3.5"
      style={{ borderBottom: "1px solid var(--aw-hairline)" }}
    >
      <button
        type="button"
        onClick={toggleCollapsed}
        aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
        className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary"
      >
        {collapsed ? <PanelLeftOpen size={18} strokeWidth={1.5} /> : <PanelLeftClose size={18} strokeWidth={1.5} />}
      </button>

      <h1 className="m-0 text-[18px] font-bold tracking-[-0.01em] text-foreground">{title}</h1>

      {filters.length > 0 && (
        <div className="ml-6 hidden gap-2 lg:flex">
          {filters.map((f, i) => (
            <button
              key={i}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-[7px] text-xs font-semibold text-muted-foreground"
              style={{ background: "var(--aw-chalk)" }}
            >
              <span>{f}</span>
              <ChevronDown size={13} strokeWidth={1.5} className="text-[var(--aw-slate)]" />
            </button>
          ))}
        </div>
      )}

      <div className="ml-auto flex items-center gap-3.5">
        {right}
        <div className="relative grid size-[34px] place-items-center rounded-full" style={{ background: "var(--aw-chalk)" }}>
          <Bell size={16} strokeWidth={1.5} className="text-foreground" />
          <span className="absolute right-[7px] top-1.5 size-[7px] rounded-full" style={{ background: "var(--aw-violet)" }} />
        </div>
        <UserMenu initials={initials} />
      </div>
    </header>
  );
}
