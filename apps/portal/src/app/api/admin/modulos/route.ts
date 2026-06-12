/**
 * PATCH /api/admin/modulos — habilita/deshabilita un módulo para LA ORG del admin.
 * ADMIN-ONLY verificado server-side. Escribe SOLO `01_auth_organization_modules.active`
 * (el plan per-org). NUNCA toca `oauth_client.disabled` (que es GLOBAL del IdP y
 * afectaría a todas las orgs). La habilitación es a nivel MÓDULO: un toggle
 * prende/apaga todos los ítems de menú de ese módulo juntos.
 */
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { organizationModules } from "@/lib/schema";
import { getCurrentUser } from "@/lib/session";
import { normalizeRole } from "@/lib/portal-config";

const BodySchema = z.object({ moduleKey: z.string().min(1), active: z.boolean() });

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "no autenticado" }, { status: 401 });
  if (normalizeRole(user.role) !== "admin") {
    return NextResponse.json({ error: "no autorizado" }, { status: 403 });
  }

  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "payload inválido" }, { status: 400 });
  }

  try {
    // Solo la fila (org, módulo) de ESTA org. Si el módulo no está en su plan, no
    // se crea (0 filas afectadas) — el alta de módulos al plan la define Vintelarg.
    await db
      .update(organizationModules)
      .set({ active: body.active })
      .where(
        and(
          eq(organizationModules.organizationId, user.orgId),
          eq(organizationModules.moduleKey, body.moduleKey)
        )
      );
  } catch (err) {
    console.error("[portal] PATCH /api/admin/modulos falló:", err);
    return NextResponse.json({ error: "error al guardar" }, { status: 500 });
  }

  // El menú (getNavForUser → getActiveModules + cruce con el IdP) lee la misma tabla.
  revalidatePath("/admin/modulos");
  return NextResponse.json({ ok: true });
}
