"use client";

import { useState } from "react";
import Link from "next/link";
import { Crown, Award, Zap, Medal, CheckCircle2, Plus, Lock } from "lucide-react";
import { MockBadge } from "@/components/portal/mock-badge";
import { PortalBadge } from "@/components/portal/badge";
import { LucideIcon } from "@/components/portal/lucide-icon";
import { EmpBackHeader } from "@/features/emprendedora/emp-back-header";
import { useEmpStore } from "@/lib/emp-store";
import { PODIUM, MEDALS, toneTile } from "@/features/emprendedora/_mock/logros";

const TABS = ["VIP", "Venta", "Programas Vigentes", "Capacitación"];

export function LogrosView() {
  const [tab, setTab] = useState("VIP");
  const notify = useEmpStore((s) => s.notify);
  const setCelebrate = useEmpStore((s) => s.setCelebrate);

  return (
    <div className="pb-6">
      <MockBadge />
      <EmpBackHeader title="Mis Logros" right={<button type="button" onClick={() => setCelebrate(true)} className="emp-press rounded-full px-3 py-1.5 text-[11.5px] font-bold" style={{ background: "var(--aw-violet-light)", color: "var(--aw-violet-deep)" }}>Ver celebración</button>} />

      <div className="px-4 pt-3.5">
        {/* status */}
        <div className="rounded-2xl p-4" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" }}>
          <div className="flex items-center gap-3">
            <span className="grid size-[52px] place-items-center rounded-full text-[18px] font-bold text-white" style={{ background: "var(--aw-violet)", boxShadow: "0 0 0 3px var(--aw-white), 0 0 0 5px var(--aw-violet)" }}>MA</span>
            <div className="flex-1">
              <div className="flex items-center gap-1.5"><span className="text-[16px] font-extrabold text-foreground">Puesto 5 · Senior</span><PortalBadge tone="violet"><Crown size={12} /> VIP</PortalBadge></div>
              <div className="mt-0.5 text-[11.5px] text-muted-foreground">María Antonieta</div>
            </div>
          </div>
          <div className="mb-1.5 mt-3.5 flex justify-between text-[12px]"><span className="text-muted-foreground">Próximo puesto · <b style={{ color: "var(--aw-violet-deep)" }}>VIP Pleno</b></span><span className="font-bold text-foreground">Te faltan 200 pts</span></div>
          <div className="h-2 overflow-hidden rounded-full" style={{ background: "var(--aw-violet-light)" }}><div className="h-full rounded-full" style={{ width: "69%", background: "var(--aw-violet)" }} /></div>
        </div>

        {/* tabs */}
        <div className="no-scrollbar mt-3.5 flex gap-1.5 overflow-x-auto">
          {TABS.map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)} className="emp-press flex-none rounded-full px-3.5 py-2 text-[12.5px] font-semibold" style={{ border: `1px solid ${tab === t ? "var(--aw-violet)" : "var(--aw-hairline)"}`, background: tab === t ? "var(--aw-violet)" : "var(--aw-white)", color: tab === t ? "#fff" : "var(--fg-subtle)" }}>{t}</button>
          ))}
        </div>

        {/* podium */}
        <Head icon={<Award size={17} style={{ color: "var(--aw-violet)" }} />} action="Ranking Nacional" onAction={() => notify("Ranking Nacional VIP #142")}>Círculo VIP</Head>
        <div className="rounded-2xl p-4" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" }}>
          <div className="flex items-end justify-center gap-2.5">
            {PODIUM.map((pl) => (
              <div key={pl.p} className="flex-1 text-center">
                <span className="mx-auto mb-1.5 grid place-items-center rounded-full font-bold" style={{ width: pl.p === 1 ? 44 : 36, height: pl.p === 1 ? 44 : 36, fontSize: pl.p === 1 ? 15 : 13, background: pl.me ? "var(--aw-violet)" : "var(--aw-app-bg)", color: pl.me ? "#fff" : "var(--foreground)" }}>{pl.n[0]}</span>
                <div className="h-6 overflow-hidden text-[10.5px] font-bold leading-tight text-foreground">{pl.n}</div>
                <div className="mb-1.5 text-[10px] text-muted-foreground">{pl.pts} pts</div>
                <div className="flex items-start justify-center rounded-t-[10px] pt-1.5 text-[15px] font-extrabold" style={{ height: pl.h, background: pl.p === 1 ? "var(--aw-violet)" : pl.me ? "var(--aw-violet-light)" : "var(--aw-app-bg)", color: pl.p === 1 ? "#fff" : "var(--foreground)" }}>{pl.p}°</div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-center text-[11.5px] text-muted-foreground">Posición en Ranking Nacional VIP: <b className="text-foreground">#142</b></div>
        </div>

        {/* desafíos */}
        <Head icon={<Zap size={17} style={{ color: "var(--aw-violet)" }} />}>Desafíos Semanales</Head>
        <div className="rounded-2xl p-4" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" }}>
          <div className="flex items-start justify-between">
            <div><div className="text-[14px] font-bold text-foreground">Vendé 5 Botellas Eco</div><div className="mt-0.5 text-[11.5px] text-muted-foreground">Termina en 2 días</div></div>
            <PortalBadge tone="success"><Plus size={12} /> 500 pts</PortalBadge>
          </div>
          <div className="mb-1.5 mt-3 flex justify-between text-[12px]"><span className="text-muted-foreground">Progreso</span><span className="font-bold text-foreground">3/5 vendidos</span></div>
          <div className="h-2 overflow-hidden rounded-full" style={{ background: "var(--aw-success-light)" }}><div className="h-full rounded-full" style={{ width: "60%", background: "var(--aw-success)" }} /></div>
          <button type="button" onClick={() => notify("Venta registrada · 4/5")} className="emp-press mt-3 flex w-full items-center justify-center gap-1.5 rounded-full py-2.5 text-[14px] font-bold text-white" style={{ background: "var(--aw-violet)" }}><CheckCircle2 size={17} /> Registrar Venta</button>
        </div>

        {/* medallas */}
        <Head icon={<Medal size={17} style={{ color: "var(--aw-violet)" }} />}>Medallas</Head>
        <div className="grid grid-cols-3 gap-2.5">
          {MEDALS.map((m) => {
            const t = toneTile(m.tone);
            return (
              <Link key={m.id} href={`/emp/logro/${m.id}`} className="emp-press rounded-2xl p-3.5 text-center" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: `1px solid ${m.got ? "var(--aw-violet-light)" : "var(--aw-hairline)"}`, opacity: m.got ? 1 : 0.55 }}>
                <span className="mx-auto mb-2 grid size-11 place-items-center rounded-full" style={m.got ? { background: t.bg, color: t.fg } : { background: "var(--aw-app-bg)", color: "var(--fg-subtle)" }}>{m.got ? <LucideIcon name={m.ic} size={21} strokeWidth={2} /> : <Lock size={21} />}</span>
                <div className="text-[10.5px] font-bold leading-tight text-foreground">{m.n}</div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Head({ icon, action, onAction, children }: { icon?: React.ReactNode; action?: string; onAction?: () => void; children: React.ReactNode }) {
  return (
    <div className="mb-3 mt-[18px] flex items-center justify-between">
      <div className="flex items-center gap-1.5 text-[15.5px] font-bold tracking-[-0.01em] text-foreground">{icon}{children}</div>
      {action && <button type="button" onClick={onAction} className="emp-press text-[12.5px] font-semibold" style={{ color: "var(--aw-violet)" }}>{action}</button>}
    </div>
  );
}
