"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";

export interface DonutDatum {
  label: string;
  value: number;
  color: string;
}

/** Donut de participación. El texto central lo pone el contenedor (overlay). */
export function Donut({ data, size = 190, thickness = 28 }: { data: DonutDatum[]; size?: number; thickness?: number }) {
  // Render solo en cliente: recharts genera IDs no determinísticos (hydration).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div style={{ width: size, height: size }} />;
  return (
    <PieChart width={size} height={size}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="label"
        cx="50%"
        cy="50%"
        innerRadius={size / 2 - thickness}
        outerRadius={size / 2}
        startAngle={90}
        endAngle={-270}
        stroke="none"
        isAnimationActive={false}
      >
        {data.map((d) => (
          <Cell key={d.label} fill={d.color} />
        ))}
      </Pie>
    </PieChart>
  );
}
