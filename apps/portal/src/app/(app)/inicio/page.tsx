import { getCurrentUser } from "@/lib/session";
import { normalizeRole, ROLE_LABEL, teaserForRole } from "@/lib/portal-config";
import { InicioView } from "@/features/backoffice/inicio-view";

/**
 * Inicio / Próximamente del back-office. Vista ÚNICA; el encuadre por rol
 * (roleLabel + teaser) se resuelve acá server-side (config por rol, igual que el
 * menú) y se pasa por prop. Sin `if(rol)` en el render.
 */
export default async function InicioPage() {
  const user = await getCurrentUser();
  const role = normalizeRole(user?.role);
  return <InicioView roleLabel={ROLE_LABEL[role]} teaser={teaserForRole(user?.role)} />;
}
