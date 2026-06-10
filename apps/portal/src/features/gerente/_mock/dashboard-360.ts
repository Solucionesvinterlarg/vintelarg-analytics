/**
 * Datos MOCK del Dashboard 360° del Gerente (Lote 2). Espejo de
 * gerente/screens1.jsx → ScreenDashboard. NO es dato real.
 */
export type ExecTone = "warning" | "success" | "danger";

export interface ExecKpi {
  title: string;
  scope?: string;
  value: string;
  delta?: string;
  deltaLabel?: string;
  meta?: string;
  cumpl?: string;
  tone?: ExecTone;
  ref1?: string;
}

export const EXEC_KPIS: ExecKpi[] = [
  { title: "Ventas Netas", scope: "WOE + Tienda Virtual", value: "$12,45 M", delta: "−2,5%", deltaLabel: "vs objetivo", meta: "Meta $12,77 M", cumpl: "97,5%", tone: "warning", ref1: "Ref. Vta. Bruta $12,98 M" },
  { title: "Órdenes Netas", scope: "WOE + Tienda Virtual", value: "104", delta: "+4%", deltaLabel: "vs ant.", meta: "Meta 100", cumpl: "104%", tone: "success", ref1: "Ref. Ord. Brutas 112" },
  { title: "Base total Emprendedor@s", scope: "Stencil", value: "12.450", delta: "+2,4%", deltaLabel: "vs ant." },
  { title: "% Actividad", scope: "Pedido / Stencil", value: "72,0%", delta: "+1,8 pts", deltaLabel: "vs ant." },
];

export interface MiniStat {
  label: string;
  value: string;
  sub?: string;
  tone?: ExecTone;
}

export const MINI_STATS: MiniStat[] = [
  { label: "Indicaciones", value: "45" },
  { label: "Reinicios", value: "128" },
  { label: "Bajas automáticas", value: "14", sub: "3 campañas de inactividad" },
  { label: "Inactivas N-1", value: "96" },
  { label: "Desmantelados", value: "3", sub: "1,5%" },
  { label: "Morosidad en N-2", value: "$35.000", sub: "Riesgo M. — cerca del límite 3,2%", tone: "warning" },
  { label: "Morosidad en N-4", value: "$12.400", sub: "Dentro de parámetros", tone: "success" },
];

export const ALERT_360 = "El KPI «Bajas» (145) superó el umbral crítico (120) en División Zeus.";
export const SUB_360 = "Resumen de indicadores críticos para Camp. 202604 — Zona 851";
