/**
 * Datos MOCK de Indicaciones y red (perfil Gerente, Lote 2). Espejo de
 * gerente/screens2.jsx → ScreenIndicaciones. NO es dato real.
 */
import type { BadgeTone } from "@/components/portal/badge";

export interface IndStat {
  label: string;
  value: string;
  delta?: string;
  tone: BadgeTone;
}

export const IND_STATS: IndStat[] = [
  { label: "Indicaciones del mes", value: "63", delta: "+11", tone: "success" },
  { label: "Altas confirmadas", value: "48", delta: "76%", tone: "violet" },
  { label: "En proceso de alta", value: "12", tone: "warn" },
  { label: "Caídas", value: "3", tone: "danger" },
];

export interface Patrocinio {
  padr: string;
  nuevo: string;
  fecha: string;
  estado: string;
  tone: BadgeTone;
}

export const PATROCINIOS: Patrocinio[] = [
  { padr: "Laura Torres", nuevo: "Mariela Suárez", fecha: "24/05", estado: "Alta confirmada", tone: "success" },
  { padr: "Carmen Ruiz", nuevo: "Daniela Ponce", fecha: "23/05", estado: "En proceso", tone: "warn" },
  { padr: "Sofía Martínez", nuevo: "Romina Vega", fecha: "23/05", estado: "Alta confirmada", tone: "success" },
  { padr: "Laura Torres", nuevo: "Cecilia Mora", fecha: "21/05", estado: "Alta confirmada", tone: "success" },
  { padr: "Julia Romero", nuevo: "Paula Bravo", fecha: "20/05", estado: "Caída", tone: "danger" },
];
