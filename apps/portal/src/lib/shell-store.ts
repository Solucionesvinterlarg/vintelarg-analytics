import { create } from "zustand";

interface ShellState {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  toggleCollapsed: () => void;
  moreSheetOpen: boolean;
  setMoreSheetOpen: (v: boolean) => void;
}

export const useShellStore = create<ShellState>((set) => ({
  collapsed: false,
  setCollapsed: (v) => set({ collapsed: v }),
  toggleCollapsed: () => set((s) => ({ collapsed: !s.collapsed })),
  moreSheetOpen: false,
  setMoreSheetOpen: (v) => set({ moreSheetOpen: v }),
}));
