/**
 * Datos MOCK de Mix de productos (perfil Gerente, Lote 2). Espejo de
 * gerente/screens2.jsx → ScreenMix. NO es dato real.
 */
import type { DonutDatum } from "@/components/portal/charts/donut";

export interface MixRubro extends DonutDatum {
  amt: string;
}

export const MIX_DATA: MixRubro[] = [
  { label: "Cosméticos", value: 34, color: "var(--aw-violet)", amt: "$16,4 M" },
  { label: "Tupperware", value: 28, color: "#3B82F6", amt: "$13,5 M" },
  { label: "Home", value: 18, color: "var(--aw-success)", amt: "$8,7 M" },
  { label: "Folletos", value: 12, color: "var(--aw-warning)", amt: "$5,8 M" },
  { label: "Demos", value: 8, color: "var(--aw-danger)", amt: "$3,8 M" },
];

export const MIX_TOTAL = "$48,2 M";
export const MIX_MAX = 34; // para escalar las barras de participación
