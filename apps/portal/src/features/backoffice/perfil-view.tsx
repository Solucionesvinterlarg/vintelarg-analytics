"use client";

import { useState } from "react";
import { Moon } from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { MockBadge } from "@/components/portal/mock-badge";
import { PortalBadge } from "@/components/portal/badge";
import { AvatarInitials } from "@/components/portal/avatar-initials";
import { PERFIL_MOCK, PREF_TOGGLES } from "@/features/backoffice/_mock/perfil";

export interface PerfilIdentity {
  name: string;
  email: string;
  roleLabel: string;
  org: string;
}

/** Mi perfil — recurso único. Identidad real por prop (sesión); resto MOCK. */
export function PerfilView({ id }: { id: PerfilIdentity }) {
  return (
    <>
      <MockBadge />
      <DesktopTopBar title="Mi perfil" initials="CR" />

      <div className="mx-auto w-full max-w-[880px] px-5 py-5 md:px-6">
        {/* Identidad */}
        <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-card p-5" style={{ border: "0.5px solid var(--aw-hairline)" }}>
          <AvatarInitials name={id.name} size={64} />
          <div className="min-w-0 flex-1">
            <div className="text-[18px] font-bold tracking-[-0.01em]">{id.name}</div>
            <div className="text-[13px] text-muted-foreground">{id.roleLabel} · {id.org}</div>
          </div>
          <PortalBadge tone="violet">Acceso mínimo</PortalBadge>
        </div>

        {/* 2 columnas */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Datos */}
          <Card title="Datos del usuario">
            <Field label="Nombre" value={id.name} />
            <Field label="Email" value={id.email} />
            <Field label="Rol" value={id.roleLabel} />
            <Field label="Organización" value={id.org} />
            <Field label="ID interno" value={PERFIL_MOCK.idInterno} mono />
            <Field label="Alta" value={PERFIL_MOCK.joined} />
          </Card>

          {/* Apariencia + Preferencias */}
          <div className="flex flex-col gap-4">
            <Card title="Apariencia">
              <ToggleRow icon={<Moon size={16} strokeWidth={1.75} />} label="Tema claro / oscuro" sub="Se guarda en este dispositivo" initial={false} />
            </Card>
            <Card title="Preferencias de notificación">
              {PREF_TOGGLES.map((p) => <ToggleRow key={p.label} label={p.label} initial={p.on} />)}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-card p-5" style={{ border: "0.5px solid var(--aw-hairline)" }}>
      <h3 className="mb-3 text-[14px] font-bold tracking-[-0.01em]">{title}</h3>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b py-2.5 last:border-b-0" style={{ borderColor: "var(--aw-hairline)" }}>
      <span className="text-[12.5px] text-muted-foreground">{label}</span>
      <span className="truncate text-right text-[13px] font-semibold" style={mono ? { fontFamily: "var(--font-mono)" } : undefined}>{value}</span>
    </div>
  );
}

function ToggleRow({ icon, label, sub, initial }: { icon?: React.ReactNode; label: string; sub?: string; initial: boolean }) {
  const [on, setOn] = useState(initial);
  return (
    <div className="flex items-center justify-between gap-3 border-b py-2.5 last:border-b-0" style={{ borderColor: "var(--aw-hairline)" }}>
      <div className="flex items-center gap-2.5">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <div>
          <div className="text-[13px] font-semibold">{label}</div>
          {sub && <div className="text-[11.5px] text-muted-foreground">{sub}</div>}
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => setOn((v) => !v)}
        className="relative h-[22px] w-[38px] shrink-0 rounded-full transition-colors"
        style={{ background: on ? "var(--aw-violet)" : "var(--aw-mist)" }}
      >
        <span className="absolute top-[2px] size-[18px] rounded-full bg-white transition-all" style={{ left: on ? 18 : 2 }} />
      </button>
    </div>
  );
}
