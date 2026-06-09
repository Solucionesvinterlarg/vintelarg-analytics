import { MoreSheetContent } from "@/components/portal/more-sheet-content";
import { getCurrentUser } from "@/lib/session";
import { extraSectionsForRole, normalizeRole, ROLE_LABEL } from "@/lib/portal-config";

export default async function MasPage() {
  const user = await getCurrentUser();
  const role = normalizeRole(user?.role);

  return (
    <div className="flex min-h-full flex-col">
      <div style={{ background: "var(--aw-violet)" }} className="px-5 pb-4 pt-4 text-base font-extrabold text-white">
        Más opciones
      </div>
      <div className="flex flex-1 flex-col bg-card">
        <MoreSheetContent sections={extraSectionsForRole(user?.role)} version={`v1.2.0 · ${ROLE_LABEL[role]}`} />
      </div>
    </div>
  );
}
