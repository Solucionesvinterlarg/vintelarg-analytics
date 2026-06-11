/**
 * Datos MOCK de Biblioteca de reportes (perfil Gerente, Lote 2). Espejo de
 * gerente/screens3.jsx → ScreenReportes. NO es dato real.
 */
import type { BadgeTone } from "@/components/portal/badge";

export type ReporteTipo = "PDF" | "XLSX" | "CSV";

export interface Reporte {
  n: string;
  tipo: ReporteTipo;
  gen: string;
  icon: string; // nombre lucide
  size: string;
}

export const TIPO_TONE: Record<ReporteTipo, BadgeTone> = { PDF: "danger", XLSX: "success", CSV: "info" };

export const REPORTES: Reporte[] = [
  { n: "Cierre de campaña 202607", tipo: "PDF", gen: "02/06/2026", icon: "file-text", size: "2,4 MB" },
  { n: "Fuerza de ventas — detalle", tipo: "XLSX", gen: "01/06/2026", icon: "sheet", size: "880 KB" },
  { n: "Cuenta corriente división", tipo: "XLSX", gen: "01/06/2026", icon: "sheet", size: "1,1 MB" },
  { n: "Mix de productos por zona", tipo: "PDF", gen: "28/05/2026", icon: "file-text", size: "1,8 MB" },
  { n: "Indicaciones y red", tipo: "CSV", gen: "24/05/2026", icon: "file-spreadsheet", size: "320 KB" },
  { n: "Performance histórica 8 camp.", tipo: "PDF", gen: "20/05/2026", icon: "file-text", size: "3,2 MB" },
];
