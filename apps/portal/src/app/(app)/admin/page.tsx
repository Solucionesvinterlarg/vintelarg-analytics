import { Users, Puzzle, ShieldCheck } from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { Sparkline } from "@/components/portal/sparkline";
import { PortalBadge } from "@/components/portal/badge";
import { getAdminOverview } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const o = await getAdminOverview();

  const shortcuts = [
    { Icon: Users, title: "Gestionar usuarios", desc: `${o.usuarios} usuarios · ${o.orgs} organización(es)` },
    { Icon: Puzzle, title: "Configurar módulos", desc: "Sin módulos configurados todavía" },
    { Icon: ShieldCheck, title: "Permisos por rol", desc: `${o.roles} roles configurados` },
  ];

  return (
    <>
      <DesktopTopBar title="Panel de control" initials="DA" />

      {/* Métricas (reales) */}
      <div className="grid grid-cols-4 gap-[14px]" style={{ padding: "20px 24px 0" }}>
        <Card title="Usuarios activos">
          <Value>{o.usuarios}</Value>
          <div className="mt-0.5 text-xs font-semibold" style={{ color: "var(--aw-success)" }}>
            {o.usuariosSemana > 0 ? `+${o.usuariosSemana} esta semana` : "Sin altas esta semana"}
          </div>
        </Card>

        <Card title="Organizaciones">
          <Value>{o.orgs}</Value>
          <div className="mt-0.5 text-xs" style={{ color: "var(--fg-muted)" }}>{o.orgName}</div>
        </Card>

        <Card title="Sesiones (7 días)">
          <Value>{o.sesionesHoy}</Value>
          <div className="mt-1">
            <Sparkline values={o.sesionesPorDia} color="var(--aw-violet)" width={180} height={28} />
          </div>
        </Card>

        {/* Módulos: sin fuente todavía → empty state */}
        <Card title="Módulos activos">
          <div className="mt-1.5 text-[28px] font-extrabold leading-none tracking-[-0.02em] text-[var(--aw-stone)]">—</div>
          <div className="mt-1 text-xs" style={{ color: "var(--fg-subtle)" }}>Sin configurar</div>
        </Card>
      </div>

      {/* Actividad + accesos */}
      <div style={{ padding: "18px 24px 24px", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16, flex: 1 }}>
        <div className="rounded-2xl bg-card" style={{ padding: "18px 22px", border: "0.5px solid var(--aw-hairline)" }}>
          <div className="mb-3.5 flex items-baseline justify-between">
            <h3 className="m-0 text-sm font-bold tracking-[-0.01em] text-foreground">Actividad reciente</h3>
            <span className="text-xs font-bold" style={{ color: "var(--aw-violet)" }}>Ver registro completo</span>
          </div>
          {o.actividad.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">Sin actividad registrada.</div>
          ) : (
            <div className="relative pl-4">
              <div className="absolute bottom-1 top-1 w-px" style={{ left: 5, background: "var(--aw-hairline)" }} />
              {o.actividad.map((a, i) => (
                <div key={i} className="relative flex items-center gap-3 py-2.5">
                  <div className="absolute size-[11px] rounded-full bg-card" style={{ left: -16, top: 16, border: "2px solid var(--aw-violet)" }} />
                  <div className="m-0 min-w-[80px] text-[11px] font-semibold" style={{ color: "var(--fg-subtle)" }}>{a.when}</div>
                  <div className="flex-1 text-[13px] text-foreground">{a.text}</div>
                  <PortalBadge tone={a.tone}>{a.badge}</PortalBadge>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="m-0 mb-[-4px] mt-1 text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--fg-subtle)]">Accesos directos</h3>
          {shortcuts.map((s) => (
            <div key={s.title} className="flex items-center gap-3.5 rounded-2xl bg-card px-4 py-3.5" style={{ border: "0.5px solid var(--aw-hairline)" }}>
              <div className="grid size-[42px] shrink-0 place-items-center rounded-xl" style={{ background: "var(--aw-violet-light)", color: "var(--aw-violet)" }}>
                <s.Icon size={20} strokeWidth={1.5} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-bold">{s.title}</div>
                <div className="mt-px text-[11px]" style={{ color: "var(--fg-subtle)" }}>{s.desc}</div>
              </div>
              <button className="rounded-full border-0 px-3.5 py-[7px] text-[12px] font-bold text-white" style={{ background: "var(--aw-violet)" }}>Ir →</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-card" style={{ padding: 18, border: "0.5px solid var(--aw-hairline)" }}>
      <p className="m-0 text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--fg-subtle)" }}>{title}</p>
      {children}
    </div>
  );
}

function Value({ children }: { children: React.ReactNode }) {
  return <p className="m-0 mt-1.5 text-[28px] font-extrabold leading-none tracking-[-0.02em] text-foreground">{children}</p>;
}
