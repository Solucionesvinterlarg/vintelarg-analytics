"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Bot, Menu, X, Send, MessageCircle, LogOut, Sun, Moon, ChevronRight, Crown, Tag, Percent, Truck, Share2 } from "lucide-react";
import { LucideIcon } from "@/components/portal/lucide-icon";
import { useEmpStore } from "@/lib/emp-store";
import type { Section } from "@/lib/portal-config";

/**
 * Shell "phone" de la red comercial (emprendedora/lci). Enmarca la app mobile en
 * una columna de ~414px sobre fondo neutro en ≥768; full-screen en mobile.
 * Bottom-nav (4 tabs primary + Menú) + drawer + bot FAB + toast. La vista NO mira
 * el rol: el layout elige este shell por audiencia.
 */
export function PhoneShell({
  tabs,
  drawerItems,
  user,
  children,
}: {
  tabs: Section[];
  drawerItems: Section[];
  user: { name: string; role: string; initials: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [bot, setBot] = useState(false);
  const toast = useEmpStore((s) => s.toast);
  const clearToast = useEmpStore((s) => s.clearToast);
  const drawer = useEmpStore((s) => s.drawer);
  const setDrawer = useEmpStore((s) => s.setDrawer);
  const celebrate = useEmpStore((s) => s.celebrate);
  const setCelebrate = useEmpStore((s) => s.setCelebrate);
  const notify = useEmpStore((s) => s.notify);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(clearToast, 1900);
    return () => clearTimeout(t);
  }, [toast, clearToast]);

  // cerrar overlays al navegar
  useEffect(() => { setDrawer(false); setBot(false); }, [pathname, setDrawer]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="flex min-h-dvh justify-center md:items-center md:py-4" style={{ background: "var(--shell-bg)" }}>
      <div
        className="relative flex w-full max-w-[414px] flex-col overflow-hidden md:h-[calc(100dvh-2rem)] md:max-h-[880px] md:rounded-[2.2rem] md:shadow-2xl md:ring-1 md:ring-black/10"
        style={{ background: "var(--aw-app-bg)" }}
      >
        {/* contenido (scroll) */}
        <main className="emp-screen-in flex-1 overflow-y-auto overflow-x-hidden pb-[62px]">{children}</main>

        {/* Bot FAB */}
        <button
          type="button"
          onClick={() => setBot(true)}
          aria-label="Bot de ayuda"
          className="emp-press absolute bottom-[78px] right-4 z-[8] grid size-[52px] place-items-center rounded-full text-white"
          style={{ background: "var(--aw-violet)", boxShadow: "var(--shadow-violet)" }}
        >
          <Bot size={26} strokeWidth={2} />
        </button>

        {/* Bottom nav */}
        <nav
          className="absolute bottom-0 left-0 right-0 z-[7] flex h-[62px] items-center px-1.5"
          style={{ background: "color-mix(in srgb, var(--aw-white) 86%, transparent)", backdropFilter: "blur(18px)", borderTop: "1px solid var(--aw-hairline)" }}
        >
          {tabs.map((t) => {
            const on = isActive(t.href);
            return (
              <Link key={t.id} href={t.href} className="emp-press flex flex-1 flex-col items-center gap-[3px] py-2" style={{ color: on ? "var(--aw-violet)" : "var(--fg-subtle)" }}>
                <LucideIcon name={t.icon} size={22} strokeWidth={on ? 2.4 : 2} />
                <span className="text-[10px]" style={{ fontWeight: on ? 700 : 600 }}>{t.name}</span>
              </Link>
            );
          })}
          <button type="button" onClick={() => setDrawer(true)} className="emp-press flex flex-1 flex-col items-center gap-[3px] py-2" style={{ color: "var(--fg-subtle)" }}>
            <Menu size={22} strokeWidth={2} />
            <span className="text-[10px] font-semibold">Menú</span>
          </button>
        </nav>

        {/* Toast */}
        {toast && (
          <div
            key={toast.id}
            className="absolute bottom-[78px] left-1/2 z-30 max-w-[88%] -translate-x-1/2 truncate rounded-full px-[18px] py-2.5 text-[13px] font-bold"
            style={{ background: "var(--aw-ink, var(--foreground))", color: "var(--aw-app-bg)", boxShadow: "var(--shadow-lg)", animation: "emp-pop .35s var(--ease-spring)" }}
          >
            {toast.msg}
          </div>
        )}

        {/* Drawer */}
        {drawer && <Drawer items={drawerItems} user={user} onClose={() => setDrawer(false)} />}

        {/* Bot panel */}
        {bot && <BotPanel onClose={() => setBot(false)} />}

        {/* Celebración de logro */}
        {celebrate && <Celebration onClose={() => setCelebrate(false)} notify={notify} />}
      </div>
    </div>
  );
}

