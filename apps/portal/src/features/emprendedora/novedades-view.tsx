"use client";

import { Megaphone, Building2, Mail, Image as ImageIcon, Calendar, Zap } from "lucide-react";
import { MockBadge } from "@/components/portal/mock-badge";
import { PortalBadge, type BadgeTone } from "@/components/portal/badge";
import { EmpBackHeader } from "@/features/emprendedora/emp-back-header";
import { useEmpStore } from "@/lib/emp-store";
import { toneTile } from "@/features/emprendedora/_mock/logros";

type Tone = BadgeTone | "belleza";
const FEED: { t: string; s: string; Icon: typeof Mail; tone: Tone; tag?: string }[] = [
  { t: "Lanzamientos & Noticias", s: "Llegó la línea Cocina Pro a tu catálogo.", Icon: Megaphone, tone: "violet", tag: "Nuevo" },
  { t: "Comunicaciones Oficiales", s: "Cambios en la política de devoluciones C04.", Icon: Building2, tone: "info" },
  { t: "Área de Mensajes", s: "2 mensajes nuevos de tu Líder de Zona.", Icon: Mail, tone: "success", tag: "2" },
  { t: "Material de Marketing", s: "Placas para WhatsApp y redes · descargables.", Icon: ImageIcon, tone: "belleza" },
  { t: "Calendario de Eventos", s: "Capacitación en vivo · 16/04 19 h.", Icon: Calendar, tone: "warn" },
  { t: "Notificaciones & Promos", s: "WAO del día: 30% en Hogar hasta las 23:59.", Icon: Zap, tone: "danger", tag: "WAO" },
];

function tileFor(tone: Tone) {
  if (tone === "belleza") return { bg: "var(--cat-belleza-light)", fg: "var(--cat-belleza)" };
  return toneTile(tone);
}

export function NovedadesView() {
  const notify = useEmpStore((s) => s.notify);
  return (
    <div className="pb-6">
      <MockBadge />
      <EmpBackHeader title="Novedades" />
      <div className="flex flex-col gap-2.5 px-4 pt-3.5">
        {FEED.map((f) => {
          const t = tileFor(f.tone);
          return (
            <button key={f.t} type="button" onClick={() => notify(f.t)} className="emp-press flex items-start gap-3 rounded-2xl p-3.5 text-left" style={{ background: "var(--aw-white)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--aw-hairline)" }}>
              <span className="grid size-11 flex-none place-items-center rounded-xl" style={{ background: t.bg, color: t.fg }}><f.Icon size={21} /></span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2"><div className="text-[13.5px] font-bold text-foreground">{f.t}</div>{f.tag && <PortalBadge tone={f.tone === "belleza" ? "violet" : f.tone}>{f.tag}</PortalBadge>}</div>
                <div className="mt-0.5 text-[12px] leading-snug text-muted-foreground">{f.s}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
