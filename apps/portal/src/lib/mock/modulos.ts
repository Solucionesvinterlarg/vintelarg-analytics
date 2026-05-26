import type { BadgeTone } from "@/components/portal/badge";

export interface Modulo {
  key: string;
  icon: string;
  title: string;
  desc: string;
  etapa: string;
  etapaTone: BadgeTone;
  defaultOn: boolean;
  color: string;
  bg: string;
}

export const MODULOS: Modulo[] = [
  { key: "cuenta-corriente", icon: "wallet",         title: "Cuenta corriente",    desc: "Saldo, movimientos, pagos",                 etapa: "Etapa 1", etapaTone: "success", defaultOn: true,  color: "#236A40",            bg: "#F0FDF4" },
  { key: "perfil",           icon: "user",           title: "Perfil",              desc: "Datos personales, configuración",            etapa: "Etapa 1", etapaTone: "success", defaultOn: true,  color: "#5C5A54",            bg: "#F1EFEA" },
  { key: "pedidos",          icon: "shopping-bag",   title: "Pedidos y catálogo",  desc: "Carga de pedidos, catálogo por campaña",    etapa: "Etapa 2", etapaTone: "info",    defaultOn: true,  color: "#1E448F",            bg: "#EFF6FF" },
  { key: "promociones",      icon: "tag",            title: "Promociones",         desc: "Ofertas y reglas de campaña",               etapa: "Etapa 2", etapaTone: "info",    defaultOn: true,  color: "#1E448F",            bg: "#EFF6FF" },
  { key: "reclamos",         icon: "refresh-ccw",    title: "Cambios y reclamos",  desc: "Crear, aprobar, seguimiento",               etapa: "Etapa 3", etapaTone: "warn",    defaultOn: true,  color: "#84541A",            bg: "#FFFBEB" },
  { key: "facturas",         icon: "file-text",      title: "Facturas",            desc: "Consulta de facturas emitidas",             etapa: "Futuro",  etapaTone: "neutral", defaultOn: false, color: "#5C5A54",            bg: "#F1EFEA" },
  { key: "boletas",          icon: "receipt",        title: "Boletas de pago",     desc: "Consulta de boletas y vencimientos",        etapa: "Futuro",  etapaTone: "neutral", defaultOn: false, color: "#5C5A54",            bg: "#F1EFEA" },
  { key: "academia",         icon: "graduation-cap", title: "Academia",            desc: "Cursos, materiales, capacitación",          etapa: "Futuro",  etapaTone: "neutral", defaultOn: false, color: "var(--aw-violet-ink)", bg: "var(--aw-violet-light)" },
  { key: "ai-agent",         icon: "bot",            title: "AI Agent",            desc: "Asistente inteligente de soporte",          etapa: "Futuro",  etapaTone: "neutral", defaultOn: false, color: "var(--aw-violet-ink)", bg: "var(--aw-violet-light)" },
  { key: "notificaciones",   icon: "bell",           title: "Notificaciones",      desc: "Alertas push y centro de notificaciones",   etapa: "Futuro",  etapaTone: "neutral", defaultOn: false, color: "#84541A",            bg: "#FFFBEB" },
  { key: "chat",             icon: "message-circle", title: "Chat en vivo",        desc: "Mensajería en tiempo real",                 etapa: "Futuro",  etapaTone: "neutral", defaultOn: false, color: "#236A40",            bg: "#F0FDF4" },
];
