import { cn } from "@/lib/utils";

export type BadgeTone =
  | "neutral"
  | "violet"
  | "success"
  | "warn"
  | "danger"
  | "info"
  | "internal"
  | "external";

const TONES: Record<BadgeTone, { bg: string; fg: string }> = {
  neutral: { bg: "#F1EFEA", fg: "#5C5A54" },
  violet: { bg: "var(--aw-violet-light)", fg: "var(--aw-violet-ink)" },
  success: { bg: "var(--aw-success-light)", fg: "#236A40" },
  warn: { bg: "var(--aw-warning-light)", fg: "#84541A" },
  danger: { bg: "var(--aw-danger-light)", fg: "#7C2F35" },
  info: { bg: "#E0EBFF", fg: "#1E448F" },
  internal: { bg: "#E0EBFF", fg: "#1E448F" },
  external: { bg: "#FFF1D6", fg: "#84541A" },
};

/** Pill badge del design system A-ware (8 tonos). Port de shared.jsx Badge. */
export function PortalBadge({
  tone = "neutral",
  dot,
  children,
  className,
}: {
  tone?: BadgeTone;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const t = TONES[tone];
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-[3px] text-[11px] font-bold", className)}
      style={{ background: t.bg, color: t.fg }}
    >
      {dot && <span className="size-1.5 rounded-full" style={{ background: t.fg }} />}
      {children}
    </span>
  );
}
