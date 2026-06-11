import { getCurrentUser } from "@/lib/session";
import { normalizeRole, ROLE_LABEL } from "@/lib/portal-config";
import { PerfilView } from "@/features/backoffice/perfil-view";

/**
 * Mi perfil — recurso único. La identidad (nombre, email, rol, org) sale REAL de
 * la sesión y se pasa por prop; el resto (campos/preferencias) es MOCK. La vista
 * no mira el rol.
 */
export default async function PerfilPage() {
  const user = await getCurrentUser();
  const role = normalizeRole(user?.role);
  return (
    <PerfilView
      id={{
        name: user?.name || "Usuario",
        email: user?.email || "—",
        roleLabel: ROLE_LABEL[role],
        org: user?.orgName || "A-ware®",
      }}
    />
  );
}
