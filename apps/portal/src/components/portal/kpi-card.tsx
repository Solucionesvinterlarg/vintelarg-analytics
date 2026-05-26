import { Sparkline } from "./sparkline";

export type MetaTone = "muted" | "success" | "warn" | "danger";
export type Semaforo = "green" | "yellow" | "red";

const META_COLOR: Record<MetaTone, string> = {
  muted: "var(--aw-slate)",
  success: "var(--aw-success)",
  warn: "#B27A1A",
  danger: "var(--aw-danger)",
};
const SEMA_COLOR: Record<Semaforo, string> = {
  green: "var(--aw-success)",
  yellow: "#E5A53C",
  red: "var(--aw-danger)",
};

/**
 * KPI card (dashboard desktop). Card blanca radius 16, title uppercase 11px,
 * value 24px/800, sparkline opcional, semáforo dot top-right. Port de shared.jsx.
 */
export function KpiCard({
  title,
  value,
  meta,
  metaTone = "muted",
  sparkValues,
  sparkColor,
  semaforo,
  footer,
}: {
  title: string;
  value: React.ReactNode;
  meta?: React.ReactNode;
  metaTone?: MetaTone;
  sparkValues?: number[];
  sparkColor?: string;
  semaforo?: Semaforo;
  footer?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[156px] flex-col gap-1.5 rounded-2xl bg-card p-[18px_18px_14px] text-card-foreground" style={{ border: "0.5px solid var(--aw-hairline)" }}>
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--aw-slate)]">{title}</div>
        {semaforo && <span className="size-2 shrink-0 rounded-full" style={{ background: SEMA_COLOR[semaforo] }} />}
      </div>
      <div className="text-2xl font-extrabold leading-tight tracking-[-0.02em]">{value}</div>
      {meta != null && (
        <div className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: META_COLOR[metaTone] }}>
          {meta}
        </div>
      )}
      {sparkValues && (
        <div className="mt-auto pt-2">
          <Sparkline values={sparkValues} color={sparkColor || (semaforo ? SEMA_COLOR[semaforo] : "var(--aw-violet)")} width={220} height={40} />
        </div>
      )}
      {footer}
    </div>
  );
}
