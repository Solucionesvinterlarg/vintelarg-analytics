/**
 * Datos MOCK de Fuerza de ventas (perfil Gerente Comercial, Lote 2).
 * Espejo de los datos de ejemplo del prototipo (vault: gerente/screens1.jsx →
 * FUERZA_ROWS / SummaryCards). NO es dato real: se reemplaza por queries cuando
 * se definan los KPIs. Tipado para que el swap sea mecánico.
 */
import type { BadgeTone } from "@/components/portal/badge";

export type RevEstado = "Activa" | "Sin pedido" | "Inactiva" | "Reinicio" | "Alta" | "Baja";
export type DeudaKey = "normal" | "caution" | "danger";

export interface RevRow {
  estado: RevEstado;
  nombre: string;
  id: string;
  gpo: string;
  /** Importe WAO si está habilitada (ej. "$10.000"), o null si no. */
  wao: string | null;
  uds: number;
  total: number;
  /** Composición Belleza/Home/Tupper, ej. "0B/12H/6T" o "—". */
  comp: string;
  score: number;
  /** Texto de última actividad, ej. "Hace 2 días". */
  act: string;
  /** Días desde la última actividad (para ordenar y pintar en rojo si > 30). */
  actDays: number;
  deuda: DeudaKey;
  ganaMas: boolean;
}

export const ESTADO_TONE: Record<RevEstado, BadgeTone> = {
  Activa: "success",
  "Sin pedido": "info",
  Inactiva: "warn",
  Reinicio: "violet",
  Alta: "info",
  Baja: "danger",
};

export const DEUDA: Record<DeudaKey, { tone: BadgeTone; label: string }> = {
  normal: { tone: "success", label: "Al día" },
  caution: { tone: "warn", label: "Atraso leve" },
  danger: { tone: "danger", label: "Deuda N-2" },
};

export const FUERZA_ROWS: RevRow[] = [
  { estado: "Activa", nombre: "ALEYDA SANCHEZ", id: "182401", gpo: "1", wao: "$10.000", uds: 18, total: 293986.5, comp: "0B/12H/6T", score: 4.8, act: "Hace 2 días", actDays: 2, deuda: "normal", ganaMas: true },
  { estado: "Activa", nombre: "SILVINA RINALDI", id: "182505", gpo: "1", wao: null, uds: 7, total: 152494.5, comp: "0B/3H/4T", score: 4.5, act: "Hace 5 días", actDays: 5, deuda: "caution", ganaMas: false },
  { estado: "Inactiva", nombre: "ALICIA GARAY", id: "464178", gpo: "1", wao: null, uds: 0, total: 0, comp: "—", score: 3.2, act: "Hace 48 días", actDays: 48, deuda: "danger", ganaMas: false },
  { estado: "Activa", nombre: "M. FLORENCIA CABRERA", id: "403387", gpo: "1", wao: "$0", uds: 29, total: 358626.4, comp: "0B/4H/20T", score: 4.9, act: "Hoy", actDays: 0, deuda: "normal", ganaMas: true },
  { estado: "Baja", nombre: "MARTA GOMEZ", id: "253174", gpo: "43", wao: null, uds: 0, total: 0, comp: "—", score: 2.1, act: "Hace >90 días", actDays: 91, deuda: "danger", ganaMas: false },
];

export interface SummaryDatum {
  label: string;
  value: string;
  sub?: string;
  tone?: BadgeTone;
  icon: string; // nombre lucide
  breakdown?: { v: number; l: string; tone: BadgeTone }[];
}

export const FUERZA_SUMMARY: SummaryDatum[] = [
  { label: "Stencil", value: "101", sub: "Total", icon: "users", breakdown: [
    { v: 58, l: "Activas", tone: "success" },
    { v: 25, l: "Inactivas", tone: "warn" },
    { v: 18, l: "Bajas", tone: "danger" },
  ] },
  { label: "Facturación", value: "$1.245.890", sub: "+12,5% vs camp. anterior", tone: "success", icon: "dollar-sign" },
  { label: "Órdenes pendientes", value: "14", sub: "Requieren atención", tone: "warn", icon: "clock" },
  { label: "Alertas reactivación", value: "25", sub: "Habilitadas a contactar", tone: "info", icon: "bell-ring" },
];

/** Filtros de la pantalla (mock; en real saldrían de campañas/zonas). */
export const FUERZA_FILTERS = ["Campaña-Pedido: 202605/1", "Zona: 051"];

export const FUERZA_TOTAL = 101; // para la paginación ("1–5 de 101")
