"use client";

import { useMemo, useState } from "react";
import { Flag, CalendarClock, CircleCheck, UserPlus, RefreshCw, PackageCheck, TriangleAlert, CheckCheck, BellOff } from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { MockBadge } from "@/components/portal/mock-badge";
import { NOTIFICATIONS, type Notif, type NotifTone } from "@/features/backoffice/_mock/notificaciones";

const ICONS: Record<string, typeof Flag> = {
  flag: Flag, "calendar-clock": CalendarClock, "circle-check": CircleCheck, "user-plus": UserPlus,
  "refresh-cw": RefreshCw, "package-check": PackageCheck, "triangle-alert": TriangleAlert,
};
const TINT: Record<NotifTone, { bg: string; fg: string }> = {
  danger: { bg: "var(--tint-red)", fg: "var(--aw-danger)" },
  warning: { bg: "var(--tint-amber)", fg: "var(--aw-warning)" },
  success: { bg: "var(--tint-green)", fg: "var(--aw-success)" },
  info: { bg: "var(--tint-blue)", fg: "#3B82F6" },
};

export function NotificacionesView() {
  const [items, setItems] = useState<Notif[]>(NOTIFICATIONS);
  const [tab, setTab] = useState<"todas" | "no-leidas">("todas");

  const noLeidas = items.filter((n) => n.unread).length;
  const shown = useMemo(() => (tab === "no-leidas" ? items.filter((n) => n.unread) : items), [items, tab]);

  const toggle = (id: string) => setItems((prev) => prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n)));
  const markAll = () => setItems((prev) => prev.map((n) => ({ ...n, unread: false })));

  return (
    <>
      <MockBadge />
      <DesktopTopBar title="Notificaciones" initials="CR" />

      <div className="mx-auto w-full max-w-[760px] px-5 py-5 md:px-6">
        {/* control + acción */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-full p-1" style={{ background: "var(--aw-app-bg)", border: "0.5px solid var(--aw-hairline)" }}>
            <Seg active={tab === "todas"} onClick={() => setTab("todas")}>Todas</Seg>
            <Seg active={tab === "no-leidas"} onClick={() => setTab("no-leidas")}>No leídas · {noLeidas}</Seg>
          </div>
          <button type="button" onClick={markAll} className="inline-flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: "var(--aw-violet)" }}>
            <CheckCheck size={15} strokeWidth={1.75} /> Marcar todo como leído
          </button>
        </div>

        {/* lista */}
        <div className="mt-4 overflow-hidden rounded-2xl bg-card" style={{ border: "0.5px solid var(--aw-hairline)" }}>
          {shown.length === 0 ? (
            <div className="flex flex-col items-center gap-2 p-12 text-center text-sm text-muted-foreground">
              <BellOff size={22} strokeWidth={1.5} /> No tenés notificaciones sin leer.
            </div>
          ) : (
            shown.map((n, i) => {
              const Icon = ICONS[n.icon] ?? Flag;
              const t = TINT[n.tone];
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => toggle(n.id)}
                  className="flex w-full items-start gap-3.5 px-4 py-3.5 text-left transition-colors"
                  style={{ background: n.unread ? "var(--aw-violet-light)" : "transparent", borderBottom: i < shown.length - 1 ? "0.5px solid var(--aw-hairline)" : "none" }}
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full" style={{ background: t.bg, color: t.fg }}>
                    <Icon size={17} strokeWidth={1.75} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 text-[14px] font-bold text-foreground">
                      {n.title}
                      {n.unread && <span className="size-[7px] shrink-0 rounded-full" style={{ background: "var(--aw-violet)" }} />}
                    </span>
                    <span className="mt-0.5 block text-[12.5px] text-muted-foreground">{n.desc}</span>
                  </span>
                  <span className="shrink-0 whitespace-nowrap text-[11.5px] text-muted-foreground">{n.time}</span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

function Seg({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors"
      style={active ? { background: "var(--aw-violet)", color: "#fff" } : { color: "var(--fg-subtle)" }}
    >
      {children}
    </button>
  );
}
