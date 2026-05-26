import Link from "next/link";
import { ChevronRight, LogOut } from "lucide-react";
import { LucideIcon } from "@/components/portal/lucide-icon";

interface MoreItem {
  icon: string;
  bg: string;
  fg: string;
  title: string;
  desc: string;
  href: string;
}

const ITEMS: MoreItem[] = [
  { icon: "refresh-ccw", bg: "var(--tint-amber)", fg: "var(--tint-amber-fg)", title: "Cambios y reclamos", desc: "Crear o consultar", href: "/home#reclamos" },
  { icon: "file-text", bg: "var(--tint-blue)", fg: "var(--tint-blue-fg)", title: "Mis facturas", desc: "Consultar facturas emitidas", href: "/home#facturas" },
  { icon: "receipt", bg: "var(--tint-green)", fg: "var(--tint-green-fg)", title: "Boletas de pago", desc: "Ver boletas y vencimientos", href: "/home#boletas" },
  { icon: "graduation-cap", bg: "var(--aw-violet-light)", fg: "var(--aw-violet)", title: "Academia", desc: "Cursos y materiales", href: "/home#academia" },
  { icon: "bot", bg: "var(--aw-violet-light)", fg: "var(--aw-violet)", title: "Asistente IA", desc: "Ayuda inteligente", href: "/home#asistente" },
  { icon: "user", bg: "#F1EFEA", fg: "#5C5A54", title: "Mi perfil", desc: "Datos personales y configuración", href: "/home#perfil" },
];

/** Contenido del menú "Más" (P03). Reutilizado por el bottom sheet y la ruta /mas. */
export function MoreSheetContent({ onNavigate, version = "v1.2.0 · Emprendedora" }: { onNavigate?: () => void; version?: string }) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {ITEMS.map((r, i) => (
          <Link
            key={r.title}
            href={r.href}
            onClick={onNavigate}
            className="flex items-center gap-3.5 px-5 py-3"
            style={{ borderBottom: i < ITEMS.length - 1 ? "0.5px solid var(--aw-hairline)" : "none" }}
          >
            <div className="grid size-9 shrink-0 place-items-center rounded-[10px]" style={{ background: r.bg, color: r.fg }}>
              <LucideIcon name={r.icon} size={18} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-foreground">{r.title}</div>
              <div className="text-[11px] text-[var(--aw-slate)]">{r.desc}</div>
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