const CONFETTI = ["#685BC7", "#C98A2B", "#3F8F5E", "#D79496", "#4B6C76"];

function Celebration({ onClose, notify }: { onClose: () => void; notify: (m: string) => void }) {
  return (
    <div className="absolute inset-0 z-40 grid place-items-center overflow-hidden p-6" style={{ background: "rgba(19,21,25,0.62)", animation: "emp-fade-in .25s" }}>
      {Array.from({ length: 28 }).map((_, i) => (
        <span key={i} className="absolute -top-5 size-[8px]" style={{ left: `${(i * 3.7) % 100}%`, height: 12, background: CONFETTI[i % CONFETTI.length], borderRadius: 2, animation: `emp-confetti ${1.6 + (i % 5) * 0.3}s linear ${(i % 7) * 0.12}s infinite` }} />
      ))}
      <div className="relative w-full max-w-[340px] rounded-3xl p-7 text-center" style={{ background: "var(--aw-app-bg)", boxShadow: "var(--shadow-lg)", animation: "emp-pop .5s var(--ease-spring)" }}>
        <div className="mx-auto grid size-[84px] place-items-center rounded-full text-white" style={{ background: "var(--aw-violet)", boxShadow: "var(--shadow-violet)" }}><Crown size={42} /></div>
        <div className="mt-4 text-[13px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--aw-violet)" }}>¡Felicitaciones!</div>
        <div className="mt-1.5 text-[21px] font-extrabold leading-tight tracking-[-0.02em] text-foreground">Alcanzaste<br />Emprendedora VIP</div>
        <div className="mt-4 flex flex-col gap-2.5 text-left">
          {[{ Icon: Tag, t: "Zona Outlet desbloqueada" }, { Icon: Percent, t: "Comisión +2% en tus ventas" }, { Icon: Truck, t: "Envíos gratis" }].map((b) => (
            <div key={b.t} className="flex items-center gap-3 rounded-xl p-3" style={{ background: "var(--aw-white)", border: "1px solid var(--aw-hairline)" }}>
              <span className="grid size-8 flex-none place-items-center rounded-full" style={{ background: "var(--aw-violet-light)", color: "var(--aw-violet)" }}><b.Icon size={17} /></span>
              <span className="text-[13px] font-semibold text-foreground">{b.t}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 flex gap-2.5">
          <button type="button" onClick={() => notify("Compartiendo…")} className="emp-press flex flex-1 items-center justify-center gap-1.5 rounded-full py-3 text-[14px] font-bold text-foreground" style={{ background: "var(--aw-white)", border: "1px solid var(--aw-hairline)" }}><Share2 size={17} /> Compartir</button>
          <button type="button" onClick={onClose} className="emp-press flex flex-1 items-center justify-center rounded-full py-3 text-[14px] font-bold text-white" style={{ background: "var(--aw-violet)" }}>Continuar</button>
        </div>
      </div>
    </div>
  );
}

function Drawer({ items, user, onClose }: { items: Section[]; user: { name: string; role: string; initials: string }; onClose: () => void }) {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  return (
    <div className="absolute inset-0 z-20">
      <div className="absolute inset-0" style={{ background: "rgba(19,21,25,0.5)", animation: "emp-fade-in .2s" }} onClick={onClose} />
      <div className="absolute bottom-0 left-0 top-0 flex w-[85%] max-w-[330px] flex-col overflow-y-auto" style={{ background: "var(--aw-app-bg)", boxShadow: "var(--shadow-lg)", animation: "emp-drawer-in .28s var(--ease-out)" }}>
        {/* header */}
        <div className="relative overflow-hidden px-[18px] pb-[18px] pt-[22px] text-white" style={{ background: "var(--aw-violet)" }}>
          <div className="absolute -right-8 -top-8 size-[120px]" style={{ background: "rgba(255,255,255,.12)", clipPath: "polygon(100% 0,100% 100%,0 0)" }} />
          <div className="relative flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-full text-[15px] font-bold" style={{ background: "rgba(255,255,255,.2)" }}>{user.initials}</span>
            <div className="min-w-0 flex-1">
              <div className="text-[16px] font-extrabold tracking-[-0.02em]">{user.name}</div>
              <div className="mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-bold" style={{ background: "rgba(255,255,255,.2)" }}><Crown size={12} /> {user.role}</div>
            </div>
          </div>
          <Link href="/emp/perfil" onClick={onClose} className="emp-press relative mt-3.5 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12.5px] font-bold text-white" style={{ background: "rgba(255,255,255,.16)" }}>Ver perfil <ChevronRight size={15} /></Link>
        </div>

        {/* items */}
        <div className="flex flex-col p-2.5">
          {items.map((it) => (
            <Link key={it.id} href={it.href} onClick={onClose} className="emp-press flex items-center gap-3.5 rounded-xl px-3 py-3 text-foreground">
              <LucideIcon name={it.icon} size={20} strokeWidth={2} className="text-[var(--aw-violet)]" />
              <span className="flex-1 text-[14px] font-semibold">{it.name}</span>
              <ChevronRight size={16} className="text-muted-foreground" />
            </Link>
          ))}
        </div>

        {/* footer */}
        <div className="mt-auto p-2.5" style={{ borderTop: "1px solid var(--aw-hairline)" }}>
          <div className="flex items-center gap-3.5 px-3 py-2">
            {dark ? <Moon size={20} className="text-muted-foreground" /> : <Sun size={20} className="text-muted-foreground" />}
            <span className="flex-1 text-[14px] font-semibold">Modo {dark ? "oscuro" : "claro"}</span>
            <button type="button" onClick={() => setTheme(dark ? "light" : "dark")} aria-label="Cambiar tema" className="emp-press relative h-[26px] w-[46px] rounded-full" style={{ background: dark ? "var(--aw-violet)" : "var(--aw-mist)" }}>
              <span className="absolute top-[3px] size-5 rounded-full bg-white transition-all" style={{ left: dark ? 23 : 3 }} />
            </button>
          </div>
          <Link href="/api/auth/logout" className="emp-press flex items-center gap-3.5 rounded-xl px-3 py-3" style={{ color: "var(--aw-danger)" }}>
            <LogOut size={20} /><span className="text-[14px] font-bold">Salir</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function BotPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-[26]">
      <div className="absolute inset-0" style={{ background: "rgba(19,21,25,0.5)", animation: "emp-fade-in .2s" }} onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 flex max-h-[78%] flex-col rounded-t-[22px]" style={{ background: "var(--aw-app-bg)", animation: "emp-sheet-up .3s var(--ease-out)" }}>
        <div className="flex items-center gap-3 px-[18px] py-4" style={{ borderBottom: "1px solid var(--aw-hairline)" }}>
          <div className="grid size-10 place-items-center rounded-full text-white" style={{ background: "var(--aw-violet)" }}><Bot size={22} /></div>
          <div className="flex-1">
            <div className="text-[14.5px] font-extrabold">Bot de Ayuda</div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: "var(--aw-success)" }}><span className="size-[7px] rounded-full" style={{ background: "var(--aw-success)" }} /> En línea</div>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="emp-press grid size-[30px] place-items-center rounded-full" style={{ background: "var(--aw-chalk)" }}><X size={17} /></button>
        </div>
        <div className="flex flex-col gap-3 overflow-y-auto p-[18px]">
          <div className="max-w-[85%] self-start rounded-[4px_16px_16px_16px] px-3.5 py-2.5 text-[13px] leading-relaxed" style={{ background: "var(--aw-white)", border: "1px solid var(--aw-hairline)" }}>¡Hola María! Soy tu asistente. ¿En qué te ayudo hoy?</div>
          <div className="max-w-[85%] self-end rounded-[16px_4px_16px_16px] px-3.5 py-2.5 text-[13px] leading-relaxed text-white" style={{ background: "var(--aw-violet)" }}>¿Cuánto me falta para el pedido mínimo?</div>
          <div className="max-w-[85%] self-start rounded-[4px_16px_16px_16px] px-3.5 py-2.5 text-[13px] leading-relaxed" style={{ background: "var(--aw-white)", border: "1px solid var(--aw-hairline)" }}>Te faltan <b>$450</b> para alcanzar el pedido mínimo y empezar a ver tu ganancia. 💪</div>
        </div>
        <div className="p-4" style={{ borderTop: "1px solid var(--aw-hairline)" }}>
          <div className="flex items-center gap-2.5 rounded-xl px-3.5 py-3" style={{ border: "1px solid var(--aw-hairline)", background: "var(--aw-white)" }}>
            <MessageCircle size={18} className="text-muted-foreground" />
            <input placeholder="Escribí tu consulta…" className="min-w-0 flex-1 border-0 bg-transparent text-[14px] outline-none placeholder:text-muted-foreground" />
            <span className="grid size-8 place-items-center rounded-full text-white" style={{ background: "var(--aw-violet)" }}><Send size={16} /></span>
          </div>
        </div>
      </div>
    </div>
  );
}
