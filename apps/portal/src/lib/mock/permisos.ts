import type { BadgeTone } from "@/components/portal/badge";

export interface Role {
  id: string;
  name: string;
  tone: BadgeTone;
}

export interface Perm {
  p: string;
  v: (0 | 1)[];
}

export interface PermGroup {
  g: string;
  icon: string;
  perms: Perm[];
}

export const ROLES: Role[] = [
  { id: "admin", name: "Admin",        tone: "internal" },
  { id: "mkt",   name: "Marketing",   tone: "internal" },
  { id: "atc",   name: "At. Cliente", tone: "internal" },
  { id: "com",   name: "Comercial",   tone: "internal" },
  { id: "gc",    name: "GC / EI",     tone: "internal" },
  { id: "lci",   name: "LCI",         tone: "external" },
  { id: "emp",   name: "Emprendedora",tone: "external" },
];

export const PERM_GROUPS: PermGroup[] = [
  { g: "Cuenta corriente", icon: "wallet", perms: [
    { p: "account:view",       v: [1,1,1,1,1,1,1] },
    { p: "account:view-group", v: [1,0,0,0,1,1,0] },
    { p: "account:view-all",   v: [1,0,0,1,0,0,0] },
    { p: "account:pay",        v: [0,0,0,0,0,1,1] },
  ]},
  { g: "Pedidos", icon: "shopping-bag", perms: [
    { p: "orders:view",        v: [1,1,0,1,1,1,1] },
    { p: "orders:create",      v: [0,0,0,0,0,1,1] },
    { p: "orders:create-woe",  v: [0,0,0,0,0,1,0] },
    { p: "orders:view-group",  v: [1,0,0,0,1,1,0] },
  ]},
  { g: "Reclamos", icon: "refresh-ccw", perms: [
    { p: "claims:view",        v: [1,0,1,0,1,1,1] },
    { p: "claims:create",      v: [0,0,0,0,0,0,1] },
    { p: "claims:approve",     v: [0,0,1,0,1,0,0] },
    { p: "claims:view-group",  v: [1,0,1,0,1,1,0] },
  ]},
  { g: "Facturas", icon: "file-text", perms: [
    { p: "invoices:view",      v: [1,0,1,0,0,1,1] },
    { p: "invoices:download",  v: [1,0,0,0,0,1,1] },
  ]},
  { g: "Tickets", icon: "ticket", perms: [
    { p: "tickets:view",       v: [1,0,1,0,1,0,0] },
    { p: "tickets:assign",     v: [1,0,1,0,0,0,0] },
    { p: "tickets:close",      v: [1,0,1,0,0,0,0] },
  ]},
  { g: "Admin", icon: "shield-check", perms: [
    { p: "admin:users",        v: [1,0,0,0,0,0,0] },
    { p: "admin:roles",        v: [1,0,0,0,0,0,0] },
    { p: "admin:modules",      v: [1,0,0,0,0,0,0] },
  ]},
];

/** Keys of cells that are pre-marked as "edited" in the initial demo state. */
export const INITIAL_EDITED = new Set([
  "Cuenta corriente|0|3",
  "Pedidos|1|4",
  "Reclamos|2|3",
]);
