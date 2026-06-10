"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { PortalBadge } from "@/components/portal/badge";
import { SECTION_CATALOG, SECTION_ORDER } from "@/lib/portal-config";

type Role = { id: string; name: string; userType: string | null };

/** Filas del catálogo (las 46 claves reales; se excluye shared:inicio), por grupo. */
const ROWS = SECTION_ORDER.filter((k) => k !== "shared:inicio" && SECTION_CATALOG[k]).map((k) => ({
  key: k,
  type: k.split(":")[0],
}));
const GROUPS: { type: string; keys: string[] }[] = [];
for (const r of ROWS) {
  const last = GROUPS[GROUPS.length - 1];
  if (last && last.type === r.type) last.keys.push(r.key);
  else GROUPS.push({ type: r.type, keys: [r.key] });
}

const cellKey = (roleId: string, resource: string) => `${roleId}|${resource}`;

export function PermisosMatrix({
  roles,
  allowed,
}: {
  roles: Role[];
  allowed: Record<string, boolean>;
}) {
  const router = useRouter();
  // Solo guardamos los cambios (overrides) respecto del estado de la base.
  const [overrides, setOverrides] = useState<Map<string, boolean>>(new Map());
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Tras guardar + router.refresh(), llega `allowed` fresco → limpiamos overrides.
  useEffect(() => {
    setOverrides(new Map());
  }, [allowed]);

  const baseVal = (k: string) => allowed[k] ?? false;
  const curVal = (k: string) => (overrides.has(k) ? overrides.get(k)! : baseVal(k));
  const isModified = (k: string) => overrides.has(k);

  const toggle = (roleId: string, resource: string) => {
    const k = cellKey(roleId, resource);
    const next = !curVal(k);
    setOverrides((prev) => {
      const m = new Map(prev);
      if (next === baseVal(k)) m.delete(k);
      else m.set(k, next);
      return m;
    });
  };

  const dirty = overrides.size;
  const cols = `240px repeat(${roles.length}, minmax(0, 1fr))`;

  async function save() {
    if (dirty === 0 || saving) return;
    setSaving(true);
    setError(null);
    const changes = [...overrides.entries()].map(([k, value]) => {
      const sep = k.indexOf("|");
      const roleDefinitionId = k.slice(0, sep);
      const resource = k.slice(sep + 1);
      return { roleDefinitionId, resource, resourceType: resource.split(":")[0], allowed: value };
    });
    try {
      const res = await fetch("/api/admin/permisos", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ changes }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `HTTP ${res.status}`);
      }
      setToast("Cambios guardados");
      window.setTimeout(() => setToast(null), 3000);
      // Refresca server components (matriz + menú leen la misma tabla).
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden px-6 pb-[18px] pt-3.5">
      {/* Toolbar: contador + acciones */}
      <div className="flex flex-none items-center justify-between pb-3">
        <div className="text-[13px] font-semibold" style={{ color: dirty > 0 ? "var(--aw-violet)" : "var(--fg-subtle)" }}>
          {dirty > 0 ? `Tenés ${dirty} ${dirty === 1 ? "cambio" : "cambios"} sin guardar` : "Sin cambios pendientes"}
        </div>
        <div className="flex items-center gap-2">
          {error && <span className="text-[12px] font-medium" style={{ color: "var(--aw-danger)" }}>{error}</span>}
          <button
            type="button"
            onClick={() => setOverrides(new Map())}
            disabled={dirty === 0 || saving}
            className="rounded-lg px-3 py-2 text-[13px] font-semibold transition disabled:opacity-40"
            style={{ color: "var(--fg-subtle)", border: "1px solid var(--aw-hairline)" }}
          >
            Descartar
          </button>
          <button
            type="button"
            onClick={save}
            disabled={dirty === 0 || saving}
            className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-semibold text-white transition disabled:opacity-40"
            style={{ background: "var(--aw-violet)" }}
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            Guardar cambios
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-card" style={{ border: "0.5px solid var(--aw-hairline)" }}>
        {/* header */}
        <div className="grid flex-none items-center px-4 py-3" style={{ gridTemplateColumns: cols, background: "var(--aw-app-bg)", borderBottom: "1px solid var(--aw-hairline)" }}>
          <div className="text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: "var(--fg-subtle)" }}>Permiso</div>
          {roles.map((r) => (
            <div key={r.id} className="flex flex-col items-center gap-1">
              <span className="text-center text-[12px] font-bold text-foreground">{r.name}</span>
              <PortalBadge tone={r.userType === "external" ? "external" : "internal"}>{r.userType ?? "interno"}</PortalBadge>
            </div>
          ))}
        </div>
        {/* body */}
        <div className="flex-1 overflow-y-auto">
          {GROUPS.map((g) => (
            <div key={g.type}>
              <div className="grid items-center px-4 py-2" style={{ gridTemplateColumns: cols, background: "var(--aw-violet-light)", borderBottom: "0.5px solid var(--aw-hairline)" }}>
                <div className="text-[11px] font-extrabold uppercase tracking-[0.1em]" style={{ color: "var(--aw-violet-ink)" }}>{g.type}</div>
              </div>
              {g.keys.map((key, pi) => (
                <div key={key} className="grid items-center px-4 py-2" style={{ gridTemplateColumns: cols, background: pi % 2 === 1 ? "var(--aw-app-bg)" : "transparent", borderBottom: "0.5px solid var(--aw-hairline)" }}>
                  <div className="truncate text-[12px] text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }} title={SECTION_CATALOG[key].name}>{key}</div>
                  {roles.map((r) => {
                    const k = cellKey(r.id, key);
                    const checked = curVal(k);
                    const modified = isModified(k);
                    return (
                      <div key={r.id} className="flex justify-center">
                        <button
                          type="button"
                          onClick={() => toggle(r.id, key)}
                          aria-pressed={checked}
                          aria-label={`${r.name} · ${key}`}
                          className="grid size-[22px] place-items-center rounded-md transition-transform hover:scale-110"
                          style={{
                            background: checked ? "var(--aw-violet)" : "var(--aw-white)",
                            border: checked ? "none" : "1.5px solid var(--aw-mist)",
                            boxShadow: modified ? "0 0 0 2px var(--aw-paper), 0 0 0 4px var(--aw-violet)" : undefined,
                          }}
                        >
                          {checked && <Check size={14} strokeWidth={3} className="text-white" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white shadow-lg"
          style={{ background: "var(--aw-violet)" }}
        >
          <Check size={16} strokeWidth={2.5} />
          {toast}
        </div>
      )}
    </div>
  );
}
