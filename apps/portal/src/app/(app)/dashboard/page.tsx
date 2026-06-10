import { Dashboard360View } from "@/features/gerente/dashboard-360-view";

/**
 * Dashboard 360° — vista ÚNICA para todos los roles. La app es única y los
 * dashboards son los mismos para todos: el rol NO cambia la vista. El acceso lo
 * decide la matriz de permisos (clave `dashboard:360`) y, a futuro, el scope de
 * datos por rol (Fase 2). Regla: nunca `if(rol)` en el render de un dashboard.
 */
export default function DashboardPage() {
  return <Dashboard360View />;
}
