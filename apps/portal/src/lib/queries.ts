/**
 * Queries del portal contra vintelarg_base (Drizzle, server-only).
 * Datos REALES. Las pantallas sin fuente (módulos, dashboards KPI) no viven acá.
 */
import "server-only";
import { db } from "./db";
import { alias } from "drizzle-orm/pg-core";
import { and, desc, eq, gte, isNotNull, sql } from "drizzle-orm";
import {
  tickets,
  ticketReasons,
  contacts,
  user,
  organization,
  session,
  authEvents,
  roleDefinitions,
  rolePermissions,
  campanias,
} from "./schema";
import type { BadgeTone } from "@/components/portal/badge";
import { sectionsFromKeys, landingForRole, type Section } from "@/lib/portal-config";

// ---------- helpers ----------
export function relativeTime(d: Date | string | null): string {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60) return "hace instantes";
  const m = Math.floor(s / 60);
  if (m < 60) return `hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h} h`;
  const dd = Math.floor(h / 24);
  if (dd === 1) return "ayer";
  return `hace ${dd} días`;
}

const STATUS: Record<string, { label: string; tone: BadgeTone }> = {
  abierto: { label: "Abierto", tone: "danger" },
  esperando: { label: "Esperando", tone: "warn" },
  en_proceso: { label: "En curso", tone: "warn" },
  en_curso: { label: "En curso", tone: "warn" },
  resuelto: { label: "Resuelto", tone: "success" },
  cerrado: { label: "Cerrado", tone: "neutral" },
};
const PRIO: Record<string, { label: string; tone: BadgeTone }> = {
  urgente: { label: "Urgente", tone: "danger" },
  alta: { label: "Alta", tone: "danger" },
  media: { label: "Media", tone: "warn" },
  baja: { label: "Baja", tone: "neutral" },
};
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// ---------- campaña vigente (real) ----------
export async function getCurrentCampaign(): Promise<{ label: string; diasRestantes: number } | null> {
  const rows = await db
    .select({ campania: campanias.campania, anio: campanias.anioCampania, fin: campanias.fechaFin })
    .from(campanias)
    .where(and(sql`${campanias.fechaInicio} <= current_date`, sql`${campanias.fechaFin} >= current_date`))
    .orderBy(desc(campanias.fechaFin))
    .limit(1);
  const c = rows[0];
  if (!c) return null;
  const dias = Math.max(0, Math.ceil((new Date(c.fin as string).getTime() - Date.now()) / 86400000));
  return { label: `Campaña ${c.anio}`, diasRestantes: dias };
}

// ---------- contacto del usuario logueado (real) ----------
export async function getContactForUser(userId: string) {
  const rows = await db
    .select({ zone: contacts.zone, level: contacts.level })
    .from(contacts)
    .where(eq(contacts.userId, userId))
    .limit(1);
  return rows[0] ?? null;
}

// ---------- P07 Atención: tickets (real) ----------
export interface TicketRow {
  id: string;
  status: string;
  statusTone: BadgeTone;
  asunto: string;
  emp: string;
  zona: string;
  motivo: string;
  prio: string;
  prioTone: BadgeTone;
  creado: string;
  asignado: string | null;
}

export async function getTickets(): Promise<TicketRow[]> {
  const empUser = alias(user, "emp_user");
  const asgUser = alias(user, "asg_user");
  const rows = await db
    .select({
      number: tickets.number,
      status: tickets.status,
      priority: tickets.priority,
      description: tickets.description,
      createdAt: tickets.createdAt,
      assignedTeam: tickets.assignedTeam,
      reason: ticketReasons.name,
      empName: empUser.name,
      zona: contacts.zone,
      asignado: asgUser.name,
    })
    .from(tickets)
    .leftJoin(ticketReasons, eq(tickets.reasonId, ticketReasons.id))
    .leftJoin(contacts, eq(tickets.contactId, contacts.id))
    .leftJoin(empUser, eq(contacts.userId, empUser.id))
    .leftJoin(asgUser, eq(tickets.assignedTo, asgUser.id))
    .orderBy(desc(tickets.createdAt))
    .limit(50);

  return rows.map((r) => {
    const st = STATUS[r.status ?? ""] ?? { label: cap(r.status ?? "—"), tone: "neutral" as BadgeTone };
    const pr = PRIO[r.priority ?? ""] ?? { label: cap(r.priority ?? "—"), tone: "neutral" as BadgeTone };
    return {
      id: `TK-${r.number ?? "?"}`,
      status: st.label,
      statusTone: st.tone,
      asunto: r.description ?? "—",
      emp: r.empName ?? "—",
      zona: r.zona ? `Z-${r.zona}` : "—",
      motivo: r.reason ?? "—",
      prio: pr.label,
      prioTone: pr.tone,
      creado: relativeTime(r.createdAt),
      asignado: r.asignado ?? r.assignedTeam ?? null,
    };
  });
}

