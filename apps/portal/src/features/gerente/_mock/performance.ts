/**
 * Datos MOCK de Performance comercial (perfil Gerente, Lote 2). Espejo de
 * gerente/screens1.jsx → ScreenPerformance. NO es dato real.
 */
import type { BadgeTone } from "@/components/portal/badge";
import type { TrendSeries } from "@/components/portal/charts/multi-trend";

export interface PerfKpi {
  title: string;
  value: string;
  delta: string;
  tone: BadgeTone;
}

export const PERF_KPIS: PerfKpi[] = [
  { title: "Órdenes Netas", value: "6.800", delta: "+3,2%", tone: "success" },
  { title: "Venta Neta", value: "$3.200", delta: "+12,5%", tone: "success" },
  { title: "Net Addition", value: "120", delta: "", tone: "violet" },
];

export const PERF_LABELS = ["202559", "202560", "202601", "202602", "202603", "202604"];
export const PERF_SERIES: TrendSeries[] = [
  { key: "objetivo", label: "Objetivo", color: "var(--fg-subtle)", dash: true, data: [8200, 8600, 8900, 9100, 9300, 9500] },
  { key: "real", label: "Real", color: "var(--aw-violet)", data: [7900, 8400, 8800, 9200, 9050, 9000] },
];

export interface PerfGauge {
  title: string;
  value: number;
  sub: string;
  tone: "success" | "warning" | "danger" | "violet";
}
export const PERF_GAUGES: PerfGauge[] = [
  { title: "Órdenes Netas vs Objetivo", value: 97.5, sub: "Obj 9.500 · Real 9.000", tone: "warning" },
  { title: "Venta Neta vs Objetivo", value: 104, sub: "Obj 10.000 · Real 9.880", tone: "success" },
];

export interface PerfZona {
  z: string;
  g: string;
  ob: number; // órdenes bruto
  vb: number; // venta bruta
  des: number; // desmantelados
  on: number; // órdenes netas
  obj: number; // objetivo
  c: number; // % cumplimiento
}
export const PERF_ZONAS: PerfZona[] = [
  { z: "132", g: "M. Silva", ob: 1850, vb: 920, des: 25, on: 2745, obj: 2600, c: 105.5 },
  { z: "133", g: "C. Ruiz", ob: 1620, vb: 780, des: 30, on: 2370, obj: 2250, c: 105.3 },
  { z: "134", g: "L. Vega", ob: 1900, vb: 650, des: 45, on: 2505, obj: 2650, c: 94.5 },
  { z: "135", g: "J. Paz", ob: 1430, vb: 850, des: 20, on: 2260, obj: 2000, c: 113.0 },
];
