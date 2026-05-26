import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { userInitials } from "@/lib/session-token";
import { desktopNavForRole, normalizeRole, ROLE_LABEL, shellForRole } from "@/lib/portal-config";
import { DesktopSidebar } from "@/components/shells/desktop-sidebar";
import { ResponsiveCollapse } from "@/components/shells/responsive-collapse";

export default async function DesktopLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/api/auth/login");
  // Si el rol es mobile, lo mandamos a su shell.
  if (shellForRole(user.role) === "mobile") redirect("/home");

  const nav = desktopNavForRole(user.role);
  const role = normalizeRole(user.role);

  return (
    <div className="flex h-dvh overflow-hidden" style={{ background: "var(--aw-paper)" }}>
      <ResponsiveCollapse />
      <DesktopSidebar
        items={nav}
        user={{ name: user.name || "Usuario", role: ROLE_LABEL[role], initials: userInitials(user.name) || "AW" }}
      />
      <main className="flex min-w-0 flex-1 flex-col overflow-y-auto">{children}</main>
    </div>
  );
}
