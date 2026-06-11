import { Sparkles } from "lucide-react";
import { MockBadge } from "@/components/portal/mock-badge";

/**
 * Placeholder "en construcción" para las pantallas de la app emprendedora que
 * llegan en sub-bloques posteriores. Mantiene el shell phone navegable sin 404.
 * Se reemplaza por la pantalla real al construirla.
 */
export function EmpSoon({ title }: { title: string }) {
  return (
    <>
      <MockBadge />
      <div className="px-5 pb-3 pt-4 text-[18px] font-extrabold tracking-[-0.02em] text-foreground">{title}</div>
      <div className="grid place-items-center px-6 py-20 text-center">
        <div className="grid size-16 place-items-center rounded-2xl" style={{ background: "var(--aw-violet-light)", color: "var(--aw-violet)" }}>
          <Sparkles size={30} />
        </div>
        <div className="mt-4 text-[15px] font-bold text-foreground">Estamos maquetando esta pantalla</div>
        <p className="mt-1.5 max-w-[260px] text-[13px] text-muted-foreground">Llega en un próximo sub-bloque de la app emprendedora.</p>
      </div>
    </>
  );
}
