"use client";

import { useEffect } from "react";
import { useShellStore } from "@/lib/shell-store";

/** Auto-colapsa el sidebar bajo 1100px (handoff §8 responsive). */
export function ResponsiveCollapse() {
  const setCollapsed = useShellStore((s) => s.setCollapsed);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1100px)");
    const apply = () => setCollapsed(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [setCollapsed]);
  return null;
}
