/**
 * Datos MOCK de Logros (gamificación) de la app emprendedora (Lote 2).
 * Espejo de emprendedora/screens-b.jsx. NO es dato real.
 */
import type { BadgeTone } from "@/components/portal/badge";

export interface Medal {
  id: string;
  n: string;
  ic: string; // nombre lucide
  got: boolean;
  tone: BadgeTone;
}

export const MEDALS: Medal[] = [
  { id: "estrella", n: "Vendedora Estrella", ic: "star", got: true, tone: "warn" },
  { id: "top10", n: "Top 10 Nacional", ic: "trophy", got: true, tone: "violet" },
  { id: "racha", n: "Racha x5", ic: "flame", got: true, tone: "danger" },
  { id: "combos", n: "Maestra Combos", ic: "layers", got: false, tone: "neutral" },
  { id: "mentora", n: "Mentora", ic: "users", got: false, tone: "neutral" },
  { id: "elite", n: "Élite VIP", ic: "crown", got: false, tone: "neutral" },
];

export const PODIUM = [
  { p: 2, n: "Ana Rodríguez", pts: 465, h: 54, me: false },
  { p: 1, n: "Juana Pérez", pts: 480, h: 72, me: false },
  { p: 3, n: "María Antonieta", pts: 450, h: 44, me: true },
];

export const getMedal = (id: string): Medal => MEDALS.find((m) => m.id === id) ?? MEDALS[0];

/** bg/fg de un tile por tono (los --bdg-* del prototipo). */
export function toneTile(tone: BadgeTone): { bg: string; fg: string } {
  switch (tone) {
    case "success": return { bg: "var(--aw-success-light)", fg: "#236A40" };
    case "warn": return { bg: "var(--aw-warning-light)", fg: "#84541A" };
    case "danger": return { bg: "var(--aw-danger-light)", fg: "#7C2F35" };
    case "info": return { bg: "var(--tint-blue)", fg: "var(--tint-blue-fg)" };
    case "violet": return { bg: "var(--aw-violet-light)", fg: "var(--aw-violet-ink)" };
    default: return { bg: "var(--aw-app-bg)", fg: "var(--fg-subtle)" };
  }
}
