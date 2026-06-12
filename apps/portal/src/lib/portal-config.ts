/**
 * Composición del portal por rol (server + client safe — sin imports de React).
 *
 * Enfoque híbrido:
 *  - PRESENTACIÓN (label, icono lucide, href, primary, tinte) vive en el código,
 *    en `SECTION_CATALOG`, indexado por la CLAVE de recurso ("dashboard:360").
 *  - PERMISOS (qué claves ve cada rol) son DATOS de la base
 *    (`01_auth_role_permissions`, allowed=true), leídos en runtime por
 *    `getNavForUser`/`getAllowedResources` (lib/queries.ts). NO se hardcodean
 *    claves por rol acá. El menú = catálogo filtrado por las claves permitidas,
 *    ordenado por `SECTION_ORDER` (orden del código, NO de la base).
 *
 * Los iconos se referencian por NOMBRE lucide (string) y se resuelven en el
 * cliente vía <LucideIcon name>, para poder pasar nav desde un Server Component.
 */

/**
 * Roles canónicos de A-ware. Reflejan los 10 roles reales de la base
 * (`01_auth_role_definitions`). Se normalizan sinónimos en normalizeRole.
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
  | "lci_lider"
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
    lci: "lci_lider",
    lci_lider: "lci_lider",
    lider: "lci_lider",
    lider_comercial: "lci_lider",
    lider_comercial_independiente: "lci_lider",
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
  // Atención al cliente: su trabajo de tickets/reclamos vive en el módulo CRM;
  // en el portal aterriza en Fuerza de ventas (1er ítem de su menú). /atencion
  // ya no es su landing ni está en su menú.
  atencion_cliente: "/dashboard/fuerza-ventas",
  comercial: "/dashboard",
  marketing: "/dashboard",
  cuentas_corrientes: "/inicio",
  administracion: "/inicio",
  deposito: "/inicio",
  lci_lider: "/lci/inicio",
  emprendedor: "/emp/inicio",
};

export function landingForRole(raw: string | undefined | null): string {
  return LANDING_BY_ROLE[normalizeRole(raw)];
}

/**
 * Audiencia "red comercial" (app mobile con shell phone) vs interna (shell
 * sidebar). Resuelto por rol server-side (no por usuario, no if-rol en el
 * render): el shell lo elige el layout. lci_lider es desktop (sidebar), NO phone.
 */
const PHONE_AUDIENCE: Partial<Record<Role, true>> = { emprendedor: true };
export function isPhoneAudience(raw: string | undefined | null): boolean {
  return !!PHONE_AUDIENCE[normalizeRole(raw)];
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
  lci_lider: "Líder Comercial",
  emprendedor: "Emprendedora",
};

// ============================================================
//  Catálogo de secciones (PRESENTACIÓN), indexado por clave de recurso.
//  La UI dibuja el menú como sidebar (todas) o tabs (primary) + "Más".
// ============================================================

/** Una sección de navegación. icon = nombre lucide. `id` = clave de recurso. */
export interface Section {
  /** Clave de recurso, ej. "dashboard:360" (= key en SECTION_CATALOG). */
  id: string;
  icon: string;
  name: string;
  href: string;
  /** Aparece como bottom-tab en <768px (máx. 4 por rol). El resto va a "Más". */
  primary?: boolean;
  badge?: string;
  badgeTone?: "danger" | "warn";
  /** Subtítulo para el sheet "Más" (P03). */
  desc?: string;
  /** Tinte del ícono en el sheet "Más" (P03). */
  tint?: { bg: string; fg: string };
  /**
   * Módulo del ecosistema (`01_auth_organization_modules.module_key`) al que
   * pertenece el ítem. Si el módulo está inactivo para la org, el ítem se
   * oculta del menú aunque el permiso esté en true (cascada de módulos). Sin
   * `module` = siempre disponible (no se filtra por cascada).
   */
  module?: string;
}

