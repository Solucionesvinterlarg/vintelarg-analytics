"use client";

import { useState } from "react";
import {
  Search,
  Check,
  Wallet,
  ShoppingBag,
  RefreshCcw,
  FileText,
  Ticket,
  ShieldCheck,
} from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { PortalBadge } from "@/components/portal/badge";
import { ROLES, PERM_GROUPS, INITIAL_EDITED } from "@/lib/mock/permisos";

const GROUP_ICON_MAP: Record<string, React.ElementType> = {
  wallet: Wallet,
  "shopping-bag": ShoppingBag,
  "refresh-ccw": RefreshCcw,
  "file-text": FileText,
  ticket: Ticket,
  "shield-check": ShieldCheck,
};

const TABS = ["Todos", "Módulos", "Acciones", "Rutas"] as const;

/** Build a stable cell key from group name, perm index, role index. */
function cellKey(groupName: string, pi: number, ri: number) {
  return `${groupName}|${pi}|${ri}`;
}

type CheckState = Record<string, boolean>;

function buildInitialState(): CheckState {
  const state: CheckState = {};
  for (const grp of PERM_GROUPS) {
    grp.perms.forEach((perm, pi) => {
      perm.v.forEach((v, ri) => {
        state[cellKey(grp.g, pi, ri)] = v === 1;
      });
    });
  }
  return state;
}

export default function PermisosPage() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Todos");
  const [search, setSearch] = useState("");
  const [checks, setChecks] = useState<CheckState>(buildInitialState);
  const [edited, setEdited] = useState<Set<string>>(new Set(INITIAL_EDITED));

  function toggleCell(key: string) {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
    setEdited((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  const pendingCount = edited.size;

  const cols = `220px repeat(${ROLES.length}, minmax(0, 1fr))`;

  return (
    <>
      <DesktopTopBar
        title="Permisos por rol"
        right={
          <>
            <PortalBadge tone="warn" dot>
              {pendingCount} cambios pendientes
            </PortalBadge>
            <button
              type="button"
              className="cursor-pointer border-0 text-[13px] font-bold text-white"
              style={{
                background: "var(--aw-violet)",
                padding: "9px 18px",
                borderRadius: 100,
              }}
            >
              Guardar cambios
            </button>
          </>
        }
      />

      {/* Tabs row */}
      <div
        className="flex items-end gap-0 px-6 pt-[14px]"
        style={{ borderBottom: "1px solid #E8E5F0" }}
      >
        {TABS.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className="border-0 bg-transparent px-[14px] py-2 text-[12px] font-bold"
              style={{
                color: isActive ? "var(--aw-violet)" : "var(--fg-muted)",
                borderBottom: isActive
                  ? "2px solid var(--aw-violet)"
                  : "2px solid transparent",
                marginBottom: -1,
                cursor: "pointer",
              }}
            >
              {tab}
            </button>
          );
        })}

        {/* Search pill — right side */}
        <div className="ml-auto flex items-center gap-2 pb-2">
          <div
            className="flex w-60 items-center gap-2 px-3 py-[6px]"
            style={{
              background: "var(--aw-chalk)",
              borderRadius: 100,
            }}
          >
            <Search
              size={13}
              strokeWidth={1.5}
              style={{ color: "var(--fg-subtle)", flexShrink: 0 }}
            />
            <input
              type="text"
              placeholder="Buscar permiso..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border-0 bg-transparent text-[12px] outline-none"
              style={{ fontFamily: "var(--font-sans)" }}
            />
          </div>
        </div>
      </div>

      {/* Matrix card */}
      <div
        className="flex flex-col overflow-hidden px-6 pb-[18px] pt-[14px]"
        style={{ flex: 1 }}
      >
        <div
          className="flex flex-1 flex-col overflow-hidden rounded-2xl"
          style={{
            background: "#fff",
            border: "0.5px solid #E8E5F0",
          }}
        >
          {/* Sticky header */}
          <div
            className="flex-none items-center px-4 py-3"
            style={{
              display: "grid",
              gridTemplateColumns: cols,
              background: "#F8F7FC",
              borderBottom: "1px solid #E8E5F0",
            }}
          >
            <div
              className="text-[11px] font-bold uppercase"
              style={{
                color: "var(--fg-subtle)",
                letterSpacing: "0.08em",
              }}
            >
              Permiso
            </div>
            {ROLES.map((r) => (
              <div
                key={r.id}
                className="flex flex-col items-center gap-1"
              >
                <span className="text-[12px] font-bold" style={{ color: "var(--fg)" }}>
                  {r.name}
                </span>
                <PortalBadge tone={r.tone}>{r.tone}</PortalBadge>
              </div>
            ))}
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto">
            {PERM_GROUPS.map((grp) => {
              const GroupIcon = GROUP_ICON_MAP[grp.icon];

              // Filter perms if searching
              const visiblePerms = search
                ? grp.perms.filter((perm) =>
                    perm.p.toLowerCase().includes(search.toLowerCase())
                  )
                : grp.perms;

              if (search && visiblePerms.length === 0) return null;

              return (
                <div key={grp.g}>
                  {/* Group header */}
                  <div
                    className="items-center px-4 py-2"
                    style={{
                      display: "grid",
                      gridTemplateColumns: cols,
                      background: "var(--aw-violet-light)",
                      borderBottom: "0.5px solid #E8E5F0",
                    }}
                  >
                    <div
                      className="flex items-center gap-2 text-[11px] font-extrabold uppercase"
                      style={{
                        color: "var(--aw-violet-ink)",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {GroupIcon && (
                        <GroupIcon size={13} strokeWidth={1.5} />
                      )}
                      {grp.g}
                    </div>
                  </div>

                  {/* Permission rows */}
                  {visiblePerms.map((perm, pi) => (
                    <div
                      key={perm.p}
                      className="items-center px-4 py-2"
                      style={{
                        display: "grid",
                        gridTemplateColumns: cols,
                        background: pi % 2 === 1 ? "#F8F7FC" : "#fff",
                        borderBottom: "0.5px solid #F1EFEA",
                      }}
                    >
                      <div
                        className="text-[12px]"
                        style={{
                          fontFamily: "var(--font-mono)",
                          color: "var(--fg-muted)",
                        }}
                      >
                        {perm.p}
                      </div>

                      {perm.v.map((_, ri) => {
                        const key = cellKey(grp.g, pi, ri);
                        const isOn = checks[key] ?? false;
                        const isEdited = edited.has(key);
                        return (
                          <div
                            key={ri}
                            className="flex justify-center"
                          >
                            <button
                              type="button"
                              onClick={() => toggleCell(key)}
                              className="relative flex cursor-pointer items-center justify-center rounded-md border-0 transition-colors"
                              style={{
                                width: 22,
                                height: 22,
                                background: isOn ? "var(--aw-violet)" : "#fff",
                                border: isOn
                                  ? "none"
                                  : "1.5px solid #D9DAE0",
                              }}
                              aria-label={`Toggle ${perm.p} for role ${ri}`}
                              aria-pressed={isOn}
                            >
                              {isOn && (
                                <Check
                                  size={14}
                                  strokeWidth={3}
                                  style={{ color: "#fff" }}
                                />
                              )}
                              {isEdited && (
                                <span
                                  className="absolute rounded-full"
                                  style={{
                                    top: -3,
                                    right: -3,
                                    width: 8,
                                    height: 8,
                                    background: "#E5A53C",
                                    border: "1.5px solid #fff",
                                  }}
                                />
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
