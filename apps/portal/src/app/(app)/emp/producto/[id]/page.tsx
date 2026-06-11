import { getProduct } from "@/features/emprendedora/_mock/products";
import { ProductoView } from "@/features/emprendedora/producto-view";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductoView product={getProduct(id)} />;
}
