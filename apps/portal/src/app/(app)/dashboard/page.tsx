import { AlertCircle, AlertTriangle, X } from "lucide-react";

import { getCurrentUser } from "@/lib/session";
import { normalizeRole, DESKTOP_FILTERS } from "@/lib/portal-config";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { KpiCard } from "@/components/portal/kpi-card";
import { PortalBadge } from "@/components/portal/badge";
import { Dashboard360View } from "@/features/gerente/dashboard-360-view";

/* ------------------------------------------------------------------ */
/*  AlertBar — borde rojo izquierdo, fondo #FEF2F2                     */
/* ------------------------------------------------------------------ */
function AlertBar({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mx-6 mt-4 flex items-center gap-3 rounded-[10px] px-4 py-[11px]"
      style={{
        background: "#FEF2F2",
        borderLeft: "3px solid var(--aw-danger)",
      }}
    >
      <AlertTriangle
        size={18}
        strokeWidth={1.5}
        className="shrink-0"
        style={{ color: "var(--aw-danger)" }}
      />
      <div className="flex-1 text-[13px]" style={{ color: "#5C2B2F" }}>
        {children}
      </div>
      <a
        href="#alertas"
        className="text-[12px] font-bold"
        style={{ color: "var(--aw-violet)" }}
      >
        Ver Centro de Alertas →
      </a>
      <button
        type="button"
        aria-label="Cerrar alerta"
        className="flex size-[22px] items-center justify-center"
      >
        <X size={14} strokeWidth={1.5} style={{ color: "#5C2B2F" }} />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Footers especiales para % Desmantelados e Incobrables              */
/* ------------------------------------------------------------------ */
const FooterDesmantelados = (
  <div className="mt-auto pt-2">
    <div
      className="overflow-hidden rounded-full"
      style={{ height: 6, background: "#E8E5F0" }}
    >
      <div
        style={{ width: "15%", height: "100%", background: "var(--aw-success)" }}
      />
    </div>
    <div className="mt-1 text-[10px]" style={{ color: "var(--aw-slate)" }}>
      Límite alerta: 4%
    </div>
  </div>
);

const FooterIncobrables = (
  <div className="mt-auto flex items-center gap-1.5 pt-2">
    <AlertCircle
      size={14}
      strokeWidth={1.5}
      style={{ color: "var(--aw-danger)" }}
    />
    <span className="text-[11px] font-bold" style={{ color: "var(--aw-danger)" }}>
      Cerca del umbral 3.5%
    </span>
  </div>
);

/* ------------------------------------------------------------------ */
/*  KPI data — 9 tarjetas del Dashboard 360°                           */
/* ------------------------------------------------------------------ */
const KPI_DATA = [
  {
    title: "Ventas Netas",
    value: "$12.45M",
    meta: "Obj: $14M · 89%",
    metaTone: "warn" as const,
    semaforo: "yellow" as const,
    sparkValues: [9.1, 9.6, 10.2, 10.8, 11.4, 12.0, 12.45],
    sparkColor: "var(--aw-success)",
  },
  {
    title: "Órdenes Netas",
    value: "104",
    meta: "Obj: 120 · 87%",
    metaTone: "warn" as const,
    semaforo: "yellow" as const,
    sparkValues: [88, 92, 95, 97, 99, 101, 104],
    sparkColor: "var(--aw-success)",
  },
  {
    title: "Stencil",
    value: "12.450",
    meta: "+2.3% vs anterior",
    metaTone: "success" as const,
    semaforo: "green" as const,
    sparkValues: [11.4, 11.7, 11.9, 12.0, 12.2, 12.3, 12.45],
    sparkColor: "var(--aw-success)",
  },
  {
    title: "Indicaciones",
    value: "45",
    meta: "+12% vs anterior",
    metaTone: "success" as const,
    semaforo: "green" as const,
    sparkValues: [32, 34, 36, 38, 40, 42, 45],
    sparkColor: "var(--aw-success)",
  },
  {
    title: "Reinicios",
    value: "128",
    meta: "−5% vs anterior",
    metaTone: "warn" as const,
    semaforo: "yellow" as const,
    sparkValues: [142, 140, 138, 135, 132, 130, 128],
    sparkColor: "#E5A53C",
  },
  {
    title: "Bajas Automáticas",
    value: "14",
    meta: "3 camp. inactividad",
    metaTone: "danger" as const,
    semaforo: "red" as const,
    sparkValues: [6, 7, 8, 10, 11, 12, 14],
    sparkColor: "var(--aw-danger)",
  },
  {
    title: "% Actividad",
    value: "72.0%",
    meta: "+1.5 pp",
    metaTone: "success" as const,
    semaforo: "green" as const,
    sparkValues: [68, 69, 69.5, 70, 70.8, 71.4, 72.0],
    sparkColor: "var(--aw-success)",
  },
  {
    title: "% Desmantelados",
    value: "3 (1.5%)",
    meta: "Saludable",
    metaTone: "success" as const,
    semaforo: "green" as const,
    footer: FooterDesmantelados,
  },
  {
    title: "Incobrables",
    value: "$35.000",
    meta: "Cerca del límite: 3.2%",
    metaTone: "danger" as const,
    semaforo: "red" as const,
    footer: FooterIncobrables,
  },
];

/* ------------------------------------------------------------------ */
/*  KpiGrid360 — grilla 3×3, gap 14, padding 20/24                    */
/* ------------------------------------------------------------------ */
function KpiGrid360() {
  return (
    <div
      style={{
        padding: "20px 24px",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 14,
      }}
    >
      {KPI_DATA.map((d) => (
        <KpiCard key={d.title} {...d} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page — Server Component, branching por rol                         */
/* ------------------------------------------------------------------ */
export default async function DashboardPage() {
  const user = await getCurrentUser();
  const role = normalizeRole(user?.role);

  // El Gerente Comercial tiene su propia maqueta 360° (mock, Lote 2). Comercial
  // y marketing conservan la vista existente de abajo, sin cambios.
  if (role === "gerente_comercial") return <Dashboard360View />;

  const showAlert = role === "comercial";
  const isMarketing = role === "marketing";

  return (
    <>
      <DesktopTopBar
        title="Dashboard 360°"
        filters={DESKTOP_FILTERS}
        right={
          isMarketing ? (
            <PortalBadge tone="info" dot>
              Modo lectura
            </PortalBadge>
          ) : undefined
        }
      />

      {showAlert && (
        <AlertBar>
          <b>Bajas (145)</b> superó umbral crítico (120) en{" "}
          <b>División Zeus</b>
        </AlertBar>
      )}

      <KpiGrid360 />
    </>
  );
}
