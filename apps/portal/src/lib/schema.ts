/**
 * Schema Drizzle (subset de columnas) de las tablas de vintelarg_base que
 * consulta el portal. Read-only desde el portal — estas tablas son propiedad
 * de vintelarg-auth (auth_*, user, organization, session, role_*) y del CRM
 * (tickets, contacts) y del ecosistema JDE (campanias, fv_revendedora).
 */
import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  date,
  char,
  jsonb,
  numeric,
  smallint,
  bigint,
} from "drizzle-orm/pg-core";

// ---- CRM / Atención ----
export const tickets = pgTable("06_crm_tickets", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id"),
  number: integer("number"),
  reasonId: text("reason_id"),
  subReasonId: text("sub_reason_id"),
  status: text("status"),
  priority: text("priority"),
  contactId: text("contact_id"),
  assignedTo: text("assigned_to"),
  assignedTeam: text("assigned_team"),
  description: text("description"),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }),
});

export const ticketReasons = pgTable("06_crm_ticket_reasons", {
  id: text("id").primaryKey(),
  name: text("name"),
  slug: text("slug"),
});

export const contacts = pgTable("06_crm_contacts", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  organizationId: text("organization_id"),
  clientCode: text("client_code"),
  zone: text("zone"),
  province: text("province"),
  level: text("level"),
  active: boolean("active"),
});

// ---- Auth (vintelarg-auth) ----
export const user = pgTable("01_auth_user", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email"),
  role: text("role"),
  banned: boolean("banned"),
  createdAt: timestamp("created_at"),
});

export const organization = pgTable("01_auth_organization", {
  id: text("id").primaryKey(),
  name: text("name"),
  slug: text("slug"),
  createdAt: timestamp("created_at"),
});

export const member = pgTable("01_auth_member", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id"),
  userId: text("user_id"),
  /** rol del usuario EN la organización (role_key). NO confundir con user.role. */
  role: text("role"),
  userType: text("user_type"),
  createdAt: timestamp("created_at"),
});

export const session = pgTable("01_auth_session", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at"),
});

export const authEvents = pgTable("01_auth_auth_events", {
  id: text("id").primaryKey(),
  type: text("type"),
  userId: text("user_id"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at"),
});

export const roleDefinitions = pgTable("01_auth_role_definitions", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id"),
  roleKey: text("role_key"),
  displayName: text("display_name"),
  userType: text("user_type"),
  isDefault: boolean("is_default"),
  isSystem: boolean("is_system"),
  sortOrder: integer("sort_order"),
});

export const rolePermissions = pgTable("01_auth_role_permissions", {
  id: text("id").primaryKey(),
  roleDefinitionId: text("role_definition_id"),
  resource: text("resource"),
  resourceType: text("resource_type"),
  allowed: boolean("allowed"),
});

export const organizationModules = pgTable("01_auth_organization_modules", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id"),
  moduleKey: text("module_key"),
  moduleType: text("module_type"),
  active: boolean("active"),
});

// ---- Ecosistema (JDE) ----
export const campanias = pgTable("03_campania_campanias", {
  id: integer("id").primaryKey(),
  campania: char("campania"),
  anioCampania: integer("anio_campania"),
  fechaInicio: date("fecha_inicio"),
  fechaFin: date("fecha_fin"),
});

export const fvRevendedora = pgTable("02_fv_revendedora", {
  id: integer("id").primaryKey(),
  estado: text("estado"),
  zona: char("zona"),
  vigencia: text("vigencia"),
});

// ---- Órdenes en curso (cascada de ventas, paso 2). Hoy vacías: la campaña en
//      curso cae a NA hasta que se carguen. Subset de columnas que usa el portal.
export const campaniaOrdenes = pgTable("03_campania_ordenes", {
  id: integer("id").primaryKey(),
  numeroOrden: bigint("numero_orden", { mode: "number" }),
  anioCampania: integer("anio_campania"),
  campania: char("campania"),
  revendedoraNumero: integer("revendedora_numero"),
  tipo: text("tipo"),
  canal: text("canal"),
  subCanal: text("sub_canal"),
  origen: text("origen"),
  estado: text("estado"),
  zona: char("zona"),
  gzEiNumero: integer("gz_ei_numero"),
  division: smallint("division"),
  importeSinImp: numeric("importe_sin_imp"),
  importeConImp: numeric("importe_con_imp"),
  unidades: numeric("unidades"),
  cantLineas: smallint("cant_lineas"),
  pagado: boolean("pagado"),
  importePagado: numeric("importe_pagado"),
  fechaIngreso: timestamp("fecha_ingreso", { withTimezone: true }),
  fechaFacturacion: timestamp("fecha_facturacion", { withTimezone: true }),
});

export const campaniaOrdenesDetalle = pgTable("03_campania_ordenes_detalle", {
  id: integer("id").primaryKey(),
  ordenId: integer("orden_id"),
  nroLinea: smallint("nro_linea"),
  codigoArticulo: text("codigo_articulo"),
  descripcion: text("descripcion"),
  rubro: smallint("rubro"),
  unidades: numeric("unidades"),
  precioUnitSinImp: numeric("precio_unit_sin_imp"),
  precioUnitConImp: numeric("precio_unit_con_imp"),
  importeLineaSinImp: numeric("importe_linea_sin_imp"),
  importeLineaConImp: numeric("importe_linea_con_imp"),
  estadoLinea: text("estado_linea"),
});