/** Entrada del sidebar: una sección o un separador/título visual. */
export type NavEntry = Section | { divider: true } | { label: string };

/** Type guard: ¿la entrada es una sección navegable (no divider/label)? */
export function isSection(e: NavEntry): e is Section {
  return "href" in e;
}

const TINT = {
  amber: { bg: "var(--tint-amber)", fg: "var(--tint-amber-fg)" },
  blue: { bg: "var(--tint-blue)", fg: "var(--tint-blue-fg)" },
  green: { bg: "var(--tint-green)", fg: "var(--tint-green-fg)" },
  violet: { bg: "var(--aw-violet-light)", fg: "var(--aw-violet)" },
  neutral: { bg: "#F1EFEA", fg: "#5C5A54" },
} as const;

/**
 * Catálogo único: clave de recurso → Section (presentación). Cubre las 46 claves
 * sembradas en `01_auth_role_permissions` + `shared:inicio` (landing, no
 * permisada). hrefs con `#ancla` apuntan a secciones de la página landing;
 * algunos son placeholders hasta que exista el módulo.
 */
export const SECTION_CATALOG: Record<string, Section> = {
  // landing (no permisada; siempre disponible para la red comercial)
  "shared:inicio": { id: "shared:inicio", icon: "home", name: "Inicio", href: "/", primary: true },
  // Inicio/Próximamente del back-office interno (teaser "acceso mínimo"). Es un
  // recurso permisado por matriz (a diferencia de shared:inicio, que es el landing
  // inyectado de la red comercial). Sin módulo: siempre disponible.
  "shared:proximamente": { id: "shared:proximamente", icon: "sparkles", name: "Inicio", href: "/inicio", primary: true },

  // ---- admin ----
  "admin:panel": { id: "admin:panel", icon: "layout-dashboard", name: "Panel de control", href: "/admin", primary: true },
  "admin:usuarios": { id: "admin:usuarios", icon: "users", name: "Usuarios", href: "/admin/usuarios", primary: true },
  "admin:organizaciones": { id: "admin:organizaciones", icon: "building-2", name: "Organizaciones", href: "/admin/organizaciones", primary: true },
  "admin:permisos": { id: "admin:permisos", icon: "shield-check", name: "Permisos por rol", href: "/admin/permisos", primary: true },
  "admin:modulos": { id: "admin:modulos", icon: "puzzle", name: "Módulos habilitados", href: "/admin/modulos" },
  "admin:campanas": { id: "admin:campanas", icon: "settings", name: "Config. campañas", href: "/admin/campanias" },

  // ---- dashboard (interno) → módulo reporteria ----
  "dashboard:360": { id: "dashboard:360", icon: "chart-pie", name: "Dashboard 360°", href: "/dashboard", primary: true, module: "reporteria" },
  "dashboard:fuerza-ventas": { id: "dashboard:fuerza-ventas", icon: "users", name: "Fuerza de ventas", href: "/dashboard/fuerza-ventas", primary: true, module: "reporteria" },
  "dashboard:performance": { id: "dashboard:performance", icon: "trending-up", name: "Performance comercial", href: "/dashboard/performance", primary: true, module: "reporteria" },
  "dashboard:top-performers": { id: "dashboard:top-performers", icon: "trophy", name: "Top performers", href: "/dashboard/top-performers", primary: true, module: "reporteria" },
  "dashboard:indicaciones": { id: "dashboard:indicaciones", icon: "git-branch", name: "Indicaciones", href: "/dashboard/indicaciones", module: "reporteria" },
  "dashboard:onboarding": { id: "dashboard:onboarding", icon: "user-plus", name: "Onboarding", href: "/dashboard/onboarding", module: "reporteria" },
  "dashboard:estado-cuenta": { id: "dashboard:estado-cuenta", icon: "coins", name: "Estado de cuenta", href: "/dashboard/estado-cuenta", module: "reporteria" },
  "dashboard:mix-productos": { id: "dashboard:mix-productos", icon: "bar-chart-3", name: "Mix de productos", href: "/dashboard/mix-productos", primary: true, module: "reporteria" },
  "dashboard:cobertura": { id: "dashboard:cobertura", icon: "map-pin", name: "Cobertura", href: "/dashboard/cobertura", module: "reporteria" },
  "dashboard:alertas": { id: "dashboard:alertas", icon: "bell", name: "Centro de alertas", href: "/dashboard/alertas", module: "reporteria" },
  "dashboard:reportes": { id: "dashboard:reportes", icon: "file-text", name: "Biblioteca de reportes", href: "/dashboard/reportes", module: "reporteria" },
  "dashboard:objetivos": { id: "dashboard:objetivos", icon: "target", name: "Config. objetivos", href: "/dashboard/objetivos", module: "reporteria" },
  "dashboard:tendencia": { id: "dashboard:tendencia", icon: "activity", name: "Tendencia", href: "/dashboard/tendencia", primary: true, module: "reporteria" },
  "dashboard:plan-bi": { id: "dashboard:plan-bi", icon: "clipboard-list", name: "Plan comercial BI", href: "/dashboard/plan-bi", module: "reporteria" },

  // ---- ops (back-office / atención) ----
  "ops:reclamos": { id: "ops:reclamos", icon: "refresh-ccw", name: "Gestión de reclamos", href: "/atencion#reclamos", primary: true, module: "returns" },
  "ops:tickets": { id: "ops:tickets", icon: "ticket", name: "Tickets", href: "/atencion", primary: true, module: "crm" },
  "ops:pedidos": { id: "ops:pedidos", icon: "package", name: "Pedidos", href: "/atencion#pedidos", module: "commerce" },
  "ops:facturas": { id: "ops:facturas", icon: "file-text", name: "Facturas", href: "/atencion#facturas", module: "commerce" },
  "ops:boletas": { id: "ops:boletas", icon: "receipt", name: "Boletas de pago", href: "/atencion#boletas", module: "commerce" },

  // ---- sat (CRM / app de pedidos) ----
  "sat:crm": { id: "sat:crm", icon: "user-search", name: "CRM Contactos", href: "/atencion#crm", primary: true, module: "crm" },
  "sat:pedidos-app": { id: "sat:pedidos-app", icon: "smartphone", name: "Pedidos App", href: "/atencion#pedidos-app", module: "commerce" },

  // ---- lci (consola DESKTOP del Líder Comercial Independiente) — recursos del
  //      catálogo, rutas /lci/*. Render en AppShell desktop (sidebar). MOCK Lote 2.
  "lci:inicio": { id: "lci:inicio", icon: "home", name: "Inicio", href: "/lci/inicio", primary: true },
  "lci:campana": { id: "lci:campana", icon: "bar-chart-3", name: "Campaña", href: "/lci/campana" },
  "lci:red": { id: "lci:red", icon: "users", name: "Mi red", href: "/lci/red" },
  "lci:bonificacion": { id: "lci:bonificacion", icon: "receipt", name: "Bonificación", href: "/lci/bonificacion" },
  "lci:dashboard": { id: "lci:dashboard", icon: "layout-dashboard", name: "Dashboard líderes", href: "/lci/dashboard" },
  "lci:revendedora": { id: "lci:revendedora", icon: "user-search", name: "Detalle revendedora", href: "/lci/revendedora" },
  "lci:pedido-woe": { id: "lci:pedido-woe", icon: "package", name: "Pedido WOE", href: "/lci/pedido-woe" },
  "lci:simulador": { id: "lci:simulador", icon: "calculator", name: "Simulador de títulos", href: "/lci/simulador" },
  "lci:plan-lucero": { id: "lci:plan-lucero", icon: "star", name: "Plan Lucero", href: "/lci/plan-lucero" },
  "lci:reportes": { id: "lci:reportes", icon: "file-text", name: "Reportes de líder", href: "/lci/reportes" },
  "lci:asistente": { id: "lci:asistente", icon: "bot", name: "Asistente IA", href: "/lci/asistente" },
  "lci:perfil": { id: "lci:perfil", icon: "user", name: "Mi perfil", href: "/lci/perfil" },

  // ---- emp (app EMPRENDEDORA) — recursos del portal, rutas /emp/*. Son
  //      recursos ÚNICOS (cualquier rol los puede prender por matriz). El shell
  //      "phone" los presenta como bottom-tabs (primary) + drawer (resto).
  "emp:inicio": { id: "emp:inicio", icon: "home", name: "Inicio", href: "/emp/inicio", primary: true },
  "emp:catalogo": { id: "emp:catalogo", icon: "shopping-bag", name: "Pedidos", href: "/emp/catalogo", primary: true },
  "emp:logros": { id: "emp:logros", icon: "trophy", name: "Logros", href: "/emp/logros", primary: true },
  "emp:perfil": { id: "emp:perfil", icon: "user", name: "Perfil", href: "/emp/perfil", primary: true },
  "emp:finanzas": { id: "emp:finanzas", icon: "wallet", name: "Mis Finanzas", href: "/emp/finanzas" },
  "emp:negocio": { id: "emp:negocio", icon: "bar-chart-3", name: "Mi Negocio", href: "/emp/negocio" },
  "emp:programas": { id: "emp:programas", icon: "gift", name: "Programas & Beneficios", href: "/emp/programas" },
  "emp:incentivos": { id: "emp:incentivos", icon: "target", name: "Mis Incentivos", href: "/emp/incentivos" },
  "emp:seguimiento": { id: "emp:seguimiento", icon: "truck", name: "Seguimiento Pedidos", href: "/emp/seguimiento" },
  "emp:indicaciones": { id: "emp:indicaciones", icon: "users", name: "Mis Indicaciones", href: "/emp/indicaciones" },
  "emp:onboarding": { id: "emp:onboarding", icon: "compass", name: "Onboarding", href: "/emp/onboarding" },
  "emp:reclamos": { id: "emp:reclamos", icon: "message-square-warning", name: "Reclamos", href: "/emp/reclamos" },
  "emp:novedades": { id: "emp:novedades", icon: "bell", name: "Novedades", href: "/emp/novedades" },

  // ---- shared (transversales; en mobile caen al sheet "Más") ----
  "shared:academia": { id: "shared:academia", icon: "graduation-cap", name: "Academia", href: "/academia", desc: "Cursos y materiales", tint: TINT.violet, module: "lms" },
  "shared:ai-agent": { id: "shared:ai-agent", icon: "bot", name: "Asistente IA", href: "/asistente", desc: "Ayuda inteligente", tint: TINT.violet, module: "ai_agent" },
  // Notificaciones y Mi perfil: pantallas core internas, siempre disponibles (sin
  // gate de módulo) y primary (bottom-tabs del back-office en mobile).
  "shared:notificaciones": { id: "shared:notificaciones", icon: "bell", name: "Notificaciones", href: "/notificaciones", primary: true },
  "shared:perfil": { id: "shared:perfil", icon: "user", name: "Mi perfil", href: "/perfil", primary: true, desc: "Datos personales y configuración", tint: TINT.neutral },
};

