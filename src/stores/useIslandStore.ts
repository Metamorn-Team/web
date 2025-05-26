// stores/islandStore.ts
import { create } from "zustand";

interface IslandState {
  id?: string;
}

interface Action {
  setIsland: (id: string) => void;
  clear: () => void;
}

export const useIslandStore = create<IslandState & Action>((set) => ({
  id: undefined,
  type: undefined,
  setIsland: (id) => set({ id }),
  clear: () => set({ id: undefined }),
}));
