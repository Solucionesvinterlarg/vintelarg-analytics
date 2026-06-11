"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Estado client de la app emprendedora (Fase 1, mock): contador de carrito +
 * mensaje de toast. El contador persiste en localStorage (reemplaza el
 * `emp_cart` del prototipo). En Fase 2 esto pasa a un modelo de pedido real.
 */
interface EmpState {
  cartCount: number;
  toast: { id: number; msg: string } | null;
  drawer: boolean;
  addToCart: (name?: string) => void;
  notify: (msg: string) => void;
  clearToast: () => void;
  setDrawer: (open: boolean) => void;
}

let toastSeq = 1;

export const useEmpStore = create<EmpState>()(
  persist(
    (set, get) => ({
      cartCount: 3,
      toast: null,
      drawer: false,
      addToCart: (name) => set({ cartCount: get().cartCount + 1, toast: { id: toastSeq++, msg: `${name ?? "Producto"} · agregado` } }),
      notify: (msg) => set({ toast: { id: toastSeq++, msg } }),
      clearToast: () => set({ toast: null }),
      setDrawer: (open) => set({ drawer: open }),
    }),
    {
      name: "emp-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ cartCount: s.cartCount }),
    }
  )
);
