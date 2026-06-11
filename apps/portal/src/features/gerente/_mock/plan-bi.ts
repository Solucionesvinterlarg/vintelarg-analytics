/**
 * Datos MOCK de Plan comercial BI (perfil Gerente, Lote 2). Espejo de
 * gerente/screens4.jsx → ScreenPlan (4 tabs). NO es dato real.
 */
export interface PlanNivelRow {
  n: string;
  req: string;
  desc: string;
  rebate: string;
  ui: number;
}
export const PLAN_NIVEL: PlanNivelRow[] = [
  { n: "Emprendedora", req: "$0", desc: "25%", rebate: "—", ui: 1284 },
  { n: "Lucero", req: "$120.000", desc: "28%", rebate: "2%", ui: 312 },
  { n: "LCI", req: "$260.000", desc: "32%", rebate: "4%", ui: 168 },
  { n: "Gerente Comercial", req: "$480.000", desc: "36%", rebate: "6%", ui: 64 },
  { n: "Círculo Elite", req: "$820.000", desc: "40%", rebate: "9%", ui: 12 },
];

export interface PlanHistRow {
  c: string;
  nivel: string;
  desde: string;
  camp: number;
  acum: string;
}
export const PLAN_HISTORIAL: PlanHistRow[] = [
  { c: "Laura Torres", nivel: "LCI", desde: "C04", camp: 6, acum: "$1.684.000" },
  { c: "Carmen Ruiz", nivel: "Gerente Comercial", desde: "C02", camp: 8, acum: "$2.210.000" },
  { c: "Sofía Martínez", nivel: "Emprendedora", desde: "C06", camp: 3, acum: "$612.000" },
  { c: "Elena Díaz", nivel: "Emprendedora", desde: "C05", camp: 4, acum: "$708.000" },
];

export interface PlanBeneficio {
  icon: string; // nombre lucide
  t: string;
  d: string;
}
export const PLAN_BENEFICIOS: PlanBeneficio[] = [
  { icon: "percent", t: "Descuento ampliado", d: "Hasta 40% según nivel alcanzado" },
  { icon: "gift", t: "Kit de graduación", d: "Productos exclusivos al subir de nivel" },
  { icon: "plane", t: "Viaje de incentivo", d: "Para el Círculo Elite por 3 campañas seguidas" },
  { icon: "graduation-cap", t: "Academia premium", d: "Acceso a formaciones de liderazgo" },
  { icon: "badge-check", t: "Reconocimiento público", d: "Mención en el evento de cierre de campaña" },
  { icon: "coins", t: "Rebate por volumen", d: "Hasta 9% sobre la facturación del grupo" },
];

export interface EliteRow {
  n: string;
  z: string;
  amt: string;
  camp: number;
}
export const PLAN_ELITE: EliteRow[] = [
  { n: "Carmen Ruiz", z: "Bs As Norte", amt: "$2.210.000", camp: 8 },
  { n: "Laura Torres", z: "Bs As Norte", amt: "$1.684.000", camp: 6 },
  { n: "Valeria Núñez", z: "Córdoba Centro", amt: "$1.512.000", camp: 7 },
  { n: "Mónica Salas", z: "Rosario", amt: "$1.340.000", camp: 5 },
];

export const ELITE_SPARK = [12, 13, 14, 13, 15, 16, 17];
