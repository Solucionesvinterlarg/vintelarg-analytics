import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { userInitials } from "@/lib/session-token";
import {
  navForRole,
  tabsForRole,
  extraSectionsForRole,
  normalizeRole,
  ROLE_LABEL,
} from "@/lib/portal-config";
import { AppShell } from "@/components/shells/app-shell";

/**
 * Layout único del portal. El shell es responsive (sidebar ≥768px / tabs
 * <768px) y NO depende del rol: el rol solo define QUÉ secciones se ven, no
 * el acomodo. Cada rol tiene una sola lista de secciones (`navForRole`).
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/api/auth/login");

  const role = normalizeRole(user.role);

  return (
    <AppShell
      nav={navForRole(user.role)}
      tabs={tabsForRole(user.role)}
      extras={extraSectionsForRole(user.role)}
      user={{ name: user.name || "Usuario", role: ROLE_LABEL[role], initials: userInitials(user.name) || "AW" }}
      version={`v1.2.0 · ${ROLE_LABEL[role]}`}
    >
      {children}
    </AppShell>
  );
}