/**
 * Orden de render del menú (del código, NO de la base). El menú de un rol es el
 * catálogo filtrado por sus claves permitidas y ordenado por este array. Los
 * `primary` que queden en las primeras 4 posiciones del rol van a bottom-tabs.
 */
export const SECTION_ORDER: string[] = [
  "shared:inicio",
  "shared:proximamente",
  // admin
  "admin:panel", "admin:usuarios", "admin:organizaciones", "admin:permisos", "admin:modulos", "admin:campanas",
  // dashboard
  "dashboard:360", "dashboard:fuerza-ventas", "dashboard:performance", "dashboard:top-performers",
  "dashboard:indicaciones", "dashboard:onboarding", "dashboard:estado-cuenta", "dashboard:mix-productos",
  "dashboard:cobertura", "dashboard:alertas", "dashboard:reportes", "dashboard:objetivos",
  "dashboard:tendencia", "dashboard:plan-bi",
  // ops
  "ops:reclamos", "ops:tickets", "ops:pedidos", "ops:facturas", "ops:boletas",
  // sat
  "sat:crm", "sat:pedidos-app",
  // lci (consola desktop del líder) — orden del sidebar del handoff
  "lci:inicio", "lci:campana", "lci:red", "lci:bonificacion", "lci:dashboard",
  "lci:revendedora", "lci:pedido-woe", "lci:simulador", "lci:plan-lucero", "lci:reportes", "lci:asistente", "lci:perfil",
  // emp (app emprendedora) — tabs primero (Inicio/Pedidos/Logros/Perfil), resto al drawer
  "emp:inicio", "emp:catalogo", "emp:logros", "emp:perfil",
  "emp:finanzas", "emp:negocio", "emp:programas", "emp:incentivos",
  "emp:seguimiento", "emp:indicaciones", "emp:onboarding", "emp:reclamos", "emp:novedades",
  // shared (resto)
  "shared:academia", "shared:ai-agent", "shared:notificaciones", "shared:perfil",
];

