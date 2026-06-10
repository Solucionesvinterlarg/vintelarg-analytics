/**
 * Datos MOCK de Academia (perfil Gerente, Lote 2). Espejo de
 * gerente/screens4.jsx → ScreenAcademia. NO es dato real.
 */
export interface Curso {
  t: string;
  d: string;
  mod: "Online" | "Presencial";
  prog: number; // 0–100
  cat: string;
}

export const CURSOS: Curso[] = [
  { t: "Liderazgo de equipos comerciales", d: "12 jun", mod: "Online", prog: 60, cat: "Liderazgo" },
  { t: "Cierre de campaña 202608", d: "18 jun", mod: "Presencial", prog: 0, cat: "Operación" },
  { t: "Onboarding de nuevas UI", d: "24 jun", mod: "Online", prog: 0, cat: "Onboarding" },
  { t: "Venta consultiva de Cosméticos", d: "Disponible", mod: "Online", prog: 100, cat: "Producto" },
  { t: "Gestión de cuenta corriente", d: "Disponible", mod: "Online", prog: 35, cat: "Finanzas" },
  { t: "Storytelling para revendedoras", d: "Disponible", mod: "Online", prog: 0, cat: "Marketing" },
];

export const ACADEMIA_DONE = "186 capacitaciones completadas";
