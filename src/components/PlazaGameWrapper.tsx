"use client";

import { useState, useRef, useCallback } from "react";
import PlazaGame, { GameRef } from "@/components/PlazaGame";
import { PlazaScene } from "@/game/scenes/plaza-scene";
import MenuHeader from "@/components/MenuHeader";

export default function PlazaGameWrapper() {
  const gameRef = useRef<GameRef | null>(null);
  const [isMute, setIsMute] = useState(false);

  const muteToggle = useCallback(() => {
    if (gameRef.current) {
      const scene =
        gameRef.current.game.scene.getScene<PlazaScene>("PlazaScene");
      setIsMute(scene.muteToggle());
    }
  }, [gameRef]);

  return (
    <div>
      <MenuHeader isMute={isMute} muteToggle={muteToggle} />
      <PlazaGame ref={gameRef} currentActiveScene={() => {}} />
    </div>
  );
}
