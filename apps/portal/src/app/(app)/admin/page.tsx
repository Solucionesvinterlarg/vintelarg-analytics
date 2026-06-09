import { Users, Puzzle, ShieldCheck } from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { Sparkline } from "@/components/portal/sparkline";
import { PortalBadge } from "@/components/portal/badge";

/* ── timeline data ─────────────────────────────────────────────────────── */
type TimelineEntry = {
  t: string;
  badge: string;
  tone: "violet" | "info" | "success" | "neutral";
  label: React.ReactNode;
};

const timeline: TimelineEntry[] = [
  {
    t: "hace 2 min",
    label: (
      <>
        <strong>María López</strong> inició sesión
      </>
    ),
    badge: "Emprendedora",
    tone: "violet",
  },
  {
    t: "hace 15 min",
    label: (
      <>
        <strong>Patricia Gómez</strong> aprobó reclamo #4521
      </>
    ),
    badge: "GC",
    tone: "info",
  },
  {
    t: "hace 1 hora",
    label: (
      <>
        Se habilitó módulo <strong>Cambios y Reclamos</strong>
      </>
    ),
    badge: "Sistema",
    tone: "success",
  },
  {
    t: "hace 3 horas",
    label: (
      <>
        Nuevo usuario registrado: <strong>Ana Torres</strong>
      </>
    ),
    badge: "Auto",
    tone: "neutral",
  },
  {
    t: "hace 5 horas",
    label: <>Backup de base completado</>,
    badge: "Sistema",
    tone: "success",
  },
];

/* ── shortcuts data ────────────────────────────────────────────────────── */
const shortcuts = [
  {
    icon: <Users size={20} strokeWidth={1.5} />,
    title: "Gestionar usuarios",
    desc: "487 usuarios · 23 pendientes de verificación",
  },
  {
    icon: <Puzzle size={20} strokeWidth={1.5} />,
    title: "Configurar módulos",
    desc: "5 habilitados · 6 disponibles",
  },
  {
    icon: <ShieldCheck size={20} strokeWidth={1.5} />,
    title: "Permisos por rol",
    desc: "7 roles · 42 permisos configurados",
  },
];

