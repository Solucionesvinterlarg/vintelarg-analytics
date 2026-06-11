import { getMedal } from "@/features/emprendedora/_mock/logros";
import { LogroDetalleView } from "@/features/emprendedora/logro-detalle-view";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LogroDetalleView medal={getMedal(id)} />;
}
