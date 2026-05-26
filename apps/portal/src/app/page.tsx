import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { landingForRole } from "@/lib/portal-config";

/** Raíz: enruta al landing según rol. El proxy ya garantizó sesión. */
export default async function RootPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/api/auth/login");
  redirect(landingForRole(user.role));
}
