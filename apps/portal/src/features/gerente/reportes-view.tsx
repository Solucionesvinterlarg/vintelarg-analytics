"use client";

import { FileText, Sheet, FileSpreadsheet, Download, Plus } from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { PortalBadge } from "@/components/portal/badge";
import { MockBadge } from "@/components/portal/mock-badge";
import { REPORTES, TIPO_TONE } from "@/features/gerente/_mock/reportes";

const ICONS: Record<string, typeof FileText> = { "file-text": FileText, sheet: Sheet, "file-spreadsheet": FileSpreadsheet };

export function ReportesView() {
  return (
    <>
      <MockBadge />
      <DesktopTopBar
        title="Biblioteca de reportes"
        initials="MC"
        right={
          <button type="button" className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-bold text-white" style={{ background: "var(--aw-violet)" }}>
            <Plus size={14} strokeWidth={2} /><span className="hidden sm:inline">Generar reporte</span>
          </button>
        }
      />
      <p className="px-5 pt-3.5 text-[13px] text-muted-foreground md:px-6">Reportes generados para tu división</p>

      <div className="px-5 pb-6 pt-3.5 md:px-6">
        <div className="overflow-hidden rounded-2xl bg-card" style={{ border: "0.5px solid var(--aw-hairline)" }}>
          {REPORTES.map((r, i) => {
            const Icon = ICONS[r.icon] ?? FileText;
            return (
              <div key={i} className="flex items-center gap-3.5 px-[18px] py-3.5" style={{ borderBottom: i < REPORTES.length - 1 ? "0.5px solid var(--aw-hairline)" : "none" }}>
                <div className="grid size-9 shrink-0 place-items-center rounded-[10px]" style={{ background: "var(--aw-violet-light)", color: "var(--aw-violet)" }}>
                  <Icon size={17} strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13.5px] font-semibold">{r.n}</div>
                  <div className="text-[11.5px] text-muted-foreground">{r.size} · {r.gen}</div>
                </div>
                <PortalBadge tone={TIPO_TONE[r.tipo]}>{r.tipo}</PortalBadge>
                <button type="button" className="ml-1 inline-flex items-center gap-1.5 rounded-lg bg-card px-3 py-1.5 text-[12px] font-semibold text-foreground transition-colors hover:bg-secondary" style={{ border: "1px solid var(--aw-hairline)" }}>
                  <Download size={14} strokeWidth={1.5} /><span className="hidden md:inline">Descargar</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
