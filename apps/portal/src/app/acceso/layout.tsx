"use client";

import { useEffect } from "react";
import { useEmpStore } from "@/lib/emp-store";

/**
 * Frame "phone" para las pantallas públicas pre-auth (Login/Landing/Registro de
 * la emprendedora). Mismo encuadre que PhoneShell pero SIN chrome (sin bottom-
 * nav/drawer/bot): son pantallas de acceso. Incluye el toast del store.
 */
export default function AccesoLayout({ children }: { children: React.ReactNode }) {
  const toast = useEmpStore((s) => s.toast);
  const clearToast = useEmpStore((s) => s.clearToast);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(clearToast, 1900);
    return () => clearTimeout(t);
  }, [toast, clearToast]);

  return (
    <div className="flex min-h-dvh justify-center md:items-center md:py-4" style={{ background: "var(--shell-bg)" }}>
      <div className="relative flex w-full max-w-[414px] flex-col overflow-hidden md:h-[calc(100dvh-2rem)] md:max-h-[880px] md:rounded-[2.2rem] md:shadow-2xl md:ring-1 md:ring-black/10" style={{ background: "var(--aw-app-bg)" }}>
        <main className="emp-screen-in flex-1 overflow-y-auto">{children}</main>
        {toast && (
          <div key={toast.id} className="absolute bottom-6 left-1/2 z-30 max-w-[88%] -translate-x-1/2 truncate rounded-full px-[18px] py-2.5 text-[13px] font-bold" style={{ background: "var(--foreground)", color: "var(--aw-app-bg)", boxShadow: "var(--shadow-lg)", animation: "emp-pop .35s var(--ease-spring)" }}>
            {toast.msg}
          </div>
        )}
      </div>
    </div>
  );
}
