"use client";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { DesktopSidebar } from "@/components/shells/desktop-sidebar";
import { MobileBottomNav } from "@/components/shells/mobile-bottom-nav";
import { ResponsiveCollapse } from "@/components/shells/responsive-collapse";
import { MoreSheetContent } from "@/components/portal/more-sheet-content";
import { useShellStore } from "@/lib/shell-store";
import type { NavEntry, Section } from "@/lib/portal-config";

/**
 * Shell único responsive: el dispositivo decide el acomodo, NO el rol.
 *  - ≥768px: sidebar (todas las secciones) + contenido a ancho completo.
 *  - <768px: contenido acotado a 440px + bottom-tabs (las `primary`) y un
 *    botón "Más" que abre el sheet con el resto de secciones (`extras`).
 * Mismo árbol en ambos: solo cambian las clases responsive de Tailwind.
 */
export function AppShell({
  nav,
  tabs,
  extras,
  user,
  version,
  children,
}: {
  nav: NavEntry[];
  tabs: Section[];
  extras: Section[];
  user: { name: string; role: string; initials: string };
  version: string;
  children: React.ReactNode;
}) {
  const { moreSheetOpen, setMoreSheetOpen } = useShellStore();

  return (
    <div className="flex h-dvh overflow-hidden" style={{ background: "var(--aw-paper)" }}>
      <ResponsiveCollapse />

      {/* Sidebar — solo ≥768px */}
      <div className="hidden md:flex">
        <DesktopSidebar items={nav} user={user} />
      </div>

      {/* Columna de contenido */}
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 overflow-y-auto" style={{ background: "var(--aw-app-bg)" }}>
          {/* El cap de 440px solo aplica en mobile; en ≥768 usa todo el ancho. */}
          <div className="mx-auto min-h-full w-full max-w-[440px] md:max-w-none">{children}</div>
        </main>
        {/* Bottom-nav — solo <768px (la nav ya trae md:hidden) */}
        <MobileBottomNav tabs={tabs} />
      </div>

      {/* Sheet "Más" — se dispara desde el bottom-nav (<768px) */}
      <Sheet open={moreSheetOpen} onOpenChange={setMoreSheetOpen}>
        <SheetContent
          side="bottom"
          showCloseButton={false}
          className="mx-auto max-h-[78%] w-full max-w-[440px] gap-0 rounded-t-[28px] bg-card p-0 pt-2.5"
        >
          <div className="mx-auto mb-3 h-1 w-10 rounded-full" style={{ background: "var(--aw-mist)" }} />
          <div className="flex items-center justify-between px-5 pb-3">
            <SheetTitle className="text-base font-extrabold tracking-[-0.01em] text-foreground">Más opciones</SheetTitle>
            <button
              type="button"
              onClick={() => setMoreSheetOpen(false)}
              aria-label="Cerrar"
              className="grid size-[30px] place-items-center rounded-full text-muted-foreground"
              style={{ background: "var(--aw-chalk)" }}
            >
              ✕
            </button>
          </div>
          <MoreSheetContent sections={extras} version={version} onNavigate={() => setMoreSheetOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
