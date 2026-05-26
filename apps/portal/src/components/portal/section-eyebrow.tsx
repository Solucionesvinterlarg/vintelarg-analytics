/** Título de sección mobile — uppercase 11px, tracking ancho. Port de shared.jsx. */
export function SectionEyebrow({
  children,
  action,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between px-5 pb-2.5 pt-1">
      <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--aw-slate)]">
        {children}
      </div>
      {action && <div className="text-xs font-semibold text-[var(--aw-violet)]">{action}</div>}
    </div>
  );
}
