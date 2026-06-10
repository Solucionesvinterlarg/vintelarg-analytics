/**
 * PATCH /api/admin/permisos — persiste el delta de la matriz de permisos.
 * ADMIN-ONLY verificado server-side (no se confía en que el front esconda el
 * botón). Cada cambio hace UPSERT manual en 01_auth_role_permissions: si la
 * fila (role+resource) existe → UPDATE allowed; si no → INSERT. No hay índice
 * único en (role_definition_id, resource), así que NO se usa ON CONFLICT.
 */
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { rolePermissions } from "@/lib/schema";
import { getCurrentUser } from "@/lib/session";
import { normalizeRole, SECTION_CATALOG } from "@/lib/portal-config";

const ChangeSchema = z.object({
  roleDefinitionId: z.string().min(1),
  resource: z.string().min(1),
  resourceType: z.string().min(1),
  allowed: z.boolean(),
});
const BodySchema = z.object({ changes: z.array(ChangeSchema).max(500) });

export async function PATCH(req: NextRequest) {
  // 1) Guarda de admin (obligatoria, server-side).
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "no autenticado" }, { status: 401 });
  if (normalizeRole(user.role) !== "admin") {
    return NextResponse.json({ error: "no autorizado" }, { status: 403 });
  }

  // 2) Validación del payload.
  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "payload inválido" }, { status: 400 });
  }
  for (const c of body.changes) {
    if (c.resource === "shared:inicio" || !SECTION_CATALOG[c.resource]) {
      return NextResponse.json({ error: `recurso desconocido: ${c.resource}` }, { status: 400 });
    }
    if (c.resourceType !== c.resource.split(":")[0]) {
      return NextResponse.json({ error: `tipo inválido para ${c.resource}` }, { status: 400 });
    }
  }

  if (body.changes.length === 0) return NextResponse.json({ ok: true, applied: 0 });

  // 3) UPSERT en transacción (UPDATE si existe, INSERT si no; nunca borra).
  try {
    await db.transaction(async (tx) => {
      for (const c of body.changes) {
        const existing = await tx
          .select({ id: rolePermissions.id })
          .from(rolePermissions)
          .where(
            and(
              eq(rolePermissions.roleDefinitionId, c.roleDefinitionId),
              eq(rolePermissions.resource, c.resource)
            )
          )
          .limit(1);
        if (existing[0]) {
          await tx
            .update(rolePermissions)
            .set({ allowed: c.allowed })
            .where(eq(rolePermissions.id, existing[0].id));
        } else {
          await tx.insert(rolePermissions).values({
            id: sql`gen_random_uuid()::text`,
            roleDefinitionId: c.roleDefinitionId,
            resource: c.resource,
            resourceType: c.resourceType,
            allowed: c.allowed,
          });
        }
      }
    });
  } catch (err) {
    console.error("[portal] PATCH /api/admin/permisos falló:", err);
    return NextResponse.json({ error: "error al guardar" }, { status: 500 });
  }

  // 4) Revalida la matriz; el menú (getNavForUser) lee la misma tabla.
  revalidatePath("/admin/permisos");
  return NextResponse.json({ ok: true, applied: body.changes.length });
}
