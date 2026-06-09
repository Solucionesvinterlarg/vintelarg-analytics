/**
 * Composición del portal por rol (server + client safe — sin imports de React).
 * Define: el landing de cada rol y su ÚNICA lista de secciones de navegación.
 *
 * El layout NO depende del rol: la app es responsive y el dispositivo decide
 * el acomodo (sidebar en ancho ≥768px, bottom-tabs en angosto <768px). Cada
 * rol tiene una sola lista de secciones (`NAV_BY_ROLE`); la UI la dibuja como
 * sidebar (todas) o como tabs (las `primary`, + "Más" con el resto).
 *
 * Los iconos se referencian por NOMBRE lucide (string) y se resuelven en el
 * cliente vía <LucideIcon name>, para poder pasar nav desde un Server Component.
 */

/**
 * Roles canónicos de A-ware. Reflejan los 10 roles reales de la base
 * (`01_auth_role_definitions`). Se normalizan sinónimos en normalizeRole.
 * Internos: admin, gerente_comercial, atencion_cliente, comercial,
 * marketing, cuentas_corrientes, administracion, deposito.
 * Red comercial: lci, emprendedor.
 */
export type Role =
  | "admin"
  | "gerente_comercial"
  | "atencion_cliente"
  | "comercial"
  | "marketing"
  | "cuentas_corrientes"
  | "administracion"
  | "deposito"
  | "lci"
  | "emprendedor";

/** Normaliza el claim de rol del IdP a un Role canónico. Fallback: emprendedor. */
export function normalizeRole(raw: string | undefined | null): Role {
  const r = (raw ?? "").toLowerCase().trim().replace(/[\s-]+/g, "_");
  const map: Record<string, Role> = {
    admin: "admin",
    administrador: "admin",
    marketing: "marketing",
    atencion_cliente: "atencion_cliente",
    atencion: "atencion_cliente",
    atc: "atencion_cliente",
    comercial: "comercial",
    gerente_comercial: "gerente_comercial",
    gerente: "gerente_comercial",
    gc: "gerente_comercial",
    ei: "gerente_comercial",
    empresario_independiente: "gerente_comercial",
    empresaria_independiente: "gerente_comercial",
    cuentas_corrientes: "cuentas_corrientes",
    cuenta_corriente: "cuentas_corrientes",
    ctacte: "cuentas_corrientes",
    administracion: "administracion",
    deposito: "deposito",
    "depósito": "deposito",
    almacen: "deposito",
    lci: "lci",
    lider: "lci",
    lider_comercial: "lci",
    lider_comercial_independiente: "lci",
    emprendedor: "emprendedor",
    emprendedora: "emprendedor",
    revendedor: "emprendedor",
    revendedora: "emprendedor",
  };
  return map[r] ?? "emprendedor";
}

/** Ruta de aterrizaje post-login según rol. */
export const LANDING_BY_ROLE: Record<Role, string> = {
  admin: "/admin",
  gerente_comercial: "/dashboard",
  atencion_cliente: "/atencion",
  comercial: "/dashboard",
  marketing: "/dashboard",
  cuentas_corrientes: "/dashboard",
  administracion: "/dashboard",
  deposito: "/dashboard",
  lci: "/home",
  emprendedor: "/home",
};

export function landingForRole(raw: string | undefined | null): string {
  return LANDING_BY_ROLE[normalizeRole(raw)];
}

/** Etiqueta legible del rol para el footer del sidebar / avatar. */
export const ROLE_LABEL: Record<Role, string> = {
  admin: "Administrador",
  gerente_comercial: "Gerente Comercial",
  atencion_cliente: "At. al Cliente",
  comercial: "Comercial",
  marketing: "Marketing",
  cuentas_corrientes: "Cuentas Corrientes",
  administracion: "Administración",
  deposito: "Depósito",
  lci: "Líder Comercial",
  emprendedor: "Emprendedora",
};

// ============================================================
//  NAV — una sola lista de secciones por rol.
//  La UI la dibuja como sidebar (todas) o tabs (primary) + "Más".
// ============================================================

/** Una sección de navegación. icon = nombre lucide. */
export interface Section {
  id: string;
  icon: string;
  name: string;
  href: string;
  /** Aparece como bottom-tab en <768px (las 4 primeras). El resto va a "Más". */
  primary?: boolean;
  badge?: string;
  badgeTone?: "danger" | "warn";
  /** Subtítulo para el sheet "Más" (P03). */
  desc?: string;
  /** Tinte del ícono en el sheet "Más" (P03). */
  tint?: { bg: string; fg: string };
}

/** Entrada del sidebar: una sección o un separador/título visual. */
export type NavEntry = Section | { divider: true } | { label: string };

/** Type guard: ¿la entrada es una sección navegable (no divider/label)? */
export function isSection(e: NavEntry): e is Section {
  return "href" in e;
}

