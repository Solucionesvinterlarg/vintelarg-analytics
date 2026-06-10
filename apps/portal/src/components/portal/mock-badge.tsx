/**
 * Badge "MOCK" fijo al viewport (no scrollea). Marca que la pantalla usa datos
 * de ejemplo (perfil Gerente, Lote 2) hasta que se definan los KPIs reales. Se
 * quita por pantalla cuando se conecta el dato real. pointer-events:none para no
 * tapar clicks. NO va en las pantallas servidas por CRM (Reclamos, Tickets).
 */
export function MockBadge() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-3.5 top-3.5 z-[1200] rounded-full px-[9px] py-[3px] text-[11px] font-bold uppercase tracking-[0.06em] text-white shadow-sm"
      style={{ background: "var(--aw-warning)", letterSpacing: "0.06em" }}
    >
      MOCK
    </div>
  );
}
