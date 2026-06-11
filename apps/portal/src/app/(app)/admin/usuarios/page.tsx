import { getUsers } from "@/lib/queries";
import { UsuariosView } from "@/features/admin/usuarios-view";

export const dynamic = "force-dynamic";

export default async function AdminUsuariosPage() {
  const data = await getUsers();
  return <UsuariosView data={data} />;
}
