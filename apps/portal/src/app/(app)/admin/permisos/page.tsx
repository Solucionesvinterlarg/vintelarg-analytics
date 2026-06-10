import { ShieldCheck, ShieldX } from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { getPermissionGrid } from "@/lib/queries";
import { getCurrentUser } from "@/lib/session";
import { normalizeRole } from "@/lib/portal-config";
import { PermisosMatrix } from "./permisos-matrix";

export const dynamic = "force-dynamic";

export default async function PermisosPage() {
  // Doble guarda: el layout autentica, pero esta pantalla es admin-only.
  const user = await getCurrentUser();
  if (!user || normalizeRole(user.role) !== "admin") {
    return (
      <>
        <DesktopTopBar title="Permisos por rol" initials="DA" />
        <Forbidden />
      </>
    );
  }

  const { roles, allowed } = await getPermissionGrid();

  return (
    <>
      <DesktopTopBar title="Permisos por rol" initials="DA" />
      {roles.length === 0 ? <EmptyState /> : <PermisosMatrix roles={roles} allowed={allowed} />}
    </>
  );
}

function Forbidden() {
  return (
    <div className="grid flex-1 place-items-center p-10">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl" style={{ background: "var(--aw-danger-light)", color: "var(--aw-danger)" }}>
          <ShieldX size={26} strokeWidth={1.5} />
        </div>
        <h2 className="text-lg font-extrabold tracking-tight text-foreground">No tenés acceso a esta sección</h2>
        <p className="mt-2 text-sm text-muted-foreground">La gestión de permisos por rol es exclusiva del rol <code className="text-xs">admin</code>.</p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="grid flex-1 place-items-center p-10">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl" style={{ background: "var(--aw-violet-light)", color: "var(--aw-violet)" }}>
          <ShieldCheck size={26} strokeWidth={1.5} />
        </div>
        <h2 className="text-lg font-extrabold tracking-tight text-foreground">Todavía no hay roles configurados</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La matriz de roles y permisos se completa desde <code className="text-xs">vintelarg-auth</code>
          {" "}(tablas <code className="text-xs">role_definitions</code> y <code className="text-xs">role_permissions</code>). Cuando se definan, aparecen acá.
        </p>
      </div>
    </div>
  );
}
