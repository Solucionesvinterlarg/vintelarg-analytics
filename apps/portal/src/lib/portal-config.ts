/**
 * Composición del portal por rol (server + client safe — sin imports de React).
 * Define: a qué shell va cada rol, su landing, y los items de navegación.
 * Los iconos se referencian por NOMBRE lucide (string) y se resuelven en el
 * cliente vía <LucideIcon name>, para poder pasar nav desde un Server Component.
 */

export type Shell = "desktop" | "mobile";

/**
 * Roles canónicos de A-ware. Reflejan los 10 roles reales de la base
 * (`01_auth_role_definitions`). Se normalizan sinónimos en normalizeRole.
 * Internos (desktop): admin, gerente_comercial, atencion_cliente, comercial,
 * marketing, cuentas_corrientes, administracion, deposito.
 * Externos (mobile): lci, emprendedor.
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

export const SHELL_BY_ROLE: Record<Role, Shell> = {
  admin: "desktop",
  gerente_comercial: "desktop",
  atencion_cliente: "desktop",
  comercial: "desktop",
  marketing: "desktop",
  cuentas_corrientes: "desktop",
  administracion: "desktop",
  deposito: "desktop",
  lci: "mobile",
  emprendedor: "mobile",
};

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

export function shellForRole(raw: string | undefined | null): Shell {
  return SHELL_BY_ROLE[normalizeRole(raw)];
}

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
//  NAV — Desktop (sidebar). icon = nombre lucide.
// ============================================================
export interface NavItem {
  id: string;
  icon: string;
  name: string;
  href: string;
  badge?: string;
  badgeTone?: "danger" | "warn";
}
export type NavEntry = NavItem | { divider: true } | { label: string };

const NAV_GERENTE: NavEntry[] = [
  { id: "d", icon: "chart-pie", name: "Dashboard 360°", href: "/dashboard" },
  { id: "fv", icon: "users", name: "Fuerza de ventas", href: "/dashboard#fuerza" },
  { id: "pc", icon: "trending-up", name: "Performance comercial", href: "/dashboard#performance" },
  { id: "tp", icon: "trophy", name: "Top performers", href: "/dashboard#top" },
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
  { id: "d", icon: "chart-pie", name: "Dashboard 360°", href: "/dashboard" },
  { id: "fv", icon: "users", name: "Fuerza de ventas", href: "/dashboard#fuerza" },
  { id: "pc", icon: "trending-up", name: "Performance comercial", href: "/dashboard#performance" },
  { id: "tp", icon: "trophy", name: "Top performers", href: "/dashboard#top" },
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
  { id: "d", icon: "chart-pie", name: "Dashboard 360°", href: "/dashboard" },
  { id: "pc", icon: "trending-up", name: "Performance comercial", href: "/dashboard#performance" },
  { id: "mp", icon: "bar-chart-3", name: "Mix de productos", href: "/dashboard#mix" },
  { id: "tr", icon: "activity", name: "Tendencia (29 métricas)", href: "/dashboard#tendencia" },
  { id: "pl", icon: "clipboard-list", name: "Plan comercial BI", href: "/dashboard#plan" },
  { id: "br", icon: "file-text", name: "Biblioteca de reportes", href: "/dashboard#reportes" },
  { divider: true },
  { id: "crm", icon: "user-search", name: "CRM Contactos", href: "/dashboard#crm" },
  { id: "ac", icon: "graduation-cap", name: "Academia", href: "/dashboard#academia" },
];

const NAV_ATENCION: NavEntry[] = [
  { id: "tk", icon: "ticket", name: "Tickets", href: "/atencion", badge: "12" },
  { id: "rec", icon: "refresh-ccw", name: "Gestión de reclamos", href: "/atencion#reclamos", badge: "3", badgeTone: "warn" },
  { divider: true },
  { id: "crm", icon: "user-search", name: "CRM Contactos", href: "/atencion#crm" },
  { id: "fv", icon: "users", name: "Fuerza de ventas", href: "/atencion#fuerza" },
  { id: "ac", icon: "graduation-cap", name: "Academia", href: "/atencion#academia" },
];

const NAV_ADMIN: NavEntry[] = [
  { id: "pc", icon: "layout-dashboard", name: "Panel de control", href: "/admin" },
  { id: "us", icon: "users", name: "Usuarios", href: "/admin#usuarios" },
  { id: "or", icon: "building-2", name: "Organizaciones", href: "/admin#orgs" },
  { id: "pe", icon: "shield-check", name: "Permisos por rol", href: "/admin/permisos" },
  { id: "mo", icon: "puzzle", name: "Módulos habilitados", href: "/admin/modulos" },
  { divider: true },
  { id: "cc", icon: "settings", name: "Config. campañas", href: "/admin#campanas" },
  { id: "co", icon: "target", name: "Config. objetivos", href: "/admin#objetivos" },
  { id: "ac", icon: "graduation-cap", name: "Academia (admin)", href: "/admin#academia" },
  { divider: true },
  { id: "d360", icon: "chart-pie", name: "Dashboard 360°", href: "/dashboard" },
  { id: "br", icon: "file-text", name: "Reportes", href: "/admin#reportes" },
];

export const DESKTOP_NAV_BY_ROLE: Partial<Record<Role, NavEntry[]>> = {
  admin: NAV_ADMIN,
  marketing: NAV_MARKETING,
  atencion_cliente: NAV_ATENCION,
  comercial: NAV_COMERCIAL,
  gerente_comercial: NAV_GERENTE,
};

export function desktopNavForRole(raw: string | undefined | null): NavEntry[] {
  const role = normalizeRole(raw);
  // Roles internos sin nav dedicada (cuentas_corrientes, administracion,
  // deposito) caen a una vista comercial por defecto hasta tener la propia.
  return DESKTOP_NAV_BY_ROLE[role] ?? NAV_COMERCIAL;
}

/** Filtros globales del topbar desktop (handoff). */
export const DESKTOP_FILTERS = ["Campaña 202608", "División Zeus", "Canal: Consolidado", "Todas las zonas"];

// ============================================================
//  NAV — Mobile (bottom tabs). icon = nombre lucide.
// ============================================================
export interface Tab {
  id: string;
  icon: string;
  label: string;
  href: string;
}

const TABS_EMPRENDEDOR: Tab[] = [
  { id: "home", icon: "home", label: "Inicio", href: "/home" },
  { id: "cat", icon: "shopping-bag", label: "Catálogo", href: "/home#catalogo" },
  { id: "ord", icon: "package", label: "Pedidos", href: "/home#pedidos" },
  { id: "acc", icon: "wallet", label: "Cuenta", href: "/home#cuenta" },
  { id: "more", icon: "menu", label: "Más", href: "/mas" },
];

const TABS_LCI: Tab[] = [
  { id: "home", icon: "home", label: "Inicio", href: "/home" },
  { id: "camp", icon: "bar-chart-3", label: "Campaña", href: "/home#campana" },
  { id: "red", icon: "users", label: "Mi red", href: "/home#red" },
  { id: "bon", icon: "wallet", label: "Bonific.", href: "/home#bonificacion" },
  { id: "more", icon: "menu", label: "Más", href: "/mas" },
];

export function mobileTabsForRole(raw: string | undefined | null): Tab[] {
  return normalizeRole(raw) === "lci" ? TABS_LCI : TABS_EMPRENDEDOR;
}
