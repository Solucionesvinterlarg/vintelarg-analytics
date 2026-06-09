"use client";

import { useState } from "react";
import {
  Wallet,
  User,
  ShoppingBag,
  Tag,
  RefreshCcw,
  FileText,
  Receipt,
  GraduationCap,
  Bot,
  Bell,
  MessageCircle,
  Info,
} from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { PortalBadge } from "@/components/portal/badge";
import { Toggle } from "@/components/portal/toggle";
import { MODULOS } from "@/lib/mock/modulos";

const ICON_MAP: Record<string, React.ElementType> = {
  wallet: Wallet,
  user: User,
  "shopping-bag": ShoppingBag,
  tag: Tag,
  "refresh-ccw": RefreshCcw,
  "file-text": FileText,
  receipt: Receipt,
  "graduation-cap": GraduationCap,
  bot: Bot,
  bell: Bell,
  "message-circle": MessageCircle,
};

export default function ModulosPage() {
  const [state, setState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(MODULOS.map((m) => [m.key, m.defaultOn]))
  );

  const activos = Object.values(state).filter(Boolean).length;
  const total = MODULOS.length;

  function toggle(key: string) {
    setState((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <>
      <DesktopTopBar
        title="Módulos del sistema"
        right={
          <PortalBadge tone="violet">
            {activos} de {total} activos
          </PortalBadge>
        }
      />

      {/* Intro */}
      <div className="px-6 pb-2 pt-5">
        <p
          className="m-0 max-w-[780px] text-[13px] leading-[1.5]"
          style={{ color: "var(--fg-muted)" }}
        >
          Los módulos habilitados estarán disponibles para todos los perfiles según sus permisos.
          Los módulos deshabilitados no se muestran en ninguna pantalla.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-[14px] px-6 pb-4 pt-3">
        {MODULOS.map((m) => {
          const on = state[m.key];
          const Icon = ICON_MAP[m.icon];
          return (
            <div
              key={m.key}
              className="flex items-center gap-[14px] rounded-2xl px-[18px] py-4 transition-opacity"
              style={{
                background: "#fff",
                border: "0.5px solid #E8E5F0",
                borderLeft: on
                  ? "3px solid var(--aw-success)"
                  : "3px solid #D9DAE0",
                opacity: on ? 1 : 0.66,
              }}
            >
              {/* Icon tile */}
              <div
                className="flex size-12 shrink-0 items-center justify-center rounded-xl"
                style={{ background: m.bg, color: m.color }}
              >
                {Icon && <Icon size={24} strokeWidth={1.5} />}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="text-[15px] font-extrabold"
                    style={{ letterSpacing: "-0.01em" }}
                  >
                    {m.title}
                  </span>
                  <PortalBadge tone={m.etapaTone}>{m.etapa}</PortalBadge>
                </div>
                <div
                  className="mt-0.5 text-[12px]"
                  style={{ color: "var(--fg-subtle)" }}
                >
                  {m.desc}
                </div>
              </div>

              {/* Toggle */}
              <Toggle on={on} onToggle={() => toggle(m.key)} />
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div
        className="mx-6 mb-6 flex items-center gap-[10px] rounded-xl px-4 py-3"
        style={{ background: "var(--aw-violet-light)" }}
      >
        <Info
          size={18}
          strokeWidth={1.5}
          style={{ color: "var(--aw-violet)", flexShrink: 0 }}
        />
        <span
          className="text-[12px]"
          style={{ color: "var(--aw-violet-ink)" }}
        >
          Los cambios se aplican inmediatamente para todos los usuarios de la organización. No es necesario reiniciar.
        </span>
      </div>
    </>
  );
}
