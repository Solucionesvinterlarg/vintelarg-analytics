import { Calendar } from "lucide-react";

/** Chip de campaña vigente sobre fondo violeta (header mobile). */
export function CampaignPill({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold text-white"
      style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)" }}
    >
      <Calendar size={12} strokeWidth={1.5} />
      <span>{children}</span>
    </div>
  );
}