const NAV_GERENTE: NavEntry[] = [
  { id: "d", icon: "chart-pie", name: "Dashboard 360°", href: "/dashboard", primary: true },
  { id: "fv", icon: "users", name: "Fuerza de ventas", href: "/dashboard#fuerza", primary: true },
  { id: "pc", icon: "trending-up", name: "Performance comercial", href: "/dashboard#performance", primary: true },
  { id: "tp", icon: "trophy", name: "Top performers", href: "/dashboard#top", primary: true },
  { id: "rec", icon: "refresh-ccw", name: "Gestión de reclamos", href: "/atencion", badge: "3" },
  { id: "ind", icon: "git-branch", name: "Indicaciones", href: "/dashboard#indicaciones" },
  { id: "on", icon: "user-plus", name: "Onboarding", href: "/dashboard#onboarding" },
  { id: "cc", icon: "coins", name: "Estado de cuenta", href: "/dashboard#cuenta" },
  { id: "mp", icon: "bar-chart-3", name: "Mix de productos", href: "/dashboard#mix" },
  { id: "cob", icon: "map-pin", name: "Cobertura", href: "/dashboard#cobertura" },
  { id: "al", icon: "bell", name: "Centro de alertas", href: "/dashboard#alertas", badge: "7", badgeTone: "warn" },
  { id: "br", icon: "file-text", name: "Biblioteca de reportes", href: "/dashboard#reportes" },
  { id: "co", icon: "target", name: "Config. objetivos", href: "/dashboard#objetivos" },
  { id: "tr", icon: "activity", name: "Tendencia", href: "/dashboard#tendencia" },
  { id: "pl", icon: "clipboard-list", name: "Plan comercial", href: "/dashboard#plan" },
  { id: "ac", icon: "graduation-cap", name: "Academia", href: "/dashboard#academia" },
  { divider: true },
  { id: "tk", icon: "ticket", name: "Tickets", href: "/atencion" },
];

const NAV_COMERCIAL: NavEntry[] = [
  { id: "d", icon: "chart-pie", name: "Dashboard 360°", href: "/dashboard", primary: true },
  { id: "fv", icon: "users", name: "Fuerza de ventas", href: "/dashboard#fuerza", primary: true },
  { id: "pc", icon: "trending-up", name: "Performance comercial", href: "/dashboard#performance", primary: true },
  { id: "tp", icon: "trophy", name: "Top performers", href: "/dashboard#top", primary: true },
  { id: "mp", icon: "bar-chart-3", name: "Mix de productos", href: "/dashboard#mix" },
  { id: "cob", icon: "map-pin", name: "Cobertura", href: "/dashboard#cobertura" },
  { id: "br", icon: "file-text", name: "Biblioteca de reportes", href: "/dashboard#reportes" },
  { id: "tr", icon: "activity", name: "Tendencia", href: "/dashboard#tendencia" },
  { id: "pl", icon: "clipboard-list", name: "Plan comercial", href: "/dashboard#plan" },
  { divider: true },
  { id: "crm", icon: "user-search", name: "CRM Contactos", href: "/dashboard#crm" },
  { id: "ac", icon: "graduation-cap", name: "Academia", href: "/dashboard#academia" },
];

const NAV_MARKETING: NavEntry[] = [
  { id: "d", icon: "chart-pie", name: "Dashboard 360°", href: "/dashboard", primary: true },
  { id: "pc", icon: "trending-up", name: "Performance comercial", href: "/dashboard#performance", primary: true },
  { id: "mp", icon: "bar-chart-3", name: "Mix de productos", href: "/dashboard#mix", primary: true },
  { id: "tr", icon: "activity", name: "Tendencia (29 métricas)", href: "/dashboard#tendencia", primary: true },
  { id: "pl", icon: "clipboard-list", name: "Plan comercial BI", href: "/dashboard#plan" },
  { id: "br", icon: "file-text", name: "Biblioteca de reportes", href: "/dashboard#reportes" },
  { divider: true },
  { id: "crm", icon: "user-search", name: "CRM Contactos", href: "/dashboard#crm" },
  { id: "ac", icon: "graduation-cap", name: "Academia", href: "/dashboard#academia" },
];

const NAV_ATENCION: NavEntry[] = [
  { id: "tk", icon: "ticket", name: "Tickets", href: "/atencion", badge: "12", primary: true },
  { id: "rec", icon: "refresh-ccw", name: "Gestión de reclamos", href: "/atencion#reclamos", badge: "3", badgeTone: "warn", primary: true },
  { divider: true },
  { id: "crm", icon: "user-search", name: "CRM Contactos", href: "/atencion#crm", primary: true },
  { id: "fv", icon: "users", name: "Fuerza de ventas", href: "/atencion#fuerza", primary: true },
  { id: "ac", icon: "graduation-cap", name: "Academia", href: "/atencion#academia" },
];

