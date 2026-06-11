import { getCurrentUser } from "@/lib/session";
import { topbarFiltersForRole } from "@/lib/portal-config";
import { Dashboard360View } from "@/features/gerente/dashboard-360-view";

/**
 * Dashboard 360° — vista ÚNICA para todos los roles. La vista NO mira el rol
 * (nunca `if(rol)` en el render). Lo único role-dependiente son los chips de
 * filtro del topbar, resueltos acá server-side (config por rol, igual que el
 * menú) y pasados como prop: comercial ve su encuadre de equipo, el resto los
 * filtros globales. Cosmético — el scope de datos real es Fase 2.
 */
export default async function DashboardPage() {
  const user = await getCurrentUser();
  return <Dashboard360View filters={topbarFiltersForRole(user?.role)} />;
}
