// stores/islandStore.ts
import { create } from "zustand";
import { setItem } from "@/utils/session-storage";
import { ISLAND_SCENE } from "@/constants/game/islands/island";

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
  setIsland: (id, type, password) => {
    // Session Storage에 island 정보 저장
    setItem("current_island_id", id);
    setItem("current_island_type", type || "NORMAL");

    // Scene 정보 저장 - Private Island는 ISLAND_SCENE 사용
    setItem("current_scene", ISLAND_SCENE);

    set({ id, type, password });
  },
  clear: () => set({ id: undefined, type: undefined, password: undefined }),
}));
