/**
 * Productos MOCK de la app emprendedora (Lote 2). Espejo de emprendedora/data.jsx.
 * NO es dato real. Compartido por Catálogo, Detalle y Carrito.
 */
export type Cat = "Hogar" | "Belleza" | "Bienestar" | "Deportes" | "Mascotas";

export interface Product {
  id: string;
  n: string;
  by: string;
  cat: Cat;
  price: string;
  gain: string;
  stock: number;
  old?: string;
  tag?: string;
}

export const PRODUCTS: Product[] = [
  { id: "p1", n: "Bowl Creativa 3L", by: "A-ware by Lexihome", cat: "Hogar", price: "8.900", gain: "2.225", stock: 5, tag: "WAO" },
  { id: "p2", n: "Organizador Modular", by: "A-ware by Lexihome", cat: "Hogar", price: "15.200", gain: "3.800", stock: 12 },
  { id: "p3", n: "Crema hidratante 200ml", by: "A-ware", cat: "Belleza", price: "9.450", old: "12.600", gain: "2.835", stock: 8, tag: "2x1" },
  { id: "p4", n: "Botella Eco 750ml", by: "A-ware", cat: "Deportes", price: "7.800", gain: "1.950", stock: 3 },
  { id: "p5", n: "Shampoo sólido", by: "A-ware", cat: "Belleza", price: "6.200", gain: "1.550", stock: 20 },
  { id: "p6", n: "Comedero doble inox", by: "A-ware", cat: "Mascotas", price: "11.400", gain: "2.850", stock: 6 },
  { id: "p7", n: "Infusor de té inox", by: "A-ware", cat: "Bienestar", price: "5.200", gain: "1.300", stock: 9 },
  { id: "p8", n: "Set toallas microfibra", by: "A-ware by Touch", cat: "Hogar", price: "13.700", gain: "3.425", stock: 4, tag: "Outlet" },
];

export const QUICK_FILTERS = ["WAO", "2x1", "10 Más Vendidos", "Outlet", "Combos", "Cuotas", "Categorías", "Ofertas"];

const SLUG: Record<Cat, string> = { Hogar: "hogar", Belleza: "belleza", Bienestar: "bienestar", Deportes: "deportes", Mascotas: "mascotas" };
export const CAT_ICON: Record<Cat, string> = { Hogar: "house", Belleza: "sparkles", Bienestar: "leaf", Deportes: "bike", Mascotas: "paw-print" };
export const catSoft = (c: Cat) => `var(--cat-${SLUG[c]}-light)`;
export const catAccent = (c: Cat) => `var(--cat-${SLUG[c]})`;

export const getProduct = (id: string): Product => PRODUCTS.find((p) => p.id === id) ?? PRODUCTS[0];
