import type { BadgeTone } from "@/components/portal/badge";

export interface Ticket {
  id: string;
  estado: "Abierto" | "En curso" | "Resuelto";
  asunto: string;
  emp: string;
  zona: string;
  motivo: string;
  prio: "Alta" | "Media" | "Baja";
  creado: string;
  asig: string;
}

export const TICKETS: Ticket[] = [
  { id: "TK-3142", estado: "Abierto",   asunto: "Producto roto en entrega",      emp: "Laura Méndez",    zona: "Z-204", motivo: "Reclamo",          prio: "Alta",  creado: "hace 12 min", asig: "Sin asignar" },
  { id: "TK-3141", estado: "En curso",  asunto: "Solicita cambio de talle",      emp: "Verónica Aguilar",zona: "Z-207", motivo: "Cambio",           prio: "Media", creado: "hace 38 min", asig: "L. Ríos" },
  { id: "TK-3140", estado: "Abierto",   asunto: "No accede a la app",            emp: "Mariana Pereyra", zona: "Z-302", motivo: "Problema técnico", prio: "Alta",  creado: "hace 1 h",    asig: "Sin asignar" },
  { id: "TK-3138", estado: "En curso",  asunto: "Consulta por bonificación",     emp: "Romina Salas",    zona: "Z-204", motivo: "Consulta",         prio: "Baja",  creado: "hace 2 h",    asig: "M. Vega" },
  { id: "TK-3137", estado: "Resuelto",  asunto: "Diferencia en facturación",     emp: "Cintia Borges",   zona: "Z-105", motivo: "Reclamo",          prio: "Media", creado: "hace 3 h",    asig: "L. Ríos" },
  { id: "TK-3135", estado: "Abierto",   asunto: "Cambio por defecto de fábrica", emp: "Daniela Quiroga", zona: "Z-204", motivo: "Cambio",           prio: "Media", creado: "hace 4 h",    asig: "Sin asignar" },
  { id: "TK-3134", estado: "En curso",  asunto: "No le llegó parte del pedido",  emp: "Florencia Núñez", zona: "Z-301", motivo: "Reclamo",          prio: "Alta",  creado: "hace 5 h",    asig: "M. Vega" },
  { id: "TK-3131", estado: "Resuelto",  asunto: "Capacitación nuevo módulo",     emp: "Yamila Acosta",   zona: "Z-208", motivo: "Consulta",         prio: "Baja",  creado: "ayer",        asig: "P. Costa" },
  { id: "TK-3129", estado: "Resuelto",  asunto: "Olvido de contraseña",          emp: "Carla Suárez",    zona: "Z-110", motivo: "Problema técnico", prio: "Baja",  creado: "ayer",        asig: "L. Ríos" },
];

export const estadoTone: Record<Ticket["estado"], BadgeTone> = {
  Abierto:  "danger",
  "En curso": "warn",
  Resuelto: "success",
};

export const prioTone: Record<Ticket["prio"], BadgeTone> = {
  Alta:  "danger",
  Media: "warn",
  Baja:  "neutral",
};
