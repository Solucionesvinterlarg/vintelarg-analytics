import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { userInitials } from "@/lib/session-token";
import { normalizeRole, ROLE_LABEL, tabsFromSections, extrasFromSections } from "@/lib/portal-config";
import { getNavForUser } from "@/lib/queries";
import { AppShell } from "@/components/shells/app-shell";

/**
 * Layout único del portal. El shell es responsive (sidebar ≥768px / tabs
 * <768px) y NO depende del rol. El menú sale de la matriz de permisos de la
 * base (`getNavForUser` → 01_auth_role_permissions); la presentación vive en
 * el catálogo del código. Fallback seguro dentro de getNavForUser.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/api/auth/login");

  const role = normalizeRole(user.role);
  const nav = await getNavForUser(role, user.orgId);

  return (
    <AppShell
      nav={nav}
      tabs={tabsFromSections(nav)}
      extras={extrasFromSections(nav)}
      user={{ name: user.name || "Usuario", role: ROLE_LABEL[role], initials: userInitials(user.name) || "AW" }}
      version={`v1.2.0 · ${ROLE_LABEL[role]}`}
    >
      {children}
    </AppShell>
  );
}
