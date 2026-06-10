import Link from "next/link";
import { ChevronRight, LogOut } from "lucide-react";
import { LucideIcon } from "@/components/portal/lucide-icon";
import type { Section } from "@/lib/portal-config";

/**
 * Contenido del menú "Más" (P03): el resto de las secciones del rol (las
 * no-primary). Reutilizado por el bottom sheet (<768px) y la ruta /mas.
 */
export function MoreSheetContent({
  sections,
  onNavigate,
  version = "v1.2.0",
}: {
  sections: Section[];
  onNavigate?: () => void;
  version?: string;
}) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {sections.map((s, i) => (
          <Link
            key={s.id}
            href={s.href}
            onClick={onNavigate}
            className="flex items-center gap-3.5 px-5 py-3"
            style={{ borderBottom: i < sections.length - 1 ? "0.5px solid var(--aw-hairline)" : "none" }}
          >
            <div
              className="grid size-9 shrink-0 place-items-center rounded-[10px]"
              style={{ background: s.tint?.bg ?? "#F1EFEA", color: s.tint?.fg ?? "#5C5A54" }}
            >
              <LucideIcon name={s.icon} size={18} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-foreground">{s.name}</div>
              {s.desc && <div className="text-[11px] text-[var(--aw-slate)]">{s.desc}</div>}
            </div>
            <ChevronRight size={16} strokeWidth={1.5} className="text-[var(--aw-stone)]" />
          </Link>
        ))}
        <div className="h-2" style={{ background: "var(--aw-app-bg)" }} />
        <Link href="/api/auth/logout" className="flex items-center gap-3.5 px-5 py-3.5">
          <div className="grid size-9 shrink-0 place-items-center rounded-[10px]" style={{ background: "var(--aw-danger-light)", color: "var(--aw-danger)" }}>
            <LogOut size={18} strokeWidth={1.5} />
          </div>
          <div className="text-sm font-bold text-[var(--aw-danger)]">Cerrar sesión</div>
        </Link>
      </div>
      <div className="px-0 pb-6 pt-2 text-center font-mono text-[10px] text-[var(--aw-stone)]">{version}</div>
    </div>
  );
}
