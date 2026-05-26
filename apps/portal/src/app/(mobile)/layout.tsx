import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { mobileTabsForRole, normalizeRole, ROLE_LABEL, shellForRole } from "@/lib/portal-config";
import { MobileShell } from "@/components/shells/mobile-shell";

export default async function MobileLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/api/auth/login");
  // Si el rol es desktop, lo mandamos a su shell.
  if (shellForRole(user.role) === "desktop") redirect("/dashboard");

  const tabs = mobileTabsForRole(user.role);
  const role = normalizeRole(user.role);

  return (
    <MobileShell tabs={tabs} roleVersion={`v1.2.0 · ${ROLE_LABEL[role]}`}>
      {children}
    </MobileShell>
  );
}
