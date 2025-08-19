import { useState, useCallback } from "react";
import { SoundManager } from "@/game/managers/sound-manager";
import {
  persistItem,
  getItem as getPersistenceItem,
} from "@/utils/persistence";

export function useBgmToggle() {
  const [isPlayBgm, setIsPlayBgm] = useState(
    () => getPersistenceItem("play_bgm") ?? true
  );

  const toggleBgm = useCallback(() => {
    const soundManager = SoundManager.getInstance();
    if (isPlayBgm) {
      soundManager.pauseBgm();
      persistItem("play_bgm", false);
    } else {
      soundManager.resumeBgm();
      persistItem("play_bgm", true);
    }
    setIsPlayBgm((prev) => !prev);
  }, [isPlayBgm]);

  return { isPlayBgm, toggleBgm };
}
