/**
 * Datos MOCK de Notificaciones (back-office interno, Lote 2). Espejo de
 * backoffice/data.jsx → NOTIFICATIONS. NO es dato real. Recurso único.
 */
export type NotifTone = "danger" | "warning" | "success" | "info";

export interface Notif {
  id: string;
  icon: string; // nombre lucide
  tone: NotifTone;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
}

export const NOTIFICATIONS: Notif[] = [
  { id: "n1", icon: "flag", tone: "danger", title: "Nuevo reclamo asignado", desc: "Reclamo #RC-2287 de Nora Suárez quedó a tu cargo.", time: "hace 6 min", unread: true },
  { id: "n2", icon: "calendar-clock", tone: "warning", title: "Cierre de campaña en 3 días", desc: "La campaña 05 cierra el 30/04. Revisá pedidos pendientes.", time: "hace 40 min", unread: true },
  { id: "n3", icon: "circle-check", tone: "success", title: "Pago acreditado", desc: "Se acreditó $184.200 del pedido #A-10293 (Silvia Ramírez).", time: "hace 2 h", unread: true },
  { id: "n4", icon: "user-plus", tone: "info", title: "Nuevo contacto en tu cartera", desc: "Gabriel Sosa fue agregado a la zona Patagonia.", time: "hace 5 h", unread: false },
  { id: "n5", icon: "refresh-cw", tone: "info", title: "Ajuste de cuenta corriente", desc: "Se registró un ajuste de −$12.400 en la cuenta de Diana Páez.", time: "ayer", unread: false },
  { id: "n6", icon: "package-check", tone: "success", title: "Despacho confirmado", desc: "El pedido #A-10289 salió del depósito Central.", time: "ayer", unread: false },
  { id: "n7", icon: "triangle-alert", tone: "warning", title: "Stock bajo", desc: "Set de organizadores Línea Hogar por debajo del mínimo.", time: "hace 2 días", unread: false },
];
