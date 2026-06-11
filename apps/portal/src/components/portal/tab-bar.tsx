"use client";

/** Tabs internos con subrayado (Onboarding, Plan comercial BI). */
export function TabBar<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: T; label: string }[];
  active: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="flex gap-1 overflow-x-auto" style={{ borderBottom: "1px solid var(--aw-hairline)" }}>
      {tabs.map((t) => {
        const on = t.id === active;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className="whitespace-nowrap px-3.5 py-2.5 text-[13px] transition-colors"
            style={{ fontWeight: on ? 700 : 500, color: on ? "var(--aw-violet)" : "var(--fg-subtle)", borderBottom: on ? "2px solid var(--aw-violet)" : "2px solid transparent", marginBottom: -1 }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
