import { getCurrentUser } from "@/lib/session";
import { normalizeRole } from "@/lib/portal-config";
import { MobileTopbar } from "@/components/shells/mobile-topbar";
import { CampaignPill } from "@/components/portal/campaign-pill";
import { SectionEyebrow } from "@/components/portal/section-eyebrow";
import {
  ShoppingBag,
  Wallet,
  RefreshCcw,
  GraduationCap,
  Receipt,
  Coins,
  ChevronRight,
  ArrowRight,
  FilePlus,
  Trophy,
  Users,
  Star,
  AlertTriangle,
  Clock,
} from "lucide-react";

/* ─────────────────────────────────────────────
   P01 — Home Emprendedora
───────────────────────────────────────────── */
function HomeEmprendedora() {
  const quickActions = [
    {
      t: "Hacer pedido",
      d: "Armar carrito",
      Icon: ShoppingBag,
      bg: "#EFF6FF",
      fg: "#1E448F",
    },
    {
      t: "Mi cuenta",
      d: "Saldo y movim.",
      Icon: Wallet,
      bg: "#F0FDF4",
      fg: "#236A40",
    },
    {
      t: "Reclamo",
      d: "Cambio o queja",
      Icon: RefreshCcw,
      bg: "#FFFBEB",
      fg: "#8A6614",
    },
    {
      t: "Academia",
      d: "Cursos y videos",
      Icon: GraduationCap,
      bg: "#EFF6FF",
      fg: "#1E448F",
    },
  ];

  const summary = [
    {
      Icon: Receipt,
      bg: "#F0FDF4",
      fg: "#236A40",
      t: "Último pedido",
      v: "$48.750",
      s: "En camino · llega martes",
      st: "var(--aw-success)",
    },
    {
      Icon: Coins,
      bg: "#FFFBEB",
      fg: "#8A6614",
      t: "Saldo cuenta corriente",
      v: "−$12.300",
      s: "Vence en 8 días",
      st: "#B27A1A",
    },
    {
      Icon: RefreshCcw,
      bg: "#EFF6FF",
      fg: "#1E448F",
      t: "Reclamo abierto",
      v: "1 pendiente",
      s: "Cambio por defecto · en revisión",
      st: "#1E448F",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Violet header block */}
      <div style={{ background: "var(--aw-violet)", color: "#fff", paddingBottom: 22 }}>
        <MobileTopbar unread="3" initials="ML" />
        <div style={{ padding: "6px 20px 0" }}>
          <CampaignPill>Campaña 202608 · 4 días restantes</CampaignPill>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", marginTop: 12 }}>
            ¡Hola, María!
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.82)", marginTop: 2 }}>
            Emprendedora · Zona 204 · Grupo 3
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ background: "var(--aw-app-bg)" }}>
        <div style={{ paddingTop: 18, paddingBottom: 24 }}>
          {/* Acciones rápidas */}
          <SectionEyebrow>Acciones rápidas</SectionEyebrow>
          <div
            style={{
              padding: "0 20px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            {quickActions.map((c, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  border: "0.5px solid var(--aw-hairline)",
                  borderRadius: 16,
                  padding: 14,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: c.bg,
                    color: c.fg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <c.Icon size={20} strokeWidth={1.5} />
                </div>
                <div
                  style={{
                    marginTop: 12,
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--fg)",
                  }}
                >
                  {c.t}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--fg-subtle)",
                    marginTop: 1,
                  }}
                >
                  {c.d}
                </div>
              </div>
            ))}
          </div>

          <div style={{ height: 24 }} />

          {/* Tu resumen */}
          <SectionEyebrow>Tu resumen</SectionEyebrow>
          <div
            style={{
              padding: "0 20px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {summary.map((r, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  border: "0.5px solid var(--aw-hairline)",
                  borderRadius: 16,
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: r.bg,
                    color: r.fg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: "none",
                  }}
                >
                  <r.Icon size={20} strokeWidth={1.5} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--fg-subtle)",
                      fontWeight: 600,
                    }}
                  >
                    {r.t}
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      letterSpacing: "-0.01em",
                      color: "var(--fg)",
                      marginTop: 1,
                    }}
                  >
                    {r.v}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: r.st,
                      fontWeight: 600,
                      marginTop: 1,
                    }}
                  >
                    {r.s}
                  </div>
                </div>
                <ChevronRight
                  size={18}
                  strokeWidth={1.5}
                  style={{ color: "var(--fg-faint)", flex: "none" }}
                />
              </div>
            ))}
          </div>

          <div style={{ height: 24 }} />

          {/* Promo card */}
          <div
            style={{
              margin: "0 20px",
              background: "var(--aw-violet)",
              color: "#fff",
              borderRadius: 16,
              padding: 18,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative corner triangle */}
            <div
              style={{
                position: "absolute",
                right: -30,
                bottom: -30,
                width: 140,
                height: 140,
                background: "rgba(255,255,255,0.08)",
                clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
              }}
            />
            <div style={{ position: "relative" }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.16em",
                  color: "rgba(255,255,255,0.72)",
                }}
              >
                Campaña 08
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  marginTop: 6,
                  letterSpacing: "-0.01em",
                }}
              >
                Comprá 3, llevate 4
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.88)",
                  marginTop: 4,
                  lineHeight: 1.4,
                }}
              >
                En toda la línea de fragancias femeninas.
              </div>
              <div
                style={{
                  marginTop: 14,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "rgba(255,255,255,0.22)",
                  color: "#fff",
                  padding: "8px 14px",
                  borderRadius: 100,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Ver catálogo <ArrowRight size={14} strokeWidth={1.5} />
              </div>
            </div>
          </div>

          <div style={{ height: 16 }} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   P02 — Home Líder Comercial
───────────────────────────────────────────── */
function ProgressBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div
      style={{
        height: 6,
        borderRadius: 100,
        background: "rgba(255,255,255,0.22)",
        overflow: "hidden",
        marginTop: 8,
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: color,
          borderRadius: 100,
        }}
      />
    </div>
  );
}

