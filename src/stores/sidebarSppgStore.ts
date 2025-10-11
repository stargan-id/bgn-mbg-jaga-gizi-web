import { create } from "zustand";

interface SidebarSppgState {
  open: boolean;
  toggle: () => void;
  setOpen: (open: boolean) => void;
}

export const useSidebarSppgStore = create<SidebarSppgState>((set) => ({
  open: true,
  toggle: () => set((state) => ({ open: !state.open })),
  setOpen: (open) => set({ open }),
}));
