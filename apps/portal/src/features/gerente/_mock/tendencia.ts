/**
 * Datos MOCK de Tendencia (perfil Gerente, Lote 2). Espejo de
 * gerente/screens4.jsx → ScreenTendencia (29 métricas). NO es dato real.
 */
export type TendTone = "s" | "w" | "d";

export interface TendMetric {
  label: string;
  value: string;
  delta: string;
  tone: TendTone;
}

export const TENDENCIA: TendMetric[] = [
  { label: "Facturación", value: "$48,2 M", delta: "+8,3%", tone: "s" },
  { label: "Pedidos", value: "3.124", delta: "+2,1%", tone: "s" },
  { label: "Ticket prom.", value: "$15.430", delta: "+4,0%", tone: "s" },
  { label: "Rev. activas", value: "1.847", delta: "−1,4%", tone: "w" },
  { label: "Altas mes", value: "63", delta: "+11", tone: "s" },
  { label: "Bajas mes", value: "21", delta: "+3", tone: "d" },
  { label: "Retención", value: "94,2%", delta: "+0,8", tone: "s" },
  { label: "Cobertura", value: "73%", delta: "−2", tone: "w" },
  { label: "Activación", value: "81%", delta: "+5", tone: "s" },
  { label: "Morosidad", value: "2,8%", delta: "+0,4", tone: "d" },
  { label: "Reclamos", value: "14", delta: "−6", tone: "s" },
  { label: "Resol. media", value: "2,4 d", delta: "−0,3", tone: "s" },
  { label: "NPS red", value: "72", delta: "+4", tone: "s" },
  { label: "Cosméticos", value: "34%", delta: "+2", tone: "s" },
  { label: "Tupperware", value: "28%", delta: "−1", tone: "w" },
  { label: "Home", value: "18%", delta: "+1", tone: "s" },
  { label: "Pedido prom.", value: "4,2 ítems", delta: "+0,1", tone: "s" },
  { label: "Recompra", value: "78%", delta: "+4", tone: "s" },
  { label: "Indicaciones", value: "63", delta: "+11", tone: "s" },
  { label: "UI nivel +", value: "34", delta: "+5", tone: "s" },
  { label: "Círculo Elite", value: "12", delta: "+1", tone: "s" },
  { label: "Capacit. compl.", value: "186", delta: "+22", tone: "s" },
  { label: "Stock crítico", value: "4 SKU", delta: "+2", tone: "d" },
  { label: "Devoluciones", value: "1,9%", delta: "−0,2", tone: "s" },
  { label: "Cancelaciones", value: "2,1%", delta: "+0,3", tone: "d" },
  { label: "Tiempo entrega", value: "3,1 d", delta: "−0,4", tone: "s" },
  { label: "Digital share", value: "41%", delta: "+6", tone: "s" },
  { label: "Margen prom.", value: "38,4%", delta: "+0,6", tone: "s" },
  { label: "Costo capt.", value: "$1.240", delta: "−4%", tone: "s" },
];

/** Sparkline determinista por índice (misma fórmula que el prototipo). */
export function sparkFor(seed: number, n = 7): number[] {
  const a: number[] = [];
  let v = 40 + (seed % 30);
  for (let i = 0; i < n; i++) {
    v += ((seed * (i + 3)) % 13) - 6;
    a.push(Math.max(8, v));
  }
  return a;
}