/* ── page ──────────────────────────────────────────────────────────────── */
export default function AdminHomePage() {
  return (
    <>
      <DesktopTopBar title="Panel de control" initials="DA" />

      {/* Metric cards */}
      <div
        className="grid grid-cols-4 gap-[14px]"
        style={{ padding: "20px 24px 0" }}
      >
        {/* Usuarios activos */}
        <div
          className="rounded-2xl bg-card"
          style={{
            padding: 18,
            border: "0.5px solid var(--aw-hairline)",
          }}
        >
          <p
            className="m-0 text-[11px] font-bold uppercase tracking-[0.1em]"
            style={{ color: "var(--fg-subtle)" }}
          >
            Usuarios activos
          </p>
          <p className="m-0 mt-1.5 text-[28px] font-extrabold leading-none tracking-[-0.02em] text-foreground">
            487
          </p>
          <p
            className="m-0 mt-0.5 text-xs font-semibold"
            style={{ color: "var(--aw-success)" }}
          >
            +12 esta semana
          </p>
        </div>

        {/* Organizaciones */}
        <div
          className="rounded-2xl bg-card"
          style={{
            padding: 18,
            border: "0.5px solid var(--aw-hairline)",
          }}
        >
          <p
            className="m-0 text-[11px] font-bold uppercase tracking-[0.1em]"
            style={{ color: "var(--fg-subtle)" }}
          >
            Organizaciones
          </p>
          <p className="m-0 mt-1.5 text-[28px] font-extrabold leading-none tracking-[-0.02em] text-foreground">
            1
          </p>
          <p
            className="m-0 mt-0.5 text-xs"
            style={{ color: "var(--fg-muted)" }}
          >
            Aware S.A.
          </p>
        </div>

        {/* Sesiones hoy */}
        <div
          className="rounded-2xl bg-card"
          style={{
            padding: 18,
            border: "0.5px solid var(--aw-hairline)",
          }}
        >
          <p
            className="m-0 text-[11px] font-bold uppercase tracking-[0.1em]"
            style={{ color: "var(--fg-subtle)" }}
          >
            Sesiones hoy
          </p>
          <p className="m-0 mt-1.5 text-[28px] font-extrabold leading-none tracking-[-0.02em] text-foreground">
            234
          </p>
          <div className="mt-1">
            <Sparkline
              values={[180, 195, 210, 198, 220, 228, 234]}
              color="var(--aw-violet)"
              width={180}
              height={28}
            />
          </div>
        </div>

        {/* Módulos activos */}
        <div
          className="rounded-2xl bg-card"
          style={{
            padding: 18,
            border: "0.5px solid var(--aw-hairline)",
          }}
        >
          <p
            className="m-0 text-[11px] font-bold uppercase tracking-[0.1em]"
            style={{ color: "var(--fg-subtle)" }}
          >
            Módulos activos
          </p>
          <p className="m-0 mt-1.5 text-[28px] font-extrabold leading-none tracking-[-0.02em] text-foreground">
            5{" "}
            <span
              className="text-sm font-semibold"
              style={{ color: "var(--fg-subtle)" }}
            >
              de 11
            </span>
          </p>
          <div
            className="mt-2 h-1.5 overflow-hidden rounded-full"
            style={{ background: "#F1EFEA" }}
          >
            <div
              className="h-full rounded-full"
              style={{ width: "45%", background: "var(--aw-violet)" }}
            />
          </div>
        </div>
      </div>

      {/* Two-column: timeline + shortcuts */}
      <div
        style={{
          padding: "18px 24px 24px",
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: 16,
          flex: 1,
        }}
      >
        {/* Actividad reciente */}
        <div
          className="rounded-2xl bg-card"
          style={{
            padding: "18px 22px",
            border: "0.5px solid var(--aw-hairline)",
          }}
        >
          <div className="mb-3.5 flex items-baseline justify-between">
            <h3 className="m-0 text-sm font-bold tracking-[-0.01em] text-foreground">
              Actividad reciente
            </h3>
            <a
              className="cursor-pointer text-xs font-bold"
              style={{ color: "var(--aw-violet)" }}
            >
              Ver registro completo
            </a>
          </div>

          {/* Timeline */}
          <div className="relative pl-4">
            {/* vertical line */}
            <div
              className="absolute bottom-1 top-1 w-px"
              style={{ left: 5, background: "var(--aw-hairline)" }}
            />

            {timeline.map((entry, i) => (
              <div key={i} className="relative flex items-center gap-3 py-2.5">
                {/* dot */}
                <div
                  className="absolute size-[11px] rounded-full bg-card"
                  style={{
                    left: -16,
                    top: 16,
                    border: "2px solid var(--aw-violet)",
                  }}
                />
                {/* time */}
                <p
                  className="m-0 min-w-[80px] text-[11px] font-semibold"
                  style={{ color: "var(--fg-subtle)" }}
                >
                  {entry.t}
                </p>
                {/* event text */}
                <p className="m-0 flex-1 text-[13px] text-foreground">
                  {entry.label}
                </p>
                {/* badge */}
                <PortalBadge tone={entry.tone}>{entry.badge}</PortalBadge>
              </div>
            ))}
          </div>
        </div>

        {/* Accesos directos */}
        <div className="flex flex-col gap-3">
          <h3
            className="m-0 mb-[-4px] mt-1 text-[11px] font-bold uppercase tracking-[0.1em]"
            style={{ color: "var(--fg-subtle)" }}
          >
            Accesos directos
          </h3>

          {shortcuts.map((s, i) => (
            <div
              key={i}
              className="flex items-center gap-3.5 rounded-[14px] bg-card"
              style={{
                padding: "14px 16px",
                border: "0.5px solid var(--aw-hairline)",
              }}
            >
              {/* icon bubble */}
              <div
                className="grid size-[42px] flex-none place-items-center rounded-xl"
                style={{
                  background: "var(--aw-violet-light)",
                  color: "var(--aw-violet)",
                }}
              >
                {s.icon}
              </div>

              {/* text */}
              <div className="min-w-0 flex-1">
                <p className="m-0 text-[13px] font-bold text-foreground">
                  {s.title}
                </p>
                <p
                  className="m-0 mt-px text-[11px]"
                  style={{ color: "var(--fg-subtle)" }}
                >
                  {s.desc}
                </p>
              </div>

              {/* CTA */}
              <button
                type="button"
                className="cursor-pointer rounded-full border-0 px-3.5 py-[7px] text-xs font-bold text-white"
                style={{ background: "var(--aw-violet)" }}
              >
                Ir →
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
