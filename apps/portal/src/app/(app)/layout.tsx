import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { userInitials } from "@/lib/session-token";
import { normalizeRole, ROLE_LABEL, tabsFromSections, extrasFromSections, isPhoneAudience } from "@/lib/portal-config";
import { getNavForUser } from "@/lib/queries";
import { AppShell } from "@/components/shells/app-shell";
import { PhoneShell } from "@/components/shells/phone-shell";

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
  const shellUser = { name: user.name || "Usuario", role: ROLE_LABEL[role], initials: userInitials(user.name) || "AW" };

  // Shell por AUDIENCIA (no por rol-individual, sin if-rol en el render): red
  // comercial → phone; internos → sidebar. La misma pantalla (recurso único)
  // renderiza en el shell del viewer.
  if (isPhoneAudience(role)) {
    return (
      <PhoneShell tabs={tabsFromSections(nav)} drawerItems={nav.filter((s) => s.id !== "emp:inicio" && s.id !== "emp:perfil")} user={shellUser}>
        {children}
      </PhoneShell>
    );
  }

  return (
    <AppShell
      nav={nav}
      tabs={tabsFromSections(nav)}
      extras={extrasFromSections(nav)}
      user={shellUser}
      version={`v1.2.0 · ${ROLE_LABEL[role]}`}
    >
      {children}
    </AppShell>
  );
}
