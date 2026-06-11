/**
 * Datos MOCK de Config. objetivos (perfil Gerente, Lote 2). Espejo de
 * gerente/screens3.jsx → ScreenObjetivos. NO es dato real (valores de ejemplo;
 * las zonas/divisiones reales salen de la base).
 */
export interface ObjKpi {
  label: string;
  value: string;
  unit: string;
  icon: string; // nombre lucide
}

export const OBJ_KPIS: ObjKpi[] = [
  { label: "Facturación objetivo", value: "54.800.000", unit: "$", icon: "dollar-sign" },
  { label: "% de activación", value: "85", unit: "%", icon: "zap" },
  { label: "Cobertura objetivo", value: "88", unit: "%", icon: "map-pin" },
  { label: "Ticket promedio meta", value: "16.000", unit: "$", icon: "receipt" },
];

export interface ObjZona {
  z: string;
  meta: string;
}

export const OBJ_ZONAS: ObjZona[] = [
  { z: "Bs As Norte", meta: "14.200.000" },
  { z: "Bs As Sur", meta: "9.800.000" },
  { z: "Córdoba Centro", meta: "8.400.000" },
  { z: "Rosario", meta: "6.100.000" },
  { z: "Mendoza", meta: "4.900.000" },
];

export const OBJ_REPARTIDO = "$43,4 M repartidos";
