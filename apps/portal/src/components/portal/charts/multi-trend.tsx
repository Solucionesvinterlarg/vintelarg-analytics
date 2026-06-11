"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export interface TrendSeries {
  key: string;
  label: string;
  color: string;
  /** línea punteada (ej. el objetivo). */
  dash?: boolean;
  data: number[];
}

/** Líneas comparativas (ej. Objetivo punteado vs Real). */
export function MultiTrend({ series, labels, height = 240 }: { series: TrendSeries[]; labels: string[]; height?: number }) {
  const rows = labels.map((label, i) => {
    const o: Record<string, number | string> = { label };
    for (const s of series) o[s.key] = s.data[i];
    return o;
  });
  // Render solo en cliente: recharts genera IDs no determinísticos (hydration).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div style={{ height }} />;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={rows} margin={{ top: 10, right: 12, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--aw-hairline)" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--fg-subtle)" }} />
        <YAxis hide domain={["dataMin - 300", "dataMax + 300"]} />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: "1px solid var(--aw-hairline)", background: "var(--aw-white, #fff)", fontSize: 12 }}
          labelStyle={{ fontWeight: 700, color: "var(--aw-ink, #1E2128)" }}
        />
        {series.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color}
            strokeWidth={2.5}
            strokeDasharray={s.dash ? "6 5" : undefined}
            dot={s.dash ? false : { r: 3, strokeWidth: 2, fill: "var(--aw-white, #fff)" }}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
