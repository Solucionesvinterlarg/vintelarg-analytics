"use client";

import { DynamicIcon, type IconName } from "lucide-react/dynamic";

/**
 * Resuelve un ícono lucide por su nombre kebab (igual que `data-lucide` del
 * handoff). Stroke 1.5 / rounded por defecto. Para pantallas conviene importar
 * el ícono directo de "lucide-react" (mejor SSR); esto es para nav dinámica
 * donde el nombre llega como string desde un Server Component.
 */
export function LucideIcon({
  name,
  size = 18,
  strokeWidth = 1.5,
  className,
}: {
  name: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <DynamicIcon
      name={name as IconName}
      size={size}
      strokeWidth={strokeWidth}
      className={className}
    />
  );
}
