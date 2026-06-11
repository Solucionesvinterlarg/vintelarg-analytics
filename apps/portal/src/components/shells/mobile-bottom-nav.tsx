"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "@/components/portal/lucide-icon";
import { useShellStore } from "@/lib/shell-store";
import type { Section } from "@/lib/portal-config";
import { cn } from "@/lib/utils";

/**
 * Bottom nav fija translúcida (<768px): las secciones `primary` del rol + un
 * botón "Más" que abre el sheet con el resto de secciones. Activo en violeta.
 */
export function MobileBottomNav({ tabs }: { tabs: Section[] }) {
  const pathname = usePathname();
  const setMoreSheetOpen = useShellStore((s) => s.setMoreSheetOpen);

  const cls = (active: boolean) =>
    cn(
      "flex flex-1 flex-col items-center gap-[3px] text-[10px] font-semibold",
      active ? "text-[var(--aw-violet)]" : "text-[var(--aw-slate)]"
    );

  return (
    <nav
      className="flex flex-none px-1.5 pb-5 pt-2 md:hidden"
      style={{ borderTop: "1px solid var(--aw-hairline)", background: "rgba(255,255,255,0.94)", backdropFilter: "blur(12px)" }}
    >
      {tabs.map((t) => {
        const active = pathname === t.href.split("#")[0] && !t.href.includes("#");
        return (
          <Link key={t.id} href={t.href} prefetch={false} className={cls(active)} aria-current={active ? "page" : undefined}>
            <LucideIcon name={t.icon} size={22} />
            <span>{t.name}</span>
          </Link>
        );
      })}
      <button type="button" className={cls(false)} onClick={() => setMoreSheetOpen(true)}>
        <LucideIcon name="menu" size={22} />
        <span>Más</span>
      </button>
    </nav>
  );
}