const NAV_ADMIN: NavEntry[] = [
  { id: "pc", icon: "layout-dashboard", name: "Panel de control", href: "/admin", primary: true },
  { id: "us", icon: "users", name: "Usuarios", href: "/admin#usuarios", primary: true },
  { id: "or", icon: "building-2", name: "Organizaciones", href: "/admin#orgs", primary: true },
  { id: "pe", icon: "shield-check", name: "Permisos por rol", href: "/admin/permisos", primary: true },
  { id: "mo", icon: "puzzle", name: "Módulos habilitados", href: "/admin/modulos" },
  { divider: true },
  { id: "cc", icon: "settings", name: "Config. campañas", href: "/admin#campanas" },
  { id: "co", icon: "target", name: "Config. objetivos", href: "/admin#objetivos" },
  { id: "ac", icon: "graduation-cap", name: "Academia (admin)", href: "/admin#academia" },
  { divider: true },
  { id: "d360", icon: "chart-pie", name: "Dashboard 360°", href: "/dashboard" },
  { id: "br", icon: "file-text", name: "Reportes", href: "/admin#reportes" },
];

// Secciones secundarias de la red comercial (el "Más" / P03). Comunes a
// emprendedor y lci — en sidebar (≥768) se ven como ítems; en mobile (<768)
// caen al sheet "Más".
const RED_EXTRAS: Section[] = [
  { id: "reclamos", icon: "refresh-ccw", name: "Cambios y reclamos", href: "/home#reclamos", desc: "Crear o consultar", tint: { bg: "var(--tint-amber)", fg: "var(--tint-amber-fg)" } },
  { id: "facturas", icon: "file-text", name: "Mis facturas", href: "/home#facturas", desc: "Consultar facturas emitidas", tint: { bg: "var(--tint-blue)", fg: "var(--tint-blue-fg)" } },
  { id: "boletas", icon: "receipt", name: "Boletas de pago", href: "/home#boletas", desc: "Ver boletas y vencimientos", tint: { bg: "var(--tint-green)", fg: "var(--tint-green-fg)" } },
  { id: "academia", icon: "graduation-cap", name: "Academia", href: "/home#academia", desc: "Cursos y materiales", tint: { bg: "var(--aw-violet-light)", fg: "var(--aw-violet)" } },
  { id: "asistente", icon: "bot", name: "Asistente IA", href: "/home#asistente", desc: "Ayuda inteligente", tint: { bg: "var(--aw-violet-light)", fg: "var(--aw-violet)" } },
  { id: "perfil", icon: "user", name: "Mi perfil", href: "/home#perfil", desc: "Datos personales y configuración", tint: { bg: "#F1EFEA", fg: "#5C5A54" } },
];

const NAV_EMPRENDEDOR: NavEntry[] = [
  { id: "home", icon: "home", name: "Inicio", href: "/home", primary: true },
  { id: "cat", icon: "shopping-bag", name: "Catálogo", href: "/home#catalogo", primary: true },
  { id: "ord", icon: "package", name: "Pedidos", href: "/home#pedidos", primary: true },
  { id: "acc", icon: "wallet", name: "Cuenta", href: "/home#cuenta", primary: true },
  ...RED_EXTRAS,
];

const NAV_LCI: NavEntry[] = [
  { id: "home", icon: "home", name: "Inicio", href: "/home", primary: true },
  { id: "camp", icon: "bar-chart-3", name: "Campaña", href: "/home#campana", primary: true },
  { id: "red", icon: "users", name: "Mi red", href: "/home#red", primary: true },
  { id: "bon", icon: "wallet", name: "Bonificación", href: "/home#bonificacion", primary: true },
  ...RED_EXTRAS,
];

/** Única lista de secciones por rol. La UI decide sidebar vs tabs por ancho. */
export const NAV_BY_ROLE: Record<Role, NavEntry[]> = {
  admin: NAV_ADMIN,
  gerente_comercial: NAV_GERENTE,
  atencion_cliente: NAV_ATENCION,
  comercial: NAV_COMERCIAL,
  marketing: NAV_MARKETING,
  // Internos de back-office sin nav dedicada todavía → vista comercial.
  cuentas_corrientes: NAV_COMERCIAL,
  administracion: NAV_COMERCIAL,
  deposito: NAV_COMERCIAL,
  lci: NAV_LCI,
  emprendedor: NAV_EMPRENDEDOR,
};

/** Lista completa de secciones del rol (para el sidebar). */
export function navForRole(raw: string | undefined | null): NavEntry[] {
  return NAV_BY_ROLE[normalizeRole(raw)];
}

/** Secciones `primary` (máx. 4) que se muestran como bottom-tabs en mobile. */
export function tabsForRole(raw: string | undefined | null): Section[] {
  return navForRole(raw).filter(isSection).filter((s) => s.primary).slice(0, 4);
}

/** Resto de secciones (no-primary) que se muestran en el sheet "Más" en mobile. */
export function extraSectionsForRole(raw: string | undefined | null): Section[] {
  return navForRole(raw).filter(isSection).filter((s) => !s.primary);
}

/** Filtros globales del topbar desktop (handoff). */
export const DESKTOP_FILTERS = ["Campaña 202608", "División Zeus", "Canal: Consolidado", "Todas las zonas"];
