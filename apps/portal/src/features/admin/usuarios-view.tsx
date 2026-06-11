"use client";

import { useMemo, useState } from "react";
import { Search, Download, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { PortalBadge } from "@/components/portal/badge";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UsersData } from "@/lib/queries";

const PAGE_SIZE = 10;
const GRID = "1.4fr 1.9fr 1fr 1.3fr 0.9fr 1fr";

export function UsuariosView({ data }: { data: UsersData }) {
  const [search, setSearch] = useState("");
  const [rol, setRol] = useState("all");
  const [org, setOrg] = useState("all");
  const [estado, setEstado] = useState("all"); // all | active | inactive
  const [page, setPage] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return data.users.filter((u) => {
      if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
      if (rol !== "all" && u.roleKey !== rol) return false;
      if (org !== "all" && u.orgId !== org) return false;
      if (estado === "active" && !u.active) return false;
      if (estado === "inactive" && u.active) return false;
      return true;
    });
  }, [data.users, search, rol, org, estado]);

  // Si cambian los filtros, volver a la primera página.
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const start = safePage * PAGE_SIZE;
  const pageRows = filtered.slice(start, start + PAGE_SIZE);

  function resetPage<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v);
      setPage(0);
    };
  }

  const roleOptions = data.roles.map((r) => ({ value: r.key, label: r.label }));
  const orgOptions = data.orgs.map((o) => ({ value: o.id, label: o.name }));
  const estadoOptions = [
    { value: "active", label: "Activos" },
    { value: "inactive", label: "Inactivos" },
  ];

  const filters = (
    <>
      <FilterSelect value={rol} onChange={resetPage(setRol)} options={roleOptions} allLabel="Todos los roles" />
      <FilterSelect value={org} onChange={resetPage(setOrg)} options={orgOptions} allLabel="Todas las orgs" />
      <FilterSelect value={estado} onChange={resetPage(setEstado)} options={estadoOptions} allLabel="Todos los estados" />
    </>
  );

  return (
    <>
      <DesktopTopBar
        title="Usuarios"
        initials="DA"
        right={
          <div className="hidden w-60 items-center gap-2 rounded-full px-3 py-[7px] md:flex" style={{ background: "var(--aw-chalk)" }}>
            <Search size={14} strokeWidth={1.5} className="shrink-0 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              placeholder="Buscar por nombre o email…"
              className="min-w-0 flex-1 border-0 bg-transparent text-[12px] text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
        }
      />

      {/* Buscador (mobile) */}
      <div className="px-5 pt-4 md:hidden">
        <div className="flex items-center gap-2 rounded-full px-3 py-2" style={{ background: "var(--aw-chalk)" }}>
          <Search size={15} strokeWidth={1.5} className="shrink-0 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder="Buscar por nombre o email…"
            className="min-w-0 flex-1 border-0 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Filtros + Exportar */}
      <div className="flex items-center gap-2.5 px-5 pt-3.5 md:px-6">
        {/* Desktop: selects en fila */}
        <div className="hidden items-center gap-2.5 md:flex">
          <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Filtros</span>
          {filters}
        </div>

        {/* Mobile: botón que abre el drawer inferior */}
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-card px-3 py-2 text-[13px] font-semibold text-foreground md:hidden"
          style={{ border: "1px solid var(--aw-hairline)" }}
        >
          <SlidersHorizontal size={15} strokeWidth={1.5} />
          Filtros
          {activeFilterCount(rol, org, estado) > 0 && (
            <span className="grid size-[18px] place-items-center rounded-full text-[10px] font-bold text-white" style={{ background: "var(--aw-violet)" }}>
              {activeFilterCount(rol, org, estado)}
            </span>
          )}
        </button>

        {/* Exportar (TODO: export CSV real) */}
        <button
          type="button"
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-card px-3 py-2 text-[12px] font-semibold text-foreground transition-colors hover:bg-secondary"
          style={{ border: "1px solid var(--aw-hairline)" }}
        >
          <Download size={14} strokeWidth={1.5} />
          <span className="hidden sm:inline">Exportar</span>
        </button>
      </div>

      {/* Tabla (desktop) */}
      <div className="hidden flex-1 flex-col overflow-hidden px-6 pb-4 pt-4 md:flex">
        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-card" style={{ border: "0.5px solid var(--aw-hairline)" }}>
          <div
            className="grid shrink-0 px-[18px] py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground"
            style={{ gridTemplateColumns: GRID, background: "var(--aw-app-bg)", borderBottom: "1px solid var(--aw-hairline)" }}
          >
            <span>Nombre</span><span>Email</span><span>Rol</span><span>Organización</span><span>Estado</span><span>Último acceso</span>
          </div>

          <div className="flex-1 overflow-y-auto">
            {pageRows.length === 0 ? (
              <div className="grid h-full place-items-center p-10 text-center text-sm text-muted-foreground">
                {data.users.length === 0 ? "Todavía no hay usuarios." : "Sin resultados para tu búsqueda."}
              </div>
            ) : (
              pageRows.map((u, i) => (
                <div
                  key={u.id}
                  className="grid items-center px-[18px] py-[11px] text-[12px] text-foreground"
                  style={{
                    gridTemplateColumns: GRID,
                    background: i % 2 === 1 ? "var(--aw-app-bg)" : "transparent",
                    borderBottom: i < pageRows.length - 1 ? "0.5px solid var(--aw-hairline)" : "none",
                  }}
                >
                  <span className="truncate pr-2 font-semibold">{u.name}</span>
                  <span className="truncate pr-2 text-muted-foreground">{u.email}</span>
                  <span className="truncate pr-2">{u.roleLabel}</span>
                  <span className="truncate pr-2 text-muted-foreground">{u.org}</span>
                  <span>
                    <PortalBadge tone={u.active ? "success" : "danger"} dot={u.active}>
                      {u.active ? "Activo" : "Inactivo"}
                    </PortalBadge>
                  </span>
                  <span className="text-[11px] text-muted-foreground">{u.lastAccess}</span>
                </div>
              ))
            )}
          </div>

          <Pagination
            page={safePage}
            pageCount={pageCount}
            total={filtered.length}
            start={start}
            shown={pageRows.length}
            onPrev={() => setPage((p) => Math.max(0, p - 1))}
            onNext={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
          />
        </div>
      </div>

      {/* Cards (mobile) */}
      <div className="flex flex-1 flex-col gap-2.5 px-5 pb-4 pt-3.5 md:hidden">
        {pageRows.length === 0 ? (
          <div className="grid flex-1 place-items-center p-10 text-center text-sm text-muted-foreground">
            {data.users.length === 0 ? "Todavía no hay usuarios." : "Sin resultados para tu búsqueda."}
          </div>
        ) : (
          pageRows.map((u) => (
            <div key={u.id} className="rounded-2xl bg-card p-3.5" style={{ border: "0.5px solid var(--aw-hairline)" }}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-[14px] font-bold text-foreground">{u.name}</div>
                  <div className="truncate text-[12px] text-muted-foreground">{u.email}</div>
                </div>
                <PortalBadge tone={u.active ? "success" : "danger"} dot={u.active}>
                  {u.active ? "Activo" : "Inactivo"}
                </PortalBadge>
              </div>
              <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px]">
                <span className="font-semibold text-foreground">{u.roleLabel}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{u.org}</span>
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">Último acceso: {u.lastAccess}</div>
            </div>
          ))
        )}

        {pageRows.length > 0 && (
          <div className="mt-1 flex items-center justify-between gap-2">
            <PagerButton dir="prev" disabled={safePage === 0} onClick={() => setPage((p) => Math.max(0, p - 1))} />
            <span className="text-[12px] text-muted-foreground">{safePage + 1} / {pageCount}</span>
            <PagerButton dir="next" disabled={safePage >= pageCount - 1} onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))} />
          </div>
        )}
      </div>

      {/* Drawer de filtros (mobile) */}
      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="bottom" showCloseButton={false} className="mx-auto w-full max-w-[440px] gap-0 rounded-t-[24px] bg-card p-0 pt-2.5">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full" style={{ background: "var(--aw-mist)" }} />
          <div className="flex items-center justify-between px-5 pb-3">
            <SheetTitle className="text-base font-extrabold tracking-[-0.01em] text-foreground">Filtros</SheetTitle>
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              aria-label="Cerrar"
              className="grid size-[30px] place-items-center rounded-full text-muted-foreground"
              style={{ background: "var(--aw-chalk)" }}
            >
              ✕
            </button>
          </div>
          <div className="flex flex-col gap-3 px-5 pb-6">
            <FilterField label="Rol"><FilterSelect value={rol} onChange={resetPage(setRol)} options={roleOptions} allLabel="Todos los roles" full /></FilterField>
            <FilterField label="Organización"><FilterSelect value={org} onChange={resetPage(setOrg)} options={orgOptions} allLabel="Todas las orgs" full /></FilterField>
            <FilterField label="Estado"><FilterSelect value={estado} onChange={resetPage(setEstado)} options={estadoOptions} allLabel="Todos los estados" full /></FilterField>
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="mt-1 rounded-full py-2.5 text-[14px] font-bold text-white"
              style={{ background: "var(--aw-violet)" }}
            >
              Ver {filtered.length} {filtered.length === 1 ? "usuario" : "usuarios"}
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function activeFilterCount(rol: string, org: string, estado: string) {
  return [rol, org, estado].filter((v) => v !== "all").length;
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
  allLabel,
  full,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  allLabel: string;
  full?: boolean;
}) {
  const labelFor = (v: string | null) => (v && v !== "all" ? options.find((o) => o.value === v)?.label ?? allLabel : allLabel);
  return (
    <Select value={value} onValueChange={(v) => onChange((v as string) ?? "all")}>
      <SelectTrigger
        className={full ? "h-10 w-full rounded-xl text-[13px] font-semibold" : "h-9 rounded-lg text-[12px] font-semibold"}
        style={{ background: "var(--aw-card, var(--aw-white))", border: "1px solid var(--aw-hairline)" }}
      >
        <SelectValue>{(v) => labelFor(v as string | null)}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{allLabel}</SelectItem>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function Pagination({
  page,
  pageCount,
  total,
  start,
  shown,
  onPrev,
  onNext,
}: {
  page: number;
  pageCount: number;
  total: number;
  start: number;
  shown: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-none items-center justify-between border-t px-[18px] py-2.5 text-[12px] text-muted-foreground" style={{ borderColor: "var(--aw-hairline)" }}>
      <span>
        {total === 0 ? "Sin usuarios" : `Mostrando ${start + 1}–${start + shown} de ${total} ${total === 1 ? "usuario" : "usuarios"}`}
      </span>
      <div className="flex items-center gap-2">
        <PagerButton dir="prev" disabled={page === 0} onClick={onPrev} label />
        <span className="px-1">{page + 1} / {pageCount}</span>
        <PagerButton dir="next" disabled={page >= pageCount - 1} onClick={onNext} label />
      </div>
    </div>
  );
}

function PagerButton({ dir, disabled, onClick, label }: { dir: "prev" | "next"; disabled: boolean; onClick: () => void; label?: boolean }) {
  const Icon = dir === "prev" ? ChevronLeft : ChevronRight;
  const text = dir === "prev" ? "Anterior" : "Siguiente";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1 rounded-lg bg-card px-3 py-1.5 text-[12px] font-semibold text-foreground transition disabled:opacity-40"
      style={{ border: "1px solid var(--aw-hairline)" }}
    >
      {dir === "prev" && <Icon size={14} strokeWidth={1.5} />}
      {label ? <span className="hidden lg:inline">{text}</span> : <span>{text}</span>}
      {dir === "next" && <Icon size={14} strokeWidth={1.5} />}
    </button>
  );
}