function HomeLider() {
  const redCounters = [
    { n: "18", l: "Activas", bg: "#F0FDF4", fg: "#236A40" },
    { n: "5", l: "Inactivas", bg: "#FFFBEB", fg: "#8A6614" },
    { n: "3", l: "Altas", bg: "#EFF6FF", fg: "#1E448F" },
    { n: "2", l: "Bajas", bg: "#FEF2F2", fg: "#7C2F35" },
  ];

  const quickActions = [
    {
      Icon: FilePlus,
      t: "Cargar pedido WOE",
      d: "Para una emprendedora de tu red",
    },
    {
      Icon: Trophy,
      t: "Simulador de títulos",
      d: "Nivel actual: Plata · siguiente: Oro 1",
    },
    {
      Icon: Users,
      t: "Ver mi red completa",
      d: "23 emprendedoras · 3 Luceros",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Violet header block */}
      <div style={{ background: "var(--aw-violet)", color: "#fff", paddingBottom: 22 }}>
        <MobileTopbar unread="5" initials="CP" />
        <div style={{ padding: "6px 20px 0" }}>
          <CampaignPill>Campaña 202608 · 4 días restantes</CampaignPill>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", marginTop: 12 }}>
            ¡Hola, Claudia!
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.82)", marginTop: 2 }}>
            Líder Comercial · Zona 204 · 23 emprendedoras
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ background: "var(--aw-app-bg)" }}>
        <div style={{ paddingTop: 18, paddingBottom: 24 }}>
          {/* Campaña activa */}
          <SectionEyebrow>Campaña activa</SectionEyebrow>
          <div
            style={{
              padding: "0 20px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            <div style={{ background: "#4B3FA0", color: "#fff", borderRadius: 16, padding: 14 }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.76)", fontWeight: 600 }}>
                Venta grupal
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  marginTop: 4,
                }}
              >
                $485.200
              </div>
              <ProgressBar pct={72} color="var(--aw-success)" />
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", marginTop: 6 }}>
                Meta: $670.000 · 72%
              </div>
            </div>
            <div style={{ background: "#4B3FA0", color: "#fff", borderRadius: 16, padding: 14 }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.76)", fontWeight: 600 }}>
                Cobrabilidad
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  marginTop: 4,
                }}
              >
                87%
              </div>
              <ProgressBar pct={87} color="#E5A53C" />
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", marginTop: 6 }}>
                Req: 90% · −3 pp
              </div>
            </div>
          </div>

          <div style={{ height: 22 }} />

          {/* Mi red */}
          <SectionEyebrow>Mi red</SectionEyebrow>
          <div
            style={{
              padding: "0 20px",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 8,
            }}
          >
            {redCounters.map((m, i) => (
              <div
                key={i}
                style={{
                  background: m.bg,
                  borderRadius: 12,
                  padding: "10px 6px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: m.fg,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {m.n}
                </div>
                <div style={{ fontSize: 10, color: m.fg, fontWeight: 600, marginTop: 1 }}>
                  {m.l}
                </div>
              </div>
            ))}
          </div>

          <div style={{ height: 22 }} />

          {/* Acciones rápidas */}
          <SectionEyebrow>Acciones rápidas</SectionEyebrow>
          <div
            style={{
              padding: "0 20px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {quickActions.map((r, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  border: "0.5px solid var(--aw-hairline)",
                  borderRadius: 16,
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    background: "var(--aw-violet-light)",
                    color: "var(--aw-violet)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: "none",
                  }}
                >
                  <r.Icon size={18} strokeWidth={1.5} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>{r.t}</div>
                  <div style={{ fontSize: 11, color: "var(--fg-subtle)", marginTop: 1 }}>
                    {r.d}
                  </div>
                </div>
                <ChevronRight
                  size={16}
                  strokeWidth={1.5}
                  style={{ color: "var(--fg-faint)" }}
                />
              </div>
            ))}
          </div>

          <div style={{ height: 22 }} />

          {/* Tu título provisorio */}
          <div
            style={{
              margin: "0 20px",
              background: "#fff",
              border: "2px solid var(--aw-violet)",
              borderRadius: 16,
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: "var(--fg-subtle)", fontWeight: 600 }}>
                Tu título provisorio
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 2,
                }}
              >
                <Star
                  size={18}
                  strokeWidth={1.5}
                  style={{ color: "var(--aw-violet)", fill: "var(--aw-violet)" }}
                />
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: "var(--aw-violet)",
                    letterSpacing: "0.04em",
                  }}
                >
                  PLATA
                </span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, color: "var(--fg-subtle)" }}>Bonif. estimada</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "var(--aw-success)" }}>
                $45.800
              </div>
            </div>
          </div>

          <div style={{ height: 22 }} />

          {/* Atención */}
          <SectionEyebrow>Atención</SectionEyebrow>
          <div
            style={{
              padding: "0 20px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "12px 14px 12px 11px",
                borderLeft: "3px solid var(--aw-danger)",
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
              }}
            >
              <AlertTriangle
                size={18}
                strokeWidth={1.5}
                style={{ color: "var(--aw-danger)", marginTop: 2, flex: "none" }}
              />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>
                  2 emprendedoras con baja inminente
                </div>
                <div style={{ fontSize: 11, color: "var(--fg-subtle)", marginTop: 1 }}>
                  Sin pedido en 2 campañas
                </div>
              </div>
            </div>
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "12px 14px 12px 11px",
                borderLeft: "3px solid #E5A53C",
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
              }}
            >
              <Clock
                size={18}
                strokeWidth={1.5}
                style={{ color: "#B27A1A", marginTop: 2, flex: "none" }}
              />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>
                  Cobrabilidad por debajo del requisito
                </div>
                <div style={{ fontSize: 11, color: "var(--fg-subtle)", marginTop: 1 }}>
                  Faltan $18.200 para el 90%
                </div>
              </div>
            </div>
          </div>

          <div style={{ height: 16 }} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Page — Server Component
───────────────────────────────────────────── */
export default async function MobileHomePage() {
  const user = await getCurrentUser();
  const role = normalizeRole(user?.role);
  return role === "lci" ? <HomeLider /> : <HomeEmprendedora />;
}
