import { ShoppingBag, Wallet, RefreshCcw, GraduationCap, FilePlus, Trophy, Users, Inbox, CalendarClock } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { userInitials } from "@/lib/session-token";
import { normalizeRole, ROLE_LABEL } from "@/lib/portal-config";
import { getCurrentCampaign, getContactForUser } from "@/lib/queries";
import { MobileTopbar } from "@/components/shells/mobile-topbar";
import { CampaignPill } from "@/components/portal/campaign-pill";
import { SectionEyebrow } from "@/components/portal/section-eyebrow";

export const dynamic = "force-dynamic";

const QUICK_EMP = [
  { t: "Hacer pedido", d: "Armar carrito", Icon: ShoppingBag, bg: "var(--tint-blue)", fg: "var(--tint-blue-fg)" },
  { t: "Mi cuenta", d: "Saldo y movim.", Icon: Wallet, bg: "var(--tint-green)", fg: "var(--tint-green-fg)" },
  { t: "Reclamo", d: "Cambio o queja", Icon: RefreshCcw, bg: "var(--tint-amber)", fg: "var(--tint-amber-fg)" },
  { t: "Academia", d: "Cursos y videos", Icon: GraduationCap, bg: "var(--tint-blue)", fg: "var(--tint-blue-fg)" },
];
const QUICK_LCI = [
  { t: "Cargar pedido", d: "WOE para tu red", Icon: FilePlus, bg: "var(--tint-blue)", fg: "var(--tint-blue-fg)" },
  { t: "Mi red", d: "Emprendedoras", Icon: Users, bg: "var(--tint-green)", fg: "var(--tint-green-fg)" },
  { t: "Títulos", d: "Simulador", Icon: Trophy, bg: "var(--tint-amber)", fg: "var(--tint-amber-fg)" },
  { t: "Academia", d: "Cursos y videos", Icon: GraduationCap, bg: "var(--tint-blue)", fg: "var(--tint-blue-fg)" },
];

export default async function MobileHomePage() {
  const user = await getCurrentUser();
  const role = normalizeRole(user?.role);
  const isLci = role === "lci_lider";
  const [campaign, contact] = await Promise.all([
    getCurrentCampaign(),
    user ? getContactForUser(user.id) : Promise.resolve(null),
  ]);

  const firstName = (user?.name || "").split(" ")[0] || "Hola";
  const subtitle = `${ROLE_LABEL[role]}${contact?.zone ? ` · Zona ${contact.zone}` : ""}`;
  const quick = isLci ? QUICK_LCI : QUICK_EMP;

  return (
    <div className="flex flex-col">
      {/* Header violeta (real) */}
      <div style={{ background: "var(--aw-violet)", color: "#fff", paddingBottom: 22 }}>
        <MobileTopbar unread="" initials={userInitials(user?.name ?? "") || "AW"} />
        <div style={{ padding: "6px 20px 0" }}>
          {campaign && <CampaignPill>{`${campaign.label} · ${campaign.diasRestantes} días restantes`}</CampaignPill>}
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", marginTop: 12 }}>¡Hola, {firstName}!</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.82)", marginTop: 2 }}>{subtitle}</div>
        </div>
      </div>

      <div style={{ background: "var(--aw-app-bg)", paddingTop: 18, paddingBottom: 24 }}>
        {/* Acciones rápidas (navegación) */}
        <SectionEyebrow>Acciones rápidas</SectionEyebrow>
        <div style={{ padding: "0 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {quick.map((c) => (
            <div key={c.t} className="bg-card" style={{ border: "0.5px solid var(--aw-hairline)", borderRadius: 16, padding: 14 }}>
              <div className="grid size-10 place-items-center rounded-xl" style={{ background: c.bg, color: c.fg }}>
                <c.Icon size={20} strokeWidth={1.5} />
              </div>
              <div className="mt-3 text-sm font-bold text-foreground">{c.t}</div>
              <div className="mt-px text-[11px]" style={{ color: "var(--fg-subtle)" }}>{c.d}</div>
            </div>
          ))}
        </div>

        {/* Campaña vigente (real) */}
        {campaign && (
          <>
            <div style={{ height: 24 }} />
            <SectionEyebrow>Campaña vigente</SectionEyebrow>
            <div style={{ padding: "0 20px" }}>
              <div className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3.5" style={{ border: "0.5px solid var(--aw-hairline)" }}>
                <div className="grid size-10 place-items-center rounded-xl" style={{ background: "var(--aw-violet-light)", color: "var(--aw-violet)" }}>
                  <CalendarClock size={20} strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-foreground">{campaign.label}</div>
                  <div className="text-[11px]" style={{ color: "var(--fg-subtle)" }}>Cierra en {campaign.diasRestantes} días</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Resumen — empty state (ordenes/cuenta_corriente sin datos) */}
        <div style={{ height: 24 }} />
        <SectionEyebrow>{isLci ? "Tu equipo" : "Tu resumen"}</SectionEyebrow>
        <div style={{ padding: "0 20px" }}>
          <div className="flex flex-col items-center gap-2 rounded-2xl bg-card px-5 py-8 text-center" style={{ border: "0.5px solid var(--aw-hairline)" }}>
            <div className="grid size-11 place-items-center rounded-full" style={{ background: "var(--aw-chalk)", color: "var(--fg-subtle)" }}>
              <Inbox size={22} strokeWidth={1.5} />
            </div>
            <div className="text-sm font-bold text-foreground">Todavía no hay actividad</div>
            <div className="text-[12px]" style={{ color: "var(--fg-subtle)" }}>
              {isLci
                ? "Cuando tu red cargue pedidos vas a ver acá su avance, cobrabilidad y bonificación."
                : "En cuanto tengas pedidos o movimientos de cuenta, los vas a ver acá."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
