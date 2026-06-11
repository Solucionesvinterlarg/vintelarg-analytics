/**
 * MOCK de la red de revendedoras del líder (Lote 2). Espejo del prototipo.
 * Compartido por Mi red (tabla) y Detalle revendedora.
 */
import type { BadgeTone } from "@/components/portal/badge";

export interface Revendedora {
  id: string;
  name: string;
  idNum: string;
  puntos: number;
  ventas: string;
  cobranza: string;
  estado: string;
  tone: BadgeTone;
  sem: "green" | "amber" | "red";
  detalle: string[];
}

export const REVENDEDORAS: Revendedora[] = [
  { id: "juana", name: "Juana Ramirez", idNum: "94837261", puntos: 450, ventas: "$4.050", cobranza: "100%", estado: "Al día", tone: "success", sem: "green", detalle: ["WOE/EC", "ND/NC"] },
  { id: "maria", name: "Maria Gonzalez", idNum: "83746251", puntos: 320, ventas: "$2.880", cobranza: "70%", estado: "Atraso leve", tone: "warn", sem: "amber", detalle: ["WOE/EC"] },
  { id: "carolina", name: "Carolina Diaz", idNum: "72635140", puntos: 180, ventas: "$1.620", cobranza: "40%", estado: "Con deuda N-2", tone: "danger", sem: "red", detalle: ["ND/NC"] },
  { id: "sofia", name: "Sofia Lopez", idNum: "61524398", puntos: 610, ventas: "$5.490", cobranza: "100%", estado: "Al día", tone: "success", sem: "green", detalle: ["WOE/EC", "ND/NC"] },
  { id: "laura", name: "Laura Martinez", idNum: "50413287", puntos: 250, ventas: "$2.250", cobranza: "100%", estado: "Al día", tone: "success", sem: "green", detalle: ["WOE/EC"] },
];

export const SEM_COLOR: Record<Revendedora["sem"], string> = {
  green: "var(--aw-success)",
  amber: "var(--aw-warning)",
  red: "var(--aw-danger)",
};

export const RED_TOTAL = 80;
