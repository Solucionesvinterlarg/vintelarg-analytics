"use client";

import { TrendingDown, UserX, Clock, PackageX, Target, UserPlus, CheckCheck } from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { PortalBadge } from "@/components/portal/badge";
import { MockBadge } from "@/components/portal/mock-badge";
import { ALERTAS, type AlertaTone } from "@/features/gerente/_mock/alertas";

const ICONS: Record<string, typeof Clock> = { "trending-down": TrendingDown, "user-x": UserX, clock: Clock, "package-x": PackageX, target: Target, "user-plus": UserPlus };
const TINT: Record<AlertaTone, { bg: string; fg: string }> = {
  danger: { bg: "var(--tint-red)", fg: "var(--aw-danger)" },
  warning: { bg: "var(--tint-amber)", fg: "var(--aw-warning)" },
  info: { bg: "var(--tint-blue)", fg: "#3B82F6" },
};

export function AlertasView() {
  return (
    <>
      <MockBadge />
      <DesktopTopBar
        title="Centro de alertas"
        initials="MC"
        right={
          <button type="button" className="inline-flex items-center gap-1.5 rounded-lg bg-card px-3 py-2 text-[12px] font-semibold text-foreground transition-colors hover:bg-secondary" style={{ border: "1px solid var(--aw-hairline)" }}>
            <CheckCheck size={14} strokeWidth={1.5} /><span className="hidden sm:inline">Marcar todo leído</span>
          </button>
        }
      />
      <p className="px-5 pt-3.5 text-[13px] text-muted-foreground md:px-6">6 alertas priorizadas · 2 críticas</p>

      <div className="px-5 pb-6 pt-3.5 md:px-6">
        <div className="overflow-hidden rounded-2xl bg-card" style={{ border: "0.5px solid var(--aw-hairline)" }}>
          {ALERTAS.map((a, i) => {
            const Icon = ICONS[a.icon] ?? Clock;
            const tint = TINT[a.tone];
            return (
              <div key={i} className="flex items-start gap-3.5 px-[18px] py-4" style={{ borderBottom: i < ALERTAS.length - 1 ? "1px solid var(--aw-hairline)" : "none" }}>
                <div className="grid size-10 shrink-0 place-items-center rounded-xl" style={{ background: tint.bg, color: tint.fg }}>
                  <Icon size={19} strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-[14px] font-bold">{a.t}</span>
                    <PortalBadge tone={a.tagTone} dot>{a.tag}</PortalBadge>
                  </div>
                  <div className="mt-0.5 text-[12.5px] text-muted-foreground">{a.d}</div>
                </div>
                <span className="shrink-0 whitespace-nowrap text-[11.5px] text-muted-foreground">{a.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