export interface TicketMetrics {
  abiertos: number;
  enCurso: number;
  resueltosHoy: number;
  tiempoProm: string;
}

export async function getTicketMetrics(): Promise<TicketMetrics> {
  const [m] = await db
    .select({
      abiertos: sql<number>`count(*) filter (where ${tickets.status} = 'abierto')`.mapWith(Number),
      enCurso: sql<number>`count(*) filter (where ${tickets.status} in ('en_proceso','en_curso','esperando'))`.mapWith(Number),
      resueltosHoy: sql<number>`count(*) filter (where ${tickets.resolvedAt}::date = current_date)`.mapWith(Number),
    })
    .from(tickets);
  const [t] = await db
    .select({
      hs: sql<number | null>`round(avg(extract(epoch from (${tickets.resolvedAt} - ${tickets.createdAt})) / 3600.0)::numeric, 1)`.mapWith(
        Number
      ),
    })
    .from(tickets)
    .where(isNotNull(tickets.resolvedAt));
  return {
    abiertos: m?.abiertos ?? 0,
    enCurso: m?.enCurso ?? 0,
    resueltosHoy: m?.resueltosHoy ?? 0,
    tiempoProm: t?.hs != null ? `${t.hs} hs` : "—",
  };
}

// ---------- P08 Admin: overview (real) ----------
export interface AdminOverview {
  usuarios: number;
  usuariosSemana: number;
  orgs: number;
  orgName: string;
  sesionesHoy: number;
  sesionesPorDia: number[];
  roles: number;
  actividad: { text: string; badge: string; tone: BadgeTone; when: string }[];
}

const EVENT_LABEL: Record<string, { text: string; badge: string; tone: BadgeTone }> = {
  oidc_client_created: { text: "Se registró un cliente OIDC", badge: "Sistema", tone: "success" },
  oidc_client_deleted: { text: "Se eliminó un cliente OIDC", badge: "Sistema", tone: "neutral" },
  sign_in: { text: "Inicio de sesión", badge: "Auth", tone: "violet" },
  sign_up: { text: "Nuevo registro", badge: "Auto", tone: "neutral" },
};

export async function getAdminOverview(): Promise<AdminOverview> {
  const [counts] = await db
    .select({
      usuarios: sql<number>`count(*)`.mapWith(Number),
      usuariosSemana: sql<number>`count(*) filter (where ${user.createdAt} > now() - interval '7 days')`.mapWith(Number),
    })
    .from(user);
  const orgs = await db.select({ name: organization.name }).from(organization).orderBy(organization.createdAt);
  const [sesHoy] = await db
    .select({ n: sql<number>`count(*) filter (where ${session.createdAt}::date = current_date)`.mapWith(Number) })
    .from(session);
  const porDia = await db
    .select({ d: sql<string>`${session.createdAt}::date`, n: sql<number>`count(*)`.mapWith(Number) })
    .from(session)
    .where(gte(session.createdAt, sql`now() - interval '6 days'`))
    .groupBy(sql`${session.createdAt}::date`)
    .orderBy(sql`${session.createdAt}::date`);
  // 7 días (rellena faltantes con 0)
  const serie: number[] = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date();
    day.setDate(day.getDate() - i);
    const key = day.toISOString().slice(0, 10);
    serie.push(porDia.find((r) => String(r.d).slice(0, 10) === key)?.n ?? 0);
  }
  const [roleCount] = await db.select({ n: sql<number>`count(*)`.mapWith(Number) }).from(roleDefinitions);
  const evUser = alias(user, "ev_user");
  const ev = await db
    .select({ type: authEvents.type, when: authEvents.createdAt, name: evUser.name })
    .from(authEvents)
    .leftJoin(evUser, eq(authEvents.userId, evUser.id))
    .orderBy(desc(authEvents.createdAt))
    .limit(6);
  return {
    usuarios: counts?.usuarios ?? 0,
    usuariosSemana: counts?.usuariosSemana ?? 0,
    orgs: orgs.length,
    orgName: orgs[0]?.name ?? "—",
    sesionesHoy: sesHoy?.n ?? 0,
    sesionesPorDia: serie.some((n) => n > 0) ? serie : [0, 0, 0, 0, 0, 0, 0],
    roles: roleCount?.n ?? 0,
    actividad: ev.map((e) => {
      const meta = EVENT_LABEL[e.type ?? ""] ?? { text: e.type ?? "evento", badge: "Sistema", tone: "neutral" as BadgeTone };
      return { ...meta, when: relativeTime(e.when) };
    }),
  };
}

