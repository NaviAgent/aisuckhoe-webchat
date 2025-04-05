import { create } from "zustand";

interface SidebarState {
  collapsible: "icon" | "none" | "offcanvas" | undefined;
  setCollapsible: (
    collapsible: "icon" | "none" | "offcanvas" | undefined
  ) => void;
}

export const useSidebarStore = create<SidebarState>((set, get) => ({
  collapsible: "none",

  setCollapsible: (collapsible) => set({ collapsible }),
}));