const ORDER_INDEX: Record<string, number> = Object.fromEntries(SECTION_ORDER.map((k, i) => [k, i]));

// La visibilidad del menú (qué clave ve cada rol) sale 100% de la matriz de
// permisos de la base (`01_auth_role_permissions`) vía
// `getNavForUser`/`getAllowedResources` en lib/queries.ts. NO se hardcodean
// claves por rol acá: se removió el stand-in estático (ROLE_RESOURCE_KEYS) para
// no tener dos fuentes de verdad ni confundir lecturas futuras.

// ============================================================
//  Override de href por rol (genérico, reusable).
//  Una misma clave de recurso puede apuntar a destinos distintos según el rol
//  (ej. ops:tickets → /atencion para Atención al Cliente, pero → placeholder CRM
//  para el Gerente). En vez de branchear por rol en la UI, se declara acá un mapa
//  rol → (clave → href) que PISA el href del catálogo al construir el menú.
//  Pensado para reutilizarse con otros perfiles que compartan claves.
// ============================================================
export const ROLE_HREF_OVERRIDES: Partial<Record<Role, Record<string, string>>> = {
  gerente_comercial: {
    // Reclamos/Tickets del gerente: placeholder del módulo CRM (no el /atencion real).
    "ops:reclamos": "/dashboard/reclamos",
    "ops:tickets": "/dashboard/tickets",
  },
  marketing: {
    // CRM Contactos de marketing: placeholder del módulo CRM (no el /atencion real).
    "sat:crm": "/dashboard/crm",
  },
  comercial: {
    // CRM Contactos de comercial: placeholder del módulo CRM (no el /atencion real).
    "sat:crm": "/dashboard/crm",
  },
  // Back-office interno: CRM Contactos → placeholder del módulo CRM.
  cuentas_corrientes: { "sat:crm": "/dashboard/crm" },
  administracion: { "sat:crm": "/dashboard/crm" },
  deposito: { "sat:crm": "/dashboard/crm" },
  // Atención al cliente: CRM Contactos → placeholder. Tickets/Reclamos son
  // navegación interna del módulo CRM, NO ítems del portal.
  atencion_cliente: { "sat:crm": "/dashboard/crm" },
  // Emprendedora: Academia se abre como app EXTERNA (ingreso, no el grid del
  // gerente). Mismo criterio que CRM Contactos.
  emprendedor: { "shared:academia": "/emp/academia" },
  // Líder Comercial: Academia = app externa (placeholder, no se maqueta el grid).
  lci_lider: { "shared:academia": "/lci/academia" },
};

