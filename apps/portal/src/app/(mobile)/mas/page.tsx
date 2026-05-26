import { MoreSheetContent } from "@/components/portal/more-sheet-content";

export default function MasPage() {
  return (
    <div className="flex min-h-full flex-col">
      <div style={{ background: "var(--aw-violet)" }} className="px-5 pb-4 pt-4 text-base font-extrabold text-white">
        Más opciones
      </div>
      <div className="flex flex-1 flex-col bg-card">
        <MoreSheetContent />
      </div>
    </div>
  );
}
