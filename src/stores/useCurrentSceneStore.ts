import { create } from "zustand";

interface CurrentSceneState {
  currentScene: string;
}

interface Action {
  setCurrentScene: (sceneKey: string) => void;
}

export const useCurrentSceneStore = create<CurrentSceneState & Action>(
  (set) => ({
    currentScene: "",
    setCurrentScene: (sceneKey: string) => set({ currentScene: sceneKey }),
    clear: () => set({ currentScene: "" }),
  })
);
