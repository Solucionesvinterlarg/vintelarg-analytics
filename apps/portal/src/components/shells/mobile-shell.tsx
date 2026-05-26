"use client";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { MobileBottomNav } from "@/components/shells/mobile-bottom-nav";
import { MoreSheetContent } from "@/components/portal/more-sheet-content";
import { useShellStore } from "@/lib/shell-store";
import type { Tab } from "@/lib/portal-config";

/**
 * Shell mobile: columna centrada (max-w en desktop para QA), contenido
 * scrollable, bottom nav persistente y bottom sheet "Más". La topbar violeta
 * vive dentro de cada pantalla (forma parte del hero).
 */
export function MobileShell({
  tabs,
  roleVersion,
  children,
}: {
  tabs: Tab[];
  roleVersion: string;
  children: React.ReactNode;
}) {
  const { moreSheetOpen, setMoreSheetOpen } = useShellStore();

  return (
    <div className="mx-auto flex h-dvh w-full max-w-[440px] flex-col overflow-hidden" style={{ background: "var(--aw-app-bg)" }}>
      <div className="flex-1 overflow-y-auto">{children}</div>
      <MobileBottomNav tabs={tabs} />

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
          <MoreSheetContent onNavigate={() => setMoreSheetOpen(false)} version={roleVersion} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
