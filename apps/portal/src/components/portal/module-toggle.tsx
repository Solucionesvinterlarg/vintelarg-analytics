"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Toggle } from "@/components/portal/toggle";

/**
 * Toggle de habilitación de un módulo (per-org). PATCH a /api/admin/modulos →
 * escribe organization_modules.active. Optimista; revierte si falla. `router.refresh`
 * re-renderiza el layout (menú) + la página para ver el efecto al instante.
 */
export function ModuleToggle({
  moduleKey,
  active,
  label,
}: {
  moduleKey: string;
  active: boolean;
  label: string;
}) {
  const router = useRouter();
  const [on, setOn] = useState(active);
  const [pending, setPending] = useState(false);

  async function toggle(next: boolean) {
    setOn(next);
    setPending(true);
    try {
      const res = await fetch("/api/admin/modulos", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ moduleKey, active: next }),
      });
      if (!res.ok) throw new Error(String(res.status));
      router.refresh();
    } catch (e) {
      setOn(!next); // revertir si el guardado falló
      console.error("[portal] toggle de módulo falló:", e);
    } finally {
      setPending(false);
    }
  }

  return <Toggle on={on} onToggle={toggle} disabled={pending} aria-label={`Habilitar ${label}`} />;
}
