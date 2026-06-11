import { Sparkles } from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { MockBadge } from "@/components/portal/mock-badge";

/**
 * Placeholder desktop "en construcción" para pantallas de la consola del líder
 * que llegan en sub-bloques posteriores. Mantiene el sidebar navegable sin 404.
 */
export function LciSoon({ title }: { title: string }) {
  return (
    <>
      <MockBadge />
      <DesktopTopBar title={title} initials="LT" />
      <div className="grid place-items-center px-6 py-24 text-center">
        <div className="grid size-16 place-items-center rounded-2xl" style={{ background: "var(--aw-violet-light)", color: "var(--aw-violet)" }}>
          <Sparkles size={30} strokeWidth={1.5} />
        </div>
        <div className="mt-4 text-[16px] font-bold text-foreground">Estamos maquetando esta pantalla</div>
        <p className="mt-1.5 max-w-sm text-[13px] text-muted-foreground">Llega en un próximo sub-bloque de la consola del líder.</p>
      </div>
    </>
  );
}
