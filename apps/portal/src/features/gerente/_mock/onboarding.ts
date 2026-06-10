/**
 * Datos MOCK de Onboarding (perfil Gerente, Lote 2). Espejo de
 * gerente/screens2.jsx → ScreenOnboarding (4 tabs). NO es dato real.
 */
import type { BadgeTone } from "@/components/portal/badge";

export interface AltaRow {
  n: string;
  z: string;
  padr: string;
  fecha: string;
  estado: string;
  tone: BadgeTone;
}
export const ONB_ALTAS: AltaRow[] = [
  { n: "Mariela Suárez", z: "Bs As Norte", padr: "Laura Torres", fecha: "24/05", estado: "Pendiente", tone: "warn" },
  { n: "Daniela Ponce", z: "Rosario", padr: "Carmen Ruiz", fecha: "23/05", estado: "Aprobada", tone: "success" },
  { n: "Romina Vega", z: "Córdoba Centro", padr: "Sofía Martínez", fecha: "23/05", estado: "Aprobada", tone: "success" },
  { n: "Cecilia Mora", z: "Bs As Sur", padr: "Laura Torres", fecha: "21/05", estado: "Pendiente", tone: "warn" },
];

export const ONB_CONTINUIDAD = { data: [62, 68, 71, 69, 74, 78], labels: ["C03", "C04", "C05", "C06", "C07", "C08"] };

export interface SeguimientoStep {
  t: string;
  d: string;
  done: boolean;
  icon: string; // nombre lucide
}
export const ONB_SEGUIMIENTO = {
  persona: { n: "Mariela Suárez", info: "Bs As Norte · alta 02/05 · patrocinó Laura Torres" },
  steps: [
    { t: "Alta confirmada", d: "02/05 · 14:20", done: true, icon: "user-plus" },
    { t: "Kit de bienvenida entregado", d: "04/05 · 11:00", done: true, icon: "package" },
    { t: "1er pedido realizado", d: "09/05 · $42.300", done: true, icon: "shopping-bag" },
    { t: "2do pedido realizado", d: "21/05 · $58.100", done: true, icon: "repeat" },
    { t: "3er pedido — en seguimiento", d: "Estimado 04/06", done: false, icon: "clock" },
  ] as SeguimientoStep[],
};

export const ONB_GEO = [
  { z: "Bs As Norte", v: 18 },
  { z: "Bs As Sur", v: 11 },
  { z: "Córdoba Centro", v: 9 },
  { z: "Rosario", v: 7 },
  { z: "Mendoza", v: 5 },
  { z: "Otras", v: 13 },
];
