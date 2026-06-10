"use client";

import { useEffect, useState } from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

const TONE: Record<string, string> = {
  violet: "var(--aw-violet)",
  success: "var(--aw-success)",
  warning: "var(--aw-warning)",
  danger: "var(--aw-danger)",
};

/** Gauge radial (anillo de progreso vs objetivo). value en %, 0–100+. */
export function Gauge({
  value,
  tone = "violet",
  size = 160,
  sub,
}: {
  value: number;
  tone?: keyof typeof TONE;
  size?: number;
  sub?: string;
}) {
  const color = TONE[tone] ?? TONE.violet;
  const data = [{ value: Math.min(Math.max(value, 0), 100) }];
  // recharts genera IDs no determinísticos → render solo en cliente para evitar
  // hydration mismatch. El texto central se muestra siempre (no es del chart).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {mounted && (
        <RadialBarChart
          width={size}
          height={size}
          cx="50%"
          cy="50%"
          innerRadius="74%"
          outerRadius="100%"
          startAngle={90}
          endAngle={-270}
          data={data}
          barSize={size * 0.11}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar background={{ fill: "var(--aw-app-bg)" }} dataKey="value" cornerRadius={size} fill={color} isAnimationActive={false} />
        </RadialBarChart>
      )}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-extrabold tracking-[-0.02em]" style={{ fontSize: size * 0.22 }}>{value}%</span>
        {sub && <span className="mt-[-2px] text-[11px] text-muted-foreground">{sub}</span>}
      </div>
    </div>
  );
}
