import { Bell } from "lucide-react";
import { AwareMark } from "@/components/portal/aware-mark";

/** Topbar mobile violeta: logo + campana con badge + avatar. Port de shared.jsx. */
export function MobileTopbar({ unread = "3", initials = "ML" }: { unread?: string; initials?: string }) {
  return (
    <div className="flex items-center justify-between px-5 pb-3 pt-3.5">
      <div className="flex items-center gap-1.5">
        <AwareMark size={22} />
        <span className="text-base font-extrabold tracking-[0.02em] text-white">
          A·WARE<sup className="text-[8px] opacity-70">®</sup>
        </span>
      </div>
      <div className="flex items-center gap-2.5">
        <div className="relative grid size-9 place-items-center rounded-full text-white" style={{ background: "rgba(255,255,255,0.16)" }}>
          <Bell size={18} strokeWidth={1.5} />
          {unread && (
            <span
              className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-white"
              style={{ background: "#E5484D", border: "2px solid var(--aw-violet)" }}
            >
              {unread}
            </span>
          )}
        </div>
        <div className="grid size-9 place-items-center rounded-full text-xs font-extrabold" style={{ background: "rgba(255,255,255,0.92)", color: "var(--aw-violet)" }}>
          {initials}
        </div>
      </div>
    </div>
  );
}
