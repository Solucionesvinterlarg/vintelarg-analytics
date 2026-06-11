"use client";

import { useState } from "react";
import { Smartphone, SearchCheck, IdCard, BadgeCheck, Check, CircleCheckBig, Upload, Gift } from "lucide-react";
import { PortalBadge } from "@/components/portal/badge";
import { AvatarInitials } from "@/components/portal/avatar-initials";
import { EmpBackHeader } from "@/features/emprendedora/emp-back-header";
import { useEmpStore } from "@/lib/emp-store";

const STEPS = [
  { n: "Registro digital", s: "Desde cualquier dispositivo", state: "done" as const, Icon: Smartphone },
  { n: "Chequeo de Deuda Online", s: "Validación automática de cuenta", state: "done" as const, Icon: SearchCheck },
  { n: "Subida de DNI", s: "Frente y dorso", state: "active" as const, Icon: IdCard },
  { n: "Validación Automática", s: "Alta inmediata", state: "pending" as const, Icon: BadgeCheck },
];

export function RegistroView() {
  const [tab, setTab] = useState<"auto" | "asist">("auto");
  const notify = useEmpStore((s) => s.notify);

  return (
    <div className="min-h-full pb-6">
      <EmpBackHeader title="Registro" sub="Sumate a A-ware" back="/acceso/login" />
      <div className="px-4 pt-3.5">
        <div className="flex gap-1.5 rounded-full p-1" style={{ background: "var(--aw-app-bg)" }}>
          {([{ id: "auto", l: "Autorregistración" }, { id: "asist", l: "Registración Asistida" }] as const).map((t) => (
            <button key={t.id} type="button" onClick={() => setTab(t.id)} className="emp-press flex-1 rounded-full py-2.5 text-[12.5px] font-bold" style={{ background: tab === t.id ? "var(--aw-white)" : "transparent", color: tab === t.id ? "var(--aw-violet-deep)" : "var(--fg-subtle)", boxShadow: tab === t.id ? "var(--shadow-sm)" : "none" }}>{t.l}</button>
          ))}
        </div>

        {tab === "auto" ? (
          <div className="mt-4">
            <div className="mb-3.5 text-[12.5px] leading-snug text-muted-foreground">Proceso 100% digital, desde tu celular. Alta inmediata.</div>
            <div className="rounded-2xl p-[18px]" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" }}>
              {STEPS.map((s, i) => {
                const done = s.state === "done", active = s.state === "active";
                return (
                  <div key={s.n} className="flex gap-3.5">
                    <div className="flex flex-col items-center">
                      <span className="grid size-9 flex-none place-items-center rounded-full" style={{ background: done ? "var(--aw-success)" : active ? "var(--aw-violet)" : "var(--aw-app-bg)", color: done || active ? "#fff" : "var(--fg-subtle)", boxShadow: active ? "0 0 0 4px var(--aw-violet-light)" : "none" }}>{done ? <Check size={17} strokeWidth={3} /> : <s.Icon size={17} />}</span>
                      {i < STEPS.length - 1 && <span className="min-h-[24px] w-0.5 flex-1" style={{ background: done ? "var(--aw-success)" : "var(--aw-hairline)" }} />}
                    </div>
                    <div style={{ paddingBottom: i < STEPS.length - 1 ? 16 : 0 }}>
                      <div className="text-[13.5px] font-bold" style={{ color: active ? "var(--aw-violet-deep)" : "var(--foreground)" }}>{s.n}</div>
                      <div className="text-[11.5px] text-muted-foreground">{s.s}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex items-center gap-3 rounded-2xl p-3.5" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" }}>
              <CircleCheckBig size={20} style={{ color: "var(--aw-success)" }} />
              <div className="flex-1 text-[13px] font-semibold text-foreground">Estado de Cuenta</div>
              <PortalBadge tone="success">Aprobado</PortalBadge>
            </div>
            <button type="button" onClick={() => notify("Subir DNI")} className="emp-press mt-3.5 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-bold text-white" style={{ background: "var(--aw-violet)", boxShadow: "var(--shadow-violet)" }}><Upload size={18} /> Continuar · Subir DNI</button>
          </div>
        ) : (
          <div className="mt-4">
            <div className="mb-3.5 text-[12.5px] leading-snug text-muted-foreground">Con acompañamiento de tu Líder o GZ. Mismas funciones + respaldo administrativo.</div>
            <div className="flex items-center gap-3 rounded-2xl p-4" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" }}>
              <AvatarInitials name="Carmen Suárez" size={42} />
              <div className="flex-1"><div className="text-[13.5px] font-bold text-foreground">Líder de Zona</div><div className="text-[11.5px] text-muted-foreground">Carmen Suárez · Zona Norte</div></div>
              <PortalBadge tone="violet">Asignada</PortalBadge>
            </div>
            <div className="mt-3 flex items-center gap-3 rounded-2xl p-3.5" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" }}>
              <CircleCheckBig size={20} style={{ color: "var(--aw-success)" }} />
              <div className="flex-1 text-[13px] font-semibold text-foreground">Estado de Cuenta</div>
              <PortalBadge tone="success">Aprobado</PortalBadge>
            </div>
            <div className="mt-3 flex items-center gap-3 rounded-2xl p-3.5" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" }}>
              <Gift size={20} style={{ color: "var(--aw-violet)" }} />
              <div className="flex-1 text-[13px] font-semibold text-foreground">Premio Indicante</div>
              <PortalBadge tone="violet">Seleccionado</PortalBadge>
            </div>
            <button type="button" onClick={() => notify("Solicitud enviada a tu Líder")} className="emp-press mt-3.5 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-bold text-white" style={{ background: "var(--aw-violet)", boxShadow: "var(--shadow-violet)" }}><Check size={18} /> Confirmar alta asistida</button>
          </div>
        )}
      </div>
    </div>
  );
}
