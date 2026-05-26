"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "@/components/portal/lucide-icon";
import { useShellStore } from "@/lib/shell-store";
import type { Tab } from "@/lib/portal-config";
import { cn } from "@/lib/utils";

/** Bottom nav fija translúcida, 5 tabs, activo en violeta. Port de shared.jsx. */
export function MobileBottomNav({ tabs }: { tabs: Tab[] }) {
  const pathname = usePathname();
  const setMoreSheetOpen = useShellStore((s) => s.setMoreSheetOpen);

  return (
    <nav
      className="flex flex-none px-1.5 pb-5 pt-2"
      style={{ borderTop: "1px solid var(--aw-hairline)", background: "rgba(255,255,255,0.94)", backdropFilter: "blur(12px)" }}
    >
      {tabs.map((t) => {
        const isMore = t.id === "more";
        const active = !isMore && pathname === t.href.split("#")[0];
        const inner = (
          <>
            <LucideIcon name={t.icon} size={22} />
            <span>{t.label}</span>
          </>
        );
        const cls = cn(
          "flex flex-1 flex-col items-center gap-[3px] text-[10px] font-semibold",
          active ? "text-[var(--aw-violet)]" : "text-[var(--aw-slate)]"
        );
        return isMore ? (
          <button key={t.id} type="button" className={cls} onClick={() => setMoreSheetOpen(true)}>
            {inner}
          </button>
        ) : (
          <Link key={t.id} href={t.href} className={cls} aria-current={active ? "page" : undefined}>
            {inner}
          </Link>
        );
      })}
    </nav>
  );
}