/**
 * Cosmético por rol para el teaser de Inicio/Próximamente del back-office
 * (chips + frase). Resuelto server-side y pasado por prop a la vista (sin
 * `if(rol)` en el render). El rol legible sale de ROLE_LABEL.
 */
export interface BoTeaser {
  chips: string[];
  hint: string;
}
export const BO_TEASER_BY_ROLE: Partial<Record<Role, BoTeaser>> = {
  cuentas_corrientes: {
    chips: ["cartera", "retenciones", "ajustes"],
    hint: "Acá vas a ver la cartera de cuentas, las retenciones y los ajustes manuales del período.",
  },
  deposito: {
    chips: ["stock", "picking", "despacho"],
    hint: "Acá vas a gestionar el stock, el armado de pedidos (picking) y el despacho.",
  },
  administracion: {
    chips: ["a definir"],
    hint: "El alcance de esta sección se está definiendo con el equipo de Administración.",
  },
};

const BO_TEASER_DEFAULT: BoTeaser = {
  chips: ["próximamente"],
  hint: "Las pantallas específicas de este perfil se definen en la próxima etapa.",
};

export function teaserForRole(raw: string | undefined | null): BoTeaser {
  return BO_TEASER_BY_ROLE[normalizeRole(raw)] ?? BO_TEASER_DEFAULT;
}

