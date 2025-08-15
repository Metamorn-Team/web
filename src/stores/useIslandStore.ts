// stores/islandStore.ts
import { create } from "zustand";

interface IslandState {
  id?: string;
  type?: "NORMAL" | "DESERTED" | "PRIVATE";
  password?: string;
}

interface Action {
  setIsland: (
    id: string,
    type?: "NORMAL" | "DESERTED" | "PRIVATE",
    password?: string
  ) => void;
  clear: () => void;
}

export const useIslandStore = create<IslandState & Action>((set) => ({
  id: undefined,
  type: undefined,
  password: undefined,
  setIsland: (id, type, password) => set({ id, type, password }),
  clear: () => set({ id: undefined, type: undefined, password: undefined }),
}));
