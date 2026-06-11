/**
 * Datos MOCK de Mi perfil (back-office, Lote 2). La identidad (nombre, email,
 * rol, org) llega real desde la sesión; estos son los campos/preferencias de
 * ejemplo que aún no tienen fuente. Recurso único.
 */
export const PERFIL_MOCK = {
  phone: "+54 11 4555-0142",
  idInterno: "NB-01187",
  joined: "Marzo 2024",
};

export interface PrefToggle {
  label: string;
  on: boolean;
}
export const PREF_TOGGLES: PrefToggle[] = [
  { label: "Avisos por email", on: true },
  { label: "Notificaciones push", on: true },
  { label: "Reclamos asignados", on: true },
  { label: "Resumen semanal", on: false },
];
