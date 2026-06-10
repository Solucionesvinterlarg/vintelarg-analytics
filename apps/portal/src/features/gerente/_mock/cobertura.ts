/**
 * Datos MOCK de Cobertura territorial (perfil Gerente, Lote 2). Espejo de
 * gerente/screens3.jsx → ScreenCobertura. NO es dato real.
 * Semáforo: ≥80 success · 65–79 warn · <65 danger.
 */
export type CobTone = "success" | "warn" | "danger";

export interface ZonaCobertura {
  z: string;
  cob: number; // % cobertura
  act: number; // activas
  pot: number; // potenciales
  tone: CobTone;
}

export const COBERTURA_ZONAS: ZonaCobertura[] = [
  { z: "Bs As Norte", cob: 92, act: 412, pot: 448, tone: "success" },
  { z: "Bs As Sur", cob: 78, act: 286, pot: 367, tone: "warn" },
  { z: "Córdoba Centro", cob: 84, act: 198, pot: 236, tone: "success" },
  { z: "Rosario", cob: 71, act: 154, pot: 217, tone: "warn" },
  { z: "Mendoza", cob: 63, act: 121, pot: 192, tone: "danger" },
  { z: "La Plata", cob: 88, act: 167, pot: 190, tone: "success" },
  { z: "Mar del Plata", cob: 58, act: 94, pot: 162, tone: "danger" },
  { z: "Tucumán", cob: 69, act: 88, pot: 128, tone: "warn" },
];