/**
 * Aplica los overrides de href del rol sobre las secciones. Devuelve objetos
 * NUEVOS (no muta SECTION_CATALOG, que es compartido entre roles).
 */
export function applyHrefOverrides(raw: string | undefined | null, sections: Section[]): Section[] {
  const ov = ROLE_HREF_OVERRIDES[normalizeRole(raw)];
  if (!ov) return sections;
  return sections.map((s) => (ov[s.id] ? { ...s, href: ov[s.id] } : s));
}

// ============================================================
//  Selectores de menú a partir de claves permitidas.
// ============================================================

/** Mapea claves permitidas → Sections del catálogo, ordenadas por SECTION_ORDER. */
export function sectionsFromKeys(keys: Iterable<string>): Section[] {
  const seen = new Set<string>();
  const out: Section[] = [];
  for (const k of keys) {
    if (seen.has(k)) continue;
    const s = SECTION_CATALOG[k];
    if (s) {
      seen.add(k);
      out.push(s);
    }
  }
  return out.sort((a, b) => (ORDER_INDEX[a.id] ?? 9999) - (ORDER_INDEX[b.id] ?? 9999));
}

/** Las 4 primeras secciones `primary` (bottom-tabs en <768px). */
export function tabsFromSections(sections: Section[]): Section[] {
  return sections.filter((s) => s.primary).slice(0, 4);
}

/** El resto de secciones (las que no son tab): van al sheet "Más" en <768px. */
export function extrasFromSections(sections: Section[]): Section[] {
  const tabIds = new Set(tabsFromSections(sections).map((s) => s.id));
  return sections.filter((s) => !tabIds.has(s.id));
}

/** Filtros globales del topbar desktop (handoff). */
export const DESKTOP_FILTERS = ["Campaña 202608", "División Zeus", "Canal: Consolidado", "Todas las zonas"];

/**
 * Chips de filtro del topbar resueltos POR ROL (server-side, igual que el menú —
 * sin `if(rol)` en el render). Es COSMÉTICO: los filtros mock no re-filtran; el
 * scope de datos real es Fase 2. Comercial ve su encuadre de equipo en vez de los
 * filtros globales de empresa; el resto de roles ve los globales (default).
 */
export const SCOPE_TOPBAR_FILTERS: Partial<Record<Role, string[]>> = {
  comercial: ["Mi equipo: Todo mi equipo", "Mis líderes: Todas mis líderes"],
};

export function topbarFiltersForRole(raw: string | undefined | null): string[] {
  return SCOPE_TOPBAR_FILTERS[normalizeRole(raw)] ?? DESKTOP_FILTERS;
}
