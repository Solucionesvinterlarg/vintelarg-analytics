import Link from "next/link";
import { ArrowLeft, Pencil, Receipt, Package, Activity, Star, TrendingUp, Wallet, Lightbulb } from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { MockBadge } from "@/components/portal/mock-badge";
import { PortalBadge } from "@/components/portal/badge";
import { AvatarInitials } from "@/components/portal/avatar-initials";

const KPIS = [
  { label: "Score de actividad", value: "88", Icon: Activity, badge: "Alto", tone: "success" as const },
  { label: "Puntos campaña", value: "450", Icon: Star },
  { label: "Ventas", value: "$4.050", Icon: TrendingUp },
  { label: "Cobranza N+2", value: "100%", Icon: Wallet, badge: "Al día", tone: "success" as const },
];
const RUBROS = [
  { n: "Hogar", pct: 42, color: "var(--cat-hogar)" },
  { n: "Belleza", pct: 28, color: "var(--cat-belleza)" },
  { n: "Bienestar", pct: 18, color: "var(--cat-bienestar)" },
  { n: "Deportes", pct: 8, color: "var(--cat-deportes)" },
  { n: "Mascotas", pct: 4, color: "var(--cat-mascotas)" },
];
const PEDIDOS = [
  { id: "#WOE-3041", items: "6 items · Entregado", monto: "$4.050" },
  { id: "#WOE-2980", items: "4 items · Entregado", monto: "$3.120" },
];

export function LciRevendedoraView() {
  return (
    <>
      <MockBadge />
      <DesktopTopBar title="Detalle revendedora" initials="LT" />

      <div className="px-5 pt-4 md:px-6">
        <Link href="/lci/red" className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-muted-foreground transition-colors hover:text-foreground"><ArrowLeft size={15} /> Volver a Mi red</Link>
      </div>

      {/* header */}
      <div className="mx-5 mt-3 flex flex-wrap items-center gap-3 rounded-2xl bg-card px-4 py-4 md:mx-6" style={{ border: "0.5px solid var(--aw-hairline)" }}>
        <AvatarInitials name="Juana Ramirez" size={48} />
        <div className="flex-1">
          <div className="flex items-center gap-2"><span className="text-[17px] font-extrabold tracking-[-0.02em] text-foreground">Juana Ramirez</span><PortalBadge tone="success" dot>Al día</PortalBadge></div>
          <div className="text-[11.5px] text-muted-foreground">ID 94837261 · Zona 4 · Morón</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="inline-flex items-center gap-1.5 rounded-lg bg-card px-3 py-2 text-[12px] font-semibold text-foreground" style={{ border: "1px solid var(--aw-hairline)" }}><Pencil size={14} /> Editar datos</button>
          <button type="button" className="inline-flex items-center gap-1.5 rounded-lg bg-card px-3 py-2 text-[12px] font-semibold text-foreground" style={{ border: "1px solid var(--aw-hairline)" }}><Receipt size={14} /> Generar talón</button>
          <Link href="/lci/pedido-woe" className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-bold text-white" style={{ background: "var(--aw-violet)" }}><Package size={14} /> Cargar pedido</Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-3.5 px-5 pt-4 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
        {KPIS.map((k) => (
          <div key={k.label} className="rounded-2xl bg-card p-[18px]" style={{ border: "0.5px solid var(--aw-hairline)" }}>
            <div className="flex items-center justify-between"><span className="text-[11px] font-bold uppercase tracking-[0.07em] text-muted-foreground">{k.label}</span><k.Icon size={15} strokeWidth={1.5} className="text-muted-foreground" /></div>
            <div className="mt-2 text-[24px] font-extrabold tracking-[-0.02em] tabular-nums text-foreground">{k.value}</div>
            {k.badge && <div className="mt-2"><PortalBadge tone={k.tone} dot>{k.badge}</PortalBadge></div>}
          </div>
        ))}
      </div>

      {/* rubro + historial */}
      <div className="grid grid-cols-1 gap-4 px-5 pb-6 pt-5 md:px-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-card p-5 lg:col-span-2" style={{ border: "0.5px solid var(--aw-hairline)" }}>
          <div className="text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: "var(--aw-violet)" }}>Oportunidad de categoría</div>
          <div className="text-[15.5px] font-bold tracking-[-0.01em] text-foreground">Composición de unidades por rubro</div>
          <div className="mt-4 flex flex-col gap-3">
            {RUBROS.map((r) => (
              <div key={r.n}>
                <div className="flex justify-between text-[12.5px]"><span className="font-semibold text-foreground">{r.n}</span><span className="font-bold tabular-nums text-foreground">{r.pct}%</span></div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full" style={{ background: "var(--aw-chalk)" }}><div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: r.color }} /></div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-[12px]" style={{ background: "var(--tint-blue)", color: "var(--tint-blue-fg)" }}><Lightbulb size={15} /> Baja penetración en <b>Mascotas</b> y <b>Deportes</b> — oportunidad para sumar unidades.</div>
        </div>

        <div className="rounded-2xl bg-card p-5" style={{ border: "0.5px solid var(--aw-hairline)" }}>
          <div className="text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: "var(--aw-violet)" }}>Estado de pago y tracking</div>
          <div className="text-[15.5px] font-bold tracking-[-0.01em] text-foreground">Historial de pedidos</div>
          <div className="mt-4 flex flex-col gap-3">
            {PEDIDOS.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl px-3.5 py-3" style={{ border: "1px solid var(--aw-hairline)" }}>
                <div><div className="text-[13px] font-bold" style={{ color: "var(--aw-violet)" }}>{p.id}</div><div className="text-[11px] text-muted-foreground">{p.items}</div></div>
                <div className="flex items-center gap-2"><span className="text-[13px] font-bold tabular-nums text-foreground">{p.monto}</span><PortalBadge tone="success">Pagado</PortalBadge></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
