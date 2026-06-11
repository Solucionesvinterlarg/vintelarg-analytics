/**
 * Datos MOCK de Top performers (perfil Gerente, Lote 2). Espejo de
 * gerente/screens1.jsx → ScreenTop. NO es dato real.
 */
import type { BadgeTone } from "@/components/portal/badge";

export interface Performer {
  pos: number;
  n: string;
  id?: string;
  score: number;
  badges: [string, BadgeTone][];
  fact: string;
  uds: number;
  cre: string;
  sp: number[];
}

export const TOP_PODIO: Performer[] = [
  { pos: 1, n: "MARÍA F. CABRERA", id: "403387", score: 4.9, badges: [["Top Ventas", "success"], ["Mayor Crecimiento", "violet"], ["Racha Activa", "info"]], fact: "$358,6K", uds: 29, cre: "+45%", sp: [180, 220, 250, 290, 320, 358] },
  { pos: 2, n: "ALEYDA SANCHEZ", id: "182401", score: 4.8, badges: [["Mejor Score", "violet"], ["Meta Superada", "success"]], fact: "$293,9K", uds: 18, cre: "+30%", sp: [150, 180, 210, 240, 270, 294] },
  { pos: 3, n: "SILVINA RINALDI", id: "182505", score: 4.5, badges: [["Cliente Premium", "info"], ["Meta Superada", "success"]], fact: "$152,4K", uds: 7, cre: "+15%", sp: [110, 120, 130, 140, 148, 152] },
];

export const TOP_REST: Performer[] = [
  { pos: 4, n: "MALENA AGOSTINO", score: 4.0, badges: [["Meta Superada", "success"]], fact: "$44,9K", uds: 2, cre: "+5%", sp: [30, 34, 38, 41, 43, 45] },
  { pos: 5, n: "MARÍA MURRUNI", score: 4.2, badges: [["Racha Activa", "info"]], fact: "$34,2K", uds: 3, cre: "+10%", sp: [24, 27, 29, 31, 33, 34] },
];

/** Color de medalla por posición (oro/plata/bronce). */
export const MEDALS = ["#E6B33E", "#B8BCC4", "#C08457"];

export const TOP_FILTERS = ["Logro: Todos", "Zona: 051"];