// ---------- P11 Permisos: matriz roles×permisos (real; hoy vacía) ----------
export interface PermissionMatrix {
  roles: { id: string; name: string; userType: string | null }[];
  groups: { resource: string; perms: { resource: string; allowed: Record<string, boolean> }[] }[];
}

export async function getPermissionMatrix(): Promise<PermissionMatrix> {
  const roles = await db
    .select({ id: roleDefinitions.id, name: roleDefinitions.displayName, userType: roleDefinitions.userType })
    .from(roleDefinitions)
    .orderBy(roleDefinitions.sortOrder);
  const perms = await db
    .select({
      roleId: rolePermissions.roleDefinitionId,
      resource: rolePermissions.resource,
      resourceType: rolePermissions.resourceType,
      allowed: rolePermissions.allowed,
    })
    .from(rolePermissions);

  // Agrupa por resourceType → resource → {roleId: allowed}
  const byGroup = new Map<string, Map<string, Record<string, boolean>>>();
  for (const p of perms) {
    const g = p.resourceType ?? "general";
    if (!byGroup.has(g)) byGroup.set(g, new Map());
    const res = byGroup.get(g)!;
    if (!res.has(p.resource ?? "")) res.set(p.resource ?? "", {});
    res.get(p.resource ?? "")![p.roleId ?? ""] = !!p.allowed;
  }
  const groups = [...byGroup.entries()].map(([resource, m]) => ({
    resource,
    perms: [...m.entries()].map(([res, allowed]) => ({ resource: res, allowed })),
  }));
  return {
    roles: roles.map((r) => ({ id: r.id, name: r.name ?? r.id, userType: r.userType })),
    groups,
  };
}

// ---------- Menú por permisos (real; 01_auth_role_permissions) ----------
//
// La presentación (label/icono/href) vive en SECTION_CATALOG (portal-config).
// La base solo dice QUÉ claves ve cada rol. La columna `resource` ya guarda la
// clave completa ("dashboard:360"), así que se usa tal cual (no se reconstruye).

/** Menú mínimo de seguridad si la matriz falla o viene vacía. */
const MIN_NAV_KEYS = ["shared:inicio", "shared:perfil"];

/** Claves de recurso con allowed=true para el rol (role_key) en su org. */
export async function getAllowedResources(roleKey: string, orgId: string): Promise<string[]> {
  const rows = await db
    .select({ resource: rolePermissions.resource })
    .from(rolePermissions)
    .innerJoin(roleDefinitions, eq(rolePermissions.roleDefinitionId, roleDefinitions.id))
    .where(
      and(
        eq(roleDefinitions.roleKey, roleKey),
        eq(roleDefinitions.organizationId, orgId),
        eq(rolePermissions.allowed, true)
      )
    );
  return rows.map((r) => r.resource).filter((x): x is string => !!x);
}

/**
 * Menú del usuario: catálogo filtrado por las claves permitidas en la base y
 * ordenado por SECTION_ORDER (orden del código). Fallback seguro: si la query
 * falla o no devuelve nada, NO rompe el layout — devuelve un menú mínimo.
 */
export async function getNavForUser(roleKey: string, orgId: string): Promise<Section[]> {
  try {
    const allowed = await getAllowedResources(roleKey, orgId);
    // `shared:inicio` no se permisa en la base: la red comercial siempre tiene
    // landing, así que se inyecta cuando el rol aterriza en /home.
    const keys = landingForRole(roleKey) === "/home" ? ["shared:inicio", ...allowed] : allowed;
    const sections = sectionsFromKeys(keys);
    if (sections.length === 0) {
      console.error(`[portal] getNavForUser: sin secciones (role=${roleKey} org=${orgId}); menú mínimo`);
      return sectionsFromKeys(MIN_NAV_KEYS);
    }
    return sections;
  } catch (err) {
    console.error(`[portal] getNavForUser falló (role=${roleKey} org=${orgId}):`, err);
    return sectionsFromKeys(MIN_NAV_KEYS);
  }
}
