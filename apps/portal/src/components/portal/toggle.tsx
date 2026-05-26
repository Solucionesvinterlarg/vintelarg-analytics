"use client";

import { cn } from "@/lib/utils";

/** Switch 36×20, knob 16×16. Bg on = violeta, off = #D6D2C8. Port de shared.jsx. */
export function Toggle({
  on,
  onToggle,
  disabled,
  "aria-label": ariaLabel,
}: {
  on: boolean;
  onToggle?: (next: boolean) => void;
  disabled?: boolean;
  "aria-label"?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onToggle?.(!on)}
      className={cn(
        "relative inline-block h-5 w-9 shrink-0 rounded-full transition-colors",
        onToggle ? "cursor-pointer" : "cursor-default",
        disabled && "opacity-50"
      )}
      style={{ background: on ? "var(--aw-violet)" : "#D6D2C8" }}
    >
      <span
        className="absolute top-0.5 size-4 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.18)] transition-[left] duration-200 ease-[var(--ease-out)]"
        style={{ left: on ? 18 : 2 }}
      />
    </button>
  );
}
