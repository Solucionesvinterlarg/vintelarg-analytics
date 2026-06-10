import { getOrganizations } from "@/lib/queries";
import { OrganizacionesView } from "@/features/admin/organizaciones-view";

export const dynamic = "force-dynamic";

export default async function AdminOrganizacionesPage() {
  const orgs = await getOrganizations();
  return <OrganizacionesView orgs={orgs} />;
}
