/**
 * Datos MOCK de Centro de alertas (perfil Gerente, Lote 2). Espejo de
 * gerente/screens3.jsx → ScreenAlertas. NO es dato real.
 */
import type { BadgeTone } from "@/components/portal/badge";

export type AlertaTone = "danger" | "warning" | "info";

export interface Alerta {
  tone: AlertaTone;
  icon: string; // nombre lucide
  t: string;
  d: string;
  tag: string;
  tagTone: BadgeTone;
  time: string;
}

export const ALERTAS: Alerta[] = [
  { tone: "danger", icon: "trending-down", t: "Morosidad grupal supera el umbral", d: "Zona Bs As Norte · 3,4% (umbral 3,0%)", tag: "Crítica", tagTone: "danger", time: "Hace 2 h" },
  { tone: "danger", icon: "user-x", t: "38 revendedoras inactivas 2 campañas", d: "Riesgo de baja definitiva · revisar contacto", tag: "Crítica", tagTone: "danger", time: "Hace 4 h" },
  { tone: "warning", icon: "clock", t: "124 pedidos sin confirmar", d: "Cierre de campaña en 6 días", tag: "Media", tagTone: "warn", time: "Hoy 09:10" },
  { tone: "warning", icon: "package-x", t: "Stock crítico — línea Cosméticos", d: "4 SKUs con quiebre proyectado", tag: "Media", tagTone: "warn", time: "Ayer" },
  { tone: "info", icon: "target", t: "Zona Rosario al 71% del objetivo", d: "Faltan $42.000 para la meta de campaña", tag: "Seguimiento", tagTone: "info", time: "Ayer" },
  { tone: "info", icon: "user-plus", t: "12 altas pendientes de aprobación", d: "Onboarding · revisar documentación", tag: "Seguimiento", tagTone: "info", time: "Hace 2 d" },
];
