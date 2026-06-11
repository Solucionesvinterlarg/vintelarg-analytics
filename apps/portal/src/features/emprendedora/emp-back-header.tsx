import Link from "next/link";
import { ChevronLeft } from "lucide-react";

/** Header de pantalla interna (sticky) con back (chevron), título y slot derecho. */
export function EmpBackHeader({ title, sub, back = "/emp/inicio", right }: { title: string; sub?: string; back?: string; right?: React.ReactNode }) {
  return (
    <div className="sticky top-0 z-[6] flex items-center gap-3 px-4 pb-2.5 pt-3" style={{ background: "var(--aw-app-bg)", borderBottom: "1px solid var(--aw-hairline)" }}>
      <Link href={back} aria-label="Volver" className="emp-press grid size-[38px] flex-none place-items-center rounded-xl text-foreground" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)" }}>
        <ChevronLeft size={20} />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="text-[17px] font-bold tracking-[-0.02em] text-foreground">{title}</div>
        {sub && <div className="text-[11.5px] font-semibold text-muted-foreground">{sub}</div>}
      </div>
      {right}
    </div>
  );
}
