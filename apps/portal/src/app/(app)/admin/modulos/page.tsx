import type { LucideIcon } from "lucide-react";
import {
  Puzzle, ShieldX, SlidersHorizontal,
  Headset, ShoppingCart, Users, BarChart3, Bot, LayoutTemplate, GraduationCap, Truck, MessageSquare, Undo2,
  ShieldCheck, Coins, Box, HardDrive, Settings, Search,
} from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { getOrganizationModules, type OrgModule } from "@/lib/queries";
import { getModuleAppLinks } from "@/lib/idp-apps";
import { ModuleToggle } from "@/components/portal/module-toggle";
import { getCurrentUser } from "@/lib/session";
import { normalizeRole } from "@/lib/portal-config";

export const dynamic = "force-dynamic";

/** Presentación de cada módulo del ecosistema (label legible + ícono lucide). */
const MODULES: Record<string, { label: string; Icon: LucideIcon }> = {
  // negocio
  crm: { label: "CRM", Icon: Headset },
  commerce: { label: "Pedidos", Icon: ShoppingCart },
  sales_force: { label: "Fuerza de Venta", Icon: Users },
  reporteria: { label: "Reportería", Icon: BarChart3 },
  ai_agent: { label: "Agente IA", Icon: Bot },
  cms: { label: "CMS / Contenidos", Icon: LayoutTemplate },
  lms: { label: "Academia (LMS)", Icon: GraduationCap },
  logistica: { label: "Logística", Icon: Truck },
  mensajeria: { label: "Mensajería", Icon: MessageSquare },
  returns: { label: "Cambios y Reclamos", Icon: Undo2 },
  // infra
  auth: { label: "Autenticación", Icon: ShieldCheck },
  commission_worker: { label: "Motor de Comisiones", Icon: Coins },
  cubicaje: { label: "Cubicaje", Icon: Box },
  minio: { label: "Almacenamiento", Icon: HardDrive },
  operations: { label: "Operaciones", Icon: Settings },
  rag: { label: "Búsqueda IA (RAG)", Icon: Search },
};

function present(moduleKey: string) {
  return MODULES[moduleKey] ?? { label: moduleKey.replace(/_/g, " "), Icon: Puzzle };
}

export default async function ModulosPage() {
  // Doble guarda: el layout autentica, pero esta pantalla es admin-only.
  const user = await getCurrentUser();
  if (!user || normalizeRole(user.role) !== "admin") {
    return (
      <>
        <DesktopTopBar title="Módulos habilitados" initials="DA" />
        <Forbidden />
      </>
    );
  }

  const [modules, appLinks] = await Promise.all([
    getOrganizationModules(user.orgId),
    getModuleAppLinks(),
  ]);
  const appKeys = new Set(appLinks.keys());
  const negocio = modules.filter((m) => m.moduleType === "negocio");
  const infra = modules.filter((m) => m.moduleType === "infra");

  return (
    <>
      <DesktopTopBar title="Módulos habilitados" initials="DA" />
      {modules.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-3.5">
          {/* Nota: habilitación editable, por módulo y per-org */}
          <div className="mb-5 flex items-start gap-3 rounded-xl px-4 py-3" style={{ background: "var(--aw-violet-light)", border: "0.5px solid var(--aw-hairline)" }}>
            <SlidersHorizontal size={16} strokeWidth={1.5} className="mt-0.5 shrink-0" style={{ color: "var(--aw-violet)" }} />
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">Habilitación por módulo.</span> El toggle prende/apaga
              TODOS los ítems de menú del módulo para tu organización. Los módulos <span className="font-semibold text-foreground">App</span> abren
              su aplicación cuando están activos (o muestran “Próximamente” si los apagás); los internos se muestran según su pantalla.
            </p>
          </div>

          <ModuleSection title="Módulos de negocio" modules={negocio} appKeys={appKeys} />
          <ModuleSection title="Servicios base" modules={infra} appKeys={appKeys} />
        </div>
      )}
    </>
  );
}

function ModuleSection({ title, modules, appKeys }: { title: string; modules: OrgModule[]; appKeys: Set<string> }) {
  if (modules.length === 0) return null;
  const activos = modules.filter((m) => m.active).length;
  return (
    <section className="mb-6">
      <div className="mb-2.5 flex items-baseline gap-2">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--fg-subtle)" }}>{title}</h3>
        <span className="text-[11px] font-medium text-muted-foreground">· {activos} de {modules.length} activos</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((m) => (
          <ModuleCard key={m.moduleKey} mod={m} isApp={appKeys.has(m.moduleKey)} />
        ))}
      </div>
    </section>
  );
}

function ModuleCard({ mod, isApp }: { mod: OrgModule; isApp: boolean }) {
  const { label, Icon } = present(mod.moduleKey);
  return (
    <div className="flex items-center gap-3 rounded-xl bg-card px-4 py-3" style={{ border: "0.5px solid var(--aw-hairline)" }}>
      <div
        className="grid size-10 shrink-0 place-items-center rounded-xl"
        style={mod.active ? { background: "var(--aw-violet-light)", color: "var(--aw-violet)" } : { background: "var(--aw-chalk)", color: "var(--aw-stone)" }}
      >
        <Icon size={20} strokeWidth={1.5} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-bold text-foreground">{label}</div>
        <div className="flex items-center gap-1.5">
          <span className="truncate text-[11px] text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>{mod.moduleKey}</span>
          <span
            className="shrink-0 rounded px-1 py-px text-[9px] font-bold uppercase tracking-wide"
            style={isApp ? { background: "var(--aw-violet-light)", color: "var(--aw-violet)" } : { background: "var(--aw-chalk)", color: "var(--aw-stone)" }}
            title={isApp ? "Módulo-app del IdP (abre su aplicación)" : "Módulo interno del Portal"}
          >
            {isApp ? "App" : "Interno"}
          </span>
        </div>
      </div>
      <ModuleToggle moduleKey={mod.moduleKey} active={mod.active} label={label} />
    </div>
  );
}

function Forbidden() {
  return (
    <div className="grid flex-1 place-items-center p-10">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl" style={{ background: "var(--aw-danger-light)", color: "var(--aw-danger)" }}>
          <ShieldX size={26} strokeWidth={1.5} />
        </div>
        <h2 className="text-lg font-extrabold tracking-tight text-foreground">No tenés acceso a esta sección</h2>
        <p className="mt-2 text-sm text-muted-foreground">La gestión de módulos por organización es exclusiva del rol <code className="text-xs">admin</code>.</p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="grid flex-1 place-items-center p-10">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl" style={{ background: "var(--aw-violet-light)", color: "var(--aw-violet)" }}>
          <Puzzle size={26} strokeWidth={1.5} />
        </div>
        <h2 className="text-lg font-extrabold tracking-tight text-foreground">Tu organización no tiene módulos registrados</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Los módulos del ecosistema se asignan a cada organización desde Vintelarg. Cuando se configuren,
          aparecen acá con su estado.
        </p>
      </div>
    </div>
  );
}
